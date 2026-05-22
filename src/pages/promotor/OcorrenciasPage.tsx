import { useState } from 'react'
import { AlertCircle, Plus, X } from 'lucide-react'

interface Ocorrencia {
  id: string
  tipo: string
  descricao: string
  hora: string
}

const tipos = ['Produto vencido', 'Falta de estoque', 'FREEZER danificado', 'Preço incorreto', 'Outro']

export default function OcorrenciasPage() {
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([])
  const [showForm, setShowForm] = useState(false)
  const [tipo, setTipo] = useState(tipos[0])
  const [descricao, setDescricao] = useState('')

  const handleSubmit = () => {
    if (!descricao.trim()) return
    setOcorrencias((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        tipo,
        descricao,
        hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      },
    ])
    setDescricao('')
    setTipo(tipos[0])
    setShowForm(false)
  }

  const tipoColors: Record<string, string> = {
    'Produto vencido': 'bg-red-100 text-red-700',
    'Falta de estoque': 'bg-orange-100 text-orange-700',
    'FREEZER danificado': 'bg-yellow-100 text-yellow-700',
    'Preço incorreto': 'bg-blue-100 text-blue-700',
    'Outro': 'bg-muted text-muted-foreground',
  }

  return (
    <div className="p-4 space-y-4 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Ocorrências</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Registrar
        </button>
      </div>

      {showForm && (
        <div className="bg-card border rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Nova Ocorrência</h2>
            <button onClick={() => setShowForm(false)}>
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Tipo</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {tipos.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Descrição</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o que aconteceu..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!descricao.trim()}
            className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl disabled:opacity-50"
          >
            Salvar Ocorrência
          </button>
        </div>
      )}

      {ocorrencias.length > 0 ? (
        <div className="space-y-3">
          {ocorrencias.map((o) => (
            <div key={o.id} className="bg-card border rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tipoColors[o.tipo] ?? tipoColors['Outro']}`}>
                  {o.tipo}
                </span>
                <span className="text-xs text-muted-foreground">{o.hora}</span>
              </div>
              <p className="text-sm text-foreground">{o.descricao}</p>
            </div>
          ))}
        </div>
      ) : (
        !showForm && (
          <div className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-center">Nenhuma ocorrência registrada</p>
            <p className="text-sm text-muted-foreground mt-1">Use o botão acima para registrar</p>
          </div>
        )
      )}
    </div>
  )
}
