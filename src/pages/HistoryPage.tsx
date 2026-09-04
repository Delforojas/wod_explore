import { EmptyState } from '../components/EmptyState'
import { WorkoutHistoryItem } from '../components/WorkoutHistoryItem'
import type { UseWorkoutHistoryResult } from '../hooks/useWorkoutHistory'
import { findWodById } from '../lib/findWodById'
import type { Wod } from '../types/wod'

interface HistoryPageProps {
  workoutHistory: UseWorkoutHistoryResult
  wods: Wod[]
}

export function HistoryPage({ workoutHistory, wods }: HistoryPageProps) {
  const { entries } = workoutHistory

  return (
    <main
      id="main-content"
      className="mx-auto max-w-4xl px-4 py-10 sm:px-8 sm:py-16"
    >
      <header className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
          Tu progreso
        </p>
        <h1 className="mt-4 text-balance text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
          Historial de entrenamientos.
        </h1>
        <p className="mt-5 text-pretty text-lg leading-8 text-slate-300">
          Revisa los WODs que has realizado y los resultados que decidiste guardar.
        </p>
      </header>

      <section aria-labelledby="history-heading" className="mt-10 sm:mt-12">
        <h2 id="history-heading" className="sr-only">
          Historial de entrenamientos
        </h2>

        {entries.length === 0 ? (
          <EmptyState
            title="Historial vacío"
            message="Todavía no has registrado ningún entrenamiento."
          />
        ) : (
          <ol className="grid gap-4" aria-label="Entrenamientos registrados">
            {entries.map((entry) => (
              <WorkoutHistoryItem
                key={entry.id}
                entry={entry}
                wod={findWodById(wods, entry.wodId)}
              />
            ))}
          </ol>
        )}
      </section>
    </main>
  )
}
