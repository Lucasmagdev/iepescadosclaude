import * as XLSX from 'xlsx'
import { Visit, ProductCheck, Promotor } from '@/types'
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

export function exportRelatorioGestao(
  visits: Visit[],
  productChecks: ProductCheck[],
  date?: string
) {
  const wb = XLSX.utils.book_new()

  // ── Aba 1: Visitas ──────────────────────────────────────────────────────────
  const visitRows = visits.map(v => ({
    Data: v.date,
    Promotor: promotorName(v.promotorId),
    Loja: storeName(v.storeId),
    Regional: storeRegional(v.storeId),
    Status: statusLabel(v.status),
    'Check-in': v.checkInTime ?? '-',
    'Check-out': v.checkOutTime ?? '-',
    'Lat Check-in': v.checkInLat ?? '-',
    'Lng Check-in': v.checkInLng ?? '-',
    'Lat Check-out': v.checkOutLat ?? '-',
    'Lng Check-out': v.checkOutLng ?? '-',
    'Tipo Ocorrência': v.occurrenceType ?? 'Sem ocorrência',
    Observação: v.occurrenceNote ?? '-',
    'Rupturas': productChecks.filter(c => c.visitId === v.id && !c.available).length,
    'SKUs Verificados': productChecks.filter(c => c.visitId === v.id).length,
  }))

  const wsVisitas = XLSX.utils.json_to_sheet(visitRows)
  wsVisitas['!cols'] = [
    { wch: 12 }, { wch: 20 }, { wch: 22 }, { wch: 14 }, { wch: 14 },
    { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 },
    { wch: 22 }, { wch: 30 }, { wch: 10 }, { wch: 14 },
  ]
  XLSX.utils.book_append_sheet(wb, wsVisitas, 'Visitas')

  // ── Aba 2: Produtos (checklist) ─────────────────────────────────────────────
  const productRows = productChecks.map(c => {
    const visit = visits.find(v => v.id === c.visitId)
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

  const wsProdutos = XLSX.utils.json_to_sheet(productRows)
  wsProdutos['!cols'] = [
    { wch: 12 }, { wch: 20 }, { wch: 22 }, { wch: 14 },
    { wch: 14 }, { wch: 30 }, { wch: 10 }, { wch: 14 }, { wch: 10 }, { wch: 12 }, { wch: 20 },
  ]
  XLSX.utils.book_append_sheet(wb, wsProdutos, 'Produtos')

  // ── Aba 3: Ranking Promotores ───────────────────────────────────────────────
  const promotorRows = mockPromotores.map(p => ({
    Nome: p.name,
    Email: p.email,
    Telefone: p.phone,
    Regional: p.regional,
    'Programadas': p.visitsTotal,
    'Executadas': p.visitsCompleted,
    '% Conclusão': `${p.completionPct}%`,
    'Fotos': p.photosCount,
    'Status': p.connectionStatus === 'online' ? 'Online'
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

  const filename = `IE_Pescados_${date ?? new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(wb, filename)
}
