import { Link, useParams } from 'react-router-dom'
import { ErrorState } from '../components/ErrorState'
import { findWodById } from '../lib/findWodById'
import { loadWods } from '../lib/loadWods'

export function WodDetailPage() {
  const { id } = useParams<{ id: string }>()
  const result = loadWods()
  const wod = result.success ? findWodById(result.data, id) : undefined

  return (
    <main
      id="main-content"
      className="mx-auto min-h-[calc(100vh-81px)] max-w-4xl px-6 py-12 sm:px-8 sm:py-16"
    >
      <Link
        to="/wods"
        className="inline-flex rounded-md text-sm font-medium text-orange-300 hover:text-orange-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
      >
        Volver al catálogo de WODs
      </Link>

      <header className="mt-10 max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
          Detalle del entrenamiento
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {wod?.name ?? 'WOD no encontrado'}
        </h1>
      </header>

      <section className="mt-10">
        {!result.success ? (
          <ErrorState
            title="No se pudo cargar el WOD"
            message="Los datos locales no están disponibles en este momento."
          />
        ) : !wod ? (
          <ErrorState
            title="WOD no encontrado"
            message="El entrenamiento solicitado no existe. Regresa al catálogo para elegir otro WOD."
          />
        ) : (
          <article aria-labelledby="wod-detail-title">
            <h2 id="wod-detail-title" className="sr-only">
              Información de {wod.name}
            </h2>

            <dl className="grid gap-5 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:grid-cols-3">
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">Tipo</dt>
                <dd className="mt-2 text-base font-semibold text-orange-300">{wod.type}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">Nivel</dt>
                <dd className="mt-2 text-base font-semibold text-slate-100">{wod.level}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">
                  Estructura / duración
                </dt>
                <dd className="mt-2 text-base font-semibold text-slate-100">{wod.structure}</dd>
              </div>
            </dl>

            <section aria-labelledby="exercise-list-title" className="mt-8">
              <h2 id="exercise-list-title" className="text-2xl font-semibold text-white">
                Ejercicios y formato
              </h2>
              <ul className="mt-4 divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-900">
                {wod.exercises.map((exercise, index) => (
                  <li
                    key={`${exercise.exerciseId}-${exercise.repetitions}-${index}`}
                    className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="font-medium text-slate-100">{exercise.exerciseId}</span>
                    <span className="text-sm text-slate-400">
                      Repeticiones / formato: {exercise.repetitions}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="description-title" className="mt-8">
              <h2 id="description-title" className="text-2xl font-semibold text-white">
                Descripción
              </h2>
              <p className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 text-base leading-7 text-slate-300">
                {wod.description}
              </p>
            </section>
          </article>
        )}
      </section>
    </main>
  )
}
