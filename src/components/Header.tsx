import { Link, NavLink } from 'react-router-dom'

const navigationItems = [
  { label: 'Inicio', path: '/', end: true },
  { label: 'WODs', path: '/wods' },
  { label: 'Ejercicios', path: '/exercises' },
  { label: 'Historial', path: '/history' },
]

export function Header() {
  return (
    <header className="app-header">
      <div className="app-header-container">
        <Link
          to="/"
          className="brand-link"
        >
          WOD Explorer
        </Link>

        <nav className="app-header-nav" aria-label="Navegación principal">
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
      </div>
    </header>
  )
}
