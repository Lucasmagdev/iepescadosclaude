import { useState } from 'react'
import { Search, MapPin } from 'lucide-react'
import { mockStores } from '@/data/mock'

export default function LojasPage() {
  const [search, setSearch] = useState('')
  const [regionalFilter, setRegionalFilter] = useState('all')
  
  const regionals = [...new Set(mockStores.map(s => s.regional))]
  
  const filteredStores = mockStores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(search.toLowerCase()) ||
                         store.address.toLowerCase().includes(search.toLowerCase())
    const matchesRegional = regionalFilter === 'all' || store.regional === regionalFilter
    return matchesSearch && matchesRegional
  })
  
  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <h1 className="text-2xl font-bold text-foreground">Lojas</h1>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar loja..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        
        <select
          value={regionalFilter}
          onChange={(e) => setRegionalFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="all">Todas as regionais</option>
          {regionals.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
      
      {/* Store Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredStores.map((store) => (
          <div
            key={store.id}
            className="bg-card rounded-xl border p-4"
          >
            <h3 className="font-semibold text-foreground mb-2">{store.name}</h3>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{store.address}</span>
            </div>
            <span className="inline-block mt-3 px-2 py-0.5 bg-muted text-muted-foreground text-xs font-medium rounded">
              {store.regional}
            </span>
          </div>
        ))}
      </div>
      
      {filteredStores.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhuma loja encontrada</p>
        </div>
      )}
    </div>
  )
}
