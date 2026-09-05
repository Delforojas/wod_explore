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
      className="page-container-narrow"
    >
      <nav aria-label="Navegación de detalle" className="detail-back-nav">
        <Link
          to="/wods"
          className="button-link"
        >
          Volver al catálogo de WODs
        </Link>
      </nav>

      <header className="detail-header">
        <div className="detail-heading">
          <h1 className="page-title mt-0 break-words">
            {wod?.name ?? 'WOD no encontrado'}
          </h1>
        </div>
        {wod ? (
          <div className="detail-actions">
            <FavoriteButton
              isFavorite={favorites.isFavorite(wod.id)}
              onToggle={() => favorites.toggleFavorite(wod.id)}
              wodName={wod.name}
            />
          </div>
        ) : null}
      </header>

      <section className="page-section detail-content">
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

            <dl className="detail-facts">
              <div className="detail-fact">
                <dt className="card-label">Tipo</dt>
                <dd className="mt-2 break-words text-base font-semibold text-board-accent">
                  {wod.type}
                </dd>
              </div>
              <div className="detail-fact">
                <dt className="card-label">Nivel</dt>
                <dd className="mt-2 break-words text-base font-semibold text-board-text">
                  {wod.level}
                </dd>
              </div>
              <div className="detail-fact detail-fact-structure">
                <dt className="card-label">
                  Estructura / duración
                </dt>
                <dd className="mt-2 break-words text-base font-semibold text-board-text">
                  {wod.structure}
                </dd>
              </div>
            </dl>

            <section aria-labelledby="exercise-list-title" className="detail-section">
              <h2 id="exercise-list-title" className="text-balance text-2xl font-bold tracking-[-0.02em] text-board-text">
                Ejercicios y formato
              </h2>
              <ul className="detail-list">
                {wod.exercises.map((exercise, index) => (
                  <li
                    key={`${exercise.exerciseId}-${exercise.repetitions}-${index}`}
                    className="detail-list-row"
                  >
                    <span className="detail-exercise-name">
                      {exercise.exerciseId}
                    </span>
                    <span className="detail-exercise-format">
                      Repeticiones / formato: {exercise.repetitions}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="description-title" className="detail-section">
              <h2 id="description-title" className="text-balance text-2xl font-bold tracking-[-0.02em] text-board-text">
                Descripción
              </h2>
              <p className="detail-description">
                {wod.description}
              </p>
            </section>

            <div className="detail-log">
              <WorkoutLogForm
                wodId={wod.id}
                addWorkout={workoutHistory.addWorkout}
              />
            </div>
          </article>
        )}
      </section>
    </main>
  )
}
