import { Cloud, CloudOff, RefreshCw } from 'lucide-react'
import { useVisitStore } from '@/store/visits'
import { cn } from '@/lib/utils'

export function SyncIndicator() {
  const syncStatus = useVisitStore((s) => s.syncStatus)
  
  const config = {
    idle: { icon: Cloud, label: 'Sincronizado', className: 'text-muted-foreground' },
    syncing: { icon: RefreshCw, label: 'Sincronizando...', className: 'text-primary animate-spin' },
    synced: { icon: Cloud, label: 'Sincronizado', className: 'text-success' },
    error: { icon: CloudOff, label: 'Erro de sincronização', className: 'text-destructive' },
  }
  
  const { icon: Icon, className } = config[syncStatus]
  
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <Icon className="w-4 h-4" />
    </div>
  )
}
