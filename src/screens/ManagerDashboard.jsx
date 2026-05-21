import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarCheck,
  CircleGauge,
  Clock3,
  FileCheck2,
  Image,
  LogOut,
  MessageCircle,
  PackageCheck,
  RefreshCw,
  Store,
  UploadCloud,
  Wifi,
  WifiOff
} from "lucide-react";
import { Logo } from "../components/Brand";
import { MetricCard } from "../components/MetricCard";
import { gallerySeed, products, promoters, stores, today } from "../data/mockData";
import { formatMoney, percent } from "../utils/format";

export function ManagerDashboard({
  visits,
  selectedPromoterId,
  setSelectedPromoterId,
  onJustifyVisit,
  onSyncVisits,
  onResetDemo,
  onLogout
}) {
  const [filters, setFilters] = useState({ storeId: "all", promoterId: "all", status: "all" });
  const [justifyVisitId, setJustifyVisitId] = useState("");
  const [justification, setJustification] = useState("Promotor justificou impossibilidade de execução no horário.");

  const stats = useMemo(() => {
    const scheduled = 92;
    const localCompleted = visits.filter((visit) => visit.status === "completed").length;
    const localJustified = visits.filter((visit) => visit.status === "justified").length;
    const completed = 63 + localCompleted;
    const justified = 7 + localJustified;
    return { scheduled, completed, justified, pending: scheduled - completed - justified, executedPercent: percent(completed, scheduled) };
  }, [visits]);

  const rankedPromoters = useMemo(
    () =>
      promoters
        .map((promoter) => ({
          ...promoter,
          percent: percent(promoter.completed, promoter.scheduled)
        }))
        .sort((a, b) => b.percent - a.percent),
    []
  );

  const selectedPromoter = rankedPromoters.find((promoter) => promoter.id === selectedPromoterId) || rankedPromoters[0];
  const justifyTargets = visits.filter((visit) => visit.status !== "completed");
  const unsyncedCount = visits.filter((visit) => visit.unsynced).length;
  const ruptureCount = visits.reduce((total, visit) => total + visit.items.filter((item) => !item.available).length, 0);
  const selectedStore = stores.find((store) => store.id === justifyTargets[0]?.storeId);

  const gallery = useMemo(() => {
    const localPhotos = visits.flatMap((visit) =>
      [
        visit.beforePhoto && { id: `${visit.id}-before`, storeId: visit.storeId, promoterId: visit.promoterId, type: "Antes", status: visit.status, time: "Local" },
        visit.afterPhoto && { id: `${visit.id}-after`, storeId: visit.storeId, promoterId: visit.promoterId, type: "Depois", status: visit.status, time: "Local" }
      ].filter(Boolean)
    );
    return [...localPhotos, ...gallerySeed].filter((photo) => {
      return (
        (filters.storeId === "all" || photo.storeId === filters.storeId) &&
        (filters.promoterId === "all" || photo.promoterId === filters.promoterId) &&
        (filters.status === "all" || photo.status === filters.status)
      );
    });
  }, [filters, visits]);

  const productRows = useMemo(() => {
    return products.map((product) => {
      const items = visits.flatMap((visit) => visit.items.filter((item) => item.sku === product.sku));
      const available = items.filter((item) => item.available);
      const prices = available.map((item) => Number(item.price)).filter((value) => !Number.isNaN(value));
      const averagePrice = prices.length ? prices.reduce((sum, value) => sum + value, 0) / prices.length : 0;
      return {
        ...product,
        availability: percent(available.length, items.length),
        rupture: items.length - available.length,
        averagePrice
      };
    });
  }, [visits]);

  return (
    <section className="manager-screen">
      <header className="manager-header">
        <Logo />
        <div className="manager-actions">
          <button className="secondary-button" onClick={onSyncVisits}>
            <UploadCloud size={17} />
            Sync
          </button>
          <button className="icon-button" aria-label="Sair" onClick={onLogout}>
            <LogOut size={19} />
          </button>
        </div>
      </header>
      <div className="manager-content">
        <div className="manager-hero">
          <div>
            <span className="eyebrow">{today}</span>
            <h1>Central de execução IE Pescados</h1>
            <p>Roteiro, evidências de gôndola, ruptura e preço em uma visão única para decisão rápida.</p>
          </div>
          <button className="secondary-button" onClick={onResetDemo}>
            <RefreshCw size={17} />
            Reset demo
          </button>
        </div>

        <div className="metric-grid">
          <MetricCard icon={CalendarCheck} value={stats.scheduled} label="Agendadas" />
          <MetricCard icon={PackageCheck} value={stats.completed} label="Executadas" />
          <MetricCard icon={AlertTriangle} value={stats.justified} label="Justificadas" />
          <MetricCard icon={CircleGauge} value={`${stats.executedPercent}%`} label="Execução" />
        </div>

        <div className="insight-strip">
          <span><b>{unsyncedCount}</b> pendente(s) de sync</span>
          <span><b>{ruptureCount}</b> ruptura(s) no roteiro local</span>
          <span><b>{selectedStore?.name || "EPA / Super Nosso"}</b> próximo ponto crítico</span>
        </div>

        <section className="dashboard-grid">
          <div className="panel donut-panel">
            <h2>Execução de hoje</h2>
            <div className="donut" style={{ "--done": `${stats.executedPercent}%`, "--justified": `${percent(stats.completed + stats.justified, stats.scheduled)}%` }}>
              <span>{stats.executedPercent}%</span>
            </div>
            <div className="legend">
              <span><i className="dot done-dot" /> Executadas</span>
              <span><i className="dot justified-dot" /> Justificadas</span>
              <span><i className="dot pending-dot" /> Pendentes</span>
            </div>
          </div>

          <div className="panel action-panel">
            <h2>Ações imediatas</h2>
            <ActionRow icon={UploadCloud} title="Sincronização" text={`${unsyncedCount} visita(s) com dados locais aguardando envio.`} action="Sincronizar" onClick={onSyncVisits} />
            <ActionRow icon={FileCheck2} title="Justificativas" text={`${justifyTargets.length} visita(s) podem receber justificativa.`} action="Justificar" onClick={() => setJustifyVisitId(justifyTargets[0]?.id || "")} />
            <ActionRow icon={MessageCircle} title="Contato rápido" text={`Acionar ${selectedPromoter.name} pelo WhatsApp.`} action="Abrir" href={`https://wa.me/${selectedPromoter.phone}`} />
          </div>

          <div className="panel ranking-panel">
            <h2>Ranking de promotores</h2>
            {rankedPromoters.map((promoter) => (
              <button className={selectedPromoter.id === promoter.id ? "rank-row selected" : "rank-row"} key={promoter.id} onClick={() => setSelectedPromoterId(promoter.id)}>
                <span className={promoter.online ? "presence online" : "presence"} />
                <div>
                  <strong>{promoter.name}</strong>
                  <small>{promoter.completed}/{promoter.scheduled} visitas - {promoter.photos} fotos</small>
                </div>
                <b>{promoter.percent}%</b>
              </button>
            ))}
          </div>

          <PromoterDetail promoter={selectedPromoter} onOpenJustify={() => setJustifyVisitId(justifyTargets[0]?.id || "")} />
          <ProductAuditPanel rows={productRows} />

          <div className="panel warning-panel">
            <h2>Sem acesso hoje</h2>
            {promoters.filter((promoter) => promoter.lastAccess === "Sem acesso hoje").map((promoter) => (
              <div className="warning-row" key={promoter.id}>
                <AlertTriangle size={19} />
                <span>{promoter.name}</span>
                <small>{promoter.scheduled} visitas previstas</small>
              </div>
            ))}
          </div>

          <GalleryPanel gallery={gallery} filters={filters} setFilters={setFilters} />
        </section>
      </div>

      {justifyVisitId && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <h2>Justificar visita</h2>
            <label>
              Visita
              <select value={justifyVisitId} onChange={(event) => setJustifyVisitId(event.target.value)}>
                {justifyTargets.map((visit) => {
                  const store = stores.find((item) => item.id === visit.storeId);
                  return <option key={visit.id} value={visit.id}>{store?.name || "Loja"}</option>;
                })}
              </select>
            </label>
            <label>
              Motivo
              <textarea value={justification} onChange={(event) => setJustification(event.target.value)} />
            </label>
            <div className="modal-actions">
              <button onClick={() => setJustifyVisitId("")}>Cancelar</button>
              <button
                className="primary-button"
                onClick={() => {
                  onJustifyVisit(justifyVisitId, justification);
                  setJustifyVisitId("");
                }}
              >
                Salvar justificativa
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function ActionRow({ icon: Icon, title, text, action, onClick, href }) {
  const content = (
    <>
      <Icon size={19} />
      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
      <b>{action}</b>
    </>
  );
  if (href) {
    return <a className="action-row" href={href} target="_blank" rel="noreferrer">{content}</a>;
  }
  return <button className="action-row" onClick={onClick}>{content}</button>;
}

function PromoterDetail({ promoter, onOpenJustify }) {
  const completion = percent(promoter.completed, promoter.scheduled);
  return (
    <div className="panel promoter-detail">
      <div className="detail-head">
        <div>
          <span className="eyebrow">Detalhe do promotor</span>
          <h2>{promoter.name}</h2>
        </div>
        <span className={promoter.online ? "detail-status online" : "detail-status"}>
          {promoter.online ? <Wifi size={16} /> : <WifiOff size={16} />}
          {promoter.online ? "Online" : "Offline"}
        </span>
      </div>
      <div className="detail-stats">
        <span><b>{completion}%</b> conclusão</span>
        <span><b>{promoter.completed}</b> executadas</span>
        <span><b>{promoter.photos}</b> fotos</span>
      </div>
      <div className="sync-row">
        <Clock3 size={18} />
        <div>
          <strong>{promoter.synced ? "Sincronizado" : "Pendente de sync"}</strong>
          <small>Último acesso: {promoter.lastAccess}</small>
        </div>
      </div>
      <div className="detail-actions">
        <a className="action-button" href={`https://wa.me/${promoter.phone}`} target="_blank" rel="noreferrer">
          <MessageCircle size={18} />
          WhatsApp
        </a>
        <button className="action-button" onClick={onOpenJustify}>
          <FileCheck2 size={18} />
          Justificar
        </button>
      </div>
    </div>
  );
}

function ProductAuditPanel({ rows }) {
  return (
    <div className="panel product-audit-panel">
      <h2>Auditoria por produto</h2>
      <div className="product-table">
        {rows.map((row) => (
          <div className="product-row" key={row.sku}>
            <div>
              <strong>{row.name}</strong>
              <small>{row.sku}</small>
            </div>
            <span>{row.availability}% disp.</span>
            <span>{row.rupture} ruptura(s)</span>
            <b>{formatMoney(row.averagePrice)}</b>
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryPanel({ gallery, filters, setFilters }) {
  return (
    <div className="panel gallery-panel">
      <div className="panel-title-row">
        <h2>Fotos das visitas</h2>
        <span>{gallery.length} fotos</span>
      </div>
      <div className="filter-row">
        <select value={filters.storeId} onChange={(event) => setFilters({ ...filters, storeId: event.target.value })}>
          <option value="all">Todas as lojas</option>
          {stores.map((store) => <option key={store.id} value={store.id}>{store.name}</option>)}
        </select>
        <select value={filters.promoterId} onChange={(event) => setFilters({ ...filters, promoterId: event.target.value })}>
          <option value="all">Todos promotores</option>
          {promoters.map((promoter) => <option key={promoter.id} value={promoter.id}>{promoter.name}</option>)}
        </select>
        <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
          <option value="all">Todos status</option>
          <option value="completed">Concluídas</option>
          <option value="pending">Pendentes</option>
          <option value="justified">Justificadas</option>
        </select>
      </div>
      <div className="gallery-grid">
        {gallery.map((photo, index) => {
          const store = stores.find((item) => item.id === photo.storeId);
          const promoter = promoters.find((item) => item.id === photo.promoterId);
          return (
            <article className="photo-tile" key={photo.id}>
              <div className={`photo-preview photo-${(index % 6) + 1}`}>
                <Image size={22} />
              </div>
              <strong>{store?.name || "Loja"}</strong>
              <span>{photo.type} - {promoter?.name || "Promotor"}</span>
              <small>{photo.time}</small>
            </article>
          );
        })}
      </div>
    </div>
  );
}
