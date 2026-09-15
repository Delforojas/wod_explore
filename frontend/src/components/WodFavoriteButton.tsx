import { useAuth } from "../auth/useAuth";

interface WodFavoriteButtonProps {
  wodId: number;
  wodName: string;
}

export function WodFavoriteButton({ wodId, wodName }: WodFavoriteButtonProps) {
  const {
    favoriteWodIds,
    favoritesError,
    favoritesStatus,
    pendingFavoriteIds,
    toggleFavorite,
  } = useAuth();
  const isFavorite = favoriteWodIds.has(wodId);
  const isPending = pendingFavoriteIds.has(wodId);
  const isUnavailable = favoritesStatus !== "ready";
  const label = isUnavailable
    ? `Favoritos no disponibles para ${wodName}`
    : isFavorite
      ? `Quitar ${wodName} de favoritos`
      : `Añadir ${wodName} a favoritos`;
  const visibleLabel = isPending
    ? "Guardando…"
    : isFavorite
      ? "Quitar de favoritos"
      : "Añadir a favoritos";

  return (
    <button
      className={`favorite-button ${isFavorite ? "favorite-button--active" : ""}`}
      type="button"
      aria-label={label}
      aria-pressed={isFavorite}
      aria-busy={isPending}
      disabled={isUnavailable || isPending}
      title={favoritesError ?? undefined}
      onClick={() => void toggleFavorite(wodId)}
    >
      <span className="favorite-button__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
        </svg>
      </span>
      <span>{visibleLabel}</span>
    </button>
  );
}
