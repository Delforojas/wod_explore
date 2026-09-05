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
    <main
      id="main-content"
      className="page-container page-container-quiet"
    >
      <header className="page-header">
        <p className="page-kicker">
          Biblioteca de movimientos
        </p>
        <h1 className="page-title">
          Ejercicios de CrossFit.
        </h1>
        <p className="page-description">
          Consulta los movimientos disponibles y conoce la categoría de cada ejercicio.
        </p>
      </header>

      <section aria-labelledby="exercises-heading" className="page-section">
        <h2 id="exercises-heading" className="catalog-section-title">
          Movimientos disponibles
        </h2>

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
          <div className="catalog-grid">
            {result.data.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
