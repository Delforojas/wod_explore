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
    <main id="main-content" className="app-page history-page">
      <header className="catalog-intro history-page-header">
        <h1 className="catalog-title mt-0">
          Historial de entrenamientos.
        </h1>
        <p className="catalog-description">
          Revisa los WODs que has realizado y los resultados que decidiste guardar.
        </p>
        <p className="catalog-index">Archivo / Sesiones</p>
      </header>

      <section aria-labelledby="history-heading" className="history-stage">
        <div className="history-section-heading">
          <h2 id="history-heading" className="text-balance text-2xl font-bold tracking-[-0.02em] text-board-text">
            Sesiones registradas
          </h2>
          <p className="max-w-prose text-sm leading-6 text-board-muted">
            De la más reciente a la más antigua.
          </p>
        </div>

        {entries.length === 0 ? (
          <EmptyState
            kind="history"
            title="Historial vacío"
            message="Todavía no has registrado ningún entrenamiento."
          />
        ) : (
          <ol className="history-list" aria-label="Entrenamientos registrados">
            {entries.map((entry) => (
              <WorkoutHistoryItem
                key={entry.id}
                entry={entry}
                wod={findWodById(wods, entry.wodId)}
                onDelete={workoutHistory.deleteWorkout}
              />
            ))}
          </ol>
        )}
      </section>
    </main>
  )
}
