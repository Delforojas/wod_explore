/** @vitest-environment jsdom */

import { afterEach, describe, expect, it } from 'vitest'
import {
  loadWorkoutHistory,
  saveWorkoutHistory,
  WORKOUT_HISTORY_STORAGE_KEY,
} from '../src/lib/workoutHistoryStorage'
import type { WorkoutHistory } from '../src/types/workoutHistory'

const validHistory: WorkoutHistory = [
  {
    id: 'history-001',
    wodId: 'fran',
    date: '2026-09-04',
    result: '05:42',
    notes: 'Thrusters sin cortar.',
  },
]

afterEach(() => {
  localStorage.clear()
})

describe('workoutHistoryStorage', () => {
  it('devuelve un array vacío cuando no existe almacenamiento', () => {
    expect(loadWorkoutHistory()).toEqual([])
  })

  it('recupera un JSON válido', () => {
    localStorage.setItem(
      WORKOUT_HISTORY_STORAGE_KEY,
      JSON.stringify(validHistory),
    )

    expect(loadWorkoutHistory()).toEqual(validHistory)
  })

  it('devuelve un array vacío cuando el JSON está corrupto', () => {
    localStorage.setItem(WORKOUT_HISTORY_STORAGE_KEY, '{invalid-json')

    expect(loadWorkoutHistory()).toEqual([])
  })

  it.each([
    ['un objeto', JSON.stringify({ history: validHistory })],
    ['un array con una entrada inválida', JSON.stringify([{ id: 'invalid' }])],
    [
      'un historial con IDs duplicados',
      JSON.stringify([validHistory[0], { ...validHistory[0], date: '2026-09-03' }]),
    ],
    [
      'un historial con fecha futura',
      JSON.stringify([{ ...validHistory[0], date: '2999-01-01' }]),
    ],
    [
      'un historial con texto opcional vacío',
      JSON.stringify([{ ...validHistory[0], notes: '   ' }]),
    ],
    ['un valor nulo', JSON.stringify(null)],
  ])('devuelve un array vacío para %s', (_description, storedValue) => {
    localStorage.setItem(WORKOUT_HISTORY_STORAGE_KEY, storedValue)

    expect(loadWorkoutHistory()).toEqual([])
  })

  it('persiste y recupera el historial usando la clave estable', () => {
    saveWorkoutHistory(validHistory)

    expect(localStorage.getItem(WORKOUT_HISTORY_STORAGE_KEY)).toBe(
      JSON.stringify(validHistory),
    )
    expect(loadWorkoutHistory()).toEqual(validHistory)
  })

  it('conserva registros cuyo WOD ya no existe', () => {
    const historyWithMissingWod: WorkoutHistory = [
      {
        ...validHistory[0],
        wodId: 'missing-wod',
      },
    ]
    localStorage.setItem(
      WORKOUT_HISTORY_STORAGE_KEY,
      JSON.stringify(historyWithMissingWod),
    )

    expect(loadWorkoutHistory()).toEqual(historyWithMissingWod)
  })

  it('no persiste una estructura inválida', () => {
    saveWorkoutHistory([
      {
        ...validHistory[0],
        date: 'invalid-date',
      } as WorkoutHistory[number],
    ])

    expect(localStorage.getItem(WORKOUT_HISTORY_STORAGE_KEY)).toBeNull()
  })

  it('no persiste fechas futuras ni IDs duplicados', () => {
    const futureEntry = { ...validHistory[0], date: '2999-01-01' } as WorkoutHistory[number]
    const duplicatedEntries = [validHistory[0], { ...validHistory[0], date: '2026-09-03' }]

    saveWorkoutHistory([futureEntry])
    expect(localStorage.getItem(WORKOUT_HISTORY_STORAGE_KEY)).toBeNull()

    saveWorkoutHistory(duplicatedEntries)
    expect(localStorage.getItem(WORKOUT_HISTORY_STORAGE_KEY)).toBeNull()
  })
})
