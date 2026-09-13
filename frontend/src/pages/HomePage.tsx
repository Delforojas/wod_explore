export function HomePage() {
  return (
    <div className="home-page">
      <section className="home-intro">
        <h1>Tu archivo de WODs empieza aquí.</h1>
        <p className="intro-copy">
          Explora sesiones, consulta ejercicios y guarda el trabajo que quieres
          repetir. WOD Explorer reúne el catálogo y tu evolución en un mismo lugar.
        </p>
        <div className="action-row">
          <a className="button button--accent" href="#/wods">Explorar WODs</a>
          <a className="text-link" href="#/exercises">Ver ejercicios</a>
        </div>
      </section>
      <section className="home-grid" aria-label="Áreas de entrenamiento">
        <a className="feature-panel feature-panel--dark" href="#/wods">
          <span className="feature-title">WODs</span>
          <span className="feature-context">Catálogo principal</span>
          <span className="feature-copy">Busca por tipo, nivel o nombre y entra en el detalle de cada sesión.</span>
          <span className="feature-arrow" aria-hidden="true">-&gt;</span>
        </a>
        <a className="feature-panel" href="#/statistics">
          <span className="feature-title">Evolución</span>
          <span className="feature-context">Tu rendimiento</span>
          <span className="feature-copy">Tus resultados, marcas personales y el camino entre ambos.</span>
          <span className="feature-arrow" aria-hidden="true">-&gt;</span>
        </a>
        <a className="feature-panel feature-panel--accent" href="#/history">
          <span className="feature-title">Historial</span>
          <span className="feature-context">Lo que ya hiciste</span>
          <span className="feature-copy">Una lectura clara de todo lo que ya has hecho.</span>
          <span className="feature-arrow" aria-hidden="true">-&gt;</span>
        </a>
      </section>
    </div>
  );
}
