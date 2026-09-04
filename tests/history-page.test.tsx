/** @vitest-environment jsdom */

import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { useWorkoutHistory } from '../src/hooks/useWorkoutHistory'
import { HistoryPage } from '../src/pages/HistoryPage'
import { loadWods } from '../src/lib/loadWods'
import { WORKOUT_HISTORY_STORAGE_KEY } from '../src/lib/workoutHistoryStorage'
import type { WorkoutHistory } from '../src/types/workoutHistory'

const wodsResult = loadWods()

if (!wodsResult.success) {
  throw new Error('Se esperaban WODs locales válidos para las pruebas del historial.')
}

const wods = wodsResult.data
const fran = wods.find((wod) => wod.id === 'fran')

if (!fran) {
  throw new Error('Se esperaba encontrar el WOD Fran para las pruebas del historial.')
}

afterEach(() => {
  cleanup()
  localStorage.clear()
})

function HistoryWithHook() {
  const workoutHistory = useWorkoutHistory()

  return <HistoryPage workoutHistory={workoutHistory} wods={wods} />
}

function renderHistory(entries: WorkoutHistory = []) {
  localStorage.setItem(WORKOUT_HISTORY_STORAGE_KEY, JSON.stringify(entries))

  return render(
    <MemoryRouter>
      <HistoryWithHook />
    </MemoryRouter>,
  )
}

describe('HistoryPage', () => {
  it('muestra un estado vacío específico cuando no hay registros', () => {
    renderHistory()

    expect(screen.getByRole('heading', { name: 'Historial vacío' })).toBeTruthy()
    expect(screen.getByText('Todavía no has registrado ningún entrenamiento.')).toBeTruthy()
  })

  it('muestra todas las entradas ordenadas de más reciente a más antigua', () => {
    const entries: WorkoutHistory = [
      {
        id: 'history-old',
        wodId: 'fran',
        date: '2026-09-01',
      },
      {
        id: 'history-new',
        wodId: 'fran',
        date: '2026-09-04',
        result: '05:42',
        notes: 'Thrusters sin cortar.',
      },
    ]

    renderHistory(entries)

    const articles = screen.getAllByRole('article')
    expect(articles).toHaveLength(2)
    expect(
      articles.map((article) =>
        within(article).getByRole('heading', { level: 2 }).textContent,
      ),
    ).toEqual([fran.name, fran.name])
    expect(articles.map((article) => within(article).getByRole('time').getAttribute('datetime'))).toEqual([
      '2026-09-04',
      '2026-09-01',
    ])
  })

  it('muestra tipo, resultado y notas cuando están disponibles', () => {
    renderHistory([
      {
        id: 'history-with-details',
        wodId: 'fran',
        date: '2026-09-04',
        result: '05:42',
        notes: 'Thrusters sin cortar.',
      },
    ])

    const article = screen.getByRole('article')
    expect(within(article).getAllByRole('definition').map((definition) => definition.textContent)).toContain(
      fran.type,
    )
    expect(within(article).getByText('05:42')).toBeTruthy()
    expect(within(article).getByText('Thrusters sin cortar.')).toBeTruthy()
  })

  it('omite resultado y notas cuando no existen', () => {
    renderHistory([
      {
        id: 'history-without-details',
        wodId: 'fran',
        date: '2026-09-04',
      },
    ])

    const article = screen.getByRole('article')
    expect(within(article).queryByText('Resultado')).toBeNull()
    expect(within(article).queryByText('Notas')).toBeNull()
  })

  it('enlaza una entrada al detalle del WOD existente', () => {
    renderHistory([
      {
        id: 'history-link',
        wodId: 'fran',
        date: '2026-09-04',
      },
    ])

    expect(screen.getByRole('link', { name: fran.name }).getAttribute('href')).toBe('/wods/fran')
  })
})
