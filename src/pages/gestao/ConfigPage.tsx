import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, LogOut, User, Bell, Shield, Database, Users, Phone, MapPin, Smartphone, MoreVertical, UserPlus, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { mockPromotores } from '@/data/mock'
import { ConnectionStatusDot } from '@/components/ConnectionStatusDot'

const STATUS_LABEL: Record<string, string> = {
  online: 'Online',
  offline: 'Offline',
  not_accessed: 'Sem acesso',
}

export default function ConfigPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [expandedUser, setExpandedUser] = useState<string | null>(null)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0 max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground">Configurações</h1>

      {/* Gestor logado */}
      <div className="bg-card rounded-xl border p-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-7 h-7 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-foreground">{user?.name}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded">
            Gestor
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* Usuários / Promotores */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Equipe de Promotores
          </h3>
          <button className="flex items-center gap-1.5 text-xs font-medium text-primary hover:opacity-80 transition-opacity">
            <UserPlus className="w-3.5 h-3.5" />
            Convidar
          </button>
        </div>

        <div className="bg-card rounded-xl border divide-y">
          {mockPromotores.map(p => {
            const initials = p.name.split(' ').map(n => n[0]).join('').slice(0, 2)
            const isExpanded = expandedUser === p.id

            return (
              <div key={p.id}>
                <button
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/40 transition-colors"
                  onClick={() => setExpandedUser(isExpanded ? null : p.id)}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm text-primary flex-shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">{p.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{p.email}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <ConnectionStatusDot status={p.connectionStatus} />
                    <span className="text-xs text-muted-foreground hidden sm:block">{STATUS_LABEL[p.connectionStatus]}</span>
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 bg-muted/20 space-y-3">
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="flex items-start gap-2">
                        <Phone className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Telefone</p>
                          <p className="text-xs font-medium text-foreground">{p.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Regional</p>
                          <p className="text-xs font-medium text-foreground">{p.regional}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Smartphone className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Dispositivo</p>
                          <p className="text-xs font-medium text-foreground">{p.device}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Settings className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Rede</p>
                          <p className="text-xs font-medium text-foreground">{p.networkType}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => navigate(`/gestao/promotores/${p.id}`)}
                        className="flex-1 py-2 text-xs font-semibold text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors"
                      >
                        Ver perfil
                      </button>
                      <button className="flex-1 py-2 text-xs font-semibold text-muted-foreground border rounded-lg hover:bg-muted/50 transition-colors">
                        Editar acesso
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Sistema */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Sistema</h3>
        <div className="bg-card rounded-xl border divide-y">
          {[
            { icon: Bell,     label: 'Notificações',  description: 'Configurar alertas e notificações' },
            { icon: Shield,   label: 'Segurança',     description: 'Alterar senha e autenticação' },
            { icon: Database, label: 'Dados',         description: 'Exportar e gerenciar dados' },
          ].map(({ icon: Icon, label, description }) => (
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
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-destructive/10 text-destructive font-medium rounded-xl hover:bg-destructive/20 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        Sair da Conta
      </button>

      <p className="text-center text-xs text-muted-foreground">IE Pescados · Gestão de Promotores v1.0</p>
    </div>
  )
}
