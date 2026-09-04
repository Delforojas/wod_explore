function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-slate-950"
      >
        Saltar al contenido principal
      </a>

      <header className="border-b border-slate-800">
        <div className="mx-auto max-w-6xl px-6 py-5 sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-400">
            WOD Explorer
          </p>
        </div>
      </header>

      <main
        id="main-content"
        className="mx-auto flex min-h-[calc(100vh-81px)] max-w-6xl items-center px-6 py-16 sm:px-8"
      >
        <section aria-labelledby="app-title" className="max-w-2xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
            Tu biblioteca de entrenamiento
          </p>
          <h1
            id="app-title"
            className="text-4xl font-bold tracking-tight text-white sm:text-6xl"
          >
            Explora tu próximo WOD.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Una colección clara de entrenamientos y ejercicios de CrossFit para
            consultar desde cualquier dispositivo.
          </p>
          <p className="mt-10 inline-flex rounded-full border border-orange-400/40 bg-orange-400/10 px-4 py-2 text-sm text-orange-200">
            El proyecto está listo para incorporar contenido local.
          </p>
        </section>
      </main>
    </div>
  )
}

export default App
