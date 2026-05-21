import { useEffect, useState } from 'react'

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter')

  useEffect(() => {
    // logo entra → segura → sai
    const t1 = setTimeout(() => setPhase('hold'), 800)
    const t2 = setTimeout(() => setPhase('exit'), 2200)
    const t3 = setTimeout(onDone, 3000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onDone])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#1A0A04',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
        opacity: phase === 'exit' ? 0 : 1,
        transform: phase === 'exit' ? 'scale(1.04)' : 'scale(1)',
        pointerEvents: phase === 'exit' ? 'none' : 'all',
      }}
    >
      {/* glow de fundo */}
      <div
        style={{
          position: 'absolute',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,100,42,0.25) 0%, transparent 70%)',
          transition: 'opacity 0.6s ease',
          opacity: phase === 'enter' ? 0 : 1,
        }}
      />

      {/* logo */}
      <img
        src="/logo.png"
        alt="IE Pescados"
        style={{
          height: '80px',
          width: 'auto',
          objectFit: 'contain',
          position: 'relative',
          filter: 'brightness(0) invert(1)',
          transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
          opacity: phase === 'enter' ? 0 : 1,
          transform: phase === 'enter' ? 'scale(0.6) translateY(12px)' : 'scale(1) translateY(0)',
        }}
      />

      {/* tagline */}
      <p
        style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: '13px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          fontWeight: 500,
          position: 'relative',
          transition: 'opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s',
          opacity: phase === 'enter' ? 0 : 0.6,
          transform: phase === 'enter' ? 'translateY(8px)' : 'translateY(0)',
        }}
      >
        Gestão de Promotores
      </p>

      {/* barra de loading */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '3px',
          background: '#E8642A',
          transition: phase === 'enter'
            ? 'width 0.1s ease'
            : phase === 'hold'
            ? 'width 1.4s ease'
            : 'width 0.6s ease',
          width: phase === 'enter' ? '0%' : phase === 'hold' ? '85%' : '100%',
        }}
      />
    </div>
  )
}
