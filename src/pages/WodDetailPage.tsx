import { Link, useParams } from 'react-router-dom'
import { ErrorState } from '../components/ErrorState'
import { FavoriteButton } from '../components/FavoriteButton'
import { WorkoutLogForm } from '../components/WorkoutLogForm'
import type { UseFavoritesResult } from '../hooks/useFavorites'
import type { UseWorkoutHistoryResult } from '../hooks/useWorkoutHistory'
import { findWodById } from '../lib/findWodById'
import { loadWods } from '../lib/loadWods'

interface WodDetailPageProps {
  favorites: UseFavoritesResult
  workoutHistory: UseWorkoutHistoryResult
}

export function WodDetailPage({ favorites, workoutHistory }: WodDetailPageProps) {
  const { id } = useParams<{ id: string }>()
  const result = loadWods()
  const wod = result.success ? findWodById(result.data, id) : undefined

  return (
    <main
      id="main-content"
      className="mx-auto max-w-4xl px-4 py-10 sm:px-8 sm:py-16"
    >
      <Link
        to="/wods"
        className="inline-flex min-h-11 items-center touch-manipulation rounded-md py-2 text-sm font-medium text-orange-300 hover:text-orange-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400 focus-visible:ring-2 focus-visible:ring-orange-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
      >
        Volver al catálogo de WODs
      </Link>

      <header className="mt-10 flex max-w-2xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
            Detalle del entrenamiento
          </p>
          <h1 className="mt-4 break-words text-balance text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            {wod?.name ?? 'WOD no encontrado'}
          </h1>
        </div>
        {wod ? (
          <FavoriteButton
            isFavorite={favorites.isFavorite(wod.id)}
            onToggle={() => favorites.toggleFavorite(wod.id)}
            wodName={wod.name}
          />
        ) : null}
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

            <dl className="grid gap-5 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:grid-cols-3 sm:p-6">
              <div className="min-w-0">
                <dt className="text-xs uppercase tracking-[0.14em] text-slate-400">Tipo</dt>
                <dd className="mt-2 break-words text-base font-semibold text-orange-300">
                  {wod.type}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-xs uppercase tracking-[0.14em] text-slate-400">Nivel</dt>
                <dd className="mt-2 break-words text-base font-semibold text-slate-100">
                  {wod.level}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-xs uppercase tracking-[0.14em] text-slate-400">
                  Estructura / duración
                </dt>
                <dd className="mt-2 break-words text-base font-semibold text-slate-100">
                  {wod.structure}
                </dd>
              </div>
            </dl>

            <section aria-labelledby="exercise-list-title" className="mt-8">
              <h2 id="exercise-list-title" className="text-balance text-2xl font-semibold text-white">
                Ejercicios y formato
              </h2>
              <ul className="mt-4 divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-900">
                {wod.exercises.map((exercise, index) => (
                  <li
                    key={`${exercise.exerciseId}-${exercise.repetitions}-${index}`}
                    className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="break-words font-medium text-slate-100">
                      {exercise.exerciseId}
                    </span>
                    <span className="text-sm text-slate-400">
                      Repeticiones / formato: {exercise.repetitions}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="description-title" className="mt-8">
              <h2 id="description-title" className="text-balance text-2xl font-semibold text-white">
                Descripción
              </h2>
              <p className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 text-base leading-7 text-pretty text-slate-300 sm:p-6">
                {wod.description}
              </p>
            </section>

            <WorkoutLogForm
              wodId={wod.id}
              addWorkout={workoutHistory.addWorkout}
            />
          </article>
        )}
      </section>
    </main>
  )
}
