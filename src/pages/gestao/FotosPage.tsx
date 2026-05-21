import { useState } from 'react'
import { Image, MapPin } from 'lucide-react'
import { mockStores, mockPromotores } from '@/data/mock'
import { useVisitStore } from '@/store/visits'


interface DerivedPhoto {
  id: string
  storeId: string
  promotorId: string
  type: 'before' | 'after'
  timestamp: string
  imageUrl: string
  lat?: number
  lng?: number
}

export default function FotosPage() {
  const visits = useVisitStore((s) => s.visits)
  const [selectedStore, setSelectedStore] = useState('all')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const allPhotos: DerivedPhoto[] = visits.flatMap((v) => {
    const photos: DerivedPhoto[] = []
    if (v.checkInPhoto) {
      photos.push({
        id: `${v.id}-in`,
        storeId: v.storeId,
        promotorId: v.promotorId,
        type: 'before',
        timestamp: v.checkInTime ?? '',
        imageUrl: v.checkInPhoto,
        lat: v.checkInLat,
        lng: v.checkInLng,
      })
    }
    if (v.checkOutPhoto) {
      photos.push({
        id: `${v.id}-out`,
        storeId: v.storeId,
        promotorId: v.promotorId,
        type: 'after',
        timestamp: v.checkOutTime ?? '',
        imageUrl: v.checkOutPhoto,
        lat: v.checkOutLat,
        lng: v.checkOutLng,
      })
    }
    return photos
  })

  const filtered = allPhotos.filter((p) => selectedStore === 'all' || p.storeId === selectedStore)

  const byStore = filtered.reduce((acc, photo) => {
    const store = mockStores.find((s) => s.id === photo.storeId)
    if (!store) return acc
    if (!acc[store.id]) acc[store.id] = { store, photos: [] }
    acc[store.id].photos.push(photo)
    return acc
  }, {} as Record<string, { store: (typeof mockStores)[0]; photos: DerivedPhoto[] }>)

  const typeLabels = { before: 'ANTES', after: 'DEPOIS' }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <h1 className="text-2xl font-bold text-foreground">Fotos do Dia</h1>

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

      <div className="space-y-6">
        {Object.values(byStore).map(({ store, photos }) => (
          <div key={store.id} className="bg-card rounded-xl border overflow-hidden">
            <div className="p-4 border-b bg-muted/30">
              <h2 className="font-semibold text-foreground">{store.name}</h2>
              <p className="text-sm text-muted-foreground">{store.address}</p>
            </div>

            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {photos.map((photo) => {
                const promotor = mockPromotores.find((p) => p.id === photo.promotorId)
                return (
                  <div key={photo.id} className="space-y-2">
                    <div className="aspect-square rounded-lg overflow-hidden bg-muted relative">
                      {photo.imageUrl ? (
                        <img
                          src={photo.imageUrl}
                          alt={typeLabels[photo.type]}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                      )}
                      <span className={`absolute top-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        photo.type === 'before' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                      }`}>
                        {typeLabels[photo.type]}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground truncate">
                        {promotor?.name ?? 'Promotor'}
                      </p>
                      <p className="text-xs text-muted-foreground">{photo.timestamp}</p>
                      {photo.lat && photo.lng && (
                        <p className="text-[10px] text-muted-foreground flex items-center gap-0.5 mt-0.5">
                          <MapPin className="w-2.5 h-2.5" />
                          {photo.lat.toFixed(4)}, {photo.lng.toFixed(4)}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {Object.keys(byStore).length === 0 && (
        <div className="text-center py-12">
          <Image className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground font-medium">Nenhuma foto registrada ainda</p>
          <p className="text-sm text-muted-foreground mt-1">As fotos aparecem aqui após os check-ins dos promotores</p>
        </div>
      )}
    </div>
  )
}
