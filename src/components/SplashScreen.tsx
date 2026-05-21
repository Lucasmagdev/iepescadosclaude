import { useEffect } from 'react'

export function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 4300)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <>
      <style>{`
        .ie-splash {
          position: fixed; inset: 0; z-index: 9999;
          display: grid; place-items: center; overflow: hidden;
          background:
            radial-gradient(ellipse at 50% 18%, rgba(28,91,122,0.55), transparent 42%),
            linear-gradient(180deg, #071525 0%, #07111d 46%, #03070c 100%);
          animation: ieSplashExit 4.3s cubic-bezier(0.77,0,0.18,1) forwards;
        }
        .ie-splash-sea {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.7;
          background:
            repeating-linear-gradient(102deg, rgba(255,255,255,0.07) 0 1px, transparent 1px 28px),
            repeating-linear-gradient(18deg, rgba(232,100,42,0.06) 0 1px, transparent 1px 42px);
          filter: blur(0.5px);
          animation: ieOceanDrift 4.3s ease-in-out forwards;
        }
        .ie-splash-current {
          position: absolute; height: 38vh; top: 24vh; left: 0; right: 0;
          pointer-events: none; opacity: 0;
          background: linear-gradient(90deg, transparent, rgba(89,154,180,0.2), rgba(255,139,67,0.18), transparent);
          filter: blur(24px);
          animation: ieCurrent 4.3s ease forwards;
        }
        .ie-splash-vignette {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse at 50% 50%, transparent 38%, rgba(3,7,12,0.62) 100%);
        }
        .ie-splash-content {
          position: relative; display: flex; flex-direction: column;
          align-items: center; gap: 16px;
          animation: ieContentFade 4.3s ease forwards;
        }
        .ie-splash-logo { height: 72px; width: auto; object-fit: contain; filter: brightness(0) invert(1); }
        .ie-splash-tag {
          color: rgba(255,255,255,0.45); font-size: 11px;
          letter-spacing: 0.22em; text-transform: uppercase; font-weight: 500;
        }
        .ie-splash-bar {
          position: absolute; bottom: 0; left: 0; height: 3px;
          background: linear-gradient(90deg, #E8642A, #F3B23C);
          animation: ieBar 4s ease forwards;
        }
        @keyframes ieSplashExit {
          0%,72% { opacity:1; transform:scale(1); }
          100%   { opacity:0; transform:scale(1.06); pointer-events:none; }
        }
        @keyframes ieOceanDrift {
          0%   { transform: scale(1.2) rotate(-4deg) translateX(0); }
          100% { transform: scale(1.35) rotate(-6deg) translateX(-4%); }
        }
        @keyframes ieCurrent {
          0%  { opacity:0; transform:translateX(-32%) skewY(-8deg); }
          30% { opacity:1; transform:translateX(0%) skewY(-6deg); }
          70% { opacity:0.6; transform:translateX(18%) skewY(-5deg); }
          100%{ opacity:0; transform:translateX(40%) skewY(-4deg); }
        }
        @keyframes ieContentFade {
          0%    { opacity:0; transform:translateY(12px); }
          20%   { opacity:1; transform:translateY(0); }
          72%   { opacity:1; transform:translateY(0); }
          100%  { opacity:0; transform:translateY(-8px); }
        }
        @keyframes ieBar {
          0%  { width:0%; }  15% { width:30%; }
          60% { width:82%; } 90% { width:100%; } 100% { width:100%; }
        }
      `}</style>
      <div className="ie-splash">
        <div className="ie-splash-sea" />
        <div className="ie-splash-current" />
        <div className="ie-splash-vignette" />
        <div className="ie-splash-content">
          <img src="/logo.png" alt="IE Pescados" className="ie-splash-logo" />
          <span className="ie-splash-tag">Gestão de Promotores</span>
        </div>
        <div className="ie-splash-bar" />
      </div>
    </>
  )
}
