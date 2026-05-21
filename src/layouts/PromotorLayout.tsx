import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Map, ClipboardList, AlertCircle, Bell, MoreHorizontal } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { SyncIndicator } from '@/components/SyncIndicator'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/promotor', icon: Map, label: 'Roteiro', end: true },
  { to: '/promotor/tarefas', icon: ClipboardList, label: 'Tarefas' },
  { to: '/promotor/ocorrencias', icon: AlertCircle, label: 'Ocorrências' },
  { to: '/promotor/notificacoes', icon: Bell, label: 'Notificações' },
  { to: '/promotor/mais', icon: MoreHorizontal, label: 'Mais' },
]

export default function PromotorLayout() {
  const location = useLocation()
  const isVisitPage = location.pathname.includes('/visita/')
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header - hide during visit flow */}
      {!isVisitPage && (
        <header className="sticky top-0 z-40 bg-background border-b px-4 py-3 pt-safe">
          <div className="flex items-center justify-between">
            <Logo iconOnly />
            <SyncIndicator />
          </div>
        </header>
      )}
      
      {/* Main Content */}
      <main className={cn(
        'flex-1 overflow-auto',
        !isVisitPage && 'pb-20'
      )}>
        <Outlet />
      </main>
      
      {/* Bottom Navigation - hide during visit flow */}
      {!isVisitPage && (
        <nav className="fixed bottom-0 left-0 right-0 bg-background border-t pb-safe z-40">
          <div className="flex items-center justify-around py-2">
            {navItems.map(({ to, icon: Icon, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => cn(
                  'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[60px]',
                  isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}
