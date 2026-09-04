import { describe, expect, it } from 'vitest'
import {
  workoutHistoryEntrySchema,
  workoutHistorySchema,
} from '../src/schemas/workoutHistory.schema'

const validEntry = {
  id: 'history-123',
  wodId: 'fran',
  date: '2026-09-04',
}

describe('workoutHistoryEntrySchema', () => {
  it('acepta una entrada válida sin campos opcionales', () => {
    const result = workoutHistoryEntrySchema.safeParse(validEntry)

    expect(result.success).toBe(true)
  })

  it('acepta resultado y notas opcionales', () => {
    const result = workoutHistoryEntrySchema.safeParse({
      ...validEntry,
      result: '05:42',
      notes: 'Thrusters sin cortar.',
    })

    expect(result.success).toBe(true)
  })

  it.each(['id', 'wodId'] as const)('rechaza %s ausente', (field) => {
    const invalidEntry = { ...validEntry }
    delete invalidEntry[field]

    const result = workoutHistoryEntrySchema.safeParse(invalidEntry)

    expect(result.success).toBe(false)
  })

  it.each(['id', 'wodId'] as const)('rechaza %s vacío', (field) => {
    const result = workoutHistoryEntrySchema.safeParse({
      ...validEntry,
      [field]: '',
    })

    expect(result.success).toBe(false)
  })

  it.each(['2026-9-4', '2026-02-30', 'not-a-date'])(
    'rechaza una fecha inválida: %s',
    (date) => {
      const result = workoutHistoryEntrySchema.safeParse({
        ...validEntry,
        date,
      })

      expect(result.success).toBe(false)
    },
  )

  it('rechaza propiedades desconocidas', () => {
    const result = workoutHistoryEntrySchema.safeParse({
      ...validEntry,
      extra: true,
    })

    expect(result.success).toBe(false)
  })
})

describe('workoutHistorySchema', () => {
  it('acepta un array de entradas válidas', () => {
    const result = workoutHistorySchema.safeParse([
      validEntry,
      { ...validEntry, id: 'history-456', result: '7 rondas + 12 reps' },
    ])

    expect(result.success).toBe(true)
  })

  it('acepta un historial vacío', () => {
    const result = workoutHistorySchema.safeParse([])

    expect(result.success).toBe(true)
  })

  it('rechaza un array con una entrada inválida', () => {
    const result = workoutHistorySchema.safeParse([
      validEntry,
      { ...validEntry, id: '' },
    ])

    expect(result.success).toBe(false)
  })

  it('rechaza IDs duplicados dentro del historial', () => {
    const result = workoutHistorySchema.safeParse([
      validEntry,
      { ...validEntry, date: '2026-09-03' },
    ])

    expect(result.success).toBe(false)
  })

  it('rechaza campos opcionales compuestos únicamente por espacios', () => {
    const result = workoutHistoryEntrySchema.safeParse({
      ...validEntry,
      notes: '   ',
    })

    expect(result.success).toBe(false)
  })

  it('rechaza una estructura que no sea un array', () => {
    const result = workoutHistorySchema.safeParse(validEntry)

    expect(result.success).toBe(false)
  })
})
