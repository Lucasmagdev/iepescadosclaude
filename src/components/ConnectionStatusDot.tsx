import { cn } from '@/lib/utils'

interface ConnectionStatusDotProps {
  status: 'online' | 'offline' | 'not_accessed'
  className?: string
  showLabel?: boolean
}

const statusConfig = {
  online: {
    label: 'Online',
    className: 'bg-success',
  },
  offline: {
    label: 'Offline',
    className: 'bg-warning',
  },
  not_accessed: {
    label: 'Não acessou',
    className: 'bg-destructive',
  },
}

export function ConnectionStatusDot({ status, className, showLabel = false }: ConnectionStatusDotProps) {
  const config = statusConfig[status]
  
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <span className={cn(
        'w-2 h-2 rounded-full animate-pulse-dot',
        config.className
      )} />
      {showLabel && (
        <span className="text-xs text-muted-foreground">{config.label}</span>
      )}
    </div>
  )
}
