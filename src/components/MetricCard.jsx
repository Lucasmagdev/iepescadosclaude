import React from "react";

export function MetricCard({ icon: Icon, value, label }) {
  return (
    <article className="metric-card">
      <Icon size={20} />
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}
