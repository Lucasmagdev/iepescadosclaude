import { useNavigate } from 'react-router-dom'
import { Settings, LogOut, User, Bell, Shield, Database } from 'lucide-react'
import { useAuthStore } from '@/store/auth'

export default function ConfigPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  
  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  
  const configSections = [
    {
      title: 'Conta',
      items: [
        { icon: User, label: 'Perfil', description: 'Editar informações pessoais' },
        { icon: Bell, label: 'Notificações', description: 'Configurar alertas e notificações' },
      ]
    },
    {
      title: 'Sistema',
      items: [
        { icon: Shield, label: 'Segurança', description: 'Alterar senha e autenticação' },
        { icon: Database, label: 'Dados', description: 'Exportar e gerenciar dados' },
      ]
    },
  ]
  
  return (
    <div className="space-y-6 pb-20 lg:pb-0 max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
      
      {/* User Info */}
      <div className="bg-card rounded-xl border p-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">{user?.name}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded">
            Gestor
          </span>
        </div>
      </div>
      
      {/* Config Sections */}
      {configSections.map((section) => (
        <div key={section.title} className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {section.title}
          </h3>
          <div className="bg-card rounded-xl border divide-y">
            {section.items.map(({ icon: Icon, label, description }) => (
              <button
                key={label}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{label}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
      
      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-destructive/10 text-destructive font-medium rounded-xl hover:bg-destructive/20 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        Sair da Conta
      </button>
      
      <p className="text-center text-xs text-muted-foreground">
        IE Pescados - Gestão de Promotores v1.0
      </p>
    </div>
  )
}
