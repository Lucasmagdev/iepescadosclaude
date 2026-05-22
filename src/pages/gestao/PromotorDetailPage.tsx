import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Key, MessageCircle, User, Smartphone, Wifi, RefreshCw, Camera, AlertTriangle, CheckCircle2, MapPin, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ConnectionStatusDot } from '@/components/ConnectionStatusDot'
import { CompletionBadge } from '@/components/CompletionBadge'
import { mockPromotores, mockAllVisits, mockProductChecks, mockPhotos, mockStores, mockProducts } from '@/data/mock'
import { cn } from '@/lib/utils'

const weeklyHistory: Record<string, Array<{ semana: string; meta: number; executadas: number; rupturas: number }>> = {
  '1': [
    { semana: 'S-4', meta: 5, executadas: 3, rupturas: 2 },
    { semana: 'S-3', meta: 5, executadas: 5, rupturas: 0 },
    { semana: 'S-2', meta: 5, executadas: 4, rupturas: 1 },
    { semana: 'S-1', meta: 5, executadas: 5, rupturas: 1 },
    { semana: 'Atual', meta: 5, executadas: 5, rupturas: 0 },
  ],
  '2': [
    { semana: 'S-4', meta: 6, executadas: 4, rupturas: 3 },
    { semana: 'S-3', meta: 6, executadas: 5, rupturas: 2 },
    { semana: 'S-2', meta: 6, executadas: 6, rupturas: 1 },
    { semana: 'S-1', meta: 6, executadas: 5, rupturas: 2 },
    { semana: 'Atual', meta: 6, executadas: 5, rupturas: 2 },
  ],
  '3': [
    { semana: 'S-4', meta: 5, executadas: 1, rupturas: 3 },
    { semana: 'S-3', meta: 5, executadas: 2, rupturas: 2 },
    { semana: 'S-2', meta: 5, executadas: 3, rupturas: 2 },
    { semana: 'S-1', meta: 5, executadas: 3, rupturas: 1 },
    { semana: 'Atual', meta: 5, executadas: 2, rupturas: 1 },
  ],
  '4': [
    { semana: 'S-4', meta: 7, executadas: 5, rupturas: 2 },
    { semana: 'S-3', meta: 7, executadas: 6, rupturas: 1 },
    { semana: 'S-2', meta: 7, executadas: 4, rupturas: 3 },
    { semana: 'S-1', meta: 7, executadas: 5, rupturas: 2 },
    { semana: 'Atual', meta: 7, executadas: 4, rupturas: 1 },
  ],
  '5': [
    { semana: 'S-4', meta: 4, executadas: 3, rupturas: 1 },
    { semana: 'S-3', meta: 4, executadas: 4, rupturas: 0 },
    { semana: 'S-2', meta: 4, executadas: 4, rupturas: 1 },
    { semana: 'S-1', meta: 4, executadas: 3, rupturas: 1 },
    { semana: 'Atual', meta: 4, executadas: 3, rupturas: 1 },
  ],
  '6': [
    { semana: 'S-4', meta: 6, executadas: 5, rupturas: 2 },
    { semana: 'S-3', meta: 6, executadas: 4, rupturas: 1 },
    { semana: 'S-2', meta: 6, executadas: 5, rupturas: 2 },
    { semana: 'S-1', meta: 6, executadas: 4, rupturas: 2 },
    { semana: 'Atual', meta: 6, executadas: 0, rupturas: 0 },
  ],
}

export default function PromotorDetailPage() {
  const { promotorId } = useParams<{ promotorId: string }>()
  const navigate = useNavigate()

  const promotor = mockPromotores.find(p => p.id === promotorId)

  const promotorVisits = useMemo(
    () => mockAllVisits.filter(v => v.promotorId === promotorId),
    [promotorId]
  )

  const promotorChecks = useMemo(
    () => mockProductChecks.filter(c => promotorVisits.some(v => v.id === c.visitId)),
    [promotorVisits]
  )

  const rupturas = useMemo(
    () => promotorChecks.filter(c => !c.available),
    [promotorChecks]
  )

  const photos = useMemo(
    () => mockPhotos.filter(p => p.promotorId === promotorId),
    [promotorId]
  )

  const timeline = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return promotorVisits
      .filter(v => v.date === today)
      .flatMap(v => {
        const store = mockStores.find(s => s.id === v.storeId)
        const events: { time: string; type: 'check-in' | 'check-out' | 'occurrence'; store: string; note?: string }[] = []
        if (v.checkInTime) events.push({ time: v.checkInTime, type: 'check-in', store: store?.name ?? v.storeId })
        if (v.checkOutTime) events.push({ time: v.checkOutTime, type: 'check-out', store: store?.name ?? v.storeId })
        if (v.occurrenceType && v.occurrenceType !== 'Sem ocorrência' && v.checkOutTime) {
          events.push({ time: v.checkOutTime, type: 'occurrence', store: store?.name ?? v.storeId, note: v.occurrenceType })
        }
        return events
      })
      .sort((a, b) => a.time.localeCompare(b.time))
  }, [promotorVisits])

  const chartData = weeklyHistory[promotorId ?? ''] ?? []

  if (!promotor) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Promotor não encontrado</p>
      </div>
    )
  }

  const statusColor = promotor.connectionStatus === 'online' ? 'text-success' : promotor.connectionStatus === 'offline' ? 'text-primary' : 'text-muted-foreground'

  return (
    <div className="space-y-6 pb-20 lg:pb-0 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/gestao/promotores')} className="p-2 -ml-2 hover:bg-muted rounded-lg lg:hidden">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-4 flex-1">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
            {promotor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{promotor.name}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <ConnectionStatusDot status={promotor.connectionStatus} showLabel />
              <span className="text-muted-foreground/50">·</span>
              <span className="text-sm text-muted-foreground">{promotor.regional}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{promotor.device} · {promotor.networkType}</p>
          </div>
        </div>
        <CompletionBadge percentage={promotor.completionPct} />
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border p-4 text-center">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{promotor.visitsCompleted}</p>
          <p className="text-xs text-muted-foreground mt-0.5">de {promotor.visitsTotal} visitas</p>
        </div>
        <div className="bg-card rounded-xl border p-4 text-center">
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2', rupturas.length > 0 ? 'bg-destructive/10' : 'bg-muted')}>
            <AlertTriangle className={cn('w-5 h-5', rupturas.length > 0 ? 'text-destructive' : 'text-muted-foreground')} />
          </div>
          <p className={cn('text-2xl font-bold', rupturas.length > 0 ? 'text-destructive' : 'text-foreground')}>{rupturas.length}</p>
          <p className="text-xs text-muted-foreground mt-0.5">rupturas detectadas</p>
        </div>
        <div className="bg-card rounded-xl border p-4 text-center">
          <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center mx-auto mb-2">
            <Camera className="w-5 h-5 text-info" />
          </div>
          <p className="text-2xl font-bold text-foreground">{promotor.photosCount}</p>
          <p className="text-xs text-muted-foreground mt-0.5">fotos registradas</p>
        </div>
      </div>

      {/* Weekly chart */}
      {chartData.length > 0 && (
        <div className="bg-card rounded-xl border p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h2 className="font-semibold text-foreground">Desempenho — últimas 5 semanas</h2>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="semana" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} width={20} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }}
                  formatter={(value, name) => [value, name === 'executadas' ? 'Executadas' : name === 'meta' ? 'Meta' : 'Rupturas']}
                />
                <Bar dataKey="meta" fill="rgba(232,100,42,0.15)" radius={[4, 4, 0, 0]} name="meta" />
                <Bar dataKey="executadas" fill="#E8642A" radius={[4, 4, 0, 0]} name="executadas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground justify-center">
            <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ background: 'rgba(232,100,42,0.15)' }} />Meta</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block bg-primary" />Executadas</span>
          </div>
        </div>
      )}

      {/* Timeline */}
      {timeline.length > 0 && (
        <div className="bg-card rounded-xl border p-4">
          <h2 className="font-semibold text-foreground mb-4">Timeline de hoje</h2>
          <div className="space-y-0">
            {timeline.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center shrink-0',
                    item.type === 'check-in'  ? 'bg-success/15'
                    : item.type === 'occurrence' ? 'bg-warning/15'
                    : 'bg-info/15'
                  )}>
                    {item.type === 'check-in'
                      ? <MapPin className="w-3.5 h-3.5 text-success" />
                      : item.type === 'occurrence'
                      ? <AlertTriangle className="w-3.5 h-3.5 text-warning" />
                      : <CheckCircle2 className="w-3.5 h-3.5 text-info" />}
                  </div>
                  {i < timeline.length - 1 && <div className="w-0.5 h-6 bg-border mt-1" />}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">
                      {item.type === 'check-in' ? 'Check-in'
                       : item.type === 'occurrence' ? 'Ocorrência'
                       : 'Check-out'}
                    </p>
                    <span className="text-xs text-muted-foreground font-mono">{item.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.store}</p>
                  {item.note && <p className="text-xs text-warning mt-0.5">{item.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rupturas */}
      {rupturas.length > 0 && (
        <div className="bg-card rounded-xl border p-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <h2 className="font-semibold text-foreground">Rupturas detectadas</h2>
            <span className="px-2 py-0.5 bg-destructive/10 text-destructive text-xs font-bold rounded-full">{rupturas.length}</span>
          </div>
          <div className="space-y-2">
            {rupturas.map(r => {
              const visit = promotorVisits.find(v => v.id === r.visitId)
              const store = visit ? mockStores.find(s => s.id === visit.storeId) : null
              const product = mockProducts.find(p => p.id === r.productId)
              return (
                <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                  <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{product?.name ?? r.productId}</p>
                    <p className="text-xs text-muted-foreground">{store?.name ?? visit?.storeId} · SKU {r.sku}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Photos */}
      {photos.length > 0 && (
        <div className="bg-card rounded-xl border p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground">Fotos registradas</h2>
            </div>
            <span className="text-xs text-muted-foreground">{photos.length} fotos</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {photos.slice(0, 8).map(photo => {
              const store = mockStores.find(s => s.id === photo.storeId)
              return (
                <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                  <img src={photo.imageUrl} alt="" className="w-full h-full object-cover" />
                  {store && (
                    <span className="absolute bottom-0 inset-x-0 text-[8px] font-medium px-1 py-0.5 truncate text-white" style={{ background: 'rgba(0,0,0,0.55)' }}>
                      {store.name.split(' ')[0]}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tech info */}
      <div className="bg-card rounded-xl border p-4 space-y-3">
        <h2 className="font-semibold text-foreground">Informações técnicas</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Primeiro sync</p>
            <p className="font-medium text-foreground">{promotor.firstSyncTime}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Último sync</p>
            <p className="font-medium text-foreground">{promotor.lastSyncTime}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Wifi className="w-4 h-4" />{promotor.networkType}
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Smartphone className="w-4 h-4" />{promotor.device}
          </span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
          <RefreshCw className={cn('w-4 h-4 text-success', promotor.connectionStatus === 'online' && 'animate-spin')} />
          <div>
            <p className="text-sm font-medium text-foreground">
              {promotor.connectionStatus === 'online' ? 'Sincronizando' : promotor.connectionStatus === 'offline' ? 'Offline' : 'Sem acesso hoje'}
            </p>
            <p className="text-xs text-muted-foreground">
              {promotor.syncProgress.completed}/{promotor.syncProgress.total} itens · {promotor.syncProgress.total - promotor.syncProgress.completed} pendentes
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button className="flex items-center justify-center gap-2 py-3 px-4 font-medium rounded-xl transition-colors" style={{ background: 'rgba(234,179,8,0.12)', color: '#854d0e' }}>
          <Key className="w-5 h-5" />
          Atualizar acesso
        </button>
        <button className="flex items-center justify-center gap-2 py-3 px-4 font-medium rounded-xl transition-colors" style={{ background: 'rgba(34,197,94,0.12)', color: '#166534' }}>
          <MessageCircle className="w-5 h-5" />
          WhatsApp
        </button>
      </div>
    </div>
  )
}
