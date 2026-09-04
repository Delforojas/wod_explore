/** @vitest-environment jsdom */

import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { FAVORITES_STORAGE_KEY } from '../src/lib/favoritesStorage'
import { loadWods } from '../src/lib/loadWods'
import { useFavorites } from '../src/hooks/useFavorites'

const loadedWods = loadWods()

if (!loadedWods.success) {
  throw new Error('Los WODs locales deben ser válidos para ejecutar estos tests.')
}

const wods = loadedWods.data

afterEach(() => {
  cleanup()
  localStorage.clear()
})

describe('useFavorites', () => {
  it('carga los favoritos previamente persistidos', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(['fran']))

    const { result } = renderHook(() => useFavorites(wods))

    expect(result.current.favoriteIds).toEqual(['fran'])
    expect(result.current.isFavorite('fran')).toBe(true)
  })

  it('añade un WOD a favoritos', () => {
    const { result } = renderHook(() => useFavorites(wods))

    act(() => {
      result.current.addFavorite('fran')
    })

    expect(result.current.favoriteIds).toEqual(['fran'])
  })

  it('elimina un WOD de favoritos', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(['fran', 'cindy']))
    const { result } = renderHook(() => useFavorites(wods))

    act(() => {
      result.current.removeFavorite('fran')
    })

    expect(result.current.favoriteIds).toEqual(['cindy'])
    expect(result.current.isFavorite('fran')).toBe(false)
  })

  it('consulta correctamente si un WOD es favorito', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(['fran']))
    const { result } = renderHook(() => useFavorites(wods))

    expect(result.current.isFavorite('fran')).toBe(true)
    expect(result.current.isFavorite('cindy')).toBe(false)
  })

  it('no genera IDs duplicados al añadir varias veces el mismo WOD', () => {
    const { result } = renderHook(() => useFavorites(wods))

    act(() => {
      result.current.addFavorite('fran')
      result.current.addFavorite('fran')
    })

    expect(result.current.favoriteIds).toEqual(['fran'])
  })

  it('persiste los cambios de añadir y eliminar en localStorage', () => {
    const { result } = renderHook(() => useFavorites(wods))

    act(() => {
      result.current.addFavorite('fran')
    })

    expect(localStorage.getItem(FAVORITES_STORAGE_KEY)).toBe('["fran"]')

    act(() => {
      result.current.removeFavorite('fran')
    })

    expect(localStorage.getItem(FAVORITES_STORAGE_KEY)).toBe('[]')
  })

  it('ignora IDs que no corresponden a WODs existentes', () => {
    const { result } = renderHook(() => useFavorites(wods))

    act(() => {
      result.current.addFavorite('missing-wod')
    })

    expect(result.current.favoriteIds).toEqual([])
    expect(localStorage.getItem(FAVORITES_STORAGE_KEY)).toBeNull()
  })
})
