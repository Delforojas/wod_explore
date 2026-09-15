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
      {isPending ? "Guardando…" : isFavorite ? "Guardado" : "Guardar"}
    </button>
  );
}
