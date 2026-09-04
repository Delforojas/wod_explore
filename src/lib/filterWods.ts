import type { Wod, WodType } from '../types/wod'

export type WodFilter = 'All' | WodType

export const WOD_FILTERS = [
  'All',
  'For Time',
  'AMRAP',
  'EMOM',
] as const satisfies readonly WodFilter[]

export function filterWods(wods: Wod[], filter: WodFilter, search = ''): Wod[] {
  const normalizedSearch = search.trim().toLocaleLowerCase()

  return wods.filter((wod) => {
    const matchesFilter = filter === 'All' || wod.type === filter
    const matchesSearch =
      normalizedSearch === '' || wod.name.toLocaleLowerCase().includes(normalizedSearch)

    return matchesFilter && matchesSearch
  })
}
