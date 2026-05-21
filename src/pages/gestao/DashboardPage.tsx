import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, ClipboardCheck, ClipboardList, Trophy, Camera, AlertTriangle } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'
import { Logo } from '@/components/Logo'
import { ConnectionStatusDot } from '@/components/ConnectionStatusDot'
import { CompletionBadge } from '@/components/CompletionBadge'
import { mockPromotores, dashboardStats } from '@/data/mock'
import { cn, formatDate } from '@/lib/utils'

const pieData = [
  { name: 'Executadas', value: 71, color: '#22C55E' },
  { name: 'Justificadas', value: 0, color: '#EAB308' },
  { name: 'Pendentes', value: 29, color: '#E5E5E5' },
]

type FilterTab = 'agenda' | 'nao_acessaram' | 'online' | 'offline'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedRegional, setSelectedRegional] = useState('all')
  const [activeTab, setActiveTab] = useState<FilterTab>('agenda')
  
  const filteredPromotores = mockPromotores.filter(p => {
    if (activeTab === 'nao_acessaram') return p.connectionStatus === 'not_accessed'
    if (activeTab === 'online') return p.connectionStatus === 'online'
    if (activeTab === 'offline') return p.connectionStatus === 'offline'
    return true
  }).sort((a, b) => b.completionPct - a.completionPct)
  
  const unavailablePromotores = mockPromotores.filter(
    p => p.connectionStatus === 'offline' || p.connectionStatus === 'not_accessed'
  )
  
  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Logo iconOnly className="lg:hidden" />
            <h1 className="text-2xl font-bold text-foreground">Relatório Diário de Execução</h1>
          </div>
          <p className="text-muted-foreground">{formatDate(selectedDate)}</p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedRegional}
            onChange={(e) => setSelectedRegional(e.target.value)}
            className="px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">Todas as regionais</option>
            <option value="bh-centro">BH Centro</option>
            <option value="bh-norte">BH Norte</option>
            <option value="bh-sul">BH Sul</option>
          </select>
          
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
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
              <p className="text-2xl font-bold text-foreground">{dashboardStats.programadas}</p>
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
              <p className="text-2xl font-bold text-foreground">{dashboardStats.executadas}</p>
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
              <p className="text-2xl font-bold text-foreground">{dashboardStats.justificadas}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chart */}
      <div className="bg-card rounded-xl border p-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                <tspan x="50%" dy="-0.5em" className="text-2xl font-bold fill-foreground">
                  {dashboardStats.percentual}%
                </tspan>
                <tspan x="50%" dy="1.5em" className="text-sm fill-muted-foreground">
                  Executado
                </tspan>
              </text>
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar">
        {[
          { id: 'agenda' as FilterTab, label: 'Com Agenda' },
          { id: 'nao_acessaram' as FilterTab, label: 'Não Acessaram' },
          { id: 'online' as FilterTab, label: 'Online' },
          { id: 'offline' as FilterTab, label: 'Offline' },
        ].map((tab) => (
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
          <select className="text-sm border rounded-lg px-3 py-1.5 bg-background text-foreground">
            <option>Percentual Concluído</option>
          </select>
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
