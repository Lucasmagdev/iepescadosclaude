import { useNavigate } from 'react-router-dom'
import { User, LogOut, Settings, HelpCircle, FileText } from 'lucide-react'
import { useAuthStore } from '@/store/auth'

export default function MaisPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  
  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  
  const menuItems = [
    { icon: User, label: 'Meu Perfil', onClick: () => {} },
    { icon: Settings, label: 'Configurações', onClick: () => {} },
    { icon: FileText, label: 'Termos de Uso', onClick: () => {} },
    { icon: HelpCircle, label: 'Ajuda', onClick: () => {} },
  ]
  
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Mais</h1>
      
      {/* User Info */}
      <div className="bg-card rounded-xl border p-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">{user?.name}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>
      
      {/* Menu Items */}
      <div className="bg-card rounded-xl border divide-y">
        {menuItems.map(({ icon: Icon, label, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-muted/50 transition-colors"
          >
            <Icon className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium text-foreground">{label}</span>
          </button>
        ))}
      </div>
      
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
