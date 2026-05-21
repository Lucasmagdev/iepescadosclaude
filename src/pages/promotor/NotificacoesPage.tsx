import { Bell, CheckCircle2, AlertTriangle, Info } from 'lucide-react'

interface Notif {
  id: string
  tipo: 'info' | 'alerta' | 'sucesso'
  titulo: string
  mensagem: string
  hora: string
  lida: boolean
}

const mockNotifs: Notif[] = [
  {
    id: '1',
    tipo: 'info',
    titulo: 'Roteiro do dia disponível',
    mensagem: 'Você tem 3 visitas programadas para hoje.',
    hora: '07:00',
    lida: false,
  },
  {
    id: '2',
    tipo: 'alerta',
    titulo: 'Sync pendente',
    mensagem: 'Você está sem internet. Seus dados serão sincronizados quando a conexão voltar.',
    hora: '08:30',
    lida: false,
  },
  {
    id: '3',
    tipo: 'sucesso',
    titulo: 'Visita registrada',
    mensagem: 'Visita ao Supermercado BH registrada com sucesso.',
    hora: '09:15',
    lida: true,
  },
]

const icons = {
  info: <Info className="w-5 h-5 text-blue-500" />,
  alerta: <AlertTriangle className="w-5 h-5 text-warning" />,
  sucesso: <CheckCircle2 className="w-5 h-5 text-success" />,
}

const borderColors = {
  info: 'border-l-blue-400',
  alerta: 'border-l-yellow-400',
  sucesso: 'border-l-green-400',
}

export default function NotificacoesPage() {
  const naoLidas = mockNotifs.filter((n) => !n.lida)

  return (
    <div className="p-4 space-y-4 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Notificações</h1>
        {naoLidas.length > 0 && (
          <span className="text-xs font-semibold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
            {naoLidas.length} novas
          </span>
        )}
      </div>

      {mockNotifs.length > 0 ? (
        <div className="space-y-3">
          {mockNotifs.map((n) => (
            <div
              key={n.id}
              className={`bg-card border border-l-4 ${borderColors[n.tipo]} rounded-xl p-4 flex gap-3 ${
                n.lida ? 'opacity-60' : ''
              }`}
            >
              <div className="shrink-0 mt-0.5">{icons[n.tipo]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-sm text-foreground">{n.titulo}</p>
                  <span className="text-xs text-muted-foreground shrink-0">{n.hora}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{n.mensagem}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <Bell className="w-16 h-16 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground text-center">Nenhuma notificação</p>
        </div>
      )}
    </div>
  )
}
