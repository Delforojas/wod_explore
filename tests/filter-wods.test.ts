import { describe, expect, it } from 'vitest'
import { filterWods } from '../src/lib/filterWods'
import { loadWods } from '../src/lib/loadWods'

const loadedWods = loadWods()

if (!loadedWods.success) {
  throw new Error('Los WODs locales deben ser válidos para ejecutar estos tests.')
}

const wods = loadedWods.data

describe('filterWods', () => {
  it('devuelve todos los WODs con All', () => {
    expect(filterWods(wods, 'All')).toEqual(wods)
  })

  it.each(['For Time', 'AMRAP', 'EMOM'] as const)(
    'devuelve únicamente WODs de tipo %s',
    (filter) => {
      const filteredWods = filterWods(wods, filter)

      expect(filteredWods.length).toBeGreaterThan(0)
      expect(filteredWods.every((wod) => wod.type === filter)).toBe(true)
    },
  )

  it('devuelve una colección vacía cuando no hay coincidencias', () => {
    const forTimeWods = wods.filter((wod) => wod.type === 'For Time')

    expect(filterWods(forTimeWods, 'AMRAP')).toEqual([])
  })
})
