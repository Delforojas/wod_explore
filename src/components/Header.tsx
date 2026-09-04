import { Link } from 'react-router-dom'

const navigationItems = [
  { label: 'Inicio', path: '/' },
  { label: 'WODs', path: '/wods' },
  { label: 'Ejercicios', path: '/exercises' },
]

export function Header() {
  return (
    <header className="border-b border-slate-800">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <Link
          to="/"
          className="w-fit text-sm font-semibold uppercase tracking-[0.24em] text-orange-400 transition-colors hover:text-orange-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
        >
          WOD Explorer
        </Link>

        <nav aria-label="Navegación principal">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-slate-300">
            {navigationItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="inline-flex rounded-md py-1 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
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
