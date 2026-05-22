import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, CheckCircle2, ChevronRight, Play, Navigation, Target, Clock } from 'lucide-react'
import { useVisitStore } from '@/store/visits'
import { useAuthStore } from '@/store/auth'
import { mockStores } from '@/data/mock'
import { cn } from '@/lib/utils'

const NEARBY_RADIUS = 4000 // metros
// Localização demo: perto de SUPER NOSSO 289 (Av. Prof. Mário Werneck) — ~90m de distância
const DEMO_LOCATION = { lat: -19.9195, lng: -43.9870 }

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000
  const toRad = (d: number) => d * Math.PI / 180
  const φ1 = toRad(lat1), φ2 = toRad(lat2)
  const Δφ = toRad(lat2 - lat1), Δλ = toRad(lng2 - lng1)
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function formatDist(m: number) {
  return m < 1000 ? `${Math.round(m)}m` : `${(m / 1000).toFixed(1)}km`
}

function getWeekRange() {
  const now = new Date()
  const day = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1))
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  return { monday, sunday }
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

export default function RoteiroPage() {
  const navigate = useNavigate()
  const visits = useVisitStore((s) => s.visits)
  const updateVisitStatus = useVisitStore((s) => s.updateVisitStatus)
  const user = useAuthStore((s) => s.user)

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [usingDemo, setUsingDemo] = useState(false)

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(DEMO_LOCATION)
      setUsingDemo(true)
      return
    }
    const id = navigator.geolocation.watchPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => { setLocation(DEMO_LOCATION); setUsingDemo(true) },
      { enableHighAccuracy: true, maximumAge: 30000, timeout: 8000 }
    )
    return () => navigator.geolocation.clearWatch(id)
  }, [])

  const completed = visits.filter(v => v.status === 'completed')
  const inProgress = visits.filter(v => v.status === 'in_progress')
  const pct = visits.length ? Math.round((completed.length / visits.length) * 100) : 0
  const { monday, sunday } = getWeekRange()

  const weekLabel = `${monday.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} — ${sunday.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}`

  // Calcula distância e ordena: in_progress > nearby pending > pending por dist > completed
  const sortedVisits = useMemo(() => {
    return visits
      .map(v => {
        const store = mockStores.find(s => s.id === v.storeId)
        const dist = location && store?.lat != null && store?.lng != null
          ? haversine(location.lat, location.lng, store.lat, store.lng)
          : null
        const nearby = dist !== null && dist <= NEARBY_RADIUS && v.status === 'pending'
        return { visit: v, store, dist, nearby }
      })
      .sort((a, b) => {
        if (a.visit.status === 'in_progress') return -1
        if (b.visit.status === 'in_progress') return 1
        if (a.nearby && !b.nearby) return -1
        if (b.nearby && !a.nearby) return 1
        if (a.visit.status === 'completed' && b.visit.status !== 'completed') return 1
        if (b.visit.status === 'completed' && a.visit.status !== 'completed') return -1
        if (a.dist !== null && b.dist !== null) return a.dist - b.dist
        return 0
      })
  }, [visits, location])

  const handleStartVisit = (visitId: string) => {
    updateVisitStatus(visitId, 'in_progress')
    navigate(`/promotor/visita/${visitId}`)
  }

  return (
    <div className="p-4 space-y-5 pb-24">
      {/* Greeting */}
      <div className="pt-2">
        <p className="text-muted-foreground text-sm">{greeting()},</p>
        <h1 className="text-2xl font-bold text-foreground">{user?.name?.split(' ')[0] ?? 'Promotor'}</h1>
      </div>

      {/* GPS status */}
      {usingDemo && (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
          style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.25)' }}
        >
          <Navigation className="w-3.5 h-3.5 text-yellow-600 shrink-0" />
          <span className="text-yellow-700">Localização simulada — GPS não disponível neste dispositivo</span>
        </div>
      )}

      {/* Week Progress Card */}
      <div
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #FFF5F0 0%, #FFF9F5 100%)',
          border: '1px solid rgba(232,100,42,0.2)',
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Roteiro da semana
            </p>
            <p className="text-3xl font-bold text-foreground">
              {completed.length}
              <span className="text-lg text-muted-foreground font-normal">/{visits.length}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">lojas visitadas</p>
            <p className="text-xs text-muted-foreground/60 mt-1">{weekLabel}</p>
          </div>
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(232,100,42,0.12)" strokeWidth="8" />
              <circle
                cx="40" cy="40" r="34" fill="none"
                stroke="#E8642A" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 34}`}
                strokeDashoffset={`${2 * Math.PI * 34 * (1 - pct / 100)}`}
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-foreground">
              {pct}%
            </span>
          </div>
        </div>

        {inProgress.length > 0 && (
          <div className="mt-4 flex items-center gap-2 text-xs text-primary">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {inProgress.length} visita em andamento
          </div>
        )}
      </div>

      {/* Visit List */}
      <div className="space-y-3">
        {sortedVisits.map(({ visit, store, dist, nearby }) => {
          if (!store) return null
          const isDone = visit.status === 'completed'
          const isActive = visit.status === 'in_progress'

          return (
            <div
              key={visit.id}
              className={cn('rounded-2xl border p-4 transition-all', isDone && 'opacity-55')}
              style={{
                background: isActive ? '#FFF5F0' : nearby ? 'rgba(34,197,94,0.04)' : 'var(--card)',
                borderColor: isActive ? '#E8642A' : nearby ? 'rgba(34,197,94,0.45)' : undefined,
                borderWidth: isActive || nearby ? 2 : 1,
              }}
            >
              <div className="flex items-start gap-3">
                {/* Icon badge */}
                <div className={cn(
                  'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5',
                  isDone   ? 'bg-success/12 text-success'
                  : isActive ? 'bg-primary/20 text-primary'
                  : nearby   ? 'bg-success/15 text-success'
                  : 'bg-muted text-muted-foreground'
                )}>
                  {isDone    ? <CheckCircle2 className="w-5 h-5" />
                   : nearby  ? <Target className="w-4 h-4" />
                   : <MapPin className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Name + nearby badge */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={cn(
                      'font-semibold',
                      isDone ? 'text-muted-foreground line-through' : 'text-foreground'
                    )}>
                      {store.name}
                    </h3>
                    {nearby && (
                      <span
                        className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full text-success"
                        style={{ background: 'rgba(34,197,94,0.14)' }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse inline-block" />
                        DISPONÍVEL
                      </span>
                    )}
                  </div>

                  {/* Address + distance */}
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate max-w-[150px]">{store.address}</span>
                    </span>
                    {dist !== null && (
                      <span className={cn(
                        'text-xs font-semibold',
                        nearby ? 'text-success' : 'text-muted-foreground'
                      )}>
                        {formatDist(dist)}
                      </span>
                    )}
                  </div>

                  {/* Completed times */}
                  {isDone && visit.checkInTime && visit.checkOutTime && (
                    <div className="flex items-center gap-1.5 text-xs text-success mt-1.5">
                      <Clock className="w-3 h-3" />
                      <span>{visit.checkInTime} → {visit.checkOutTime}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action button */}
              {!isDone && (
                <button
                  onClick={() => handleStartVisit(visit.id)}
                  className={cn(
                    'mt-3 w-full flex items-center justify-center gap-2 py-3 px-4 font-semibold rounded-xl transition-all text-sm'
                  )}
                  style={
                    isActive ? { background: '#E8642A', color: '#fff' }
                    : nearby  ? { background: 'rgba(34,197,94,0.14)', border: '1.5px solid rgba(34,197,94,0.4)', color: '#16a34a' }
                    : { background: 'var(--muted)', color: 'var(--muted-foreground)' }
                  }
                >
                  {isActive ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      Continuar Visita
                    </>
                  ) : nearby ? (
                    <>
                      <Target className="w-4 h-4" />
                      Iniciar Visita — {formatDist(dist!)}
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Iniciar Visita
                      {dist !== null && (
                        <span className="ml-1 text-xs opacity-60">{formatDist(dist)}</span>
                      )}
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </>
                  )}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
