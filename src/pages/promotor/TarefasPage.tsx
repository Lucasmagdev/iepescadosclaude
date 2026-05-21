import { ClipboardList, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { useVisitStore } from '@/store/visits'
import { mockStores } from '@/data/mock'

export default function TarefasPage() {
  const visits = useVisitStore((s) => s.visits)

  const tasks = visits.map((v) => {
    const store = mockStores.find((s) => s.id === v.storeId)
    return { ...v, storeName: store?.name ?? 'Loja' }
  })

  const pending = tasks.filter((t) => t.status === 'pending')
  const inProgress = tasks.filter((t) => t.status === 'in_progress')
  const done = tasks.filter((t) => t.status === 'completed')

  const statusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle2 className="w-5 h-5 text-success" />
    if (status === 'in_progress') return <Clock className="w-5 h-5 text-warning" />
    return <AlertCircle className="w-5 h-5 text-muted-foreground" />
  }

  const statusLabel: Record<string, string> = {
    pending: 'Pendente',
    in_progress: 'Em andamento',
    completed: 'Concluída',
    justified: 'Justificada',
  }

  const groups = [
    { label: 'Em andamento', items: inProgress, color: 'text-warning' },
    { label: 'Pendentes', items: pending, color: 'text-muted-foreground' },
    { label: 'Concluídas hoje', items: done, color: 'text-success' },
  ]

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Tarefas</h1>
        <span className="text-sm text-muted-foreground">
          {done.length}/{tasks.length} concluídas
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-success transition-all duration-500"
          style={{ width: `${tasks.length ? (done.length / tasks.length) * 100 : 0}%` }}
        />
      </div>

      {groups.map(({ label, items, color }) =>
        items.length > 0 ? (
          <div key={label} className="space-y-3">
            <h2 className={`text-sm font-semibold uppercase tracking-wide ${color}`}>{label}</h2>
            <div className="space-y-2">
              {items.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 bg-card border rounded-xl p-4"
                >
                  {statusIcon(task.status)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{task.storeName}</p>
                    <p className="text-xs text-muted-foreground">{statusLabel[task.status]}</p>
                  </div>
                  {task.checkInTime && (
                    <span className="text-xs text-muted-foreground shrink-0">
                      {task.checkInTime}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null
      )}

      {tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <ClipboardList className="w-16 h-16 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground text-center">Nenhuma tarefa para hoje</p>
        </div>
      )}
    </div>
  )
}
