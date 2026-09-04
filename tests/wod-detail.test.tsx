/** @vitest-environment jsdom */

import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { WodCard } from '../src/components/WodCard'
import { WodDetailPage } from '../src/pages/WodDetailPage'
import { AppRoutes } from '../src/App'
import { loadWods } from '../src/lib/loadWods'

const loadedWods = loadWods()

if (!loadedWods.success) {
  throw new Error('Los WODs locales deben ser válidos para ejecutar estos tests.')
}

const fran = loadedWods.data.find((wod) => wod.id === 'fran')

if (!fran) {
  throw new Error('Se esperaba encontrar el WOD Fran en los datos locales.')
}

afterEach(() => {
  cleanup()
})

function renderDetail(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/wods/:id" element={<WodDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('WOD detail', () => {
  it('muestra toda la información de un WOD existente', () => {
    renderDetail('/wods/fran')

    expect(screen.getByRole('heading', { name: 'Fran' })).toBeTruthy()
    expect(screen.getByText('For Time')).toBeTruthy()
    expect(screen.getByText('Intermediate')).toBeTruthy()
    expect(screen.getByText('21-15-9')).toBeTruthy()
    expect(screen.getByText('thruster')).toBeTruthy()
    expect(screen.getByText('pull-up')).toBeTruthy()
    expect(screen.getByText(fran.description)).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Volver al catálogo de WODs' })).toBeTruthy()
  })

  it('muestra un error controlado para un ID inexistente', () => {
    renderDetail('/wods/not-found')

    expect(screen.getByRole('alert').textContent).toContain('WOD no encontrado')
    expect(screen.getByRole('link', { name: 'Volver al catálogo de WODs' })).toBeTruthy()
  })

  it('expone la ruta de detalle a través de AppRoutes', () => {
    render(
      <MemoryRouter initialEntries={['/wods/fran']}>
        <AppRoutes />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Fran' })).toBeTruthy()
  })

  it('enlaza una tarjeta con el detalle de su WOD', () => {
    render(
      <MemoryRouter>
        <WodCard wod={fran} isFavorite={false} onToggleFavorite={() => {}} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Ver detalle de Fran' }).getAttribute('href')).toBe(
      '/wods/fran',
    )
  })
})
