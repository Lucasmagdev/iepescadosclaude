export function formatMoney(value) {
  if (value === "" || value === null || value === undefined) return "";
  const numeric = typeof value === "number" ? value : Number(String(value).replace(",", ".").replace(/[^\d.]/g, ""));
  if (Number.isNaN(numeric)) return String(value);
  return numeric.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function nowLabel() {
  return new Date().toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function percent(part, total) {
  return total ? Math.round((part / total) * 100) : 0;
}

