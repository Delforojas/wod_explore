/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { WodsPage } from '../src/pages/WodsPage'
import { loadWods } from '../src/lib/loadWods'

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
      <WodsPage wods={wods} />
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

  it('muestra el estado vacío cuando la búsqueda no tiene coincidencias', () => {
    renderWodsCatalog()

    fireEvent.change(getSearchInput(), { target: { value: 'Murph' } })

    expect(screen.getByRole('status').textContent).toContain('No hay resultados')
  })
})
