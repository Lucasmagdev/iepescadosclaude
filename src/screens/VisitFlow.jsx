import React, { useMemo, useState } from "react";
import { AlertTriangle, Camera, Check, ChevronLeft, ChevronRight, PackageCheck, Store } from "lucide-react";
import { products, stores } from "../data/mockData";
import { formatMoney, nowLabel } from "../utils/format";

const occurrenceTypes = [
  "Sem ocorrência",
  "Ruptura de produto",
  "Preço divergente",
  "Sem espaço na gôndola",
  "Loja fechada",
  "Produto vencido"
];

export function VisitFlow({ visit, updateVisit, updateVisitItem, onBack }) {
  const initialStep = visit.status === "completed" ? 5 : visit.beforePhoto ? 2 : visit.status === "progress" ? 1 : 0;
  const [step, setStep] = useState(initialStep);
  const [productIndex, setProductIndex] = useState(0);
  const [validationError, setValidationError] = useState("");
  const store = stores.find((item) => item.id === visit.storeId) || stores[0];
  const progress = [12, 28, 56, 72, 88, 100][step];

  const checkIn = () => {
    updateVisit(visit.id, { status: "progress", checkInAt: visit.checkInAt || nowLabel() });
    setStep(1);
  };

  const registerPhoto = (field, nextStep) => {
    updateVisit(visit.id, { [field]: `${field}-${Date.now()}` });
    setStep(nextStep);
  };

  const finish = () => {
    updateVisit(visit.id, { status: "completed", checkOutAt: nowLabel(), afterPhoto: visit.afterPhoto || `afterPhoto-${Date.now()}` });
    setStep(5);
  };

  const goBack = () => {
    if (step === 2 && productIndex > 0) {
      setProductIndex((current) => current - 1);
      setValidationError("");
      return;
    }
    if (step > 0 && step < 5) setStep(step - 1);
    else onBack();
  };

  return (
    <section className="phone-screen">
      <header className="top-bar">
        <button className="icon-button" aria-label="Voltar" onClick={goBack}>
          <ChevronLeft size={21} />
        </button>
        <span className="top-title">Visita</span>
        <span className="top-spacer" />
      </header>
      <div className="progress-track">
        <span style={{ width: `${progress}%` }} />
      </div>
      <div className="content">
        <div className="visit-store">
          <Store size={21} />
          <div>
            <strong>{store.name}</strong>
            <span>{store.address} - {store.city}</span>
          </div>
        </div>
        {step === 0 && <CheckInStep store={store} onNext={checkIn} />}
        {step === 1 && <PhotoStep title="antes da gôndola" field="beforePhoto" value={visit.beforePhoto} button="Registrar foto antes" onNext={() => registerPhoto("beforePhoto", 2)} />}
        {step === 2 && (
          <ProductWizard
            visit={visit}
            productIndex={productIndex}
            setProductIndex={setProductIndex}
            updateVisitItem={updateVisitItem}
            validationError={validationError}
            setValidationError={setValidationError}
            onDone={() => setStep(3)}
          />
        )}
        {step === 3 && <OccurrenceStep visit={visit} updateVisit={updateVisit} onNext={() => setStep(4)} />}
        {step === 4 && <PhotoStep title="depois da gôndola" field="afterPhoto" value={visit.afterPhoto} button="Registrar foto depois" onNext={finish} />}
        {step === 5 && <SuccessStep visit={visit} onBack={onBack} />}
      </div>
    </section>
  );
}

function CheckInStep({ store, onNext }) {
  return (
    <div className="photo-step">
      <div className="checkin-panel">
        <Store size={38} />
        <h2>Check-in na loja</h2>
        <p>{store.name}</p>
        <span>{store.routeWindow}</span>
      </div>
      <button className="primary-button" onClick={onNext}>
        Iniciar visita
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

function PhotoStep({ title, field, value, button, onNext }) {
  return (
    <div className="photo-step">
      <div className={value ? "camera-frame captured" : "camera-frame"}>
        <Camera size={42} />
        <span>Foto {title}</span>
        <small>{value ? "Imagem simulada registrada com sucesso" : "Toque para simular captura de imagem"}</small>
        {value && <div className="photo-proof">Preview {field === "beforePhoto" ? "antes" : "depois"}</div>}
      </div>
      <button className="primary-button" onClick={onNext}>
        <Camera size={19} />
        {value ? "Avançar" : button}
      </button>
    </div>
  );
}

function ProductWizard({ visit, productIndex, setProductIndex, updateVisitItem, validationError, setValidationError, onDone }) {
  const item = visit.items[productIndex];
  const product = products.find((candidate) => candidate.sku === item.sku) || products[0];
  const availableCount = useMemo(() => visit.items.filter((candidate) => candidate.available).length, [visit.items]);
  const isLast = productIndex === visit.items.length - 1;

  const validateAndContinue = () => {
    if (item.available && (!item.price || !item.stock)) {
      setValidationError("Informe preço e estoque para produto disponível.");
      return;
    }
    setValidationError("");
    if (isLast) onDone();
    else setProductIndex((current) => current + 1);
  };

  return (
    <div className="product-wizard">
      <div className="wizard-head">
        <span className="eyebrow">Produto {productIndex + 1} de {visit.items.length}</span>
        <h2>{product.name}</h2>
        <p>{item.sku} - {product.category}</p>
      </div>
      <div className="wizard-progress">
        {visit.items.map((candidate, index) => (
          <span className={index <= productIndex ? "active" : ""} key={candidate.sku} />
        ))}
      </div>
      <article className="product-card focused">
        <div className="availability-block">
          <strong>Produto disponível na gôndola?</strong>
          <div className="yes-no" role="group" aria-label={`Disponibilidade ${product.name}`}>
            <button className={item.available ? "selected" : ""} onClick={() => updateVisitItem(visit.id, item.sku, { available: true })}>
              Sim
            </button>
            <button className={!item.available ? "selected" : ""} onClick={() => updateVisitItem(visit.id, item.sku, { available: false })}>
              Não
            </button>
          </div>
        </div>
        {item.available ? (
          <div className="product-fields">
            <label>
              Preço IE
              <input value={formatMoney(item.price)} onChange={(event) => updateVisitItem(visit.id, item.sku, { price: event.target.value })} />
            </label>
            <label>
              Estoque
              <input inputMode="numeric" value={item.stock} onChange={(event) => updateVisitItem(visit.id, item.sku, { stock: event.target.value })} />
            </label>
            <label>
              Validade
              <input placeholder="DD/MM/AAAA" value={item.expiryDate} onChange={(event) => updateVisitItem(visit.id, item.sku, { expiryDate: event.target.value })} />
            </label>
            <label>
              Preço concorrente
              <input value={formatMoney(item.competitorPrice)} placeholder="Opcional" onChange={(event) => updateVisitItem(visit.id, item.sku, { competitorPrice: event.target.value })} />
            </label>
          </div>
        ) : (
          <div className="rupture-note">
            <AlertTriangle size={18} />
            <span>Ruptura registrada para este SKU.</span>
          </div>
        )}
      </article>
      <div className="wizard-summary">
        <span><b>{availableCount}</b> disponíveis</span>
        <span><b>{visit.items.length - availableCount}</b> rupturas</span>
      </div>
      {validationError && <div className="validation-message">{validationError}</div>}
      <button className="primary-button sticky-action" onClick={validateAndContinue}>
        {isLast ? "Revisar ocorrência" : "Próximo produto"}
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

function OccurrenceStep({ visit, updateVisit, onNext }) {
  const ruptureCount = visit.items.filter((item) => !item.available).length;
  return (
    <div className="occurrence-step">
      <div className="section-heading compact">
        <div>
          <span className="eyebrow">Resumo da auditoria</span>
          <h2>Ocorrência da visita</h2>
        </div>
      </div>
      <div className="visit-recap">
        <span><b>{visit.items.length - ruptureCount}</b> SKUs disponíveis</span>
        <span><b>{ruptureCount}</b> rupturas</span>
        <span><b>{visit.beforePhoto ? "Sim" : "Não"}</b> foto antes</span>
      </div>
      <label>
        Tipo
        <select value={visit.occurrenceType || "Sem ocorrência"} onChange={(event) => updateVisit(visit.id, { occurrenceType: event.target.value })}>
          {occurrenceTypes.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
      </label>
      <label>
        Observação
        <textarea
          placeholder="Ex.: sem espaço na gôndola, etiqueta divergente, ruptura parcial..."
          value={visit.occurrenceNote || ""}
          onChange={(event) => updateVisit(visit.id, { occurrenceNote: event.target.value })}
        />
      </label>
      <button className="primary-button" onClick={onNext}>
        Continuar para foto depois
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

function SuccessStep({ visit, onBack }) {
  const ruptureCount = visit.items.filter((item) => !item.available).length;
  return (
    <div className="success-step">
      <div className="success-icon">
        <Check size={46} />
      </div>
      <h2>Tudo certo! Visita concluída</h2>
      <p>Check-out registrado. A visita ficará pendente de sync até a próxima sincronização.</p>
      <div className="success-meta">
        <span>Check-in: {visit.checkInAt || "registrado"}</span>
        <span>Check-out: {visit.checkOutAt || "registrado"}</span>
        <span>SKUs auditados: {visit.items.length}</span>
        <span>Rupturas: {ruptureCount}</span>
        <span>Ocorrência: {visit.occurrenceType || "Sem ocorrência"}</span>
      </div>
      <button className="primary-button" onClick={onBack}>
        Voltar ao roteiro
      </button>
    </div>
  );
}
