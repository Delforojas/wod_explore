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
      className="catalog-row"
    >
      <header className="wod-card-header">
        <div className="min-w-0">
          <p className="card-label text-board-accent">
            {wod.type}
          </p>
          <h2 id={titleId} className="mt-2 break-words text-balance text-2xl font-bold tracking-[-0.02em] text-board-text">
            {wod.name}
          </h2>
        </div>
        <div className="wod-card-tools">
          <span className="card-badge">
            {wod.level}
          </span>
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={onToggleFavorite}
            wodName={wod.name}
          />
        </div>
      </header>

      <div className="wod-card-body">
        <p className="wod-card-description">
          {wod.description}
        </p>
        <dl className="wod-card-meta">
          <div>
            <dt className="card-label">Estructura</dt>
            <dd className="mt-1 break-words text-sm font-medium text-board-text">
              {wod.structure}
            </dd>
          </div>
          <div>
            <dt className="card-label">Nivel</dt>
            <dd className="mt-1 text-sm font-medium text-board-text">{wod.level}</dd>
          </div>
        </dl>
      </div>

      <footer className="wod-card-footer">
        <Link
          to={`/wods/${wod.id}`}
          className="button-link"
        >
          Ver detalle de {wod.name}
        </Link>
      </footer>
    </article>
  )
}
