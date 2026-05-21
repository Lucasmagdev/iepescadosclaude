import React from "react";
import { BriefcaseBusiness, ChevronRight, UserRound } from "lucide-react";
import { Logo } from "../components/Brand";

export function LoginScreen({ role, setRole, onLogin }) {
  return (
    <section className="login-screen">
      <div className="login-top">
        <Logo />
        <h1>Gestão de Promotores</h1>
        <p>Execução de roteiro, auditoria de gôndola e evidências de loja para IE Pescados.</p>
      </div>
      <form className="login-panel" onSubmit={onLogin}>
        <div className="role-selector" role="tablist" aria-label="Perfil de acesso">
          <button type="button" className={role === "promotor" ? "selected" : ""} onClick={() => setRole("promotor")}>
            <UserRound size={18} />
            Sou Promotor
          </button>
          <button type="button" className={role === "gestor" ? "selected" : ""} onClick={() => setRole("gestor")}>
            <BriefcaseBusiness size={18} />
            Sou Gestor
          </button>
        </div>
        <div className="demo-credentials">
          <strong>Usuário demonstração</strong>
          <span>promotor@iepescados.com.br</span>
          <span>Senha: 123456</span>
        </div>
        <label>
          E-mail
          <input type="email" defaultValue="promotor@iepescados.com.br" />
        </label>
        <label>
          Senha
          <input type="password" defaultValue="123456" />
        </label>
        <button className="primary-button" type="submit">
          Entrar
          <ChevronRight size={20} />
        </button>
      </form>
    </section>
  );
}
