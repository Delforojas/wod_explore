/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { AppRoutes } from '../src/App'
import { FAVORITES_STORAGE_KEY } from '../src/lib/favoritesStorage'

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  cleanup()
  localStorage.clear()
})

function renderWodsCatalog() {
  return render(
    <MemoryRouter initialEntries={['/wods']}>
      <AppRoutes />
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

    const emptyState = screen.getByRole('status')

    expect(emptyState.textContent).toContain('No tienes favoritos')
    expect(emptyState.getAttribute('data-state-kind')).toBe('favorites')
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
