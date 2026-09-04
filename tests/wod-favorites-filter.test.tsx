/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { WodsPage } from '../src/pages/WodsPage'
import { FAVORITES_STORAGE_KEY } from '../src/lib/favoritesStorage'
import { loadWods } from '../src/lib/loadWods'

const loadedWods = loadWods()

if (!loadedWods.success) {
  throw new Error('Los WODs locales deben ser válidos para ejecutar estos tests.')
}

const wods = loadedWods.data

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  cleanup()
  localStorage.clear()
})

function renderWodsCatalog() {
  return render(
    <MemoryRouter>
      <WodsPage wods={wods} />
    </MemoryRouter>,
  )
}

function showFavoritesOnly() {
  fireEvent.click(screen.getByRole('button', { name: 'Solo favoritos' }))
}

describe('WOD favorites filter', () => {
  it('muestra únicamente los WODs favoritos', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(['fran', 'cindy']))
    renderWodsCatalog()

    showFavoritesOnly()

    expect(screen.getByRole('heading', { name: 'Fran' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Cindy' })).toBeTruthy()
    expect(screen.queryByRole('heading', { name: 'EMOM Strength' })).toBeNull()
  })

  it('mantiene la búsqueda dentro de los favoritos', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(['fran', 'cindy']))
    renderWodsCatalog()

    showFavoritesOnly()
    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar WOD por nombre' }), {
      target: { value: 'cin' },
    })

    expect(screen.getByRole('heading', { name: 'Cindy' })).toBeTruthy()
    expect(screen.queryByRole('heading', { name: 'Fran' })).toBeNull()
  })

  it.each([
    ['For Time', 'Fran', 'Cindy'],
    ['AMRAP', 'Cindy', 'Fran'],
    ['EMOM', 'EMOM Strength', 'Fran'],
  ] as const)('combina favoritos con el filtro %s', (filter, visibleWod, hiddenWod) => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(['fran', 'cindy', 'emom-strength']))
    renderWodsCatalog()

    showFavoritesOnly()
    fireEvent.click(screen.getByRole('button', { name: filter }))

    expect(screen.getByRole('heading', { name: visibleWod })).toBeTruthy()
    expect(screen.queryByRole('heading', { name: hiddenWod })).toBeNull()
  })

  it('muestra un estado vacío específico cuando no hay favoritos', () => {
    renderWodsCatalog()

    showFavoritesOnly()

    expect(screen.getByRole('status').textContent).toContain('No tienes favoritos')
    expect(screen.queryByText('No hay resultados')).toBeNull()
  })

  it('muestra el estado de resultados vacío si los filtros no coinciden', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(['fran']))
    renderWodsCatalog()

    showFavoritesOnly()
    fireEvent.click(screen.getByRole('button', { name: 'AMRAP' }))

    expect(screen.getByRole('status').textContent).toContain('No hay resultados')
    expect(screen.queryByText('No tienes favoritos')).toBeNull()
  })

  it('mantiene el acceso al detalle de un WOD favorito', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(['fran']))
    renderWodsCatalog()

    showFavoritesOnly()

    expect(screen.getByRole('link', { name: 'Ver detalle de Fran' }).getAttribute('href')).toBe(
      '/wods/fran',
    )
  })
})
