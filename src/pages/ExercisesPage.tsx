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
      className="mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-16"
    >
      <header className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
          Biblioteca de movimientos
        </p>
        <h1 className="mt-4 text-balance text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
          Ejercicios de CrossFit.
        </h1>
        <p className="mt-5 text-pretty text-lg leading-8 text-slate-300">
          Consulta los movimientos disponibles y conoce la categoría de cada ejercicio.
        </p>
      </header>

      <section aria-labelledby="exercises-heading" className="mt-10 sm:mt-12">
        <h2 id="exercises-heading" className="sr-only">
          Lista de ejercicios
        </h2>

        {!result.success ? (
          <ErrorState
            title="No se pudieron cargar los ejercicios"
            message="Los datos locales no están disponibles en este momento."
          />
        ) : result.data.length === 0 ? (
          <EmptyState
            title="No hay ejercicios disponibles"
            message="Todavía no hay ejercicios para mostrar. Vuelve a intentarlo más adelante."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {result.data.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
