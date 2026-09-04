/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { WodCard } from '../src/components/WodCard'
import { WodDetailPage } from '../src/pages/WodDetailPage'
import { AppRoutes } from '../src/App'
import { FAVORITES_STORAGE_KEY } from '../src/lib/favoritesStorage'
import { createWorkoutHistoryEntry } from '../src/lib/workoutHistory'
import { loadWods } from '../src/lib/loadWods'
import type { UseWorkoutHistoryResult } from '../src/hooks/useWorkoutHistory'
import { emptyFavorites } from './favorites-fixtures'

const loadedWods = loadWods()

if (!loadedWods.success) {
  throw new Error('Los WODs locales deben ser válidos para ejecutar estos tests.')
}

const fran = loadedWods.data.find((wod) => wod.id === 'fran')

if (!fran) {
  throw new Error('Se esperaba encontrar el WOD Fran en los datos locales.')
}

const emptyWorkoutHistory: UseWorkoutHistoryResult = {
  entries: [],
  addWorkout: createWorkoutHistoryEntry,
  deleteWorkout: () => {},
}

afterEach(() => {
  cleanup()
  localStorage.clear()
})

function renderDetail(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/wods/:id"
          element={
            <WodDetailPage
              favorites={emptyFavorites}
              workoutHistory={emptyWorkoutHistory}
            />
          }
        />
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

  it('comparte el estado entre el catálogo y el detalle', () => {
    render(
      <MemoryRouter initialEntries={['/wods']}>
        <AppRoutes />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Añadir Fran a favoritos' }))
    fireEvent.click(screen.getByRole('link', { name: 'Ver detalle de Fran' }))

    expect(screen.getByRole('button', { name: 'Quitar Fran de favoritos' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Quitar Fran de favoritos' }))
    fireEvent.click(screen.getByRole('link', { name: 'Volver al catálogo de WODs' }))

    expect(screen.getByRole('button', { name: 'Añadir Fran a favoritos' })).toBeTruthy()
  })

  it('refleja en el detalle un favorito persistido desde el catálogo', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(['fran']))

    render(
      <MemoryRouter initialEntries={['/wods/fran']}>
        <AppRoutes />
      </MemoryRouter>,
    )

    expect(screen.getByRole('button', { name: 'Quitar Fran de favoritos' })).toBeTruthy()
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
