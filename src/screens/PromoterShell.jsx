import React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  LogOut,
  PackageCheck,
  RefreshCw,
  Store,
  Tag,
  UploadCloud
} from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { Logo } from "../components/Brand";
import { StatusBadge } from "../components/StatusBadge";
import { stores, today } from "../data/mockData";
import { percent } from "../utils/format";

export function PromoterShell({ active, visits, onNavigate, onLogout, onOpenVisit, onJustifyVisit, onSyncVisits }) {
  return (
    <section className="phone-screen with-nav">
      <header className="top-bar">
        <Logo />
        <button className="icon-button" aria-label="Sair" onClick={onLogout}>
          <LogOut size={19} />
        </button>
      </header>
      <div className="content">
        {active === "route" && <RouteScreen visits={visits} onOpenVisit={onOpenVisit} onJustifyVisit={onJustifyVisit} />}
        {active === "tasks" && <TasksScreen visits={visits} />}
        {active === "issues" && <IssuesScreen />}
        {active === "notifications" && <NotificationsScreen visits={visits} onSyncVisits={onSyncVisits} />}
        {active === "more" && <MoreScreen visits={visits} />}
      </div>
      <BottomNav active={active} onNavigate={onNavigate} />
    </section>
  );
}

function RouteScreen({ visits, onOpenVisit, onJustifyVisit }) {
  const completed = visits.filter((visit) => visit.status === "completed").length;
  const inProgress = visits.filter((visit) => visit.status === "progress").length;
  const justified = visits.filter((visit) => visit.status === "justified").length;
  const completion = percent(completed, visits.length);

  return (
    <>
      <div className="section-heading">
        <div>
          <span className="eyebrow">{today}</span>
          <h2>Roteiro de hoje</h2>
        </div>
        <span className="count-pill">{completed}/{visits.length}</span>
      </div>
      <div className="route-summary">
        <div>
          <strong>{completion}%</strong>
          <span>execução</span>
        </div>
        <div>
          <strong>{inProgress}</strong>
          <span>em andamento</span>
        </div>
        <div>
          <strong>{justified}</strong>
          <span>justificada</span>
        </div>
      </div>
      <div className="store-list">
        {visits.map((visit) => {
          const store = stores.find((item) => item.id === visit.storeId) || stores[0];
          return (
            <article className="store-card route-card" key={visit.id}>
              <button className="store-open" onClick={() => onOpenVisit(visit.id)}>
                <div className="store-icon">
                  {visit.status === "completed" ? <CheckCircle2 size={24} /> : <Store size={24} />}
                </div>
                <div>
                  <strong>{store.name}</strong>
                  <span>{store.banner} - {store.address}</span>
                  <small>{store.routeWindow} - {store.city}</small>
                </div>
                <StatusBadge status={visit.status} />
              </button>
              <div className="route-meta">
                <span>{visit.unsynced ? "Pendente de sync" : "Sincronizado"}</span>
                {visit.status !== "completed" && (
                  <button onClick={() => onJustifyVisit(visit.id, "Justificativa rápida: loja sem condição de execução.")}>
                    Justificar
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

function TasksScreen({ visits }) {
  const pending = visits.filter((visit) => visit.status !== "completed");
  const cards = [
    { icon: Store, title: "Finalizar roteiro", text: `${pending.length} loja(s) ainda precisam de execução ou justificativa.` },
    { icon: Tag, title: "Auditar preço", text: "Conferir preço IE e concorrente nos SKUs de camarão descascado e tilápia." },
    { icon: PackageCheck, title: "Checar ruptura", text: "Marcar indisponibilidade quando o produto não estiver exposto na gôndola." }
  ];
  return <CardList title="Tarefas" cards={cards} />;
}

function IssuesScreen() {
  const cards = [
    { icon: AlertTriangle, title: "Ruptura de produto", text: "Produto ausente, sem estoque ou sem exposição visível." },
    { icon: Store, title: "Problema na loja", text: "Loja fechada, sem acesso ao setor ou gôndola bloqueada." },
    { icon: Tag, title: "Divergência de preço", text: "Preço de etiqueta diferente do sistema ou concorrente mais agressivo." }
  ];
  return <CardList title="Ocorrências" cards={cards} />;
}

function NotificationsScreen({ visits, onSyncVisits }) {
  const unsynced = visits.filter((visit) => visit.unsynced).length;
  return (
    <div className="simple-stack">
      <SimpleTab icon={Clock3} title="Notificações" text={`${unsynced} visita(s) aguardando sincronização. Finalize o roteiro até 17:00.`} />
      <button className="primary-button" onClick={onSyncVisits}>
        <UploadCloud size={19} />
        Sincronizar agora
      </button>
    </div>
  );
}

function MoreScreen({ visits }) {
  const completed = visits.filter((visit) => visit.status === "completed").length;
  const cards = [
    { icon: CheckCircle2, title: "Histórico de hoje", text: `${completed} visita(s) concluída(s), com fotos e checklist salvos localmente.` },
    { icon: RefreshCw, title: "Modo PWA", text: "Dados simulados em LocalStorage para demonstração sem backend." },
    { icon: Clock3, title: "Versão", text: "Protótipo navegável IE Pescados v0.2." }
  ];
  return <CardList title="Mais" cards={cards} />;
}

function CardList({ title, cards }) {
  return (
    <>
      <div className="section-heading">
        <div>
          <span className="eyebrow">Promotor</span>
          <h2>{title}</h2>
        </div>
      </div>
      <div className="mini-card-list">
        {cards.map(({ icon: Icon, title: cardTitle, text }) => (
          <article className="mini-card" key={cardTitle}>
            <Icon size={22} />
            <div>
              <strong>{cardTitle}</strong>
              <span>{text}</span>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function SimpleTab({ icon: Icon, title, text }) {
  return (
    <div className="simple-tab">
      <Icon size={34} />
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}
