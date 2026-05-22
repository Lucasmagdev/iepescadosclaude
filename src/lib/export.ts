import * as XLSX from 'xlsx'
import { Visit, ProductCheck } from '@/types'
import { mockStores, mockProducts, mockPromotores } from '@/data/mock'

function storeName(storeId: string) {
  return mockStores.find(s => s.id === storeId)?.name ?? storeId
}
function storeRegional(storeId: string) {
  return mockStores.find(s => s.id === storeId)?.regional ?? '-'
}
function promotorName(promotorId: string) {
  return mockPromotores.find(p => p.id === promotorId)?.name ?? promotorId
}
function productName(productId: string) {
  return mockProducts.find(p => p.id === productId)?.name ?? productId
}
function productSku(productId: string) {
  return mockProducts.find(p => p.id === productId)?.sku ?? productId
}
function statusLabel(status: Visit['status']) {
  const map: Record<string, string> = {
    pending: 'Pendente',
    in_progress: 'Em andamento',
    completed: 'Concluída',
    justified: 'Justificada',
  }
  return map[status] ?? status
}

// Nominatim reverse geocoding — gratuito, sem API key, respeita 1 req/s
async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=pt-BR`,
      { headers: { 'Accept-Language': 'pt-BR', 'User-Agent': 'IEPescadosApp/1.0' } }
    )
    if (!res.ok) return `${lat.toFixed(5)}, ${lng.toFixed(5)}`
    const data = await res.json()
    // Monta endereço resumido: rua + número + bairro + cidade
    const a = data.address ?? {}
    const parts = [
      a.road ?? a.pedestrian ?? a.path,
      a.house_number,
      a.suburb ?? a.neighbourhood ?? a.quarter,
      a.city ?? a.town ?? a.village,
    ].filter(Boolean)
    return parts.length ? parts.join(', ') : (data.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`)
  } catch {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`
  }
}

// Coleta todos os pares lat/lng únicos e resolve em lote (1 req/s por política Nominatim)
async function buildGeoCache(visits: Visit[]): Promise<Map<string, string>> {
  const pairs: Array<{ key: string; lat: number; lng: number }> = []
  const seen = new Set<string>()

  for (const v of visits) {
    if (v.checkInLat != null && v.checkInLng != null) {
      const key = `${v.checkInLat.toFixed(5)},${v.checkInLng.toFixed(5)}`
      if (!seen.has(key)) { seen.add(key); pairs.push({ key, lat: v.checkInLat, lng: v.checkInLng }) }
    }
    if (v.checkOutLat != null && v.checkOutLng != null) {
      const key = `${v.checkOutLat.toFixed(5)},${v.checkOutLng.toFixed(5)}`
      if (!seen.has(key)) { seen.add(key); pairs.push({ key, lat: v.checkOutLat, lng: v.checkOutLng }) }
    }
  }

  const cache = new Map<string, string>()
  for (let i = 0; i < pairs.length; i++) {
    const { key, lat, lng } = pairs[i]
    cache.set(key, await reverseGeocode(lat, lng))
    if (i < pairs.length - 1) await new Promise(r => setTimeout(r, 1100)) // respeita 1 req/s
  }
  return cache
}

function geoKey(lat?: number, lng?: number) {
  return lat != null && lng != null ? `${lat.toFixed(5)},${lng.toFixed(5)}` : null
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

  const geoCache = await buildGeoCache(filtered)

  const wb = XLSX.utils.book_new()

  // ── Aba 1: Visitas ──────────────────────────────────────────────────────────
  const visitRows = filtered.map(v => {
    const keyIn  = geoKey(v.checkInLat, v.checkInLng)
    const keyOut = geoKey(v.checkOutLat, v.checkOutLng)
    return {
      Data: v.date,
      Promotor: promotorName(v.promotorId),
      Loja: storeName(v.storeId),
      Regional: storeRegional(v.storeId),
      Status: statusLabel(v.status),
      'Check-in': v.checkInTime ?? '-',
      'Endereço Check-in': keyIn ? (geoCache.get(keyIn) ?? '-') : '-',
      'Check-out': v.checkOutTime ?? '-',
      'Endereço Check-out': keyOut ? (geoCache.get(keyOut) ?? '-') : '-',
      'Tipo Ocorrência': v.occurrenceType ?? 'Sem ocorrência',
      Observação: v.occurrenceNote ?? '-',
      Rupturas: productChecks.filter(c => c.visitId === v.id && !c.available).length,
      'SKUs Verificados': productChecks.filter(c => c.visitId === v.id).length,
    }
  })

  const wsVisitas = XLSX.utils.json_to_sheet(visitRows)
  wsVisitas['!cols'] = [
    { wch: 12 }, { wch: 20 }, { wch: 22 }, { wch: 14 }, { wch: 14 },
    { wch: 10 }, { wch: 38 }, { wch: 10 }, { wch: 38 },
    { wch: 22 }, { wch: 32 }, { wch: 10 }, { wch: 14 },
  ]
  XLSX.utils.book_append_sheet(wb, wsVisitas, 'Visitas')

  // ── Aba 2: Produtos ─────────────────────────────────────────────────────────
  const filteredChecks = productChecks.filter(c => filtered.some(v => v.id === c.visitId))
  const productRows = filteredChecks.map(c => {
    const visit = filtered.find(v => v.id === c.visitId)
    return {
      Data: visit?.date ?? '-',
      Promotor: promotorName(visit?.promotorId ?? ''),
      Loja: storeName(visit?.storeId ?? ''),
      Regional: storeRegional(visit?.storeId ?? ''),
      SKU: c.sku ?? productSku(c.productId),
      Produto: productName(c.productId),
      Disponível: c.available ? 'Sim' : 'Não',
      'Preço IE (R$)': c.price != null ? c.price.toFixed(2).replace('.', ',') : '-',
      Estoque: c.stock ?? '-',
      Validade: c.expiryDate ?? '-',
      'Preço Concorrente (R$)': c.competitorPrice != null ? c.competitorPrice.toFixed(2).replace('.', ',') : '-',
    }
  })

  const wsProdutos = XLSX.utils.json_to_sheet(productRows as object[])
  wsProdutos['!cols'] = [
    { wch: 12 }, { wch: 20 }, { wch: 22 }, { wch: 14 },
    { wch: 14 }, { wch: 30 }, { wch: 10 }, { wch: 14 }, { wch: 10 }, { wch: 12 }, { wch: 20 },
  ]
  XLSX.utils.book_append_sheet(wb, wsProdutos, 'Produtos')

  // ── Aba 3: Promotores ───────────────────────────────────────────────────────
  const promotorRows = mockPromotores.map(p => ({
    Nome: p.name,
    Email: p.email,
    Telefone: p.phone,
    Regional: p.regional,
    Programadas: p.visitsTotal,
    Executadas: p.visitsCompleted,
    '% Conclusão': `${p.completionPct}%`,
    Fotos: p.photosCount,
    Status: p.connectionStatus === 'online' ? 'Online'
      : p.connectionStatus === 'offline' ? 'Offline'
      : 'Sem acesso',
    'Primeiro Acesso': p.firstSyncTime,
    'Último Sync': p.lastSyncTime,
    Rede: p.networkType,
    Dispositivo: p.device,
  }))

  const wsPromotores = XLSX.utils.json_to_sheet(promotorRows)
  wsPromotores['!cols'] = [
    { wch: 20 }, { wch: 28 }, { wch: 18 }, { wch: 14 },
    { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 8 },
    { wch: 12 }, { wch: 16 }, { wch: 14 }, { wch: 8 }, { wch: 12 },
  ]
  XLSX.utils.book_append_sheet(wb, wsPromotores, 'Promotores')

  const filename = startDate && endDate && startDate !== endDate
    ? `IE_Pescados_${startDate}_a_${endDate}.xlsx`
    : `IE_Pescados_${startDate ?? new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(wb, filename)
}
