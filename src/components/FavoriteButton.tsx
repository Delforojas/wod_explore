interface FavoriteButtonProps {
  isFavorite: boolean
  onToggle: () => void
  wodName: string
}

export function FavoriteButton({
  isFavorite,
  onToggle,
  wodName,
}: FavoriteButtonProps) {
  const label = isFavorite
    ? `Quitar ${wodName} de favoritos`
    : `Añadir ${wodName} a favoritos`
  const stateClasses = isFavorite
    ? 'border-board-accent/60 bg-board-accent/10 text-board-accent-hover hover:border-board-accent-hover'
    : 'border-board-line bg-ink-950/40 text-board-muted hover:border-board-accent hover:text-board-text'

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isFavorite}
      onClick={onToggle}
      className={`button-base min-w-11 shrink-0 self-start border p-2 focus-visible:outline-board-accent focus-visible:ring-board-accent/40 focus-visible:ring-offset-ink-950 sm:self-auto ${stateClasses}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill={isFavorite ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m12 3.75 2.55 5.16 5.7.83-4.13 4.03.98 5.69L12 16.77l-5.1 2.69.98-5.69-4.13-4.03 5.7-.83L12 3.75Z"
        />
      </svg>
    </button>
  )
}
