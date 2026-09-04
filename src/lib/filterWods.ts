import type { Wod, WodType } from '../types/wod'

export type WodFilter = 'All' | WodType

export const WOD_FILTERS = [
  'All',
  'For Time',
  'AMRAP',
  'EMOM',
] as const satisfies readonly WodFilter[]

export function filterWods(wods: Wod[], filter: WodFilter): Wod[] {
  if (filter === 'All') {
    return wods
  }

  return wods.filter((wod) => wod.type === filter)
}
