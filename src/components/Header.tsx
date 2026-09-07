import { Link, NavLink } from 'react-router-dom'

const navigationItems = [
  { label: 'Inicio', path: '/', end: true },
  { label: 'WODs', path: '/wods' },
  { label: 'Ejercicios', path: '/exercises' },
  { label: 'Historial', path: '/history' },
]

export function Header() {
  return (
    <aside className="app-navigation">
      <div className="app-navigation-brand">
        <Link
          to="/"
          className="brand-link"
        >
          <span className="brand-mark" aria-hidden="true">W</span>
          <span className="brand-name" translate="no">WOD Explorer</span>
        </Link>
        <p className="brand-context">Catálogo local</p>
      </div>

      <nav className="app-navigation-nav" aria-label="Navegación principal">
        <p className="navigation-caption">Secciones</p>
        <ul className="app-header-links">
          {navigationItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `nav-link nav-link-layout${isActive ? ' nav-link-active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <p className="navigation-footer">Entrena. Registra. Repite.</p>
    </aside>
  )
}
