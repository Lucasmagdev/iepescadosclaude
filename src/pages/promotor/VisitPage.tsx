import { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AlertTriangle, Camera, ChevronLeft, ChevronRight, Check, X, MapPin, Loader2 } from 'lucide-react'
import { useVisitStore } from '@/store/visits'
import { mockStores, mockProducts } from '@/data/mock'
import { cn, formatTime } from '@/lib/utils'

type VisitStep = 'check-in' | 'products' | 'occurrence' | 'check-out' | 'success'

const occurrenceTypes = [
  'Sem ocorrência',
  'Ruptura de produto',
  'Preço divergente',
  'Sem espaço na gôndola',
  'Loja fechada',
  'Produto vencido',
]

interface ProductCheckData {
  productId: string
  available: boolean
  price?: string
  stock?: string
  expiryDate?: string
  competitorPrice?: string
}

interface GeoLocation {
  lat: number
  lng: number
}

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

export default function VisitPage() {
  const { visitId } = useParams<{ visitId: string }>()
  const navigate = useNavigate()
  const visits = useVisitStore((s) => s.visits)
  const updateVisit = useVisitStore((s) => s.updateVisit)
  const addProductCheck = useVisitStore((s) => s.addProductCheck)

  const visit = visits.find(v => v.id === visitId)
  const store = visit ? mockStores.find(s => s.id === visit.storeId) : null

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
    mockProducts.map(p => ({ productId: p.id, available: false }))
  )

  const fileInputRef = useRef<HTMLInputElement>(null)
  
  if (!visit || !store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Visita não encontrada</p>
      </div>
    )
  }
  
  const currentProduct = mockProducts[currentProductIndex]
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

    if (step === 'check-in') {
      setCheckInPhoto(photoData)
      setCheckInLocation(loc)
    } else if (step === 'check-out') {
      setCheckOutPhoto(photoData)
      setCheckOutLocation(loc)
    }
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
    // Save current product check
    addProductCheck({
      id: `${visitId}-${currentCheck.productId}`,
      visitId: visitId!,
      productId: currentCheck.productId,
      sku: currentProduct.sku,
      available: currentCheck.available,
      price: currentCheck.price ? parseFloat(currentCheck.price.replace(',', '.')) : undefined,
      stock: currentCheck.stock ? parseInt(currentCheck.stock) : undefined,
      expiryDate: currentCheck.expiryDate,
      competitorPrice: currentCheck.competitorPrice ? parseFloat(currentCheck.competitorPrice.replace(',', '.')) : undefined,
    })
    
    if (currentProductIndex < mockProducts.length - 1) {
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
  
  const handleBackToRoteiro = () => {
    navigate('/promotor')
  }
  
  // Check-in Step
  if (step === 'check-in') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-40 bg-background border-b px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={handleBackToRoteiro} className="p-2 -ml-2 hover:bg-muted rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-semibold text-foreground">{store.name}</h1>
              <p className="text-xs text-muted-foreground">Check-in</p>
            </div>
          </div>
        </header>
        
        <div className="flex-1 p-4 flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            <p className="text-center text-lg font-medium text-foreground">
              Foto ANTES da gôndola
            </p>
            
            {checkInPhoto ? (
              <div className="relative w-full max-w-sm aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                <img src={checkInPhoto} alt="Check-in" className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3 text-xs space-y-0.5">
                  <p>{formatTime(new Date())} — {store.address}</p>
                  {checkInLocation ? (
                    <p className="flex items-center gap-1 text-green-300">
                      <MapPin className="w-3 h-3" />
                      {checkInLocation.lat.toFixed(5)}, {checkInLocation.lng.toFixed(5)}
                    </p>
                  ) : (
                    <p className="text-yellow-300">GPS não disponível</p>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={locating}
                className="w-full max-w-sm aspect-[4/3] rounded-xl border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-colors disabled:opacity-60"
              >
                {locating ? (
                  <>
                    <Loader2 className="w-12 h-12 text-muted-foreground animate-spin" />
                    <span className="text-muted-foreground font-medium">Obtendo localização...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-12 h-12 text-muted-foreground" />
                    <span className="text-muted-foreground font-medium">Tirar Foto</span>
                  </>
                )}
              </button>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoCapture}
              className="hidden"
            />
          </div>
          
          <button
            onClick={handleConfirmCheckIn}
            disabled={!checkInPhoto}
            className="w-full py-3.5 px-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Confirmar e Continuar
          </button>
        </div>
      </div>
    )
  }
  
  // Products Step
  if (step === 'products') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-40 bg-background border-b px-4 py-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => currentProductIndex > 0 ? setCurrentProductIndex(prev => prev - 1) : setStep('check-in')} 
              className="p-2 -ml-2 hover:bg-muted rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="font-semibold text-foreground">{store.name}</h1>
              <p className="text-xs text-muted-foreground">
                Produto {currentProductIndex + 1} de {mockProducts.length}
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentProductIndex + 1) / mockProducts.length) * 100}%` }}
            />
          </div>
        </header>
        
        <div className="flex-1 p-4 space-y-6 overflow-auto pb-24">
          {/* Product Info */}
          <div className="bg-card rounded-xl border p-4 space-y-3">
            <div className="w-full aspect-video rounded-lg bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-sm">Imagem do Produto</span>
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{currentProduct.name}</h2>
              <span className="inline-flex items-center px-2 py-0.5 mt-1 bg-muted text-muted-foreground text-xs font-medium rounded">
                SKU {currentProduct.sku}
              </span>
            </div>
          </div>
          
          {/* Availability Toggle */}
          <div className="space-y-3">
            <p className="font-medium text-foreground">Produto disponível na loja?</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleProductAvailability(true)}
                className={cn(
                  'flex items-center justify-center gap-2 py-4 rounded-xl border-2 font-medium transition-all',
                  currentCheck.available
                    ? 'border-success bg-success/10 text-success'
                    : 'border-border text-muted-foreground hover:border-success/50'
                )}
              >
                <Check className="w-5 h-5" />
                Sim
              </button>
              <button
                onClick={() => handleProductAvailability(false)}
                className={cn(
                  'flex items-center justify-center gap-2 py-4 rounded-xl border-2 font-medium transition-all',
                  !currentCheck.available
                    ? 'border-destructive bg-destructive/10 text-destructive'
                    : 'border-border text-muted-foreground hover:border-destructive/50'
                )}
              >
                <X className="w-5 h-5" />
                Não
              </button>
            </div>
          </div>
          
          {/* Additional Fields (shown only if available) */}
          {currentCheck.available && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Preço (R$)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={currentCheck.price || ''}
                  onChange={(e) => handleProductFieldChange('price', e.target.value)}
                  placeholder="0,00"
                  className="w-full px-4 py-3 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Estoque (quantidade)
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={currentCheck.stock || ''}
                  onChange={(e) => handleProductFieldChange('stock', e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Data de vencimento (opcional)
                </label>
                <input
                  type="date"
                  value={currentCheck.expiryDate || ''}
                  onChange={(e) => handleProductFieldChange('expiryDate', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Preço concorrente (opcional)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={currentCheck.competitorPrice || ''}
                  onChange={(e) => handleProductFieldChange('competitorPrice', e.target.value)}
                  placeholder="R$ 0,00"
                  className="w-full px-4 py-3 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
          <button
            onClick={handleNextProduct}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all"
          >
            {currentProductIndex < mockProducts.length - 1 ? 'Próximo' : 'Finalizar Produtos'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    )
  }
  
  // Occurrence Step
  if (step === 'occurrence') {
    const availableCount = productChecks.filter(c => c.available).length
    const ruptureCount = productChecks.length - availableCount
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-40 bg-background border-b px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setStep('products')} className="p-2 -ml-2 hover:bg-muted rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-semibold text-foreground">{store.name}</h1>
              <p className="text-xs text-muted-foreground">Ocorrência da visita</p>
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 space-y-6 overflow-auto pb-24">
          <div className="bg-card rounded-xl border p-4">
            <p className="text-xs text-muted-foreground uppercase font-medium mb-3">Resumo da auditoria</p>
            <div className="flex gap-6 text-sm">
              <span><b className="text-foreground">{availableCount}</b> <span className="text-muted-foreground">SKUs disponíveis</span></span>
              <span><b className="text-destructive">{ruptureCount}</b> <span className="text-muted-foreground">rupturas</span></span>
            </div>
          </div>

          {ruptureCount > 0 && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-xl text-destructive text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{ruptureCount} produto(s) sem disponibilidade registrado(s).</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Tipo de ocorrência</label>
            <select
              value={occurrenceType}
              onChange={e => setOccurrenceType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {occurrenceTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Observação (opcional)</label>
            <textarea
              value={occurrenceNote}
              onChange={e => setOccurrenceNote(e.target.value)}
              placeholder="Ex.: sem espaço na gôndola, etiqueta divergente, ruptura parcial..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
          <button
            onClick={handleConfirmOccurrence}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all"
          >
            Continuar para foto depois
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    )
  }

  // Check-out Step
  if (step === 'check-out') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-40 bg-background border-b px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setStep('products')} className="p-2 -ml-2 hover:bg-muted rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-semibold text-foreground">{store.name}</h1>
              <p className="text-xs text-muted-foreground">Check-out</p>
            </div>
          </div>
        </header>
        
        <div className="flex-1 p-4 flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            <p className="text-center text-lg font-medium text-foreground">
              Foto DEPOIS da gôndola
            </p>
            
            {checkOutPhoto ? (
              <div className="relative w-full max-w-sm aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                <img src={checkOutPhoto} alt="Check-out" className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3 text-xs space-y-0.5">
                  <p>{formatTime(new Date())} — {store.address}</p>
                  {checkOutLocation ? (
                    <p className="flex items-center gap-1 text-green-300">
                      <MapPin className="w-3 h-3" />
                      {checkOutLocation.lat.toFixed(5)}, {checkOutLocation.lng.toFixed(5)}
                    </p>
                  ) : (
                    <p className="text-yellow-300">GPS não disponível</p>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={locating}
                className="w-full max-w-sm aspect-[4/3] rounded-xl border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-colors disabled:opacity-60"
              >
                {locating ? (
                  <>
                    <Loader2 className="w-12 h-12 text-muted-foreground animate-spin" />
                    <span className="text-muted-foreground font-medium">Obtendo localização...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-12 h-12 text-muted-foreground" />
                    <span className="text-muted-foreground font-medium">Tirar Foto</span>
                  </>
                )}
              </button>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoCapture}
              className="hidden"
            />
          </div>
          
          <button
            onClick={handleConfirmCheckOut}
            disabled={!checkOutPhoto}
            className="w-full py-3.5 px-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Confirmar e Finalizar
          </button>
        </div>
      </div>
    )
  }
  
  // Success Step
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-sm">
        {/* Success Animation */}
        <div className="w-24 h-24 mx-auto rounded-full bg-success/20 flex items-center justify-center animate-checkmark">
          <Check className="w-12 h-12 text-success" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Tudo certo!</h1>
          <p className="text-muted-foreground">
            Todas as respostas e fotos foram enviadas para o sistema.
          </p>
        </div>
        
        {/* Visit Summary */}
        <div className="bg-card rounded-xl border p-4 text-left space-y-2">
          <h3 className="font-semibold text-foreground">{store.name}</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Check-in: {visit.checkInTime}</p>
            <p>Check-out: {visit.checkOutTime}</p>
            <p>Produtos verificados: {mockProducts.length}</p>
            <p>Rupturas: {productChecks.filter(c => !c.available).length}</p>
            {visit.occurrenceType && visit.occurrenceType !== 'Sem ocorrência' && (
              <p>Ocorrência: {visit.occurrenceType}</p>
            )}
          </div>
        </div>
        
        <button
          onClick={handleBackToRoteiro}
          className="w-full py-3.5 px-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all"
        >
          Voltar ao Roteiro
        </button>
      </div>
    </div>
  )
}
