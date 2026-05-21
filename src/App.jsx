import React, { useEffect, useMemo, useState } from "react";
import { initialVisits, promoters, stores } from "./data/mockData";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { LoginScreen } from "./screens/LoginScreen";
import { PromoterShell } from "./screens/PromoterShell";
import { VisitFlow } from "./screens/VisitFlow";
import { ManagerDashboard } from "./screens/ManagerDashboard";
import { GestaoIntro } from "./components/GestaoIntro";

export default function App() {
  const [role, setRole] = useState("promotor");
  const [screen, setScreen] = useState("login");
  const [activeVisitId, setActiveVisitId] = useState(null);
  const [visits, setVisits] = useLocalStorage("ie-pescados-visits", initialVisits);
  const [selectedPromoterId, setSelectedPromoterId] = useState("prom-2");
  const [showGestaoIntro, setShowGestaoIntro] = useState(true);

  const activeVisit = useMemo(() => visits.find((visit) => visit.id === activeVisitId), [activeVisitId, visits]);

  useEffect(() => {
    const validStoreIds = new Set(stores.map((store) => store.id));
    const validVisits =
      Array.isArray(visits) &&
      visits.every((visit) => visit?.id && validStoreIds.has(visit.storeId) && Array.isArray(visit.items));

    if (!validVisits) {
      setVisits(initialVisits);
    }
  }, [setVisits, visits]);

  useEffect(() => {
    const applyPath = () => {
      if (window.location.pathname === "/gestao") {
        setScreen("manager");
      }
    };

    applyPath();
    window.addEventListener("popstate", applyPath);
    return () => window.removeEventListener("popstate", applyPath);
  }, []);

  const updateVisit = (visitId, patch) => {
    setVisits((current) =>
      current.map((visit) => (visit.id === visitId ? { ...visit, ...patch, unsynced: true } : visit))
    );
  };

  const updateVisitItem = (visitId, sku, patch) => {
    setVisits((current) =>
      current.map((visit) =>
        visit.id === visitId
          ? {
              ...visit,
              unsynced: true,
              items: visit.items.map((item) => (item.sku === sku ? { ...item, ...patch } : item))
            }
          : visit
      )
    );
  };

  const justifyVisit = (visitId, justification) => {
    updateVisit(visitId, { status: "justified", justification });
  };

  const syncVisits = () => {
    setVisits((current) => current.map((visit) => ({ ...visit, unsynced: false })));
  };

  const resetDemo = () => {
    setVisits(initialVisits);
    setActiveVisitId(null);
    setScreen("login");
    window.history.pushState({}, "", "/");
  };

  const login = (event) => {
    event.preventDefault();
    if (role === "gestor") {
      window.history.pushState({}, "", "/gestao");
      setScreen("manager");
      return;
    }
    window.history.pushState({}, "", "/");
    setScreen("route");
  };

  return (
    <main className="app-shell">
      {screen === "login" && <LoginScreen role={role} setRole={setRole} onLogin={login} />}
      {["route", "tasks", "issues", "notifications", "more"].includes(screen) && (
        <PromoterShell
          active={screen}
          visits={visits}
          onNavigate={setScreen}
          onLogout={() => {
            window.history.pushState({}, "", "/");
            setScreen("login");
          }}
          onOpenVisit={(visitId) => {
            setActiveVisitId(visitId);
            setScreen("visit");
          }}
          onJustifyVisit={justifyVisit}
          onSyncVisits={syncVisits}
        />
      )}
      {screen === "visit" && activeVisit && (
        <VisitFlow
          visit={activeVisit}
          updateVisit={updateVisit}
          updateVisitItem={updateVisitItem}
          onBack={() => setScreen("route")}
        />
      )}
      {screen === "manager" && (
        <ManagerDashboard
          visits={visits}
          selectedPromoterId={selectedPromoterId}
          setSelectedPromoterId={setSelectedPromoterId}
          onJustifyVisit={justifyVisit}
          onSyncVisits={syncVisits}
          onResetDemo={resetDemo}
          onLogout={() => {
            window.history.pushState({}, "", "/");
            setScreen("login");
          }}
        />
      )}
      {showGestaoIntro && (
        <GestaoIntro onComplete={() => setShowGestaoIntro(false)} />
      )}
    </main>
  );
}
