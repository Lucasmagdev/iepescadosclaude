import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { useNavigate } from 'react-router-dom'
import { mockPromotores, mockAllVisits, mockStores } from '@/data/mock'
import { ConnectionStatusDot } from '@/components/ConnectionStatusDot'
import { CompletionBadge } from '@/components/CompletionBadge'
import { cn } from '@/lib/utils'

const BH_CENTER: [number, number] = [-19.9250, -43.9480]

const STATUS_COLORS: Record<string, string> = {
  online: '#22C55E',
  offline: '#E8642A',
  not_accessed: '#A3A3A3',
}

function createPin(status: string, initials: string) {
  const color = STATUS_COLORS[status] ?? '#A3A3A3'
  return L.divIcon({
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;">
        <div style="
          width:40px;height:40px;border-radius:50%;
          background:${color};border:3px solid white;
          box-shadow:0 3px 14px rgba(0,0,0,0.35);
          display:flex;align-items:center;justify-content:center;
          font-size:13px;font-weight:800;color:white;
          font-family:system-ui,sans-serif;
        ">${initials}</div>
        <div style="
          width:0;height:0;
          border-left:6px solid transparent;
          border-right:6px solid transparent;
          border-top:9px solid ${color};
          margin-top:-1px;
        "></div>
      </div>`,
    className: '',
    iconSize: [40, 52],
    iconAnchor: [20, 52],
    popupAnchor: [0, -54],
  })
}

export default function MapaPage() {
  const navigate = useNavigate()

  const onlineCount = mockPromotores.filter(p => p.connectionStatus === 'online').length
  const offlineCount = mockPromotores.filter(p => p.connectionStatus === 'offline').length
  const noAccessCount = mockPromotores.filter(p => p.connectionStatus === 'not_accessed').length

  return (
    <div className="space-y-5 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mapa de Promotores</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Localização em tempo real — BH</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-success inline-block" />
            <span className="text-success">{onlineCount} online</span>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
            <span className="text-primary">{offlineCount} offline</span>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground inline-block" />
            <span className="text-muted-foreground">{noAccessCount} sem acesso</span>
          </span>
        </div>
      </div>

      {/* Map */}
      <div className="rounded-2xl overflow-hidden border shadow-sm" style={{ height: 500 }}>
        <MapContainer
          center={BH_CENTER}
          zoom={12}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
          />

          {mockPromotores.map(promotor => {
            if (!promotor.lat || !promotor.lng) return null
            const initials = promotor.name.split(' ').map(n => n[0]).join('').slice(0, 2)
            const activeVisit = mockAllVisits.find(v => v.promotorId === promotor.id && v.status === 'in_progress')
            const activeStore = activeVisit ? mockStores.find(s => s.id === activeVisit.storeId) : null

            return (
              <Marker
                key={promotor.id}
                position={[promotor.lat, promotor.lng]}
                icon={createPin(promotor.connectionStatus, initials)}
              >
                <Popup minWidth={220}>
                  <div style={{ fontFamily: 'system-ui,sans-serif', padding: '4px 0' }}>
                    {/* Promotor header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: '50%',
                        background: 'rgba(232,100,42,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: 15, color: '#E8642A', flexShrink: 0,
                      }}>
                        {initials}
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 14, margin: 0, color: '#171717' }}>{promotor.name}</p>
                        <p style={{ color: '#737373', fontSize: 12, margin: '2px 0 0' }}>{promotor.regional} · {promotor.device}</p>
                      </div>
                    </div>

                    {/* Active store */}
                    {activeStore && (
                      <div style={{
                        padding: '8px 10px', borderRadius: 8, marginBottom: 10,
                        background: 'rgba(232,100,42,0.07)', border: '1px solid rgba(232,100,42,0.2)',
                      }}>
                        <p style={{ fontSize: 10, color: '#E8642A', fontWeight: 700, margin: '0 0 3px', letterSpacing: '0.05em' }}>VISITANDO AGORA</p>
                        <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: '#171717' }}>{activeStore.name}</p>
                        <p style={{ fontSize: 11, color: '#737373', margin: '2px 0 0' }}>{activeStore.address}</p>
                      </div>
                    )}

                    {/* Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 12 }}>
                      {[
                        { label: 'Visitas', value: `${promotor.visitsCompleted}/${promotor.visitsTotal}` },
                        { label: 'Execução', value: `${promotor.completionPct}%`, highlight: true },
                        { label: 'Fotos', value: String(promotor.photosCount) },
                      ].map(({ label, value, highlight }) => (
                        <div key={label} style={{ background: '#F5F5F5', borderRadius: 6, padding: '6px 4px', textAlign: 'center' }}>
                          <p style={{ fontSize: 10, color: '#737373', margin: '0 0 2px' }}>{label}</p>
                          <p style={{ fontSize: 14, fontWeight: 700, margin: 0, color: highlight ? '#E8642A' : '#171717' }}>{value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Network */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#A3A3A3', marginBottom: 10 }}>
                      <span>Rede: <strong style={{ color: '#525252' }}>{promotor.networkType}</strong></span>
                      <span>Sync: <strong style={{ color: '#525252' }}>{promotor.lastSyncTime}</strong></span>
                    </div>

                    <button
                      onClick={() => navigate(`/gestao/promotores/${promotor.id}`)}
                      style={{
                        width: '100%', padding: '9px', background: '#E8642A', color: '#fff',
                        border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700,
                        cursor: 'pointer', letterSpacing: '0.01em',
                      }}
                    >
                      Ver perfil completo →
                    </button>
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </div>

      {/* Promotor cards row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {mockPromotores.map(promotor => {
          const activeVisit = mockAllVisits.find(v => v.promotorId === promotor.id && v.status === 'in_progress')
          const activeStore = activeVisit ? mockStores.find(s => s.id === activeVisit.storeId) : null
          return (
            <button
              key={promotor.id}
              onClick={() => navigate(`/gestao/promotores/${promotor.id}`)}
              className={cn(
                'bg-card rounded-xl border p-3 text-left hover:border-primary/40 transition-all hover:shadow-sm'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                  {promotor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <ConnectionStatusDot status={promotor.connectionStatus} />
              </div>
              <p className="font-semibold text-foreground text-sm truncate">{promotor.name.split(' ')[0]}</p>
              {activeStore ? (
                <p className="text-[10px] text-primary font-medium truncate mt-0.5">● {activeStore.name}</p>
              ) : (
                <p className="text-xs text-muted-foreground mt-0.5">{promotor.visitsCompleted}/{promotor.visitsTotal} visitas</p>
              )}
              <div className="mt-2">
                <CompletionBadge percentage={promotor.completionPct} />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
