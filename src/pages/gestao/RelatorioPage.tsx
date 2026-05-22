import { useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { FileDown, Printer, CheckCircle2, AlertTriangle, ShoppingBag, ClipboardList, TrendingUp, Users } from 'lucide-react'
import { mockAllVisits, mockProductChecks, mockPromotores, mockStores, mockProducts } from '@/data/mock'
import { exportRelatorioGestao } from '@/lib/export'

const today = new Date().toISOString().split('T')[0]
const sevenDaysAgo = new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0]

function formatDateBR(d: string) { return d.split('-').reverse().join('/') }

const PRESET_OPTS = [
  { label: 'Hoje',    start: today,        end: today },
  { label: '7 dias',  start: sevenDaysAgo, end: today },
]

export default function RelatorioPage() {
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate]     = useState(today)
  const [exporting, setExporting] = useState(false)

  const activePreset = PRESET_OPTS.find(p => p.start === startDate && p.end === endDate)?.label ?? null

  function applyPreset(start: string, end: string) {
    setStartDate(start)
    setEndDate(end)
  }

  const visits = useMemo(() =>
    mockAllVisits.filter(v => v.date >= startDate && v.date <= endDate),
  [startDate, endDate])

  const checks = useMemo(() =>
    mockProductChecks.filter(c => visits.some(v => v.id === c.visitId)),
  [visits])

  const kpis = useMemo(() => {
    const programadas  = visits.length
    const executadas   = visits.filter(v => v.status === 'completed').length
    const justificadas = visits.filter(v => v.status === 'justified').length
    const rupturas     = checks.filter(c => !c.available).length
    const skus         = checks.length
    const ocorrencias  = visits.filter(v => v.occurrenceType && v.occurrenceType !== 'Sem ocorrência' && v.status === 'completed').length
    const pct          = programadas > 0 ? Math.round((executadas / programadas) * 100) : 0
    return { programadas, executadas, justificadas, rupturas, skus, ocorrencias, pct }
  }, [visits, checks])

  const byPromotor = useMemo(() =>
    mockPromotores.map(p => {
      const pv = visits.filter(v => v.promotorId === p.id)
      const exec = pv.filter(v => v.status === 'completed').length
      const rupt = checks.filter(c => pv.some(v => v.id === c.visitId) && !c.available).length
      return { name: p.name.split(' ')[0], programadas: pv.length, executadas: exec, rupturas: rupt,
        pct: pv.length > 0 ? Math.round((exec / pv.length) * 100) : 0 }
    }).filter(p => p.programadas > 0).sort((a, b) => b.pct - a.pct),
  [visits, checks])

  const byProduct = useMemo(() => {
    const map: Record<string, { name: string; count: number }> = {}
    checks.filter(c => !c.available).forEach(c => {
      const p = mockProducts.find(p => p.id === c.productId)
      if (!p) return
      const short = p.name.split('–')[0].trim().split(' ').slice(0, 3).join(' ')
      if (!map[p.id]) map[p.id] = { name: short, count: 0 }
      map[p.id].count++
    })
    return Object.values(map).sort((a, b) => b.count - a.count).slice(0, 6)
  }, [checks])

  const ocorrencias = useMemo(() =>
    visits
      .filter(v => v.occurrenceType && v.occurrenceType !== 'Sem ocorrência')
      .map(v => ({
        data: v.date,
        promotor: mockPromotores.find(p => p.id === v.promotorId)?.name ?? '-',
        loja: mockStores.find(s => s.id === v.storeId)?.name ?? '-',
        tipo: v.occurrenceType!,
        obs: v.occurrenceNote ?? '-',
      })),
  [visits])

  const rupturas = useMemo(() =>
    checks.filter(c => !c.available).map(c => {
      const visit = visits.find(v => v.id === c.visitId)
      return {
        data: visit?.date ?? '-',
        promotor: mockPromotores.find(p => p.id === visit?.promotorId)?.name?.split(' ')[0] ?? '-',
        loja: mockStores.find(s => s.id === visit?.storeId)?.name ?? '-',
        produto: mockProducts.find(p => p.id === c.productId)?.name ?? '-',
        sku: c.sku,
      }
    }),
  [checks, visits])

  async function handleExport() {
    setExporting(true)
    try { await exportRelatorioGestao(mockAllVisits, mockProductChecks, startDate, endDate) }
    finally { setExporting(false) }
  }

  function handlePrint() { window.print() }

  const pctColor = (pct: number) =>
    pct === 100 ? '#22C55E' : pct >= 50 ? '#E8642A' : '#EF4444'

  return (
    <div className="space-y-6 pb-20 lg:pb-0 print:pb-0">
      <style>{`
        @media print {
          .gestao-sidebar,
          .gestao-mobile-header,
          .gestao-mobile-nav,
          .no-print { display: none !important; }
          main { margin-left: 0 !important; padding: 16px !important; background: white !important; }
          body { background: white !important; }
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 no-print">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Relatório Gerencial</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {startDate === endDate ? formatDateBR(startDate) : `${formatDateBR(startDate)} – ${formatDateBR(endDate)}`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {PRESET_OPTS.map(p => (
            <button
              key={p.label}
              onClick={() => applyPreset(p.start, p.end)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activePreset === p.label
                  ? 'bg-primary text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >{p.label}</button>
          ))}
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
            className="px-3 py-1.5 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
            className="px-3 py-1.5 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          <button onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium text-muted-foreground hover:bg-muted/50 transition-colors">
            <Printer className="w-4 h-4" /> PDF
          </button>
          <button onClick={handleExport} disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60">
            <FileDown className="w-4 h-4" />
            {exporting ? 'Gerando...' : 'Exportar Excel'}
          </button>
        </div>
      </div>

      {/* Print header */}
      <div className="hidden print:block mb-6">
        <h1 className="text-2xl font-bold">Relatório Gerencial — IE Pescados</h1>
        <p className="text-sm text-gray-500 mt-1">
          Período: {formatDateBR(startDate)}{startDate !== endDate ? ` a ${formatDateBR(endDate)}` : ''}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { icon: ShoppingBag,   label: 'Programadas',  value: kpis.programadas,  color: 'text-muted-foreground' },
          { icon: CheckCircle2,  label: 'Executadas',   value: kpis.executadas,   color: 'text-success' },
          { icon: TrendingUp,    label: '% Execução',   value: `${kpis.pct}%`,    color: kpis.pct >= 80 ? 'text-success' : kpis.pct >= 50 ? 'text-primary' : 'text-destructive' },
          { icon: AlertTriangle, label: 'Rupturas',     value: kpis.rupturas,     color: kpis.rupturas > 0 ? 'text-destructive' : 'text-success' },
          { icon: ClipboardList, label: 'Ocorrências',  value: kpis.ocorrencias,  color: kpis.ocorrencias > 0 ? 'text-primary' : 'text-muted-foreground' },
          { icon: Users,         label: 'SKUs Verif.',  value: kpis.skus,         color: 'text-muted-foreground' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-card rounded-xl border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-xs text-muted-foreground font-medium">{label}</span>
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Execução por Promotor */}
        <div className="bg-card rounded-xl border p-4">
          <h2 className="font-semibold text-foreground mb-4">Execução por Promotor</h2>
          {byPromotor.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={byPromotor} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val, name) => [val, name === 'executadas' ? 'Executadas' : 'Programadas']}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                />
                <Bar dataKey="programadas" fill="rgba(232,100,42,0.15)" radius={[4,4,0,0]} name="programadas" />
                <Bar dataKey="executadas"  radius={[4,4,0,0]} name="executadas">
                  {byPromotor.map((entry, i) => (
                    <Cell key={i} fill={pctColor(entry.pct)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-muted-foreground text-center py-10">Sem dados no período</p>}
        </div>

        {/* Rupturas por Produto */}
        <div className="bg-card rounded-xl border p-4">
          <h2 className="font-semibold text-foreground mb-4">Rupturas por Produto</h2>
          {byProduct.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={byProduct} layout="vertical" barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={110} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="count" fill="#EF4444" radius={[0,4,4,0]} name="Rupturas" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <CheckCircle2 className="w-10 h-10 text-success mb-2" />
              <p className="text-sm text-muted-foreground">Nenhuma ruptura no período</p>
            </div>
          )}
        </div>
      </div>

      {/* Ranking Promotores */}
      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="p-4 border-b" style={{ background: 'rgba(232,100,42,0.04)' }}>
          <h2 className="font-semibold text-foreground">Ranking de Promotores</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                {['#', 'Promotor', 'Regional', 'Programadas', 'Executadas', '% Conclusão', 'Rupturas'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {byPromotor.map((p, i) => (
                <tr key={p.name} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-bold text-muted-foreground">#{i + 1}</td>
                  <td className="px-4 py-3 font-semibold text-foreground">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {mockPromotores.find(mp => mp.name.startsWith(p.name))?.regional ?? '-'}
                  </td>
                  <td className="px-4 py-3 text-center">{p.programadas}</td>
                  <td className="px-4 py-3 text-center">{p.executadas}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: pctColor(p.pct) }} />
                      </div>
                      <span className="text-xs font-bold w-10 text-right" style={{ color: pctColor(p.pct) }}>{p.pct}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={p.rupturas > 0 ? 'text-destructive font-semibold' : 'text-muted-foreground'}>
                      {p.rupturas}
                    </span>
                  </td>
                </tr>
              ))}
              {byPromotor.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground text-sm">Sem dados no período</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ocorrências */}
      {ocorrencias.length > 0 && (
        <div className="bg-card rounded-xl border overflow-hidden">
          <div className="p-4 border-b" style={{ background: 'rgba(232,100,42,0.04)' }}>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Ocorrências Registradas</h2>
              <span className="text-xs text-muted-foreground">{ocorrencias.length} ocorrência{ocorrencias.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  {['Data', 'Promotor', 'Loja', 'Tipo', 'Observação'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {ocorrencias.map((o, i) => (
                  <tr key={i} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDateBR(o.data)}</td>
                    <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{o.promotor.split(' ')[0]}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{o.loja}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary whitespace-nowrap">{o.tipo}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">{o.obs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Rupturas */}
      {rupturas.length > 0 && (
        <div className="bg-card rounded-xl border overflow-hidden">
          <div className="p-4 border-b" style={{ background: 'rgba(239,68,68,0.04)' }}>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive" /> Rupturas Detalhadas
              </h2>
              <span className="text-xs text-muted-foreground">{rupturas.length} item{rupturas.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  {['Data', 'Promotor', 'Loja', 'Produto', 'SKU'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {rupturas.map((r, i) => (
                  <tr key={i} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDateBR(r.data)}</td>
                    <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{r.promotor}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{r.loja}</td>
                    <td className="px-4 py-3 text-foreground">{r.produto}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{r.sku}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
