import { useRegisterSW } from 'virtual:pwa-register/react'
import { RefreshCw } from 'lucide-react'

export function UpdateNotification() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // Poll for updates every 60 min
      if (r) setInterval(() => r.update(), 60 * 60 * 1000)
    },
  })

  if (!needRefresh) return null

  return (
    <div className="fixed top-4 left-4 right-4 z-50 lg:left-auto lg:right-4 lg:w-80">
      <div className="bg-primary text-primary-foreground rounded-xl shadow-lg p-4 flex items-center gap-3">
        <RefreshCw className="w-5 h-5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">Nova versão disponível</p>
          <p className="text-xs opacity-80 mt-0.5">Atualize para obter as melhorias mais recentes</p>
        </div>
        <button
          onClick={() => updateServiceWorker(true)}
          className="shrink-0 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold"
        >
          Atualizar
        </button>
      </div>
    </div>
  )
}
