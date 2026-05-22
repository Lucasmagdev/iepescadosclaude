import { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AlertTriangle, Camera, ChevronLeft, ChevronRight, Check, X, MapPin, Loader2, Fish } from 'lucide-react'
import { useVisitStore } from '@/store/visits'
import { mockStores, mockProducts } from '@/data/mock'
import { cn, formatTime } from '@/lib/utils'

type VisitStep = 'check-in' | 'products' | 'occurrence' | 'check-out' | 'success'

const STEPS: { id: VisitStep; label: string }[] = [
  { id: 'check-in', label: 'Entrada' },
  { id: 'products', label: 'Produtos' },
  { id: 'occurrence', label: 'Ocorrência' },
  { id: 'check-out', label: 'Saída' },
]

const occurrenceTypes = [
  'Sem ocorrência',
  'Ruptura de produto',
  'Preço divergente',
  'Sem espaço no freezer',
  'Loja fechada',
  'Produto vencido',
]

interface ProductCheckData {
  productId: string
  available: boolean | null
  price?: string
  stock?: string
  expiryDate?: string
  competitorPrice?: string
}

interface GeoLocation { lat: number; lng: number }

function getLocation(): Promise<GeoLocation | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) { resolve(null); return }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 8000, maximumAge: 60000 }
    )
  })
}

function StepIndicator({ current }: { current: VisitStep }) {
  const idx = STEPS.findIndex(s => s.id === current)
  return (
    <div className="flex items-center gap-1 px-4 pb-3">
      {STEPS.map((step, i) => {
        const done = i < idx
        const active = i === idx
        return (
          <div key={step.id} className="flex items-center gap-1 flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                done && 'bg-success text-white',
                active && 'bg-primary text-white',
                !done && !active && 'bg-muted text-muted-foreground'
              )}>
                {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={cn(
                'text-[9px] font-medium whitespace-nowrap',
                active ? 'text-primary' : done ? 'text-success' : 'text-muted-foreground'
              )}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn(
                'flex-1 h-0.5 mb-4 rounded-full',
                i < idx ? 'bg-success' : 'bg-muted'
              )} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function PageHeader({ title, subtitle, onBack }: { title: string; subtitle: string; onBack: () => void }) {
  return (
    <header
      className="sticky top-0 z-40 px-4 pt-3"
      style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E5E5E5',
      }}
    >
      <div className="flex items-center gap-3 pb-3">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="font-semibold text-foreground">{title}</h1>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
    </header>
  )
}

function FixedFooter({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 p-4"
      style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid #E5E5E5',
      }}
    >
      {children}
    </div>
  )
}

export default function VisitPage() {
  const { visitId } = useParams<{ visitId: string }>()
  const navigate = useNavigate()
  const visits = useVisitStore((s) => s.visits)
  const updateVisit = useVisitStore((s) => s.updateVisit)
  const addProductCheck = useVisitStore((s) => s.addProductCheck)

  const visit = visits.find(v => v.id === visitId)
  const store = visit ? mockStores.find(s => s.id === visit.storeId) : null
  const storeProducts = store ? mockProducts.filter(p => store.productIds.includes(p.id)) : []

  const [step, setStep] = useState<VisitStep>('check-in')
  const [currentProductIndex, setCurrentProductIndex] = useState(0)
  const [checkInPhoto, setCheckInPhoto] = useState<string | null>(null)
  const [checkOutPhoto, setCheckOutPhoto] = useState<string | null>(null)
  const [checkInLocation, setCheckInLocation] = useState<GeoLocation | null>(null)
  const [checkOutLocation, setCheckOutLocation] = useState<GeoLocation | null>(null)
  const [locating, setLocating] = useState(false)
  const [occurrenceType, setOccurrenceType] = useState('Sem ocorrência')
  const [occurrenceNote, setOccurrenceNote] = useState('')
  const [productChecks, setProductChecks] = useState<ProductCheckData[]>(
    () => storeProducts.map(p => ({ productId: p.id, available: null }))
  )

  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!visit || !store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Visita não encontrada</p>
      </div>
    )
  }

  const currentProduct = storeProducts[currentProductIndex]
  const currentCheck = productChecks[currentProductIndex]

  const handlePhotoCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLocating(true)
    const [photoData, loc] = await Promise.all([
      new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      }),
      getLocation(),
    ])
    setLocating(false)
    if (step === 'check-in') { setCheckInPhoto(photoData); setCheckInLocation(loc) }
    else if (step === 'check-out') { setCheckOutPhoto(photoData); setCheckOutLocation(loc) }
  }

  const handleConfirmCheckIn = () => {
    updateVisit(visitId!, {
      checkInTime: formatTime(new Date()),
      checkInPhoto: checkInPhoto || undefined,
      checkInLat: checkInLocation?.lat,
      checkInLng: checkInLocation?.lng,
    })
    setStep('products')
  }

  const handleProductAvailability = (available: boolean) => {
    setProductChecks(prev => prev.map((check, idx) =>
      idx === currentProductIndex ? { ...check, available } : check
    ))
  }

  const handleProductFieldChange = (field: keyof ProductCheckData, value: string) => {
    setProductChecks(prev => prev.map((check, idx) =>
      idx === currentProductIndex ? { ...check, [field]: value } : check
    ))
  }

  const handleNextProduct = () => {
    const available = currentCheck.available ?? false
    addProductCheck({
      id: `${visitId}-${currentCheck.productId}`,
      visitId: visitId!,
      productId: currentCheck.productId,
      sku: currentProduct.sku,
      available,
      price: currentCheck.price ? parseFloat(currentCheck.price.replace(',', '.')) : undefined,
      stock: currentCheck.stock ? parseInt(currentCheck.stock) : undefined,
      expiryDate: currentCheck.expiryDate,
      competitorPrice: currentCheck.competitorPrice ? parseFloat(currentCheck.competitorPrice.replace(',', '.')) : undefined,
    })
    if (currentProductIndex < storeProducts.length - 1) {
      setCurrentProductIndex(prev => prev + 1)
    } else {
      setStep('occurrence')
    }
  }

  const handleConfirmOccurrence = () => {
    updateVisit(visitId!, { occurrenceType, occurrenceNote })
    setStep('check-out')
  }

  const handleConfirmCheckOut = () => {
    updateVisit(visitId!, {
      checkOutTime: formatTime(new Date()),
      checkOutPhoto: checkOutPhoto || undefined,
      checkOutLat: checkOutLocation?.lat,
      checkOutLng: checkOutLocation?.lng,
      status: 'completed',
    })
    setStep('success')
  }

  const handleBackToRoteiro = () => navigate('/promotor')

  // ── Check-in ──────────────────────────────────────────────────────────────
  if (step === 'check-in') {
    return (
      <div className="min-h-screen flex flex-col">
        <PageHeader title={store.name} subtitle="Foto de entrada do freezer" onBack={handleBackToRoteiro} />
        <StepIndicator current="check-in" />

        <div className="flex-1 p-4 flex flex-col gap-6">
          <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoCapture} className="hidden" />

          {checkInPhoto ? (
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
              <img src={checkInPhoto} alt="Check-in" className="w-full h-full object-cover" />
              <div className="absolute bottom-0 inset-x-0 p-3 text-xs space-y-0.5" style={{ background: 'rgba(0,0,0,0.65)' }}>
                <p className="text-white">{formatTime(new Date())} — {store.address}</p>
                {checkInLocation ? (
                  <p className="flex items-center gap-1 text-green-300">
                    <MapPin className="w-3 h-3" />
                    {checkInLocation.lat.toFixed(5)}, {checkInLocation.lng.toFixed(5)}
                  </p>
                ) : (
                  <p className="text-yellow-300">GPS não disponível</p>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                style={{ background: 'rgba(0,0,0,0.55)' }}
              >
                Refazer
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={locating}
              className="w-full aspect-[4/3] rounded-2xl flex flex-col items-center justify-center gap-4 transition-all disabled:opacity-60"
              style={{
                border: '2px dashed rgba(232,100,42,0.35)',
                background: 'rgba(232,100,42,0.04)',
              }}
            >
              {locating ? (
                <>
                  <Loader2 className="w-14 h-14 text-primary animate-spin" />
                  <span className="text-muted-foreground font-medium">Obtendo localização...</span>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(232,100,42,0.12)' }}>
                    <Camera className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-foreground font-semibold">Tirar Foto</p>
                    <p className="text-muted-foreground text-sm mt-0.5">Enquadre o freezer completo</p>
                  </div>
                </>
              )}
            </button>
          )}

          <div className="mt-auto">
            <button
              onClick={handleConfirmCheckIn}
              disabled={!checkInPhoto}
              className="w-full py-4 px-4 font-bold rounded-2xl text-primary-foreground transition-all disabled:opacity-40 disabled:cursor-not-allowed text-base"
              style={{ background: checkInPhoto ? '#E8642A' : undefined }}
            >
              Confirmar Check-in
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Products ──────────────────────────────────────────────────────────────
  if (step === 'products') {
    const isAvailable = currentCheck.available
    return (
      <div className="min-h-screen flex flex-col">
        <PageHeader
          title={store.name}
          subtitle={`Produto ${currentProductIndex + 1} de ${storeProducts.length}`}
          onBack={() => currentProductIndex > 0 ? setCurrentProductIndex(p => p - 1) : setStep('check-in')}
        />

        {/* Progress bar */}
        <div className="h-1 mx-4 mt-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div
            className="h-full bg-primary transition-all duration-300 rounded-full"
            style={{ width: `${((currentProductIndex + 1) / storeProducts.length) * 100}%` }}
          />
        </div>

        <StepIndicator current="products" />

        <div className="flex-1 p-4 space-y-5 overflow-auto pb-28">
          {/* Product card */}
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="aspect-video relative overflow-hidden" style={{ background: 'rgba(232,100,42,0.06)' }}>
              {currentProduct.imageUrl ? (
                <img
                  src={currentProduct.imageUrl}
                  alt={currentProduct.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                  <Fish className="w-10 h-10 text-primary/50" />
                  <span className="text-xs text-muted-foreground">Imagem do produto</span>
                </div>
              )}
              <div className="absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-mono font-semibold text-white" style={{ background: 'rgba(0,0,0,0.45)' }}>
                SKU {currentProduct.sku}
              </div>
            </div>
            <div className="p-4 bg-card">
              <h2 className="font-bold text-foreground text-lg">{currentProduct.name}</h2>
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-3">
            <p className="font-semibold text-foreground">Produto disponível na loja?</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleProductAvailability(true)}
                className="flex items-center justify-center gap-2 py-4 rounded-2xl border-2 font-semibold transition-all text-sm"
                style={{
                  borderColor: isAvailable === true ? '#22C55E' : 'var(--border)',
                  background: isAvailable === true ? 'rgba(34,197,94,0.12)' : 'var(--muted)',
                  color: isAvailable === true ? '#22C55E' : 'var(--muted-foreground)',
                }}
              >
                <Check className="w-5 h-5" />
                Sim
              </button>
              <button
                onClick={() => handleProductAvailability(false)}
                className="flex items-center justify-center gap-2 py-4 rounded-2xl border-2 font-semibold transition-all text-sm"
                style={{
                  borderColor: isAvailable === false ? '#EF4444' : 'var(--border)',
                  background: isAvailable === false ? 'rgba(239,68,68,0.12)' : 'var(--muted)',
                  color: isAvailable === false ? '#EF4444' : 'var(--muted-foreground)',
                }}
              >
                <X className="w-5 h-5" />
                Não
              </button>
            </div>
            {isAvailable === null && (
              <p className="text-xs text-center text-primary animate-pulse">Toque em Sim ou Não para continuar</p>
            )}
          </div>

          {/* Extra fields */}
          {isAvailable === true && (
            <div className="space-y-4">
              {[
                { field: 'price', label: 'Preço IE (R$)', placeholder: '0,00', mode: 'decimal' },
                { field: 'stock', label: 'Estoque (qtd)', placeholder: '0', mode: 'numeric' },
                { field: 'competitorPrice', label: 'Preço concorrente (opcional)', placeholder: '0,00', mode: 'decimal' },
              ].map(({ field, label, placeholder, mode }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
                  <input
                    type="text"
                    inputMode={mode as 'decimal' | 'numeric'}
                    value={(currentCheck as unknown as Record<string, string>)[field] || ''}
                    onChange={e => handleProductFieldChange(field as keyof ProductCheckData, e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Validade (opcional)</label>
                <input
                  type="date"
                  value={currentCheck.expiryDate || ''}
                  onChange={e => handleProductFieldChange('expiryDate', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
                />
              </div>
            </div>
          )}
        </div>

        <FixedFooter>
          <button
            onClick={handleNextProduct}
            disabled={isAvailable === null}
            className="w-full flex items-center justify-center gap-2 py-4 font-bold rounded-2xl text-primary-foreground transition-all disabled:opacity-40 disabled:cursor-not-allowed text-base"
            style={{ background: isAvailable !== null ? '#E8642A' : undefined }}
          >
            {currentProductIndex < storeProducts.length - 1 ? 'Próximo Produto' : 'Finalizar Produtos'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </FixedFooter>
      </div>
    )
  }

  // ── Occurrence ────────────────────────────────────────────────────────────
  if (step === 'occurrence') {
    const availableCount = productChecks.filter(c => c.available === true).length
    const ruptureCount = productChecks.filter(c => c.available === false).length

    return (
      <div className="min-h-screen flex flex-col">
        <PageHeader title={store.name} subtitle="Ocorrência da visita" onBack={() => setStep('products')} />
        <StepIndicator current="occurrence" />

        <div className="flex-1 p-4 space-y-5 overflow-auto pb-28">
          {/* Audit summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl p-4 text-center" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <p className="text-2xl font-bold text-success">{availableCount}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Disponíveis</p>
            </div>
            <div className="rounded-2xl p-4 text-center" style={{ background: ruptureCount > 0 ? 'rgba(239,68,68,0.08)' : 'var(--muted)', border: ruptureCount > 0 ? '1px solid rgba(239,68,68,0.2)' : '1px solid var(--border)' }}>
              <p className={cn('text-2xl font-bold', ruptureCount > 0 ? 'text-destructive' : 'text-muted-foreground')}>{ruptureCount}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Rupturas</p>
            </div>
          </div>

          {ruptureCount > 0 && (
            <div className="flex items-center gap-3 p-4 rounded-2xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
              <span className="text-destructive">{ruptureCount} produto(s) sem disponibilidade. Informe a ocorrência abaixo.</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Tipo de ocorrência</label>
            <select
              value={occurrenceType}
              onChange={e => setOccurrenceType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
            >
              {occurrenceTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Observação (opcional)</label>
            <textarea
              value={occurrenceNote}
              onChange={e => setOccurrenceNote(e.target.value)}
              placeholder="Ex.: ruptura parcial, etiqueta divergente..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
            />
          </div>
        </div>

        <FixedFooter>
          <button
            onClick={handleConfirmOccurrence}
            className="w-full flex items-center justify-center gap-2 py-4 font-bold rounded-2xl text-primary-foreground text-base"
            style={{ background: '#E8642A' }}
          >
            Continuar para Check-out
            <ChevronRight className="w-5 h-5" />
          </button>
        </FixedFooter>
      </div>
    )
  }

  // ── Check-out ─────────────────────────────────────────────────────────────
  if (step === 'check-out') {
    return (
      <div className="min-h-screen flex flex-col">
        <PageHeader title={store.name} subtitle="Foto de saída do freezer" onBack={() => setStep('occurrence')} />
        <StepIndicator current="check-out" />

        <div className="flex-1 p-4 flex flex-col gap-6">
          <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoCapture} className="hidden" />

          {checkOutPhoto ? (
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
              <img src={checkOutPhoto} alt="Check-out" className="w-full h-full object-cover" />
              <div className="absolute bottom-0 inset-x-0 p-3 text-xs space-y-0.5" style={{ background: 'rgba(0,0,0,0.65)' }}>
                <p className="text-white">{formatTime(new Date())} — {store.address}</p>
                {checkOutLocation ? (
                  <p className="flex items-center gap-1 text-green-300">
                    <MapPin className="w-3 h-3" />
                    {checkOutLocation.lat.toFixed(5)}, {checkOutLocation.lng.toFixed(5)}
                  </p>
                ) : (
                  <p className="text-yellow-300">GPS não disponível</p>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                style={{ background: 'rgba(0,0,0,0.55)' }}
              >
                Refazer
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={locating}
              className="w-full aspect-[4/3] rounded-2xl flex flex-col items-center justify-center gap-4 transition-all disabled:opacity-60"
              style={{ border: '2px dashed rgba(232,100,42,0.35)', background: 'rgba(232,100,42,0.04)' }}
            >
              {locating ? (
                <>
                  <Loader2 className="w-14 h-14 text-primary animate-spin" />
                  <span className="text-muted-foreground font-medium">Obtendo localização...</span>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(232,100,42,0.12)' }}>
                    <Camera className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-foreground font-semibold">Tirar Foto</p>
                    <p className="text-muted-foreground text-sm mt-0.5">Enquadre o freezer após execução</p>
                  </div>
                </>
              )}
            </button>
          )}

          <div className="mt-auto">
            <button
              onClick={handleConfirmCheckOut}
              disabled={!checkOutPhoto}
              className="w-full py-4 px-4 font-bold rounded-2xl text-primary-foreground transition-all disabled:opacity-40 disabled:cursor-not-allowed text-base"
              style={{ background: checkOutPhoto ? '#E8642A' : undefined }}
            >
              Finalizar Visita
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Success ───────────────────────────────────────────────────────────────
  const rupturas = productChecks.filter(c => c.available === false).length

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-sm w-full">
        <div
          className="w-24 h-24 mx-auto rounded-full flex items-center justify-center"
          style={{ background: 'rgba(34,197,94,0.15)', border: '2px solid rgba(34,197,94,0.3)' }}
        >
          <Check className="w-12 h-12 text-success" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground">Visita concluída!</h1>
          <p className="text-muted-foreground mt-1">Dados enviados com sucesso.</p>
        </div>

        <div className="rounded-2xl p-5 text-left space-y-3" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <h3 className="font-bold text-foreground">{store.name}</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl p-3 text-center" style={{ background: 'var(--muted)' }}>
              <p className="text-xs text-muted-foreground">Check-in</p>
              <p className="font-semibold text-foreground">{visit.checkInTime}</p>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: 'var(--muted)' }}>
              <p className="text-xs text-muted-foreground">Check-out</p>
              <p className="font-semibold text-foreground">{visit.checkOutTime}</p>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: 'var(--muted)' }}>
              <p className="text-xs text-muted-foreground">Produtos</p>
              <p className="font-semibold text-foreground">{storeProducts.length}</p>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: rupturas > 0 ? 'rgba(239,68,68,0.08)' : 'var(--muted)' }}>
              <p className="text-xs text-muted-foreground">Rupturas</p>
              <p className={cn('font-semibold', rupturas > 0 ? 'text-destructive' : 'text-foreground')}>{rupturas}</p>
            </div>
          </div>
          {visit.occurrenceType && visit.occurrenceType !== 'Sem ocorrência' && (
            <div className="pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
              <p className="text-xs text-muted-foreground">Ocorrência</p>
              <p className="text-sm font-medium text-foreground">{visit.occurrenceType}</p>
            </div>
          )}
        </div>

        <button
          onClick={handleBackToRoteiro}
          className="w-full py-4 font-bold rounded-2xl text-primary-foreground text-base"
          style={{ background: '#E8642A' }}
        >
          Voltar ao Roteiro
        </button>
      </div>
    </div>
  )
}
