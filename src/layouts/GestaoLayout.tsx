import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Store, Image, Settings } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/gestao', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/gestao/promotores', icon: Users, label: 'Promotores' },
  { to: '/gestao/lojas', icon: Store, label: 'Lojas' },
  { to: '/gestao/fotos', icon: Image, label: 'Fotos' },
  { to: '/gestao/config', icon: Settings, label: 'Config' },
]

export default function GestaoLayout() {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-background border-r hidden lg:flex flex-col">
        <div className="p-6 border-b">
          <Logo />
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors',
                isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-background border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <Logo />
        </div>
      </header>
      
      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
      
      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t pb-safe z-40">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[56px]',
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
    </div>
  )
}
