import { Link } from 'react-router-dom'

const navigationItems = [
  { label: 'Inicio', path: '/' },
  { label: 'WODs', path: '/wods' },
  { label: 'Ejercicios', path: '/exercises' },
  { label: 'Historial', path: '/history' },
]

export function Header() {
  return (
    <header className="border-b border-slate-800">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-5">
        <Link
          to="/"
          className="inline-flex min-h-11 w-fit items-center touch-manipulation rounded-md text-sm font-semibold uppercase tracking-[0.24em] text-orange-400 transition-colors hover:text-orange-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400 focus-visible:ring-2 focus-visible:ring-orange-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          WOD Explorer
        </Link>

        <nav className="w-full sm:w-auto" aria-label="Navegación principal">
          <ul className="flex flex-wrap gap-1 text-sm font-medium text-slate-300 sm:gap-x-2">
            {navigationItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="inline-flex min-h-11 items-center touch-manipulation rounded-md px-2.5 py-2 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 focus-visible:ring-2 focus-visible:ring-orange-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
