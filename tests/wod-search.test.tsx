/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { WodsPage } from '../src/pages/WodsPage'
import { loadWods } from '../src/lib/loadWods'
import { emptyFavorites } from './favorites-fixtures'

const loadedWods = loadWods()

if (!loadedWods.success) {
  throw new Error('Los WODs locales deben ser válidos para ejecutar estos tests.')
}

const wods = loadedWods.data

afterEach(() => {
  cleanup()
})

function renderWodsCatalog() {
  return render(
    <MemoryRouter>
      <WodsPage wods={wods} favorites={emptyFavorites} />
    </MemoryRouter>,
  )
}

function getSearchInput() {
  return screen.getByRole('searchbox', { name: 'Buscar WOD por nombre' }) as HTMLInputElement
}

describe('WOD search', () => {
  it('muestra un campo de búsqueda con etiqueta accesible', () => {
    renderWodsCatalog()

    const input = getSearchInput()

    expect(input.getAttribute('name')).toBe('wod-search')
    expect(input.value).toBe('')
    expect(input.className).toContain('input-control')
  })

  it('actualiza el valor controlado al escribir', () => {
    renderWodsCatalog()

    const input = getSearchInput()
    fireEvent.change(input, { target: { value: 'Fran' } })

    expect(input.value).toBe('Fran')
  })

  it('actualiza el catálogo según el nombre buscado', () => {
    renderWodsCatalog()

    fireEvent.change(getSearchInput(), { target: { value: 'Cindy' } })

    expect(screen.getByRole('heading', { name: 'Cindy' })).toBeTruthy()
    expect(screen.queryByRole('heading', { name: 'Fran' })).toBeNull()
  })

  it('combina la búsqueda con el filtro de tipo', () => {
    renderWodsCatalog()

    fireEvent.change(getSearchInput(), { target: { value: 'n' } })
    fireEvent.click(screen.getByRole('button', { name: 'AMRAP' }))

    expect(screen.getByRole('heading', { name: 'Cindy' })).toBeTruthy()
    expect(screen.queryByRole('heading', { name: 'Fran' })).toBeNull()
    expect(screen.queryByRole('heading', { name: 'EMOM Strength' })).toBeNull()
  })

  it('conserva la búsqueda al cambiar el filtro de tipo', () => {
    renderWodsCatalog()

    const input = getSearchInput()
    fireEvent.change(input, { target: { value: 'n' } })
    fireEvent.click(screen.getByRole('button', { name: 'AMRAP' }))

    expect(input.value).toBe('n')
    expect(screen.getByRole('heading', { name: 'Cindy' })).toBeTruthy()
  })

  it('muestra el estado vacío cuando la búsqueda no tiene coincidencias', () => {
    renderWodsCatalog()

    fireEvent.change(getSearchInput(), { target: { value: 'Murph' } })

    const emptyState = screen.getByRole('status')

    expect(emptyState.textContent).toContain('No encontramos WODs')
    expect(emptyState.textContent).toContain('Prueba con otro término de búsqueda.')
    expect(emptyState.getAttribute('data-state-kind')).toBe('search')
  })
})
