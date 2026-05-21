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
        .gestao-dark {
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

        .gestao-dark .gestao-main {
          background:
            radial-gradient(ellipse at 70% 0%, rgba(28,91,122,0.25) 0%, transparent 50%),
            linear-gradient(180deg, #071525 0%, #07111d 60%, #050e18 100%);
          min-height: 100vh;
        }

        .gestao-sidebar {
          position: fixed; left: 0; top: 0; bottom: 0; width: 256px;
          display: none; flex-direction: column; overflow: hidden;
          background:
            radial-gradient(ellipse at 50% 0%, rgba(28,91,122,0.55) 0%, transparent 55%),
            linear-gradient(180deg, #071525 0%, #07111d 55%, #050e18 100%);
          border-right: 1px solid rgba(255,255,255,0.07);
        }
        @media (min-width: 1024px) { .gestao-sidebar { display: flex; } }

        .gestao-sidebar-sea {
          position: absolute; inset: 0; pointer-events: none;
          opacity: 0.35;
          background:
            repeating-linear-gradient(108deg, rgba(255,255,255,0.055) 0 1px, transparent 1px 32px),
            repeating-linear-gradient(22deg, rgba(232,100,42,0.04) 0 1px, transparent 1px 48px);
          filter: blur(0.5px);
        }
        .gestao-sidebar-glow {
          position: absolute; top: -10%; left: -20%;
          width: 140%; height: 40%; pointer-events: none;
          background: radial-gradient(ellipse, rgba(232,100,42,0.12) 0%, transparent 65%);
          filter: blur(24px);
        }

        .gestao-nav-link {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 16px; border-radius: 10px;
          font-size: 14px; font-weight: 500;
          color: rgba(255,255,255,0.5);
          transition: background 0.18s, color 0.18s;
          position: relative; text-decoration: none;
        }
        .gestao-nav-link:hover {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.85);
        }
        .gestao-nav-link.active {
          background: rgba(232,100,42,0.15);
          color: #E8642A;
          box-shadow: inset 3px 0 0 #E8642A;
        }

        .gestao-mobile-header {
          background:
            radial-gradient(ellipse at 50% 0%, rgba(28,91,122,0.7) 0%, transparent 80%),
            linear-gradient(180deg, #071525 0%, #07111d 100%);
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .gestao-mobile-nav {
          background: #071525;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .gestao-mobile-nav-link {
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          padding: 8px 12px; border-radius: 10px;
          color: rgba(255,255,255,0.4); min-width: 56px;
          transition: color 0.18s; text-decoration: none; font-size: 10px; font-weight: 500;
        }
        .gestao-mobile-nav-link:hover { color: rgba(255,255,255,0.75); }
        .gestao-mobile-nav-link.active { color: #E8642A; }
      `}</style>

      <div className="gestao-dark min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="gestao-sidebar">
          <div className="gestao-sidebar-sea" />
          <div className="gestao-sidebar-glow" />

          <div style={{ position: 'relative', padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <Logo className="brightness-0 invert" />
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

          <div style={{ position: 'relative', padding: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: 11, textAlign: 'center', letterSpacing: '0.1em' }}>
              IE Pescados v1.0
            </p>
          </div>
        </aside>

        {/* Mobile Header */}
        <header className="gestao-mobile-header lg:hidden sticky top-0 z-40 px-4 py-3">
          <div className="flex items-center justify-between">
            <Logo className="brightness-0 invert" size="sm" />
          </div>
        </header>

        {/* Main Content */}
        <main className="lg:ml-64 gestao-main">
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
