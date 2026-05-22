import { useEffect } from 'react'

export function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3200)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <>
      <style>{`
        .ie-splash {
          position: fixed; inset: 0; z-index: 9999;
          display: grid; place-items: center; overflow: hidden;
          background: #FFFAF7;
          animation: ieSplashExit 3.2s cubic-bezier(0.77,0,0.18,1) forwards;
        }
        .ie-splash-blob1 {
          position: absolute; width: 60vw; height: 60vw; max-width: 420px; max-height: 420px;
          top: -15%; left: -10%; border-radius: 50%; pointer-events: none;
          background: radial-gradient(circle, rgba(232,100,42,0.12) 0%, transparent 70%);
          animation: ieBlob1 3.2s ease forwards;
        }
        .ie-splash-blob2 {
          position: absolute; width: 50vw; height: 50vw; max-width: 360px; max-height: 360px;
          bottom: -10%; right: -10%; border-radius: 50%; pointer-events: none;
          background: radial-gradient(circle, rgba(243,178,60,0.15) 0%, transparent 70%);
          animation: ieBlob2 3.2s ease forwards;
        }
        .ie-splash-content {
          position: relative; display: flex; flex-direction: column;
          align-items: center; gap: 14px;
          animation: ieContentFade 3.2s ease forwards;
        }
        .ie-splash-logo {
          height: 68px; width: auto; object-fit: contain;
        }
        .ie-splash-tag {
          color: #A3A3A3; font-size: 11px;
          letter-spacing: 0.22em; text-transform: uppercase; font-weight: 500;
        }
        .ie-splash-bar {
          position: absolute; bottom: 0; left: 0; height: 3px;
          background: linear-gradient(90deg, #E8642A, #F3B23C);
          animation: ieBar 3s ease forwards;
        }
        @keyframes ieSplashExit {
          0%,75% { opacity:1; transform:scale(1); }
          100%   { opacity:0; transform:scale(1.04); pointer-events:none; }
        }
        @keyframes ieBlob1 {
          0%   { transform: scale(0.8) translate(-10%, -10%); opacity: 0; }
          30%  { opacity: 1; }
          100% { transform: scale(1.1) translate(5%, 5%); opacity: 0.6; }
        }
        @keyframes ieBlob2 {
          0%   { transform: scale(0.8) translate(10%, 10%); opacity: 0; }
          30%  { opacity: 1; }
          100% { transform: scale(1.1) translate(-5%, -5%); opacity: 0.6; }
        }
        @keyframes ieContentFade {
          0%    { opacity:0; transform:translateY(10px); }
          20%   { opacity:1; transform:translateY(0); }
          75%   { opacity:1; transform:translateY(0); }
          100%  { opacity:0; transform:translateY(-6px); }
        }
        @keyframes ieBar {
          0%  { width:0%; }  15% { width:30%; }
          60% { width:82%; } 90% { width:100%; } 100% { width:100%; }
        }
      `}</style>
      <div className="ie-splash">
        <div className="ie-splash-blob1" />
        <div className="ie-splash-blob2" />
        <div className="ie-splash-content">
          <img src="/logo.png" alt="IE Pescados" className="ie-splash-logo" />
          <span className="ie-splash-tag">Gestão de Promotores</span>
        </div>
        <div className="ie-splash-bar" />
      </div>
    </>
  )
}
