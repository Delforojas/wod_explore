import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <main id="main-content" className="page-container">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-copy">
          <h1 id="home-title" className="page-title mt-0">
            Encuentra tu próximo WOD.
          </h1>
          <p className="page-description">
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
      </section>
    </main>
  )
}
