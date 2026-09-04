import { z } from 'zod'
import type { Wod } from '../types/wod'

export const FAVORITES_STORAGE_KEY = 'wod-explorer:favorites'

const favoriteIdsSchema = z.array(z.string().min(1))

function getExistingWodIds(wods: readonly Wod[]): Set<string> {
  return new Set(wods.map((wod) => wod.id))
}

function sanitizeFavoriteIds(
  favoriteIds: readonly string[],
  wods: readonly Wod[],
): string[] {
  const existingWodIds = getExistingWodIds(wods)

  return [...new Set(favoriteIds)].filter((id) => existingWodIds.has(id))
}

export function loadFavoriteIds(wods: readonly Wod[]): string[] {
  try {
    const storedFavorites = globalThis.localStorage.getItem(FAVORITES_STORAGE_KEY)

    if (storedFavorites === null) {
      return []
    }

    const parsedFavorites: unknown = JSON.parse(storedFavorites)
    const validationResult = favoriteIdsSchema.safeParse(parsedFavorites)

    if (!validationResult.success) {
      return []
    }

    return sanitizeFavoriteIds(validationResult.data, wods)
  } catch {
    return []
  }
}

export function saveFavoriteIds(
  favoriteIds: readonly string[],
  wods: readonly Wod[],
): void {
  try {
    const sanitizedFavoriteIds = sanitizeFavoriteIds(favoriteIds, wods)
    globalThis.localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(sanitizedFavoriteIds),
    )
  } catch {
    // Storage failures must not break the application.
  }
}
