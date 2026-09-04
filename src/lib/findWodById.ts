import type { Wod } from '../types/wod'

export function findWodById(wods: Wod[], id: string | undefined): Wod | undefined {
  if (!id) {
    return undefined
  }

  return wods.find((wod) => wod.id === id)
}
