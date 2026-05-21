import React from "react";
import { Bell, ClipboardCheck, Home, MessageSquareWarning, MoreHorizontal } from "lucide-react";

const items = [
  { id: "route", label: "Roteiro", icon: Home },
  { id: "tasks", label: "Tarefas", icon: ClipboardCheck },
  { id: "issues", label: "Ocorrências", icon: MessageSquareWarning },
  { id: "notifications", label: "Notificações", icon: Bell },
  { id: "more", label: "Mais", icon: MoreHorizontal }
];

export function BottomNav({ active, onNavigate }) {
  return (
    <nav className="bottom-nav" aria-label="Navegação principal">
      {items.map(({ id, label, icon: Icon }) => (
        <button className={active === id ? "active" : ""} key={id} onClick={() => onNavigate(id)}>
          <Icon size={20} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
