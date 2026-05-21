import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Key, MessageCircle, Check, User, Smartphone, Wifi, HardDrive, RefreshCw, Clock } from 'lucide-react'
import { ConnectionStatusDot } from '@/components/ConnectionStatusDot'
import { CompletionBadge } from '@/components/CompletionBadge'
import { mockPromotores } from '@/data/mock'
import { cn } from '@/lib/utils'

export default function PromotorDetailPage() {
  const { promotorId } = useParams<{ promotorId: string }>()
  const navigate = useNavigate()
  
  const promotor = mockPromotores.find(p => p.id === promotorId)
  
  if (!promotor) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Promotor não encontrado</p>
      </div>
    )
  }
  
  const mockTimeline = [
    { time: '08:30', type: 'check-in', store: 'Super Nosso Gonçalves Dias' },
    { time: '09:15', type: 'check-out', store: 'Super Nosso Gonçalves Dias' },
    { time: '09:45', type: 'check-in', store: 'EPA São Luiz' },
    { time: '10:20', type: 'check-out', store: 'EPA São Luiz' },
  ]
  
  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/gestao/promotores')}
          className="p-2 -ml-2 hover:bg-muted rounded-lg lg:hidden"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3 flex-1">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xl">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{promotor.name}</h1>
            <div className="flex items-center gap-2">
              <ConnectionStatusDot status={promotor.connectionStatus} showLabel />
              <span className="text-muted-foreground">|</span>
              <span className="text-sm text-muted-foreground">{promotor.regional}</span>
            </div>
          </div>
        </div>
        
        <CompletionBadge percentage={promotor.completionPct} className="text-sm" />
      </div>
      
      {/* Action Buttons */}
      <div className="space-y-3">
        <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-warning/20 text-warning-foreground font-medium rounded-xl hover:bg-warning/30 transition-colors">
          <Key className="w-5 h-5" />
          Atualizar Acesso do Promotor
        </button>
        
        <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-success/20 text-success font-medium rounded-xl hover:bg-success/30 transition-colors">
          <MessageCircle className="w-5 h-5" />
          Enviar Mensagem no WhatsApp
        </button>
        
        <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-info/20 text-info font-medium rounded-xl hover:bg-info/30 transition-colors">
          <Check className="w-5 h-5" />
          Justificar Agendamentos do Dia
        </button>
      </div>
      
      {/* Sync Info Card */}
      <div className="bg-card rounded-xl border p-4 space-y-4">
        <h2 className="font-semibold text-foreground">Informações de Sincronização</h2>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Primeiro envio do dia</p>
            <p className="font-medium text-foreground">{promotor.firstSyncTime}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Último envio</p>
            <p className="font-medium text-foreground">{promotor.lastSyncTime}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Tipo de rede:</span>
            <span className="font-medium text-foreground">{promotor.networkType}</span>
          </div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Aparelho:</span>
            <span className="font-medium text-foreground">{promotor.device}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <HardDrive className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Uso de memória:</span>
          <span className="text-foreground">LocalStorage 2.4 MB | IndexedDB 8.1 MB</span>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <RefreshCw className={cn(
            "w-5 h-5 text-success",
            promotor.connectionStatus === 'online' && "animate-spin"
          )} />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {promotor.connectionStatus === 'online' ? 'SYNCING' : 'OFFLINE'}
            </p>
            <p className="text-xs text-muted-foreground">
              {promotor.syncProgress.completed}/{promotor.syncProgress.total} concluídos | {promotor.syncProgress.total - promotor.syncProgress.completed} pendentes
            </p>
          </div>
        </div>
      </div>
      
      {/* Timeline */}
      <div className="bg-card rounded-xl border p-4">
        <h2 className="font-semibold text-foreground mb-4">Check-ins e check-outs do dia</h2>
        
        <div className="space-y-4">
          {mockTimeline.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  item.type === 'check-in' ? 'bg-success/20' : 'bg-info/20'
                )}>
                  <Clock className={cn(
                    "w-4 h-4",
                    item.type === 'check-in' ? 'text-success' : 'text-info'
                  )} />
                </div>
                {index < mockTimeline.length - 1 && (
                  <div className="w-0.5 h-8 bg-border mt-2" />
                )}
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <p className="font-medium text-foreground text-sm">
                  {item.type === 'check-in' ? 'Check-in' : 'Check-out'}
                </p>
                <p className="text-sm text-muted-foreground truncate">{item.store}</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
