import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Camera } from 'lucide-react'
import { ConnectionStatusDot } from '@/components/ConnectionStatusDot'
import { CompletionBadge } from '@/components/CompletionBadge'
import { mockPromotores } from '@/data/mock'
import { cn } from '@/lib/utils'

export default function PromotoresPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  
  const filteredPromotores = mockPromotores.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                         p.email.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || p.connectionStatus === statusFilter
    return matchesSearch && matchesStatus
  })
  
  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <h1 className="text-2xl font-bold text-foreground">Promotores</h1>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar promotor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="all">Todos os status</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
          <option value="not_accessed">Não acessou</option>
        </select>
      </div>
      
      {/* Promoter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredPromotores.map((promotor) => (
          <button
            key={promotor.id}
            onClick={() => navigate(`/gestao/promotores/${promotor.id}`)}
            className="bg-card rounded-xl border p-4 text-left hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg">
                  {promotor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{promotor.name}</h3>
                  <p className="text-sm text-muted-foreground">{promotor.regional}</p>
                </div>
              </div>
              <ConnectionStatusDot status={promotor.connectionStatus} showLabel />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{promotor.visitsCompleted}/{promotor.visitsTotal} visitas</span>
                <span className="flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5" />
                  {promotor.photosCount}
                </span>
              </div>
              <CompletionBadge percentage={promotor.completionPct} />
            </div>
          </button>
        ))}
      </div>
      
      {filteredPromotores.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum promotor encontrado</p>
        </div>
      )}
    </div>
  )
}
