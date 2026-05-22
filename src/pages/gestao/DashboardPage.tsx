import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, ClipboardCheck, ClipboardList, Trophy, Camera, AlertTriangle, Download } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'
import { ConnectionStatusDot } from '@/components/ConnectionStatusDot'
import { CompletionBadge } from '@/components/CompletionBadge'
import { mockPromotores, mockAllVisits, mockProductChecks } from '@/data/mock'
import { exportRelatorioGestao } from '@/lib/export'
import { cn, formatDate } from '@/lib/utils'

const regionais = ['BH Centro', 'BH Norte', 'BH Sul', 'BH Leste', 'BH Oeste']

type FilterTab = 'agenda' | 'nao_acessaram' | 'online' | 'offline'

export default function DashboardPage() {
  const navigate = useNavigate()
  const todayStr = new Date().toISOString().split('T')[0]
  const [startDate, setStartDate] = useState(todayStr)
  const [endDate, setEndDate] = useState(todayStr)
  const [selectedRegional, setSelectedRegional] = useState('all')
  const [activeTab, setActiveTab] = useState<FilterTab>('agenda')
  const [exporting, setExporting] = useState(false)

  const activePreset = useMemo(() => {
    const t = new Date().toISOString().split('T')[0]
    if (startDate === t && endDate === t) return 'today'
    const week = new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0]
    if (startDate === week && endDate === t) return 'week'
    const month = new Date(Date.now() - 29 * 86400000).toISOString().split('T')[0]
    if (startDate === month && endDate === t) return 'month'
    return null
  }, [startDate, endDate])

  const applyPreset = (preset: 'today' | 'week' | 'month') => {
    const end = new Date().toISOString().split('T')[0]
    if (preset === 'today') { setStartDate(end); setEndDate(end) }
    else if (preset === 'week') { setStartDate(new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0]); setEndDate(end) }
    else { setStartDate(new Date(Date.now() - 29 * 86400000).toISOString().split('T')[0]); setEndDate(end) }
  }

  const filteredPromotores = useMemo(() => {
    return mockPromotores
      .filter(p => {
        const regionalMatch = selectedRegional === 'all' || p.regional === selectedRegional
        const tabMatch =
          activeTab === 'nao_acessaram' ? p.connectionStatus === 'not_accessed'
          : activeTab === 'online' ? p.connectionStatus === 'online'
          : activeTab === 'offline' ? p.connectionStatus === 'offline'
          : true
        return regionalMatch && tabMatch
      })
      .sort((a, b) => b.completionPct - a.completionPct)
  }, [activeTab, selectedRegional])

  const stats = useMemo(() => {
    const rangeVisits = mockAllVisits.filter(v => {
      const dateOk = v.date >= startDate && v.date <= endDate
      const regionalOk = selectedRegional === 'all' ||
        mockPromotores.find(p => p.id === v.promotorId)?.regional === selectedRegional
      return dateOk && regionalOk
    })
    const programadas = rangeVisits.length
    const executadas = rangeVisits.filter(v => v.status === 'completed').length
    const justificadas = rangeVisits.filter(v => v.status === 'justified').length
    const pct = programadas ? Math.round((executadas / programadas) * 100) : 0
    return { programadas, executadas, justificadas, pct }
  }, [startDate, endDate, selectedRegional])

  const pieData = [
    { name: 'Executadas', value: stats.executadas, color: '#22C55E' },
    { name: 'Justificadas', value: stats.justificadas, color: '#EAB308' },
    { name: 'Pendentes', value: Math.max(0, stats.programadas - stats.executadas - stats.justificadas), color: '#E5E5E5' },
  ]

  const unavailablePromotores = filteredPromotores.filter(
    p => p.connectionStatus === 'offline' || p.connectionStatus === 'not_accessed'
  )

  const handleExport = async () => {
    setExporting(true)
    try {
      await exportRelatorioGestao(mockAllVisits, mockProductChecks, startDate, endDate)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-foreground">Relatório Diário de Execução</h1>
          </div>
          <p className="text-muted-foreground">
            {startDate === endDate
              ? formatDate(startDate)
              : `${startDate.split('-').reverse().join('/')} — ${endDate.split('-').reverse().join('/')}`}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            {([
              { id: 'today', label: 'Hoje' },
              { id: 'week',  label: '7 dias' },
              { id: 'month', label: '30 dias' },
            ] as const).map(p => (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  activePreset === p.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedRegional}
              onChange={(e) => setSelectedRegional(e.target.value)}
              className="px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">Todas as regionais</option>
              {regionais.map(r => <option key={r} value={r}>{r}</option>)}
            </select>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">De</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <span className="text-sm text-muted-foreground whitespace-nowrap">Até</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              <Download className={cn('w-4 h-4', exporting && 'animate-spin')} />
              {exporting ? 'Geocodificando...' : 'Exportar Excel'}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Programadas</p>
              <p className="text-2xl font-bold text-foreground">{stats.programadas}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Executadas</p>
              <p className="text-2xl font-bold text-foreground">{stats.executadas}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Justificadas</p>
              <p className="text-2xl font-bold text-foreground">{stats.justificadas}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-card rounded-xl border p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-foreground">Execução do dia</h2>
          <span className="text-2xl font-bold text-primary">{stats.pct}%</span>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={2} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <text x="50%" y="48%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 22, fontWeight: 700, fill: 'var(--foreground)' }}>
                {stats.pct}%
              </text>
              <text x="50%" y="56%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 12, fill: 'var(--muted-foreground)' }}>
                Executado
              </text>
              <Legend verticalAlign="bottom" height={36} formatter={(value) => <span className="text-sm text-foreground">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar">
        {([
          { id: 'agenda', label: 'Com Agenda' },
          { id: 'nao_acessaram', label: 'Não Acessaram' },
          { id: 'online', label: 'Online' },
          { id: 'offline', label: 'Offline' },
        ] as { id: FilterTab; label: string }[]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Promoter Ranking */}
      <div className="bg-card rounded-xl border">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Ranking de Promotores</h2>
            <span className="px-2 py-0.5 bg-muted rounded text-xs font-medium text-muted-foreground">
              {filteredPromotores.length}
            </span>
          </div>
        </div>

        <div className="divide-y">
          {filteredPromotores.map((promotor, index) => (
            <button
              key={promotor.id}
              onClick={() => navigate(`/gestao/promotores/${promotor.id}`)}
              className="w-full p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors text-left"
            >
              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground truncate">{promotor.name}</span>
                  <ConnectionStatusDot status={promotor.connectionStatus} />
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  <span>{promotor.visitsCompleted}/{promotor.visitsTotal} visitas</span>
                  <span className="flex items-center gap-1">
                    <Camera className="w-3 h-3" />
                    {promotor.photosCount} fotos
                  </span>
                  <span className="text-muted-foreground/60">{promotor.regional}</span>
                </div>
              </div>
              <CompletionBadge percentage={promotor.completionPct} />
            </button>
          ))}
        </div>
      </div>

      {/* Unavailable Promoters Warning */}
      {unavailablePromotores.length > 0 && (
        <div className="bg-warning/10 border border-warning/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <h3 className="font-semibold text-foreground">Promotores Indisponíveis</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Promotores sem atividade nos últimos 10 minutos.
          </p>
          <div className="flex flex-wrap gap-2">
            {unavailablePromotores.map(p => (
              <span key={p.id} className="px-3 py-1 bg-background rounded-full text-sm text-foreground">
                {p.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
