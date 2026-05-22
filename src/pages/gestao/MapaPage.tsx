import 'leaflet/dist/leaflet.css'
import { useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { useNavigate } from 'react-router-dom'
import { mockPromotores, mockAllVisits, mockStores } from '@/data/mock'
import { ConnectionStatusDot } from '@/components/ConnectionStatusDot'
import { CompletionBadge } from '@/components/CompletionBadge'
import { Promotor } from '@/types'
import { cn } from '@/lib/utils'

const BH_CENTER: [number, number] = [-19.9250, -43.9480]
const today = new Date().toISOString().split('T')[0]

const STATUS_COLORS: Record<string, string> = {
  online: '#22C55E',
  offline: '#E8642A',
  not_accessed: '#A3A3A3',
}

function completionColor(completed: number, total: number) {
  if (total === 0) return '#A3A3A3'
  const pct = completed / total
  if (pct === 1) return '#22C55E'
  if (pct >= 0.5) return '#E8642A'
  return '#EF4444'
}

function createPin(color: string, initials: string) {
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

function formatDateBR(d: string) {
  return d.split('-').reverse().join('/')
}

export default function MapaPage() {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(today)
  const isToday = selectedDate === today

  const dateStats = useMemo(() =>
    mockPromotores.reduce((acc, p) => {
      const visits = mockAllVisits.filter(v => v.promotorId === p.id && v.date === selectedDate)
      const completed = visits.filter(v => v.status === 'completed').length
      const justified = visits.filter(v => v.status === 'justified').length
      const inProgress = visits.filter(v => v.status === 'in_progress')
      acc[p.id] = { visits, completed, justified, total: visits.length, inProgress }
      return acc
    }, {} as Record<string, {
      visits: typeof mockAllVisits
      completed: number
      justified: number
      total: number
      inProgress: typeof mockAllVisits
    }>),
  [selectedDate])

  function pinColor(p: Promotor) {
    if (isToday) return STATUS_COLORS[p.connectionStatus] ?? '#A3A3A3'
    const s = dateStats[p.id]
    return completionColor(s.completed, s.total)
  }

  const onlineCount  = mockPromotores.filter(p => p.connectionStatus === 'online').length
  const offlineCount = mockPromotores.filter(p => p.connectionStatus === 'offline').length
  const noAccess     = mockPromotores.filter(p => p.connectionStatus === 'not_accessed').length

  return (
    <div className="space-y-5 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mapa de Promotores</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isToday ? 'Localização em tempo real' : `Dados de ${formatDateBR(selectedDate)}`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date filter */}
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="px-3 py-2 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />

          {/* Status legend — only for today */}
          {isToday && (
            <div className="hidden sm:flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 font-medium text-success">
                <span className="w-2.5 h-2.5 rounded-full bg-success inline-block" />{onlineCount} online
              </span>
              <span className="flex items-center gap-1.5 font-medium text-primary">
                <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />{offlineCount} offline
              </span>
              <span className="flex items-center gap-1.5 font-medium text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground inline-block" />{noAccess} s/ acesso
              </span>
            </div>
          )}

          {/* Completion legend — for past dates */}
          {!isToday && (
            <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-success inline-block" />100%</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />50%+</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-destructive inline-block" />Parcial</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-muted-foreground inline-block" />Sem dados</span>
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="rounded-2xl overflow-hidden border shadow-sm" style={{ height: 500 }}>
        <MapContainer center={BH_CENTER} zoom={12} style={{ width: '100%', height: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
          />

          {mockPromotores.map(promotor => {
            if (!promotor.lat || !promotor.lng) return null
            const initials = promotor.name.split(' ').map(n => n[0]).join('').slice(0, 2)
            const stats = dateStats[promotor.id]

            // Loja ativa (hoje = in_progress, passado = última completed)
            const activeVisit = isToday
              ? stats.inProgress[0]
              : stats.visits.filter(v => v.status === 'completed').at(-1)
            const activeStore = activeVisit ? mockStores.find(s => s.id === activeVisit.storeId) : null

            const completedStores = stats.visits
              .filter(v => v.status === 'completed')
              .map(v => mockStores.find(s => s.id === v.storeId)?.name)
              .filter(Boolean)

            const color = pinColor(promotor)

            return (
              <Marker
                key={promotor.id}
                position={[promotor.lat, promotor.lng]}
                icon={createPin(color, initials)}
              >
                <Popup minWidth={230}>
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
                        <p style={{ color: '#737373', fontSize: 12, margin: '2px 0 0' }}>
                          {promotor.regional}
                          {isToday && ` · ${promotor.connectionStatus === 'online' ? '🟢 Online' : promotor.connectionStatus === 'offline' ? '🟡 Offline' : '⚫ Sem acesso'}`}
                        </p>
                      </div>
                    </div>

                    {/* Date-specific content */}
                    {isToday && activeStore && (
                      <div style={{ padding: '8px 10px', borderRadius: 8, marginBottom: 10, background: 'rgba(232,100,42,0.07)', border: '1px solid rgba(232,100,42,0.2)' }}>
                        <p style={{ fontSize: 10, color: '#E8642A', fontWeight: 700, margin: '0 0 3px', letterSpacing: '0.05em' }}>VISITANDO AGORA</p>
                        <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: '#171717' }}>{activeStore.name}</p>
                        <p style={{ fontSize: 11, color: '#737373', margin: '2px 0 0' }}>{activeStore.address}</p>
                      </div>
                    )}

                    {!isToday && stats.total === 0 && (
                      <div style={{ padding: '8px 10px', borderRadius: 8, marginBottom: 10, background: '#F5F5F5' }}>
                        <p style={{ fontSize: 12, color: '#737373', margin: 0, textAlign: 'center' }}>Sem visitas em {formatDateBR(selectedDate)}</p>
                      </div>
                    )}

                    {!isToday && completedStores.length > 0 && (
                      <div style={{ marginBottom: 10 }}>
                        <p style={{ fontSize: 10, color: '#737373', fontWeight: 700, margin: '0 0 6px', letterSpacing: '0.05em' }}>LOJAS VISITADAS EM {formatDateBR(selectedDate)}</p>
                        {completedStores.map((name, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                            <span style={{ fontSize: 10, color: '#22C55E' }}>✓</span>
                            <span style={{ fontSize: 12, color: '#171717' }}>{name}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 12 }}>
                      {[
                        {
                          label: 'Visitas',
                          value: stats.total > 0 ? `${stats.completed}/${stats.total}` : (isToday ? `${promotor.visitsCompleted}/${promotor.visitsTotal}` : '—'),
                        },
                        {
                          label: 'Execução',
                          value: stats.total > 0
                            ? `${Math.round((stats.completed / stats.total) * 100)}%`
                            : (isToday ? `${promotor.completionPct}%` : '—'),
                          highlight: true,
                        },
                        { label: 'Fotos', value: String(promotor.photosCount) },
                      ].map(({ label, value, highlight }) => (
                        <div key={label} style={{ background: '#F5F5F5', borderRadius: 6, padding: '6px 4px', textAlign: 'center' }}>
                          <p style={{ fontSize: 10, color: '#737373', margin: '0 0 2px' }}>{label}</p>
                          <p style={{ fontSize: 14, fontWeight: 700, margin: 0, color: highlight ? color : '#171717' }}>{value}</p>
                        </div>
                      ))}
                    </div>

                    {isToday && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#A3A3A3', marginBottom: 10 }}>
                        <span>Rede: <strong style={{ color: '#525252' }}>{promotor.networkType}</strong></span>
                        <span>Sync: <strong style={{ color: '#525252' }}>{promotor.lastSyncTime}</strong></span>
                      </div>
                    )}

                    <button
                      onClick={() => navigate(`/gestao/promotores/${promotor.id}`)}
                      style={{
                        width: '100%', padding: '9px', background: '#E8642A', color: '#fff',
                        border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700,
                        cursor: 'pointer',
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

      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {mockPromotores.map(promotor => {
          const stats = dateStats[promotor.id]
          const activeVisit = isToday
            ? stats.inProgress[0]
            : stats.visits.filter(v => v.status === 'completed').at(-1)
          const activeStore = activeVisit ? mockStores.find(s => s.id === activeVisit.storeId) : null
          const color = pinColor(promotor)

          return (
            <button
              key={promotor.id}
              onClick={() => navigate(`/gestao/promotores/${promotor.id}`)}
              className="bg-card rounded-xl border p-3 text-left hover:border-primary/40 transition-all hover:shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white"
                  style={{ background: color }}
                >
                  {promotor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                {isToday && <ConnectionStatusDot status={promotor.connectionStatus} />}
              </div>
              <p className="font-semibold text-foreground text-sm truncate">{promotor.name.split(' ')[0]}</p>
              {activeStore ? (
                <p className="text-[10px] font-medium truncate mt-0.5" style={{ color }}>
                  {isToday ? '●' : '✓'} {activeStore.name}
                </p>
              ) : stats.total > 0 ? (
                <p className="text-xs text-muted-foreground mt-0.5">{stats.completed}/{stats.total} lojas</p>
              ) : (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isToday ? `${promotor.visitsCompleted}/${promotor.visitsTotal}` : 'Sem dados'}
                </p>
              )}
              {isToday ? (
                <div className="mt-2"><CompletionBadge percentage={promotor.completionPct} /></div>
              ) : stats.total > 0 ? (
                <div className="mt-2"><CompletionBadge percentage={Math.round((stats.completed / stats.total) * 100)} /></div>
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
