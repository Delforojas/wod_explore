/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { WodsPage } from '../src/pages/WodsPage'
import { FAVORITES_STORAGE_KEY } from '../src/lib/favoritesStorage'
import { loadWods } from '../src/lib/loadWods'

const loadedWods = loadWods()

if (!loadedWods.success) {
  throw new Error('Los WODs locales deben ser válidos para ejecutar estos tests.')
}

const wods = loadedWods.data

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
})
