export function HomePage() {
  return (
    <div className="home-page">
      <header className="home-intro">
        <div className="home-intro__content">
          <h1 id="home-title">Entrena con contexto.</h1>
          <p>Encuentra una sesión, consulta sus movimientos y vuelve a lo que ya has registrado.</p>
        </div>
        <p className="home-intro__mode">OPERATE / ARCHIVO DE ENTRENAMIENTO</p>
      </header>

      <section className="home-workspace" aria-labelledby="home-workspace-title">
        <header className="home-workspace__heading">
          <div>
            <span className="home-section-label">Rutas de trabajo</span>
            <h2 id="home-workspace-title">Elige dónde continuar.</h2>
          </div>
          <p>Una ruta para empezar. Tres para entender y revisar tu trabajo.</p>
        </header>

        <div className="home-workspace__grid">
          <a className="home-wod-entry" href="#/wods" aria-label="Explorar WODs">
            <span className="home-wod-entry__label">Catálogo de sesiones</span>
            <strong>Explorar WODs</strong>
            <span className="home-wod-entry__copy">Busca por formato, nivel o nombre y abre el detalle del entrenamiento que quieres hacer.</span>
            <span className="home-wod-entry__action">Abrir catálogo <span aria-hidden="true">-&gt;</span></span>
          </a>

          <nav className="home-route-list" aria-label="Rutas de seguimiento">
            <a className="home-route" href="#/exercises">
              <span className="home-route__context">Movimiento</span>
              <span className="home-route__body">
                <strong>Ejercicios</strong>
                <span>Consulta movimientos y sus medidas.</span>
              </span>
              <span className="home-route__arrow" aria-hidden="true">-&gt;</span>
            </a>
            <a className="home-route" href="#/statistics">
              <span className="home-route__context">Tu rendimiento</span>
              <span className="home-route__body">
                <strong>Evolución</strong>
                <span>Revisa marcas personales e intentos.</span>
              </span>
              <span className="home-route__arrow" aria-hidden="true">-&gt;</span>
            </a>
            <a className="home-route" href="#/history">
              <span className="home-route__context">Lo que ya hiciste</span>
              <span className="home-route__body">
                <strong>Historial</strong>
                <span>Vuelve a tus sesiones y registros.</span>
              </span>
              <span className="home-route__arrow" aria-hidden="true">-&gt;</span>
            </a>
          </nav>
        </div>
      </section>

      <footer className="home-footer">
        <span>WOD Explorer / Entrenamiento y rendimiento</span>
        <p>El trabajo queda registrado para que puedas volver a él.</p>
      </footer>
    </div>
  );
}
