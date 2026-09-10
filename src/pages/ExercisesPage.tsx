import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { ExerciseCard } from '../components/ExerciseCard'
import { loadExercises } from '../lib/loadExercises'
import type { Exercise } from '../types/exercise'

interface ExercisesPageProps {
  exercises?: Exercise[]
}

export function ExercisesPage({ exercises }: ExercisesPageProps = {}) {
  const result =
    exercises === undefined
      ? loadExercises()
      : {
          success: true as const,
          data: exercises,
        }

  return (
    <main id="main-content" className="app-page catalog-page exercises-page">
      <header className="catalog-intro">
        <h1 className="catalog-title">
          Ejercicios de CrossFit.
        </h1>
        <p className="catalog-description">
          Consulta los movimientos disponibles y conoce la categoría de cada ejercicio.
        </p>
        <p className="catalog-index">Biblioteca / Movimientos</p>
      </header>

      <section aria-labelledby="exercises-heading" className="catalog-stage">
        <div className="catalog-stage-heading">
        <h2 id="exercises-heading" className="catalog-section-title">
          Movimientos disponibles
        </h2>
        <span className="catalog-stage-rule" aria-hidden="true" />
        </div>

        {!result.success ? (
          <ErrorState
            title="No se pudieron cargar los ejercicios"
            message="Los datos locales no están disponibles en este momento."
          />
        ) : result.data.length === 0 ? (
          <EmptyState
            kind="exercises"
            title="No hay ejercicios disponibles"
            message="Todavía no hay ejercicios para mostrar. Vuelve a intentarlo más adelante."
          />
        ) : (
          <div className="exercise-list">
            {result.data.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
