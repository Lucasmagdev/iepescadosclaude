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
    <>
      <style>{`
        .gestao-sidebar {
          position: fixed; left: 0; top: 0; bottom: 0; width: 256px;
          display: none; flex-direction: column; overflow: hidden;
          background: #ffffff;
          border-right: 1px solid #E5E5E5;
        }
        @media (min-width: 1024px) { .gestao-sidebar { display: flex; } }

        .gestao-sidebar-accent {
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #E8642A, #F3B23C);
        }

        .gestao-nav-link {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 16px; border-radius: 10px;
          font-size: 14px; font-weight: 500;
          color: #737373;
          transition: background 0.15s, color 0.15s;
          text-decoration: none;
        }
        .gestao-nav-link:hover {
          background: #FFF5F0;
          color: #E8642A;
        }
        .gestao-nav-link.active {
          background: #FFF5F0;
          color: #E8642A;
          font-weight: 600;
        }
        .gestao-nav-link.active svg { color: #E8642A; }

        .gestao-mobile-header {
          background: #ffffff;
          border-bottom: 1px solid #E5E5E5;
        }
        .gestao-mobile-nav {
          background: #ffffff;
          border-top: 1px solid #E5E5E5;
        }
        .gestao-mobile-nav-link {
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          padding: 8px 12px; border-radius: 10px; min-width: 56px;
          color: #A3A3A3;
          transition: color 0.15s; text-decoration: none;
          font-size: 10px; font-weight: 500;
        }
        .gestao-mobile-nav-link:hover { color: #E8642A; }
        .gestao-mobile-nav-link.active { color: #E8642A; }
      `}</style>

      <div className="min-h-screen bg-background">
        {/* Desktop Sidebar */}
        <aside className="gestao-sidebar">
          <div className="gestao-sidebar-accent" />

          <div style={{ position: 'relative', padding: '24px', borderBottom: '1px solid #E5E5E5' }}>
            <Logo />
          </div>

          <nav style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: 2, position: 'relative' }}>
            {navItems.map(({ to, icon: Icon, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => cn('gestao-nav-link', isActive && 'active')}
              >
                <Icon style={{ width: 18, height: 18, flexShrink: 0 }} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div style={{ padding: '16px', borderTop: '1px solid #E5E5E5' }}>
            <p style={{ color: '#D4D4D4', fontSize: 11, textAlign: 'center', letterSpacing: '0.1em' }}>
              IE Pescados v1.0
            </p>
          </div>
        </aside>

        {/* Mobile Header */}
        <header className="gestao-mobile-header lg:hidden sticky top-0 z-40 px-4 py-3">
          <div className="flex items-center justify-between">
            <Logo size="sm" />
          </div>
        </header>

        {/* Main Content */}
        <main className="lg:ml-64 min-h-screen bg-muted/40">
          <div className="p-4 lg:p-8">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="gestao-mobile-nav lg:hidden fixed bottom-0 left-0 right-0 pb-safe z-40">
          <div className="flex items-center justify-around py-2">
            {navItems.map(({ to, icon: Icon, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => cn('gestao-mobile-nav-link', isActive && 'active')}
              >
                <Icon style={{ width: 20, height: 20 }} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </>
  )
}
