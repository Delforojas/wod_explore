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

  it('devuelve todos los WODs cuando la búsqueda está vacía', () => {
    expect(filterWods(wods, 'All', '')).toEqual(wods)
  })

  it('ignora una búsqueda compuesta únicamente por espacios', () => {
    expect(filterWods(wods, 'All', '   ')).toEqual(wods)
  })

  it('encuentra una coincidencia exacta por nombre', () => {
    expect(filterWods(wods, 'All', 'Fran').map((wod) => wod.name)).toEqual(['Fran'])
  })

  it('encuentra coincidencias parciales por nombre', () => {
    expect(filterWods(wods, 'All', 'fr').map((wod) => wod.name)).toEqual(['Fran'])
  })

  it('ignora mayúsculas y minúsculas en la búsqueda', () => {
    expect(filterWods(wods, 'All', 'fRaN').map((wod) => wod.name)).toEqual(['Fran'])
  })

  it('devuelve una lista vacía cuando no encuentra el nombre', () => {
    expect(filterWods(wods, 'All', 'Murph')).toEqual([])
  })
})
