import { useState, useMemo } from 'react'
import { Image, MapPin, Camera } from 'lucide-react'
import { mockStores, mockPromotores, mockPhotos, MockPhoto } from '@/data/mock'
import { cn } from '@/lib/utils'

export default function FotosPage() {
  const [selectedStore, setSelectedStore] = useState('all')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [lightbox, setLightbox] = useState<MockPhoto | null>(null)

  const filtered = useMemo(() =>
    mockPhotos.filter(p =>
      p.date === selectedDate &&
      (selectedStore === 'all' || p.storeId === selectedStore)
    ),
  [selectedDate, selectedStore])

  const byStore = useMemo(() =>
    filtered.reduce((acc, photo) => {
      const store = mockStores.find(s => s.id === photo.storeId)
      if (!store) return acc
      if (!acc[store.id]) acc[store.id] = { store, photos: [] }
      acc[store.id].photos.push(photo)
      return acc
    }, {} as Record<string, { store: (typeof mockStores)[0]; photos: MockPhoto[] }>),
  [filtered])

  const typeLabel = (t: MockPhoto['type']) => t === 'before' ? 'ANTES' : 'DEPOIS'

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Fotos do Dia</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filtered.length} foto{filtered.length !== 1 ? 's' : ''} registrada{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10">
          <Camera className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary">{filtered.length}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="all">Todas as lojas</option>
          {mockStores.map((store) => (
            <option key={store.id} value={store.id}>{store.name}</option>
          ))}
        </select>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Photo groups by store */}
      <div className="space-y-6">
        {Object.values(byStore).map(({ store, photos }) => {
          const beforeCount = photos.filter(p => p.type === 'before').length
          const afterCount = photos.filter(p => p.type === 'after').length
          return (
            <div key={store.id} className="bg-card rounded-xl border overflow-hidden">
              <div className="p-4 border-b" style={{ background: 'rgba(232,100,42,0.04)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-foreground">{store.name}</h2>
                    <p className="text-sm text-muted-foreground">{store.address}</p>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">{beforeCount} antes</span>
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">{afterCount} depois</span>
                  </div>
                </div>
              </div>

              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {photos.map((photo) => {
                  const promotor = mockPromotores.find((p) => p.id === photo.promotorId)
                  return (
                    <button
                      key={photo.id}
                      onClick={() => setLightbox(photo)}
                      className="text-left group space-y-2"
                    >
                      <div className="aspect-square rounded-xl overflow-hidden bg-muted relative shadow-sm group-hover:shadow-md transition-shadow">
                        <img
                          src={photo.imageUrl}
                          alt={typeLabel(photo.type)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const t = e.target as HTMLImageElement
                            t.style.display = 'none'
                            t.parentElement!.classList.add('flex', 'items-center', 'justify-center')
                          }}
                        />
                        <span className={cn(
                          'absolute top-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md',
                          photo.type === 'before' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                        )}>
                          {typeLabel(photo.type)}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground truncate">{promotor?.name ?? 'Promotor'}</p>
                        <p className="text-xs text-muted-foreground">{photo.timestamp}</p>
                        {photo.lat != null && photo.lng != null && (
                          <p className="text-[10px] text-muted-foreground flex items-center gap-0.5 mt-0.5">
                            <MapPin className="w-2.5 h-2.5 shrink-0" />
                            {photo.lat.toFixed(4)}, {photo.lng.toFixed(4)}
                          </p>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {Object.keys(byStore).length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(232,100,42,0.08)' }}>
            <Image className="w-10 h-10 text-muted-foreground/40" />
          </div>
          <p className="text-muted-foreground font-medium">Nenhuma foto para este filtro</p>
          <p className="text-sm text-muted-foreground mt-1">Tente outra data ou loja</p>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.85)' }}
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <img
              src={lightbox.imageUrl}
              alt={typeLabel(lightbox.type)}
              className="w-full rounded-2xl shadow-2xl"
            />
            <div className="absolute bottom-0 inset-x-0 p-4 rounded-b-2xl" style={{ background: 'rgba(0,0,0,0.7)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">
                    {mockStores.find(s => s.id === lightbox.storeId)?.name}
                  </p>
                  <p className="text-white/70 text-sm">
                    {mockPromotores.find(p => p.id === lightbox.promotorId)?.name} · {lightbox.timestamp}
                    {lightbox.lat != null && ` · ${lightbox.lat.toFixed(4)}, ${lightbox.lng!.toFixed(4)}`}
                  </p>
                </div>
                <span className={cn(
                  'px-3 py-1 rounded-full text-xs font-bold',
                  lightbox.type === 'before' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                )}>
                  {typeLabel(lightbox.type)}
                </span>
              </div>
            </div>
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
              style={{ background: 'rgba(0,0,0,0.5)' }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
