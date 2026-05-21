import React, { useEffect } from "react";

type GestaoIntroProps = {
  onComplete: () => void;
};

export function GestaoIntro({ onComplete }: GestaoIntroProps) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(onComplete, prefersReducedMotion ? 700 : 4300);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="gestao-intro" aria-label="IE Pescados Gestão">
      <div className="intro-sea" />
      <div className="intro-current intro-current-a" />
      <div className="intro-current intro-current-b" />
      <div className="intro-reef-light" />
      <div className="intro-logo-stage">
        <img src="/logo-ie-pescados.png" alt="ie pescados" />
      </div>
      <div className="intro-vignette" />
    </div>
  );
}
