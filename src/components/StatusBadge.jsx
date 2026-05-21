import React from "react";

export const statusLabels = {
  pending: "Pendente",
  progress: "Em andamento",
  completed: "Concluída",
  justified: "Justificada",
  synced: "Sincronizado",
  unsynced: "Pendente de sync"
};

export function StatusBadge({ status }) {
  return <span className={`status ${status}`}>{statusLabels[status] || status}</span>;
}
