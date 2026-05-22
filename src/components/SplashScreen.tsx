import { useEffect } from 'react'

export function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3800)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <>
      <style>{`
        .sp {
          position: fixed; inset: 0; z-index: 9999;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 20px;
          overflow: hidden; background: #FFFAF7;
          animation: spExit 3.8s cubic-bezier(0.77,0,0.18,1) forwards;
        }

        /* ── Burst inicial laranja ── */
        .sp-burst {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(circle at 50% 46%, #E8642A 0%, #F3B23C 25%, #FFFAF7 65%);
          animation: spBurst 1s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        @keyframes spBurst {
          0%   { opacity: 1; transform: scale(0); }
          45%  { opacity: 1; transform: scale(1.4); }
          100% { opacity: 0; transform: scale(2); }
        }

        /* ── Partículas flutuantes ── */
        .sp-particles {
          position: absolute; inset: 0; pointer-events: none;
          animation: spParticlesIn 0.4s ease 0.2s both;
        }
        @keyframes spParticlesIn { from { opacity:0 } to { opacity:1 } }

        .sp-dot {
          position: absolute; border-radius: 50%;
          background: #E8642A; opacity: 0;
          animation: spDotFloat linear infinite;
        }
        .sp-dot:nth-child(1)  { width:6px;  height:6px;  left:12%;  animation-duration:2.8s; animation-delay:0.3s; }
        .sp-dot:nth-child(2)  { width:4px;  height:4px;  left:25%;  animation-duration:2.2s; animation-delay:0.7s; background:#F3B23C; }
        .sp-dot:nth-child(3)  { width:8px;  height:8px;  left:38%;  animation-duration:3.1s; animation-delay:0.5s; }
        .sp-dot:nth-child(4)  { width:5px;  height:5px;  left:55%;  animation-duration:2.5s; animation-delay:0.2s; background:#F3B23C; }
        .sp-dot:nth-child(5)  { width:7px;  height:7px;  left:68%;  animation-duration:2.9s; animation-delay:0.9s; }
        .sp-dot:nth-child(6)  { width:4px;  height:4px;  left:80%;  animation-duration:2.3s; animation-delay:0.4s; background:#F3B23C; }
        .sp-dot:nth-child(7)  { width:5px;  height:5px;  left:90%;  animation-duration:2.7s; animation-delay:0.6s; }
        @keyframes spDotFloat {
          0%   { opacity: 0; transform: translateY(100vh) scale(0.5); }
          15%  { opacity: 0.35; }
          85%  { opacity: 0.2; }
          100% { opacity: 0; transform: translateY(-20vh) scale(1); }
        }

        /* ── Logo wrap ── */
        .sp-logo-wrap {
          position: relative; display: flex;
          flex-direction: column; align-items: center; gap: 16px;
          animation: spLogoIn 0.65s cubic-bezier(0.34,1.7,0.64,1) 0.25s both;
        }
        @keyframes spLogoIn {
          0%   { opacity: 0; transform: scale(0.3) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        .sp-logo { height: 72px; width: auto; object-fit: contain; }

        /* Shine sweep over logo */
        .sp-logo-shine {
          position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.65) 50%, transparent 70%);
          animation: spShine 0.7s ease 0.9s forwards;
          pointer-events: none;
        }
        @keyframes spShine {
          0%   { left: -100%; }
          100% { left: 200%; }
        }

        /* ── Ripple rings ── */
        .sp-ring {
          position: absolute;
          border-radius: 50%;
          border: 2px solid rgba(232,100,42,0.7);
          top: 50%; left: 50%;
          width: 100px; height: 100px;
          margin: -50px 0 0 -50px;
          animation: spRing 0.9s ease 0.6s forwards;
        }
        .sp-ring2 {
          position: absolute;
          border-radius: 50%;
          border: 1.5px solid rgba(243,178,60,0.5);
          top: 50%; left: 50%;
          width: 100px; height: 100px;
          margin: -50px 0 0 -50px;
          animation: spRing 0.9s ease 0.75s forwards;
        }
        @keyframes spRing {
          0%   { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(3.5); opacity: 0; }
        }

        /* ── Tagline ── */
        .sp-tag {
          color: #A3A3A3; font-size: 11px;
          letter-spacing: 0.28em; text-transform: uppercase; font-weight: 500;
          animation: spTagIn 0.5s ease 0.85s both;
        }
        @keyframes spTagIn {
          from { opacity: 0; transform: translateY(10px); letter-spacing: 0.1em; }
          to   { opacity: 1; transform: translateY(0);    letter-spacing: 0.28em; }
        }

        /* ── Peixe ── */
        .sp-fish {
          position: absolute; top: 58%;
          opacity: 0;
          animation: spFish 2s ease 1.1s forwards;
        }
        @keyframes spFish {
          0%   { opacity: 0; transform: translateX(-60vw) scaleX(1); }
          8%   { opacity: 0.12; }
          92%  { opacity: 0.12; }
          100% { opacity: 0; transform: translateX(110vw) scaleX(1); }
        }

        /* ── Onda inferior ── */
        .sp-wave {
          position: absolute; bottom: -2px; left: 0; right: 0;
          animation: spWaveIn 0.7s ease 0.5s both;
        }
        @keyframes spWaveIn {
          from { transform: translateY(60px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .sp-wave-path {
          animation: spWaveMove 2.5s ease-in-out infinite alternate;
        }
        @keyframes spWaveMove {
          0%   { d: path("M0,24 C120,0 240,48 360,24 C480,0 600,48 720,24 C840,0 960,48 1080,24 L1080,64 L0,64 Z"); }
          100% { d: path("M0,32 C120,56 240,8  360,32 C480,56 600,8  720,32 C840,56 960,8  1080,32 L1080,64 L0,64 Z"); }
        }

        /* ── Barra de progresso ── */
        .sp-bar {
          position: absolute; bottom: 0; left: 0; height: 3px;
          background: linear-gradient(90deg, #E8642A, #F3B23C);
          box-shadow: 0 0 10px rgba(232,100,42,0.7), 0 0 20px rgba(232,100,42,0.3);
          animation: spBar 3.6s ease forwards;
        }
        @keyframes spBar {
          0%   { width: 0%; }
          12%  { width: 28%; }
          55%  { width: 75%; }
          88%  { width: 100%; }
          100% { width: 100%; }
        }

        /* ── Exit ── */
        @keyframes spExit {
          0%,76% { opacity: 1; transform: scale(1); }
          100%   { opacity: 0; transform: scale(1.08); pointer-events: none; }
        }
      `}</style>

      <div className="sp">
        {/* Burst laranja */}
        <div className="sp-burst" />

        {/* Partículas */}
        <div className="sp-particles">
          {[...Array(7)].map((_, i) => <div key={i} className="sp-dot" />)}
        </div>

        {/* Ripple rings (absolutas ao logo) */}
        <div style={{ position: 'absolute' }}>
          <div className="sp-ring" />
          <div className="sp-ring2" />
        </div>

        {/* Logo + tagline */}
        <div className="sp-logo-wrap">
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <img src="/logo.png" alt="IE Pescados" className="sp-logo" />
            <div className="sp-logo-shine" />
          </div>
          <span className="sp-tag">Gestão de Promotores</span>
        </div>

        {/* Peixe atravessando */}
        <div className="sp-fish">
          <svg width="80" height="40" viewBox="0 0 80 40" fill="none">
            <path d="M60,20 Q50,8 30,12 Q10,16 4,20 Q10,24 30,28 Q50,32 60,20 Z" fill="#E8642A" />
            <path d="M60,20 L78,10 L72,20 L78,30 Z" fill="#E8642A" />
            <circle cx="28" cy="18" r="2" fill="white" opacity="0.8" />
          </svg>
        </div>

        {/* Onda */}
        <svg className="sp-wave" viewBox="0 0 1080 64" preserveAspectRatio="none" height="48">
          <path
            className="sp-wave-path"
            d="M0,24 C120,0 240,48 360,24 C480,0 600,48 720,24 C840,0 960,48 1080,24 L1080,64 L0,64 Z"
            fill="rgba(232,100,42,0.08)"
          />
          <path
            d="M0,36 C150,20 300,52 450,36 C600,20 750,52 900,36 C960,28 1020,40 1080,36 L1080,64 L0,64 Z"
            fill="rgba(243,178,60,0.07)"
          />
        </svg>

        {/* Barra */}
        <div className="sp-bar" />
      </div>
    </>
  )
}
