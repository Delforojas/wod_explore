import { Link } from 'react-router-dom'
import type { Wod } from '../types/wod'

interface WodCardProps {
  wod: Wod
}

export function WodCard({ wod }: WodCardProps) {
  const titleId = `wod-${wod.id}-title`

  return (
    <article
      aria-labelledby={titleId}
      className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-slate-950/20"
    >
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-400">
            {wod.type}
          </p>
          <h2 id={titleId} className="mt-2 text-2xl font-semibold text-white">
            {wod.name}
          </h2>
        </div>
        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-medium text-slate-300">
          {wod.level}
        </span>
      </header>

      <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-slate-800 py-4">
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">Tipo</dt>
          <dd className="mt-1 text-sm font-medium text-slate-200">{wod.type}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">Nivel</dt>
          <dd className="mt-1 text-sm font-medium text-slate-200">{wod.level}</dd>
        </div>
      </dl>

      <div className="mt-5">
        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          Estructura
        </h3>
        <p className="mt-2 text-sm font-medium text-slate-200">{wod.structure}</p>
      </div>

      <p className="mt-5 flex-1 text-sm leading-6 text-slate-300">{wod.description}</p>

      <Link
        to={`/wods/${wod.id}`}
        className="mt-6 inline-flex self-start rounded-md text-sm font-semibold text-orange-300 hover:text-orange-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
      >
        Ver detalle de {wod.name}
      </Link>
    </article>
  )
}
