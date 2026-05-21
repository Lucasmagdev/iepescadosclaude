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
    <>
      <style>{`
        .promotor-dark {
          --background: #071525;
          --foreground: #ddeaf3;
          --card: #0d1e30;
          --card-foreground: #ddeaf3;
          --popover: #0d1e30;
          --popover-foreground: #ddeaf3;
          --muted: #112033;
          --muted-foreground: #7aaccb;
          --border: #1a3048;
          --input: #1a3048;
          --secondary: #112033;
          --secondary-foreground: #ddeaf3;
          --accent: #112033;
          --accent-foreground: #ddeaf3;
        }
        .promotor-bg {
          background:
            radial-gradient(ellipse at 50% 0%, rgba(28,91,122,0.35) 0%, transparent 55%),
            linear-gradient(180deg, #071525 0%, #07111d 60%, #050e18 100%);
          min-height: 100vh;
        }
        .promotor-header {
          background: rgba(7,21,37,0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .promotor-bottom-nav {
          background: rgba(5,14,24,0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-top: 1px solid rgba(255,255,255,0.07);
        }
        .promotor-nav-link {
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          padding: 8px 12px; border-radius: 10px; min-width: 60px;
          color: rgba(255,255,255,0.4);
          transition: color 0.18s; text-decoration: none;
          font-size: 10px; font-weight: 500;
        }
        .promotor-nav-link:hover { color: rgba(255,255,255,0.75); }
        .promotor-nav-link.active { color: #E8642A; }
      `}</style>

      <div className="promotor-dark promotor-bg flex flex-col">
        {/* Header */}
        {!isVisitPage && (
          <header className="promotor-header sticky top-0 z-40 px-4 py-3 pt-safe">
            <div className="flex items-center justify-between">
              <Logo iconOnly className="brightness-0 invert" />
              <SyncIndicator />
            </div>
          </header>
        )}

        {/* Main Content */}
        <main className={cn('flex-1 overflow-auto', !isVisitPage && 'pb-20')}>
          <Outlet />
        </main>

        {/* Bottom Navigation */}
        {!isVisitPage && (
          <nav className="promotor-bottom-nav fixed bottom-0 left-0 right-0 pb-safe z-40">
            <div className="flex items-center justify-around py-2">
              {navItems.map(({ to, icon: Icon, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) => cn('promotor-nav-link', isActive && 'active')}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </nav>
        )}
      </div>
    </>
  )
}
