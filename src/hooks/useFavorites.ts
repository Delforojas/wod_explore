import { useEffect, useRef, useState } from 'react'
import { loadFavoriteIds, saveFavoriteIds } from '../lib/favoritesStorage'
import type { Wod } from '../types/wod'

export interface UseFavoritesResult {
  favoriteIds: readonly string[]
  isFavorite: (wodId: string) => boolean
  addFavorite: (wodId: string) => void
  removeFavorite: (wodId: string) => void
  toggleFavorite: (wodId: string) => void
}

export function useFavorites(wods: readonly Wod[]): UseFavoritesResult {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => loadFavoriteIds(wods))
  const isFirstRender = useRef(true)
  const existingWodIds = new Set(wods.map((wod) => wod.id))

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    saveFavoriteIds(favoriteIds, wods)
  }, [favoriteIds, wods])

  function isFavorite(wodId: string): boolean {
    return favoriteIds.includes(wodId)
  }

  function addFavorite(wodId: string): void {
    if (!existingWodIds.has(wodId)) {
      return
    }

    setFavoriteIds((currentFavoriteIds) =>
      currentFavoriteIds.includes(wodId)
        ? currentFavoriteIds
        : [...currentFavoriteIds, wodId],
    )
  }

  function removeFavorite(wodId: string): void {
    setFavoriteIds((currentFavoriteIds) => {
      if (!currentFavoriteIds.includes(wodId)) {
        return currentFavoriteIds
      }

      return currentFavoriteIds.filter((favoriteId) => favoriteId !== wodId)
    })
  }

  function toggleFavorite(wodId: string): void {
    if (isFavorite(wodId)) {
      removeFavorite(wodId)
      return
    }

    addFavorite(wodId)
  }

  return {
    favoriteIds,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  }
}
