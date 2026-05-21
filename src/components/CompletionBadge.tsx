import { cn } from '@/lib/utils'

interface CompletionBadgeProps {
  percentage: number
  className?: string
}

export function CompletionBadge({ percentage, className }: CompletionBadgeProps) {
  const getColorClass = () => {
    if (percentage >= 90) return 'bg-success/20 text-success'
    if (percentage >= 50) return 'bg-warning/20 text-warning-foreground'
    return 'bg-destructive/20 text-destructive'
  }
  
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold',
      getColorClass(),
      className
    )}>
      {percentage}%
    </span>
  )
}
