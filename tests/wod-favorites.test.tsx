/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { AppRoutes } from '../src/App'
import wodsData from '../src/data/wods.json'
import { FAVORITES_STORAGE_KEY } from '../src/lib/favoritesStorage'

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

describe('WOD favorite integration', () => {
  it('permite marcar y desmarcar un WOD desde su tarjeta', () => {
    renderWodsCatalog()

    const addButton = screen.getByRole('button', { name: 'Añadir Fran a favoritos' })
    fireEvent.click(addButton)

    expect(screen.getByRole('button', { name: 'Quitar Fran de favoritos' })).toBeTruthy()
    expect(localStorage.getItem(FAVORITES_STORAGE_KEY)).toBe('["fran"]')

    fireEvent.click(screen.getByRole('button', { name: 'Quitar Fran de favoritos' }))

    expect(screen.getByRole('button', { name: 'Añadir Fran a favoritos' })).toBeTruthy()
    expect(localStorage.getItem(FAVORITES_STORAGE_KEY)).toBe('[]')
  })

  it('recupera el estado favorito persistido al cargar el catálogo', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(['cindy']))

    renderWodsCatalog()

    expect(screen.getByRole('button', { name: 'Quitar Cindy de favoritos' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Añadir Fran a favoritos' })).toBeTruthy()
  })

  it.each([
    ['JSON corrupto', '{invalid-json'],
    ['estructura inválida', JSON.stringify({ favorites: ['fran'] })],
  ])('mantiene el catálogo cuando localStorage contiene %s', (_description, storedValue) => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, storedValue)

    renderWodsCatalog()

    expect(screen.getByRole('heading', { name: 'Fran' })).toBeTruthy()
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('no modifica los datos locales al marcar o desmarcar favoritos', () => {
    const originalWods = JSON.stringify(wodsData)
    renderWodsCatalog()

    fireEvent.click(screen.getByRole('button', { name: 'Añadir Fran a favoritos' }))
    fireEvent.click(screen.getByRole('button', { name: 'Quitar Fran de favoritos' }))

    expect(JSON.stringify(wodsData)).toBe(originalWods)
  })
})
