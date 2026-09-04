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
    ? 'border-orange-400/60 bg-orange-400/10 text-orange-300 hover:border-orange-300 hover:text-orange-200'
    : 'border-slate-700 bg-slate-950/40 text-slate-400 hover:border-slate-500 hover:text-slate-200'

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isFavorite}
      onClick={onToggle}
      className={`inline-flex min-h-11 min-w-11 shrink-0 self-start items-center justify-center rounded-md border p-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400 focus-visible:ring-2 focus-visible:ring-orange-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:self-auto ${stateClasses}`}
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
