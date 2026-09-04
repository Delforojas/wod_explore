/** @vitest-environment jsdom */

import { afterEach, describe, expect, it } from 'vitest'
import { loadWods } from '../src/lib/loadWods'
import {
  FAVORITES_STORAGE_KEY,
  loadFavoriteIds,
  saveFavoriteIds,
} from '../src/lib/favoritesStorage'

const loadedWods = loadWods()

if (!loadedWods.success) {
  throw new Error('Los WODs locales deben ser válidos para ejecutar estos tests.')
}

const wods = loadedWods.data

afterEach(() => {
  localStorage.clear()
})

describe('favoritesStorage', () => {
  it('devuelve una lista vacía cuando no existe almacenamiento', () => {
    expect(loadFavoriteIds(wods)).toEqual([])
  })

  it('recupera una lista válida de IDs', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(['fran', 'cindy']))

    expect(loadFavoriteIds(wods)).toEqual(['fran', 'cindy'])
  })

  it('devuelve una lista vacía cuando el JSON está corrupto', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, '{invalid-json')

    expect(loadFavoriteIds(wods)).toEqual([])
  })

  it.each([
    ['un objeto', JSON.stringify({ favorites: ['fran'] })],
    ['un array con valores no string', JSON.stringify(['fran', 1])],
    ['un valor nulo', JSON.stringify(null)],
  ])('devuelve una lista vacía para %s', (_description, storedValue) => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, storedValue)

    expect(loadFavoriteIds(wods)).toEqual([])
  })

  it('elimina IDs duplicados y WODs inexistentes', () => {
    localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(['fran', 'fran', 'missing-wod', 'cindy']),
    )

    expect(loadFavoriteIds(wods)).toEqual(['fran', 'cindy'])
  })

  it('guarda únicamente IDs válidos y sin duplicados', () => {
    saveFavoriteIds(['fran', 'fran', 'missing-wod', 'cindy'], wods)

    expect(JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) ?? '')).toEqual([
      'fran',
      'cindy',
    ])
  })
})
