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

  function isCurrentPage(path: string) {
    return currentPage === path.slice(1) || (path === "/" && currentPage === "home");
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Saltar al contenido</a>
      <header className="topbar">
        <a className="brand" href="#/">
          <span className="brand-mark" aria-hidden="true">W</span>
          <span className="brand-copy">
            <strong>WOD Explorer</strong>
            <small>Archivo de entrenamiento</small>
          </span>
        </a>
        <div className="session-actions">
          {user ? (
            <>
              <a
                className={`profile-link ${currentPage === "profile" ? "profile-link--active" : ""}`}
                href="#/profile"
                aria-current={currentPage === "profile" ? "page" : undefined}
                aria-label={`Abrir perfil de ${user.name}`}
              >
                <span>Perfil</span>
                <span className="user-name">{user.name}</span>
              </a>
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
              className={`nav-link ${isCurrentPage(path) ? "nav-link--active" : ""}`}
              key={path}
              href={`#${path}`}
              aria-current={isCurrentPage(path) ? "page" : undefined}
            >
              <span className="nav-link__body">
                <span>{label}</span>
              </span>
              <span aria-hidden="true">-&gt;</span>
            </a>
          ))}
        </nav>
        <main className="page-content" id="main-content" tabIndex={-1}>{children}</main>
      </div>

      <nav className="bottom-nav" aria-label="Navegación móvil">
        {navigation.map(([label, path]) => (
          <a
            className={`bottom-nav__link ${isCurrentPage(path) ? "bottom-nav__link--active" : ""}`}
            key={path}
            href={`#${path}`}
            aria-current={isCurrentPage(path) ? "page" : undefined}
          >
            <span>{label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
