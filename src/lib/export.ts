import * as XLSX from 'xlsx'
import { Visit, ProductCheck } from '@/types'
import { mockStores, mockProducts, mockPromotores } from '@/data/mock'

function storeName(id: string)    { return mockStores.find(s => s.id === id)?.name     ?? id }
function storeRegional(id: string){ return mockStores.find(s => s.id === id)?.regional ?? '-' }
function promotorName(id: string) { return mockPromotores.find(p => p.id === id)?.name ?? id }
function productName(id: string)  { return mockProducts.find(p => p.id === id)?.name   ?? id }
function productSku(id: string)   { return mockProducts.find(p => p.id === id)?.sku    ?? id }

function statusLabel(s: Visit['status']) {
  return ({ pending: 'Pendente', in_progress: 'Em andamento', completed: 'Concluída', justified: 'Justificada' })[s] ?? s
}

function formatDateBR(d: string) { return d.split('-').reverse().join('/') }

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=pt-BR`,
      { headers: { 'Accept-Language': 'pt-BR', 'User-Agent': 'IEPescadosApp/1.0' } }
    )
    if (!res.ok) return `${lat.toFixed(5)}, ${lng.toFixed(5)}`
    const data = await res.json()
    const a = data.address ?? {}
    const parts = [a.road ?? a.pedestrian ?? a.path, a.house_number, a.suburb ?? a.neighbourhood ?? a.quarter, a.city ?? a.town ?? a.village].filter(Boolean)
    return parts.length ? parts.join(', ') : (data.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`)
  } catch {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`
  }
}

async function buildGeoCache(visits: Visit[]): Promise<Map<string, string>> {
  const pairs: Array<{ key: string; lat: number; lng: number }> = []
  const seen = new Set<string>()
  for (const v of visits) {
    for (const [lat, lng] of [[v.checkInLat, v.checkInLng], [v.checkOutLat, v.checkOutLng]] as [number|undefined, number|undefined][]) {
      if (lat != null && lng != null) {
        const key = `${lat.toFixed(5)},${lng.toFixed(5)}`
        if (!seen.has(key)) { seen.add(key); pairs.push({ key, lat, lng }) }
      }
    }
  }
  const cache = new Map<string, string>()
  for (let i = 0; i < pairs.length; i++) {
    const { key, lat, lng } = pairs[i]
    cache.set(key, await reverseGeocode(lat, lng))
    if (i < pairs.length - 1) await new Promise(r => setTimeout(r, 1100))
  }
  return cache
}

function geoKey(lat?: number, lng?: number) {
  return lat != null && lng != null ? `${lat.toFixed(5)},${lng.toFixed(5)}` : null
}

function autoWidth(ws: XLSX.WorkSheet, rows: object[]) {
  if (!rows.length) return
  const keys = Object.keys(rows[0])
  ws['!cols'] = keys.map(k => ({
    wch: Math.min(50, Math.max(k.length + 2, ...rows.map(r => String((r as Record<string,unknown>)[k] ?? '').length + 1)))
  }))
}

export async function exportRelatorioGestao(
  visits: Visit[],
  productChecks: ProductCheck[],
  startDate?: string,
  endDate?: string
) {
  const filtered = startDate && endDate
    ? visits.filter(v => v.date >= startDate && v.date <= endDate)
    : visits

  const filteredChecks = productChecks.filter(c => filtered.some(v => v.id === c.visitId))

  const geoCache = await buildGeoCache(filtered)
  const wb = XLSX.utils.book_new()

  // ── Aba 1: Resumo ────────────────────────────────────────────────────────────
  const executadas   = filtered.filter(v => v.status === 'completed').length
  const justificadas = filtered.filter(v => v.status === 'justified').length
  const rupturas     = filteredChecks.filter(c => !c.available).length
  const skus         = filteredChecks.length
  const ocorrencias  = filtered.filter(v => v.occurrenceType && v.occurrenceType !== 'Sem ocorrência' && v.status === 'completed').length
  const pct          = filtered.length > 0 ? Math.round((executadas / filtered.length) * 100) : 0

  const periodo = startDate && endDate
    ? (startDate === endDate ? formatDateBR(startDate) : `${formatDateBR(startDate)} a ${formatDateBR(endDate)}`)
    : 'Todos'

  const resumoRows = [
    { Indicador: 'Período',              Valor: periodo },
    { Indicador: '',                     Valor: '' },
    { Indicador: 'Visitas Programadas',  Valor: filtered.length },
    { Indicador: 'Visitas Executadas',   Valor: executadas },
    { Indicador: 'Visitas Justificadas', Valor: justificadas },
    { Indicador: 'Visitas Pendentes',    Valor: filtered.length - executadas - justificadas },
    { Indicador: '% de Execução',        Valor: `${pct}%` },
    { Indicador: '',                     Valor: '' },
    { Indicador: 'Total de Rupturas',    Valor: rupturas },
    { Indicador: 'Ocorrências Registradas', Valor: ocorrencias },
    { Indicador: 'SKUs Verificados',     Valor: skus },
    { Indicador: '',                     Valor: '' },
    { Indicador: 'Promotores Ativos',    Valor: [...new Set(filtered.map(v => v.promotorId))].length },
    { Indicador: 'Lojas Atendidas',      Valor: [...new Set(filtered.filter(v => v.status === 'completed').map(v => v.storeId))].length },
  ]

  const wsResumo = XLSX.utils.json_to_sheet(resumoRows)
  wsResumo['!cols'] = [{ wch: 28 }, { wch: 20 }]
  XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo')

  // ── Aba 2: Visitas ───────────────────────────────────────────────────────────
  const visitRows = filtered.map(v => {
    const keyIn  = geoKey(v.checkInLat, v.checkInLng)
    const keyOut = geoKey(v.checkOutLat, v.checkOutLng)
    return {
      Data:                   formatDateBR(v.date),
      Promotor:               promotorName(v.promotorId),
      Loja:                   storeName(v.storeId),
      Regional:               storeRegional(v.storeId),
      Status:                 statusLabel(v.status),
      'Check-in':             v.checkInTime ?? '-',
      'Endereço Check-in':    keyIn  ? (geoCache.get(keyIn)  ?? '-') : '-',
      'Check-out':            v.checkOutTime ?? '-',
      'Endereço Check-out':   keyOut ? (geoCache.get(keyOut) ?? '-') : '-',
      'Tipo Ocorrência':      v.occurrenceType ?? 'Sem ocorrência',
      Observação:             v.occurrenceNote ?? '-',
      Rupturas:               filteredChecks.filter(c => c.visitId === v.id && !c.available).length,
      'SKUs Verificados':     filteredChecks.filter(c => c.visitId === v.id).length,
    }
  })
  const wsVisitas = XLSX.utils.json_to_sheet(visitRows)
  autoWidth(wsVisitas, visitRows)
  XLSX.utils.book_append_sheet(wb, wsVisitas, 'Visitas')

  // ── Aba 3: Rupturas ──────────────────────────────────────────────────────────
  const rupturaRows = filteredChecks.filter(c => !c.available).map(c => {
    const visit = filtered.find(v => v.id === c.visitId)
    return {
      Data:     visit?.date ? formatDateBR(visit.date) : '-',
      Promotor: promotorName(visit?.promotorId ?? ''),
      Loja:     storeName(visit?.storeId ?? ''),
      Regional: storeRegional(visit?.storeId ?? ''),
      SKU:      c.sku ?? productSku(c.productId),
      Produto:  productName(c.productId),
    }
  })
  const wsRupturas = XLSX.utils.json_to_sheet(rupturaRows.length ? rupturaRows : [{ Info: 'Nenhuma ruptura no período' }])
  autoWidth(wsRupturas, rupturaRows)
  XLSX.utils.book_append_sheet(wb, wsRupturas, 'Rupturas')

  // ── Aba 4: Ocorrências ───────────────────────────────────────────────────────
  const ocorrRows = filtered
    .filter(v => v.occurrenceType && v.occurrenceType !== 'Sem ocorrência')
    .map(v => ({
      Data:             formatDateBR(v.date),
      Promotor:         promotorName(v.promotorId),
      Loja:             storeName(v.storeId),
      Regional:         storeRegional(v.storeId),
      Status:           statusLabel(v.status),
      'Tipo':           v.occurrenceType ?? '-',
      Observação:       v.occurrenceNote ?? '-',
    }))
  const wsOcorr = XLSX.utils.json_to_sheet(ocorrRows.length ? ocorrRows : [{ Info: 'Nenhuma ocorrência no período' }])
  autoWidth(wsOcorr, ocorrRows)
  XLSX.utils.book_append_sheet(wb, wsOcorr, 'Ocorrências')

  // ── Aba 5: Produtos ──────────────────────────────────────────────────────────
  const productRows = filteredChecks.map(c => {
    const visit = filtered.find(v => v.id === c.visitId)
    const priceIE   = c.price != null ? c.price : null
    const priceConc = c.competitorPrice != null ? c.competitorPrice : null
    const delta = priceIE != null && priceConc != null
      ? `${priceConc > priceIE ? '+' : ''}${Math.round(((priceConc - priceIE) / priceIE) * 100)}%`
      : '-'
    return {
      Data:                   visit?.date ? formatDateBR(visit.date) : '-',
      Promotor:               promotorName(visit?.promotorId ?? ''),
      Loja:                   storeName(visit?.storeId ?? ''),
      Regional:               storeRegional(visit?.storeId ?? ''),
      SKU:                    c.sku ?? productSku(c.productId),
      Produto:                productName(c.productId),
      Disponível:             c.available ? 'Sim' : 'Não',
      'Preço IE (R$)':        priceIE   != null ? priceIE.toFixed(2).replace('.', ',')   : '-',
      'Preço Concorrente (R$)': priceConc != null ? priceConc.toFixed(2).replace('.', ',') : '-',
      'Δ vs Concorrente':     delta,
      Estoque:                c.stock ?? '-',
      Validade:               c.expiryDate ?? '-',
    }
  })
  const wsProdutos = XLSX.utils.json_to_sheet(productRows as object[])
  autoWidth(wsProdutos, productRows)
  XLSX.utils.book_append_sheet(wb, wsProdutos, 'Produtos')

  // ── Aba 6: Promotores (ranking) ──────────────────────────────────────────────
  const promotorRows = mockPromotores.map(p => {
    const pv   = filtered.filter(v => v.promotorId === p.id)
    const exec = pv.filter(v => v.status === 'completed').length
    const rupt = filteredChecks.filter(c => pv.some(v => v.id === c.visitId) && !c.available).length
    const pct2  = pv.length > 0 ? Math.round((exec / pv.length) * 100) : 0
    return {
      Ranking:             0,
      Nome:                p.name,
      Email:               p.email,
      Telefone:            p.phone,
      Regional:            p.regional,
      Programadas:         pv.length,
      Executadas:          exec,
      '% Conclusão':       `${pct2}%`,
      Rupturas:            rupt,
      'SKUs Verificados':  filteredChecks.filter(c => pv.some(v => v.id === c.visitId)).length,
      Dispositivo:         p.device,
      Rede:                p.networkType,
      'Último Sync':       p.lastSyncTime,
    }
  })
    .sort((a, b) => parseInt(b['% Conclusão']) - parseInt(a['% Conclusão']))
    .map((r, i) => ({ ...r, Ranking: i + 1 }))

  const wsPromotores = XLSX.utils.json_to_sheet(promotorRows)
  autoWidth(wsPromotores, promotorRows)
  XLSX.utils.book_append_sheet(wb, wsPromotores, 'Promotores')

  const filename = startDate && endDate && startDate !== endDate
    ? `IE_Pescados_${startDate}_a_${endDate}.xlsx`
    : `IE_Pescados_${startDate ?? new Date().toISOString().split('T')[0]}.xlsx`

  XLSX.writeFile(wb, filename)
}
