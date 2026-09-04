import { Link } from 'react-router-dom'
import type { WorkoutHistoryEntry } from '../types/workoutHistory'
import type { Wod } from '../types/wod'

interface WorkoutHistoryItemProps {
  entry: WorkoutHistoryEntry
  wod: Wod | undefined
}

export function WorkoutHistoryItem({ entry, wod }: WorkoutHistoryItemProps) {
  const titleId = `workout-history-${entry.id}-title`

  return (
    <li>
      <article
        aria-labelledby={titleId}
        className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-slate-950/20 sm:p-6"
      >
        <header className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-400">
              {wod?.type ?? 'WOD no disponible'}
            </p>
            <h2 id={titleId} className="mt-2 break-words text-2xl font-semibold text-white">
              {wod ? (
                <Link
                  to={`/wods/${wod.id}`}
                  className="rounded-md hover:text-orange-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400 focus-visible:ring-2 focus-visible:ring-orange-400/40"
                >
                  {wod.name}
                </Link>
              ) : (
                'WOD no disponible'
              )}
            </h2>
          </div>
          <time dateTime={entry.date} className="shrink-0 text-sm text-slate-400">
            {entry.date}
          </time>
        </header>

        <dl className="mt-5 grid gap-4 border-t border-slate-800 pt-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-[0.14em] text-slate-400">Tipo</dt>
            <dd className="mt-1 text-sm font-medium text-slate-200">
              {wod?.type ?? 'No disponible'}
            </dd>
          </div>
          {entry.result ? (
            <div>
              <dt className="text-xs uppercase tracking-[0.14em] text-slate-400">Resultado</dt>
              <dd className="mt-1 break-words text-sm font-medium text-slate-200">{entry.result}</dd>
            </div>
          ) : null}
        </dl>

        {entry.notes ? (
          <div className="mt-5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Notas
            </h3>
            <p className="mt-2 break-words text-sm leading-6 text-slate-300">{entry.notes}</p>
          </div>
        ) : null}
      </article>
    </li>
  )
}
