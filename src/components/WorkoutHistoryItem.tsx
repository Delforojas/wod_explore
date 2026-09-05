import { Link } from 'react-router-dom'
import { DeleteWorkoutButton } from './DeleteWorkoutButton'
import type { WorkoutHistoryEntry } from '../types/workoutHistory'
import type { Wod } from '../types/wod'

interface WorkoutHistoryItemProps {
  entry: WorkoutHistoryEntry
  wod: Wod | undefined
  onDelete: (entryId: string) => void
}

export function WorkoutHistoryItem({ entry, wod, onDelete }: WorkoutHistoryItemProps) {
  const titleId = `workout-history-${entry.id}-title`

  return (
    <li className="history-entry">
      <article
        aria-labelledby={titleId}
        className="history-entry-content"
      >
        <header className="history-entry-header">
          <div className="history-entry-date">
            <time dateTime={entry.date} className="font-mono text-lg font-bold tracking-[-0.02em] text-board-text">
              {entry.date}
            </time>
            <span className="history-entry-date-label">
              Sesión registrada
            </span>
          </div>
          <div className="min-w-0">
            <p className="card-label text-board-accent">
              {wod?.type ?? 'WOD no disponible'}
            </p>
            <h2 id={titleId} className="history-entry-title">
              {wod ? (
                <Link
                  to={`/wods/${wod.id}`}
                  className="history-entry-link"
                >
                  {wod.name}
                </Link>
              ) : (
                'WOD no disponible'
              )}
            </h2>
          </div>
        </header>

        <dl className="history-entry-facts">
          <div>
            <dt className="card-label">Tipo</dt>
            <dd className="mt-1 text-sm font-medium text-board-text">
              {wod?.type ?? 'No disponible'}
            </dd>
          </div>
          {entry.result ? (
            <div>
              <dt className="card-label">Resultado</dt>
              <dd className="mt-1 break-words text-sm font-medium text-board-text">{entry.result}</dd>
            </div>
          ) : null}
        </dl>

        {entry.notes ? (
          <div className="history-entry-notes">
            <h3 className="card-label">
              Notas
            </h3>
            <p className="mt-2 break-words text-sm leading-6 text-board-muted">{entry.notes}</p>
          </div>
        ) : null}

        <footer className="history-entry-footer">
          <DeleteWorkoutButton
            entryId={entry.id}
            wodName={wod?.name ?? 'WOD no disponible'}
            date={entry.date}
            onDelete={onDelete}
          />
        </footer>
      </article>
    </li>
  )
}
