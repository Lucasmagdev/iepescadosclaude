import { Printer } from 'lucide-react'
import { useRef, useState } from 'react'

const hoje = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
const validade = new Date(Date.now() + 30 * 86400000).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })

const features = [
  { title: 'Roteiro Inteligente por GPS', desc: 'Promotores recebem as lojas da semana ordenadas por proximidade. O app detecta automaticamente quando estão a menos de 4km da loja e libera o check-in.' },
  { title: 'Registro de Visita com Evidência', desc: 'Check-in e check-out com foto do freezer, carimbo de horário e coordenadas GPS — prova irrefutável de que o promotor esteve na loja.' },
  { title: 'Verificação de Produtos (SKU)', desc: 'Promotor registra disponibilidade, preço e estoque de cada SKU. Rupturas são sinalizadas em tempo real para o gestor.' },
  { title: 'Ocorrências e Justificativas', desc: 'Registro estruturado de preço divergente, ruptura, loja fechada, freezer danificado e outras ocorrências, com campo de observação livre.' },
  { title: 'Mapa em Tempo Real', desc: 'Gestor acompanha a localização de todos os promotores em mapa interativo. Filtro por data mostra execução histórica por cores.' },
  { title: 'Dashboard Gerencial', desc: 'Painel com KPIs do dia: visitas programadas vs. executadas, percentual de execução, rupturas e ocorrências, filtráveis por período.' },
  { title: 'Relatório Gerencial Completo', desc: 'Página dedicada com gráficos de execução por promotor, ranking, rupturas por produto, tabela de ocorrências e exportação em Excel (6 abas).' },
  { title: 'Exportação Excel', desc: 'Relatório em .xlsx com abas: Resumo, Visitas, Rupturas, Ocorrências, Produtos e Ranking de Promotores — gerado com 1 clique, filtrado por período.' },
  { title: 'Gestão de Usuários', desc: 'Cadastro de promotores com perfil, telefone, dispositivo, regional e status de conexão. Controle de acesso por perfil (promotor / gestor).' },
  { title: 'PWA — Instala no Celular', desc: 'Funciona como aplicativo nativo no Android e iOS sem precisar de App Store. Instalação via link, opera offline com sincronização automática.' },
]

const mensalidade = [
  'Hospedagem em servidor dedicado na nuvem',
  'Banco de dados com backups diários automáticos',
  'Domínio personalizado (ex: app.suaempresa.com.br)',
  'Atualizações de segurança e manutenção preventiva',
  'Monitoramento de disponibilidade 24/7',
]

export default function PropostaPage() {
  const pageRef = useRef<HTMLDivElement>(null)
  const [generating, setGenerating] = useState(false)

  async function exportPDF() {
    if (!pageRef.current) return
    setGenerating(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).jsPDF

      const canvas = await html2canvas(pageRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

      const pdfW = pdf.internal.pageSize.getWidth()
      const pdfH = pdf.internal.pageSize.getHeight()
      const ratio = canvas.height / canvas.width
      const imgH = pdfW * ratio

      if (imgH <= pdfH) {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfW, imgH)
      } else {
        // múltiplas páginas se o conteúdo for longo
        let yOffset = 0
        while (yOffset < imgH) {
          if (yOffset > 0) pdf.addPage()
          pdf.addImage(imgData, 'PNG', 0, -yOffset, pdfW, imgH)
          yOffset += pdfH
        }
      }

      pdf.save('IE_Pescados_Proposta_Comercial.pdf')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 print:bg-white print:py-0 print:px-0">
      <style>{`
        @media print {
          body { margin: 0; background: white; }
          .no-print { display: none !important; }
          .page { box-shadow: none !important; border-radius: 0 !important; margin: 0 !important; max-width: 100% !important; }
          @page { margin: 15mm 20mm; size: A4; }
        }
        .page { page-break-inside: avoid; }
      `}</style>

      {/* Export button */}
      <div className="no-print flex justify-center mb-6">
        <button
          onClick={exportPDF}
          disabled={generating}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-lg hover:opacity-90 transition-opacity disabled:opacity-60"
          style={{ background: '#E8642A' }}
        >
          <Printer className="w-4 h-4" />
          {generating ? 'Gerando PDF...' : 'Exportar PDF'}
        </button>
      </div>

      {/* A4 Page */}
      <div ref={pageRef} className="page bg-white max-w-3xl mx-auto shadow-xl rounded-2xl overflow-hidden">

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' }} className="px-10 pt-10 pb-8">
          <div className="flex items-start justify-between">
            <div>
              {/* Logo com fundo branco pra visibilidade */}
              <div className="mb-5 inline-block px-4 py-2 rounded-xl" style={{ background: 'white' }}>
                <img src="/logo.png" alt="IE Pescados" style={{ height: 44, width: 'auto', objectFit: 'contain', display: 'block' }} />
              </div>
              <h1 className="text-3xl font-black text-white leading-tight">Proposta Comercial</h1>
              <p className="mt-1" style={{ color: '#A3A3A3', fontSize: 14 }}>Plataforma Digital para Gestão de Equipe de Campo</p>
            </div>
            <div className="text-right">
              <p className="text-xs" style={{ color: '#737373' }}>Emitida em</p>
              <p className="text-sm font-semibold text-white">{hoje}</p>
              <p className="text-xs mt-3" style={{ color: '#737373' }}>Válida até</p>
              <p className="text-sm font-semibold" style={{ color: '#F3B23C' }}>{validade}</p>
            </div>
          </div>
        </div>

        {/* Accent bar */}
        <div style={{ height: 4, background: 'linear-gradient(90deg, #E8642A, #F3B23C)' }} />

        <div className="px-10 py-8 space-y-8">

          {/* Intro */}
          <div>
            <p style={{ color: '#525252', lineHeight: 1.7, fontSize: 14 }}>
              Apresentamos a proposta para desenvolvimento e implantação do <strong style={{ color: '#171717' }}>IE Pescados App</strong> —
              uma plataforma web progressiva (PWA) completa para gestão, rastreamento e relatório da equipe de promotores de vendas,
              com foco em operações de campo em supermercados e pontos de venda.
            </p>
          </div>

          {/* Investimento */}
          <div className="rounded-2xl overflow-hidden border-2" style={{ borderColor: '#E8642A' }}>
            <div className="px-6 py-4" style={{ background: '#E8642A' }}>
              <h2 className="text-white font-black text-lg">Investimento</h2>
            </div>
            <div className="grid grid-cols-2 divide-x">

              {/* Implantação */}
              <div className="px-6 py-6">
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#A3A3A3' }}>Implantação</p>
                <p className="text-3xl font-black" style={{ color: '#171717' }}>R$ 7.000<span className="text-base font-semibold text-gray-400">,00</span></p>
                <div className="mt-2 space-y-1">
                  <p className="text-xs" style={{ color: '#737373' }}>• À vista via Pix ou transferência</p>
                  <p className="text-xs" style={{ color: '#737373' }}>• Parcelado em até <strong style={{ color: '#E8642A' }}>7x no Infinite Pay</strong> (com juros)</p>
                  <p className="text-xs" style={{ color: '#737373' }}>• 50% na aprovação · 50% na entrega</p>
                </div>
                <div className="mt-4 space-y-1.5">
                  {['Desenvolvimento completo da plataforma', 'Configuração e hospedagem inicial', 'Treinamento da equipe (online)', 'Documentação de uso'].map(i => (
                    <div key={i} className="flex items-start gap-2">
                      <span style={{ color: '#E8642A', fontSize: 12, marginTop: 2 }}>✓</span>
                      <span style={{ fontSize: 12, color: '#525252' }}>{i}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Manutenção */}
              <div className="px-6 py-6" style={{ background: '#FAFAFA' }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#A3A3A3' }}>Manutenção Mensal</p>

                {/* Essencial */}
                <div className="rounded-xl p-3 mb-3 border-2" style={{ borderColor: '#E8642A', background: 'white' }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black uppercase" style={{ color: '#E8642A' }}>Essencial</span>
                    <span className="text-lg font-black" style={{ color: '#171717' }}>R$ 250<span className="text-xs font-normal text-gray-400">/mês</span></span>
                  </div>
                  <div className="space-y-1">
                    {mensalidade.map(i => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span style={{ color: '#22C55E', fontSize: 11, marginTop: 2 }}>✓</span>
                        <span style={{ fontSize: 11, color: '#525252' }}>{i}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Premium */}
                <div className="rounded-xl p-3" style={{ background: '#1a1a1a' }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black uppercase" style={{ color: '#F3B23C' }}>Premium</span>
                    <span className="text-lg font-black text-white">R$ 500<span className="text-xs font-normal" style={{ color: '#737373' }}>/mês</span></span>
                  </div>
                  <div className="space-y-1">
                    {[...mensalidade, 'Suporte técnico 24/7 — 7 dias por semana'].map(i => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span style={{ color: '#F3B23C', fontSize: 11, marginTop: 2 }}>✓</span>
                        <span style={{ fontSize: 11, color: '#A3A3A3' }}>{i}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Funcionalidades */}
          <div>
            <h2 className="text-lg font-black mb-4" style={{ color: '#171717' }}>
              Funcionalidades Incluídas
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(232,100,42,0.1)', color: '#E8642A' }}>
                {features.length} módulos
              </span>
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {features.map((f, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl" style={{ background: '#F9F9F9' }}>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: '#E8642A' }}>
                    <span className="text-white font-black text-xs">{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: '#171717' }}>{f.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#737373', lineHeight: 1.5 }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prazo e Tecnologia */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl p-5" style={{ background: '#F5F5F5' }}>
              <h3 className="font-bold text-sm mb-3" style={{ color: '#171717' }}>Prazo de Entrega</h3>
              <div className="space-y-2">
                {[
                  ['Semana 1', 'Configuração, banco de dados e roteiro do promotor'],
                  ['Semana 2', 'Dashboard, mapa, fotos e relatórios'],
                  ['Semana 3', 'Testes, ajustes e entrega em produção'],
                ].map(([s, d]) => (
                  <div key={s} className="flex gap-2">
                    <span className="text-xs font-bold whitespace-nowrap" style={{ color: '#E8642A' }}>{s}</span>
                    <span className="text-xs" style={{ color: '#737373' }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl p-5" style={{ background: '#F5F5F5' }}>
              <h3 className="font-bold text-sm mb-3" style={{ color: '#171717' }}>Tecnologia</h3>
              <div className="flex flex-wrap gap-1.5">
                {['React + TypeScript', 'PWA (offline)', 'GPS em tempo real', 'Mapas OpenStreetMap', 'Banco de dados na nuvem', 'Exportação Excel', 'Backups automáticos'].map(t => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'white', color: '#525252', border: '1px solid #E5E5E5' }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Condições */}
          <div className="rounded-xl p-5 border" style={{ borderColor: '#E5E5E5' }}>
            <h3 className="font-bold text-sm mb-3" style={{ color: '#171717' }}>Condições Gerais</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
              {[
                ['Validade da proposta', '30 dias a partir da emissão'],
                ['Início do desenvolvimento', 'Após aprovação e sinal de 50%'],
                ['Saldo da implantação', 'Na entrega em produção'],
                ['Parcelamento', 'Até 7x no Infinite Pay (com juros)'],
                ['Mensalidade', 'Cobrança mensal, vencimento dia 5'],
                ['Suporte 24/7', 'Exclusivo plano Premium (R$500/mês)'],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-col">
                  <span className="text-xs font-semibold" style={{ color: '#A3A3A3' }}>{k}</span>
                  <span className="text-xs" style={{ color: '#525252' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
