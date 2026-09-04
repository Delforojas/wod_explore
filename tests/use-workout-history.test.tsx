/** @vitest-environment jsdom */

import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import {
  WORKOUT_HISTORY_STORAGE_KEY,
} from '../src/lib/workoutHistoryStorage'
import { useWorkoutHistory } from '../src/hooks/useWorkoutHistory'
import type { WorkoutHistory } from '../src/types/workoutHistory'

const today = '2026-09-04'

const storedHistory: WorkoutHistory = [
  {
    id: 'history-old',
    wodId: 'fran',
    date: '2026-09-01',
  },
  {
    id: 'history-new',
    wodId: 'cindy',
    date: today,
  },
]

afterEach(() => {
  cleanup()
  localStorage.clear()
})

describe('useWorkoutHistory', () => {
  it('carga el historial inicial desde la capa de almacenamiento', () => {
    localStorage.setItem(
      WORKOUT_HISTORY_STORAGE_KEY,
      JSON.stringify(storedHistory),
    )

    const { result } = renderHook(() => useWorkoutHistory())

    expect(result.current.entries).toEqual([
      storedHistory[1],
      storedHistory[0],
    ])
  })

  it('añade un registro utilizando la lógica de creación existente', () => {
    const { result } = renderHook(() => useWorkoutHistory())

    let addedEntryId = ''
    act(() => {
      const entry = result.current.addWorkout({
        wodId: 'fran',
        date: today,
        result: '  05:42  ',
        notes: '  Thrusters sin cortar.  ',
        today,
      })
      addedEntryId = entry.id
    })

    expect(result.current.entries).toEqual([
      expect.objectContaining({
        id: addedEntryId,
        wodId: 'fran',
        date: today,
        result: '05:42',
        notes: 'Thrusters sin cortar.',
      }),
    ])
  })

  it('persiste un registro añadido', () => {
    const { result } = renderHook(() => useWorkoutHistory())

    act(() => {
      result.current.addWorkout({
        wodId: 'fran',
        date: today,
        today,
      })
    })

    const persistedHistory = JSON.parse(
      localStorage.getItem(WORKOUT_HISTORY_STORAGE_KEY) ?? 'null',
    )

    expect(persistedHistory).toEqual([
      expect.objectContaining({ wodId: 'fran', date: today }),
    ])
    expect(localStorage.length).toBe(1)
  })

  it('elimina un registro y conserva los demás', () => {
    localStorage.setItem(
      WORKOUT_HISTORY_STORAGE_KEY,
      JSON.stringify(storedHistory),
    )
    const { result } = renderHook(() => useWorkoutHistory())

    act(() => {
      result.current.deleteWorkout('history-old')
    })

    expect(result.current.entries).toEqual([storedHistory[1]])
  })

  it('persiste la eliminación de un registro', () => {
    localStorage.setItem(
      WORKOUT_HISTORY_STORAGE_KEY,
      JSON.stringify(storedHistory),
    )
    const { result } = renderHook(() => useWorkoutHistory())

    act(() => {
      result.current.deleteWorkout('history-old')
    })

    expect(JSON.parse(localStorage.getItem(WORKOUT_HISTORY_STORAGE_KEY) ?? 'null')).toEqual([
      storedHistory[1],
    ])
  })

  it('expone el historial ordenado de más reciente a más antiguo', () => {
    localStorage.setItem(
      WORKOUT_HISTORY_STORAGE_KEY,
      JSON.stringify([...storedHistory].reverse()),
    )

    const { result } = renderHook(() => useWorkoutHistory())

    expect(result.current.entries.map((entry) => entry.date)).toEqual([
      today,
      '2026-09-01',
    ])
  })

  it('mantiene el historial vacío si se elimina un id inexistente', () => {
    const { result } = renderHook(() => useWorkoutHistory())

    act(() => {
      result.current.deleteWorkout('missing-id')
    })

    expect(result.current.entries).toEqual([])
  })
})
