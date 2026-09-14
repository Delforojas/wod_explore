export function HomePage() {
  return (
    <div className="home-page">
      <header className="home-dashboard-header">
        <div className="home-dashboard-title">
          <span className="home-dashboard-title__mark" aria-hidden="true">W</span>
          <div>
            <h1 id="home-title">Tu archivo de WODs empieza aquí.</h1>
          </div>
        </div>
        <p className="home-dashboard-header__note">Explora, registra y vuelve a tu trabajo.</p>
      </header>

      <div className="home-dashboard-content">
        <section className="home-primary" aria-labelledby="home-primary-title">
          <div className="home-primary__copy">
            <p className="home-primary__label">WODs / Catálogo principal</p>
            <h2 id="home-primary-title">Encuentra tu próximo WOD.</h2>
            <p>
              Explora sesiones por tipo, nivel o nombre y entra en el detalle de
              cada entrenamiento.
            </p>
            <a className="button button--accent" href="#/wods">
              Explorar WODs <span aria-hidden="true">-&gt;</span>
            </a>
          </div>
          <div className="home-primary__visual" aria-hidden="true">
            <span className="home-primary__visual-ring" />
            <span className="home-primary__visual-axis" />
            <span className="home-primary__visual-word">WOD</span>
          </div>
          <footer className="home-primary__footer">
            <span>Sesiones para encontrar y repetir</span>
            <span>WOD Explorer</span>
          </footer>
        </section>

        <aside className="home-support" aria-label="Accesos del archivo">
          <a className="home-support-card" href="#/exercises">
            <span className="home-support-card__top">
              <span className="feature-context">Movimiento</span>
              <span className="home-support-card__mark" aria-hidden="true">Archivo</span>
            </span>
            <span className="home-support-card__body">
              <strong>Ejercicios</strong>
              <span>Consulta movimientos y encuentra el trabajo que necesitas.</span>
            </span>
            <span className="home-support-card__footer">
              Ver ejercicios <span aria-hidden="true">-&gt;</span>
            </span>
          </a>
          <a className="home-support-card" href="#/statistics">
            <span className="home-support-card__top">
              <span className="feature-context">Tu rendimiento</span>
              <span className="home-support-card__mark" aria-hidden="true">Datos</span>
            </span>
            <span className="home-support-card__body">
              <strong>Evolución</strong>
              <span>Tus resultados, marcas personales y el camino entre ambos.</span>
            </span>
            <span className="home-support-card__footer">
              Ver estadísticas <span aria-hidden="true">-&gt;</span>
            </span>
          </a>
          <a className="home-support-card home-support-card--accent" href="#/history">
            <span className="home-support-card__top">
              <span className="feature-context">Lo que ya hiciste</span>
              <span className="home-support-card__mark" aria-hidden="true">Registro</span>
            </span>
            <span className="home-support-card__body">
              <strong>Historial</strong>
              <span>Una lectura clara de todo lo que ya has hecho.</span>
            </span>
            <span className="home-support-card__footer">
              Leer historial <span aria-hidden="true">-&gt;</span>
            </span>
          </a>
        </aside>
      </div>

      <section className="home-bottom" aria-label="Principios del archivo">
        <div className="home-bottom__intro">
          <p>WOD Explorer</p>
          <strong>El trabajo queda registrado.</strong>
        </div>
        <div className="home-bottom__rule" aria-hidden="true" />
        <p className="home-bottom__copy">
          Consulta lo que hiciste, entiende tu evolución y vuelve a entrenar con
          contexto.
        </p>
      </section>
    </div>
  );
}
