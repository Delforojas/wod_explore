import type { Wod, WodType } from '../types/wod'

export type WodFilter = 'All' | WodType

export const WOD_FILTERS = [
  'All',
  'For Time',
  'AMRAP',
  'EMOM',
] as const satisfies readonly WodFilter[]

export interface WodFilterOptions {
  favoritesOnly?: boolean
  favoriteIds?: readonly string[]
}

export function filterWods(
  wods: readonly Wod[],
  filter: WodFilter,
  search = '',
  options: WodFilterOptions = {},
): Wod[] {
  const normalizedSearch = search.trim().toLocaleLowerCase()
  const favoriteIds = new Set(options.favoriteIds ?? [])

  return wods.filter((wod) => {
    const matchesFilter = filter === 'All' || wod.type === filter
    const matchesSearch =
      normalizedSearch === '' || wod.name.toLocaleLowerCase().includes(normalizedSearch)
    const matchesFavorites = !options.favoritesOnly || favoriteIds.has(wod.id)

    return matchesFilter && matchesSearch && matchesFavorites
  })
}
