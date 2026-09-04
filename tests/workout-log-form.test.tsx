/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { WorkoutLogForm } from '../src/components/WorkoutLogForm'
import { AppRoutes } from '../src/App'
import { createWorkoutHistoryEntry } from '../src/lib/workoutHistory'
import {
  WORKOUT_HISTORY_STORAGE_KEY,
} from '../src/lib/workoutHistoryStorage'
import type {
  CreateWorkoutHistoryEntryInput,
  WorkoutHistoryEntry,
} from '../src/types/workoutHistory'

const today = '2026-09-04'

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(2026, 8, 4, 12))
})

afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.useRealTimers()
})

function renderForm(
  addWorkout: (
    input: CreateWorkoutHistoryEntryInput,
  ) => WorkoutHistoryEntry = createWorkoutHistoryEntry,
) {
  return render(
    <WorkoutLogForm wodId="fran" addWorkout={addWorkout} />,
  )
}

describe('WorkoutLogForm', () => {
  it('propone la fecha local actual por defecto', () => {
    renderForm()

    expect(screen.getByLabelText('Fecha del entrenamiento').getAttribute('value')).toBe(today)
  })

  it('registra un entrenamiento válido', () => {
    const addWorkout = vi.fn(createWorkoutHistoryEntry)
    renderForm(addWorkout)

    fireEvent.change(screen.getByLabelText('Resultado (opcional)'), {
      target: { value: ' 05:42 ' },
    })
    fireEvent.change(screen.getByLabelText('Notas (opcional)'), {
      target: { value: ' Buen ritmo ' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar entrenamiento' }))

    expect(addWorkout).toHaveBeenCalledWith({
      wodId: 'fran',
      date: today,
      result: ' 05:42 ',
      notes: ' Buen ritmo ',
      today,
    })
    expect(screen.getByRole('status').textContent).toContain(
      'Entrenamiento registrado correctamente.',
    )
  })

  it('permite seleccionar una fecha anterior', () => {
    const addWorkout = vi.fn(createWorkoutHistoryEntry)
    renderForm(addWorkout)

    fireEvent.change(screen.getByLabelText('Fecha del entrenamiento'), {
      target: { value: '2026-09-03' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar entrenamiento' }))

    expect(addWorkout).toHaveBeenCalledWith(
      expect.objectContaining({ date: '2026-09-03' }),
    )
  })

  it('rechaza una fecha futura con un error visible', () => {
    const addWorkout = vi.fn(createWorkoutHistoryEntry)
    renderForm(addWorkout)

    fireEvent.change(screen.getByLabelText('Fecha del entrenamiento'), {
      target: { value: '2026-09-05' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar entrenamiento' }))

    expect(screen.getByRole('alert').textContent).toContain(
      'La fecha no puede ser posterior a hoy.',
    )
    expect(addWorkout).not.toHaveBeenCalled()
  })

  it('muestra un error comprensible si falta la fecha', () => {
    const addWorkout = vi.fn(createWorkoutHistoryEntry)
    renderForm(addWorkout)

    fireEvent.change(screen.getByLabelText('Fecha del entrenamiento'), {
      target: { value: '' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar entrenamiento' }))

    expect(screen.getByRole('alert').textContent).toContain(
      'Selecciona una fecha para registrar el entrenamiento.',
    )
    expect(addWorkout).not.toHaveBeenCalled()
  })

  it('mantiene result y notes como campos opcionales', () => {
    const addWorkout = vi.fn(createWorkoutHistoryEntry)
    renderForm(addWorkout)

    fireEvent.click(screen.getByRole('button', { name: 'Guardar entrenamiento' }))

    expect(addWorkout).toHaveBeenCalledWith(
      expect.objectContaining({ result: '', notes: '' }),
    )
  })
})

describe('WorkoutLogForm en el detalle de WOD', () => {
  it('actualiza el historial mediante el hook y la persistencia existente', () => {
    render(
      <MemoryRouter initialEntries={['/wods/fran']}>
        <AppRoutes />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText('Resultado (opcional)'), {
      target: { value: '05:42' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar entrenamiento' }))

    expect(screen.getByRole('status').textContent).toContain(
      'Entrenamiento registrado correctamente.',
    )
    expect(JSON.parse(localStorage.getItem(WORKOUT_HISTORY_STORAGE_KEY) ?? 'null')).toEqual([
      expect.objectContaining({ wodId: 'fran', date: today, result: '05:42' }),
    ])
  })

  it('mantiene funcionando el favorito del WOD', () => {
    render(
      <MemoryRouter initialEntries={['/wods/fran']}>
        <AppRoutes />
      </MemoryRouter>,
    )

    const favoriteButton = screen.getByRole('button', { name: 'Añadir Fran a favoritos' })
    fireEvent.click(favoriteButton)

    expect(screen.getByRole('button', { name: 'Quitar Fran de favoritos' })).toBeTruthy()
  })
})
