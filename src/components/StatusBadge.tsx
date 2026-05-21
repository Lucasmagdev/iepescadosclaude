import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: 'pending' | 'in_progress' | 'completed' | 'justified'
  className?: string
}

const statusConfig = {
  pending: {
    label: 'Pendente',
    className: 'bg-muted text-muted-foreground',
  },
  in_progress: {
    label: 'Em andamento',
    className: 'bg-warning/20 text-warning-foreground',
  },
  completed: {
    label: 'Concluído',
    className: 'bg-success/20 text-success',
  },
  justified: {
    label: 'Justificado',
    className: 'bg-warning/20 text-warning-foreground',
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]
  
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      config.className,
      className
    )}>
      {config.label}
    </span>
  )
}
