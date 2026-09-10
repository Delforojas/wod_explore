import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <main id="main-content" className="app-page home-page">
      <section className="home-deck" aria-labelledby="home-title">
        <div className="home-title-block">
          <h1 id="home-title" className="home-title">
            Encuentra tu
            <span>próximo WOD.</span>
          </h1>
          <p className="home-description">
            Consulta entrenamientos con su formato, nivel y resumen para encontrar tu
            próximo reto. Guarda tus favoritos y revisa tus sesiones cuando quieras.
          </p>

          <nav className="home-actions" aria-label="Accesos principales">
            <Link to="/wods" className="button-primary">
              Explorar WODs
            </Link>
            <Link to="/history" className="button-secondary">
              Ver historial
            </Link>
          </nav>
        </div>

        <aside className="home-feature" aria-label="Acceso al catálogo de entrenamientos">
          <span className="home-feature-label">Catálogo</span>
          <span className="home-feature-word" aria-hidden="true">WOD</span>
          <span className="home-feature-note">Entrenamientos, favoritos e historial</span>
        </aside>

        <div className="home-deck-footer" aria-hidden="true">
          <span>01</span>
          <span>Consulta el catálogo local</span>
          <span>→</span>
        </div>
      </section>
    </main>
  )
}
