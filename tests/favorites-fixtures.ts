import type { UseFavoritesResult } from '../src/hooks/useFavorites'

export const emptyFavorites: UseFavoritesResult = {
  favoriteIds: [],
  isFavorite: () => false,
  addFavorite: () => {},
  removeFavorite: () => {},
  toggleFavorite: () => {},
}
