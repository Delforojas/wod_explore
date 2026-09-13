import type { ReactNode } from "react";

import { useAuth } from "../auth/useAuth";

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
}

const navigation = [
  ["Inicio", "/"],
  ["WODs", "/wods"],
  ["Ejercicios", "/exercises"],
  ["Historial", "/history"],
  ["Estadísticas", "/statistics"],
] as const;

export function Layout({ children, currentPage }: LayoutProps) {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#/">
          <span className="brand-mark" aria-hidden="true">W</span>
          <span>WOD Explorer</span>
        </a>
        <div className="session-actions">
          {user ? (
            <>
              <span className="user-name">{user.name}</span>
              <button className="button button--quiet" type="button" onClick={logout}>Salir</button>
            </>
          ) : (
            <>
              <a className="button button--quiet" href="#/login">Entrar</a>
              <a className="button button--accent" href="#/register">Crear cuenta</a>
            </>
          )}
        </div>
      </header>

      <div className="app-frame">
        <nav className="side-nav" aria-label="Navegación principal">
          <span className="nav-caption">Archivo de entrenamiento</span>
          {navigation.map(([label, path]) => (
            <a
              className={`nav-link ${currentPage === path.slice(1) || (path === "/" && currentPage === "home") ? "nav-link--active" : ""}`}
              key={path}
              href={`#${path}`}
            >
              <span>{label}</span>
              <span aria-hidden="true">-&gt;</span>
            </a>
          ))}
        </nav>
        <main className="page-content">{children}</main>
      </div>

      <nav className="bottom-nav" aria-label="Navegación móvil">
        {navigation.map(([label, path]) => (
          <a key={path} href={`#${path}`}>
            <span>{label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
