import { useNavigate } from 'react-router-dom'
import { MapPin, ChevronRight } from 'lucide-react'
import { useVisitStore } from '@/store/visits'
import { mockStores } from '@/data/mock'
import { StatusBadge } from '@/components/StatusBadge'
import { formatDate } from '@/lib/utils'

export default function RoteiroPage() {
  const navigate = useNavigate()
  const visits = useVisitStore((s) => s.visits)
  const updateVisitStatus = useVisitStore((s) => s.updateVisitStatus)
  
  const today = new Date()
  const todayVisits = visits.filter(v => v.date === today.toISOString().split('T')[0])
  
  const completedCount = todayVisits.filter(v => v.status === 'completed').length
  const totalCount = todayVisits.length
  
  const handleStartVisit = (visitId: string) => {
    updateVisitStatus(visitId, 'in_progress')
    navigate(`/promotor/visita/${visitId}`)
  }
  
  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Roteiro do Dia</h1>
        <p className="text-muted-foreground">
          {formatDate(today)} - {completedCount}/{totalCount} visitas concluídas
        </p>
      </div>
      
      {/* Visit Cards */}
      <div className="space-y-3">
        {todayVisits.map((visit) => {
          const store = mockStores.find(s => s.id === visit.storeId)
          if (!store) return null
          
          return (
            <div
              key={visit.id}
              className="bg-card rounded-xl border p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">
                    {store.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{store.address}</span>
                  </div>
                </div>
                <StatusBadge status={visit.status} />
              </div>
              
              {visit.status === 'completed' ? (
                <div className="text-sm text-muted-foreground">
                  Check-in: {visit.checkInTime} | Check-out: {visit.checkOutTime}
                </div>
              ) : (
                <button
                  onClick={() => handleStartVisit(visit.id)}
                  disabled={visit.status === 'in_progress'}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {visit.status === 'in_progress' ? 'Continuar Visita' : 'Iniciar Visita'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )
        })}
      </div>
      
      {todayVisits.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">Nenhuma visita agendada para hoje</p>
        </div>
      )}
    </div>
  )
}
