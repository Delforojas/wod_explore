import { Link } from 'react-router-dom'
import { FavoriteButton } from './FavoriteButton'
import type { Wod } from '../types/wod'

interface WodCardProps {
  wod: Wod
  isFavorite: boolean
  onToggleFavorite: () => void
}

export function WodCard({ wod, isFavorite, onToggleFavorite }: WodCardProps) {
  const titleId = `wod-${wod.id}-title`

  return (
    <article
      aria-labelledby={titleId}
      className="flex h-full min-w-0 flex-col rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-slate-950/20"
    >
      <header className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-400">
            {wod.type}
          </p>
          <h2 id={titleId} className="mt-2 break-words text-balance text-2xl font-semibold text-white">
            {wod.name}
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={onToggleFavorite}
            wodName={wod.name}
          />
          <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-medium text-slate-300">
            {wod.level}
          </span>
        </div>
      </header>

      <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-slate-800 py-4">
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-slate-400">Tipo</dt>
          <dd className="mt-1 text-sm font-medium text-slate-200">{wod.type}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-slate-400">Nivel</dt>
          <dd className="mt-1 text-sm font-medium text-slate-200">{wod.level}</dd>
        </div>
      </dl>

      <div className="mt-5">
        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
          Estructura
        </h3>
        <p className="mt-2 break-words text-sm font-medium text-slate-200">{wod.structure}</p>
      </div>

      <p className="mt-5 flex-1 break-words text-sm leading-6 text-pretty text-slate-300">
        {wod.description}
      </p>

      <Link
        to={`/wods/${wod.id}`}
        className="mt-6 inline-flex min-h-11 items-center touch-manipulation self-start rounded-md py-2 text-sm font-semibold text-orange-300 hover:text-orange-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
      >
        Ver detalle de {wod.name}
      </Link>
    </article>
  )
}
