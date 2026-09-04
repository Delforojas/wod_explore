import { describe, expect, it } from 'vitest'
import {
  deleteWorkoutEntry,
  sortWorkoutHistory,
} from '../src/lib/workoutHistory'
import type { WorkoutHistoryEntry } from '../src/types/workoutHistory'

const createEntry = (
  id: string,
  wodId: string,
  date: string,
): WorkoutHistoryEntry => ({
  id,
  wodId,
  date,
})

describe('sortWorkoutHistory', () => {
  it('devuelve un historial vacío cuando recibe un array vacío', () => {
    expect(sortWorkoutHistory([])).toEqual([])
  })

  it('mantiene un único registro', () => {
    const entry = createEntry('history-001', 'fran', '2026-09-04')

    expect(sortWorkoutHistory([entry])).toEqual([entry])
  })

  it('ordena varios registros de más reciente a más antiguo', () => {
    const entries = [
      createEntry('history-001', 'fran', '2026-09-01'),
      createEntry('history-002', 'cindy', '2026-09-04'),
      createEntry('history-003', 'murph', '2026-08-28'),
    ]

    expect(sortWorkoutHistory(entries).map((entry) => entry.id)).toEqual([
      'history-002',
      'history-001',
      'history-003',
    ])
  })

  it('mantiene un orden estable para registros del mismo día', () => {
    const firstEntry = createEntry('history-001', 'fran', '2026-09-04')
    const secondEntry = createEntry('history-002', 'fran', '2026-09-04')
    const thirdEntry = createEntry('history-003', 'cindy', '2026-09-03')

    expect(sortWorkoutHistory([firstEntry, secondEntry, thirdEntry])).toEqual([
      firstEntry,
      secondEntry,
      thirdEntry,
    ])
  })

  it('no muta el array original', () => {
    const entries = [
      createEntry('history-001', 'fran', '2026-09-01'),
      createEntry('history-002', 'cindy', '2026-09-04'),
    ]

    const originalEntries = [...entries]
    const sortedEntries = sortWorkoutHistory(entries)

    expect(entries).toEqual(originalEntries)
    expect(sortedEntries).not.toBe(entries)
  })
})

describe('deleteWorkoutEntry', () => {
  it('elimina una entrada existente por su id', () => {
    const entries = [
      createEntry('history-001', 'fran', '2026-09-03'),
      createEntry('history-002', 'cindy', '2026-09-04'),
    ]

    expect(deleteWorkoutEntry(entries, 'history-001')).toEqual([entries[1]])
  })

  it('conserva los demás registros', () => {
    const entries = [
      createEntry('history-001', 'fran', '2026-09-03'),
      createEntry('history-002', 'cindy', '2026-09-04'),
      createEntry('history-003', 'murph', '2026-09-02'),
    ]

    expect(deleteWorkoutEntry(entries, 'history-002').map((entry) => entry.id)).toEqual([
      'history-001',
      'history-003',
    ])
  })

  it('conserva otros registros del mismo WOD', () => {
    const firstEntry = createEntry('history-001', 'fran', '2026-09-03')
    const secondEntry = createEntry('history-002', 'fran', '2026-09-04')

    expect(deleteWorkoutEntry([firstEntry, secondEntry], firstEntry.id)).toEqual([
      secondEntry,
    ])
  })

  it('devuelve los registros sin cambios si el id no existe', () => {
    const entries = [createEntry('history-001', 'fran', '2026-09-04')]

    expect(deleteWorkoutEntry(entries, 'missing-id')).toEqual(entries)
  })

  it('devuelve un historial vacío cuando elimina sobre un array vacío', () => {
    expect(deleteWorkoutEntry([], 'missing-id')).toEqual([])
  })
})
