import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, CheckCircle2, ChevronRight, Play } from 'lucide-react'
import { useVisitStore } from '@/store/visits'
import { useAuthStore } from '@/store/auth'
import { mockStores } from '@/data/mock'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default function RoteiroPage() {
  const navigate = useNavigate()
  const visits = useVisitStore((s) => s.visits)
  const updateVisitStatus = useVisitStore((s) => s.updateVisitStatus)
  const user = useAuthStore((s) => s.user)

  const today = new Date()
  const todayVisits = visits.filter(v => v.date === today.toISOString().split('T')[0])
  const completed = todayVisits.filter(v => v.status === 'completed')
  const inProgress = todayVisits.filter(v => v.status === 'in_progress')
  const pct = todayVisits.length ? Math.round((completed.length / todayVisits.length) * 100) : 0

  const handleStartVisit = (visitId: string) => {
    updateVisitStatus(visitId, 'in_progress')
    navigate(`/promotor/visita/${visitId}`)
  }

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Bom dia'
    if (h < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  return (
    <div className="p-4 space-y-5 pb-24">
      {/* Greeting */}
      <div className="pt-2">
        <p className="text-muted-foreground text-sm">{greeting()},</p>
        <h1 className="text-2xl font-bold text-foreground">{user?.name?.split(' ')[0] ?? 'Promotor'}</h1>
        <p className="text-xs text-muted-foreground mt-0.5">{formatDate(today)}</p>
      </div>

      {/* Progress Summary */}
      <div
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(232,100,42,0.18) 0%, rgba(28,91,122,0.25) 100%)',
          border: '1px solid rgba(232,100,42,0.25)',
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Progresso hoje</p>
            <p className="text-3xl font-bold text-foreground">
              {completed.length}<span className="text-lg text-muted-foreground font-normal">/{todayVisits.length}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">visitas concluídas</p>
          </div>
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
              <circle
                cx="40" cy="40" r="34" fill="none"
                stroke="#E8642A" strokeWidth="8"
                strokeLinecap="round"
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
        {todayVisits.length === 0 && (
          <div className="text-center py-16">
            <MapPin className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">Nenhuma visita agendada para hoje</p>
          </div>
        )}

        {todayVisits.map((visit, idx) => {
          const store = mockStores.find(s => s.id === visit.storeId)
          if (!store) return null
          const isDone = visit.status === 'completed'
          const isActive = visit.status === 'in_progress'

          return (
            <div
              key={visit.id}
              className={cn(
                'rounded-2xl border p-4 transition-all',
                isDone && 'opacity-60',
                isActive && 'border-primary/40',
              )}
              style={{
                background: isActive
                  ? 'linear-gradient(135deg, rgba(232,100,42,0.08) 0%, rgba(7,21,37,0.9) 100%)'
                  : 'var(--card)',
                borderColor: isActive ? 'rgba(232,100,42,0.4)' : undefined,
              }}
            >
              <div className="flex items-start gap-3">
                {/* Sequence badge */}
                <div className={cn(
                  'w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 mt-0.5',
                  isDone
                    ? 'bg-success/15 text-success'
                    : isActive
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                )}>
                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className={cn(
                    'font-semibold truncate',
                    isDone ? 'text-muted-foreground line-through' : 'text-foreground'
                  )}>
                    {store.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{store.address}</span>
                  </div>

                  {isDone && visit.checkInTime && visit.checkOutTime && (
                    <div className="flex items-center gap-1.5 text-xs text-success mt-1.5">
                      <Clock className="w-3 h-3" />
                      <span>{visit.checkInTime} → {visit.checkOutTime}</span>
                    </div>
                  )}
                </div>
              </div>

              {!isDone && (
                <button
                  onClick={() => handleStartVisit(visit.id)}
                  className={cn(
                    'mt-3 w-full flex items-center justify-center gap-2 py-3 px-4 font-semibold rounded-xl transition-all text-sm',
                    isActive
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                  )}
                >
                  {isActive ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse" />
                      Continuar Visita
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Iniciar Visita
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
