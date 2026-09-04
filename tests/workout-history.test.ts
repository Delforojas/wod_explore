import { describe, expect, it } from 'vitest'
import { createWorkoutHistoryEntry } from '../src/lib/workoutHistory'

const today = '2026-09-04'

describe('createWorkoutHistoryEntry', () => {
  it('crea una entrada válida para un WOD', () => {
    const entry = createWorkoutHistoryEntry({
      wodId: 'fran',
      date: today,
      today,
    })

    expect(entry).toMatchObject({
      wodId: 'fran',
      date: today,
    })
    expect(entry.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    )
  })

  it('genera un ID independiente del wodId', () => {
    const entry = createWorkoutHistoryEntry({
      wodId: 'fran',
      date: today,
      today,
    })

    expect(entry.id).not.toBe(entry.wodId)
  })

  it('permite registrar el mismo WOD varias veces', () => {
    const firstEntry = createWorkoutHistoryEntry({
      wodId: 'fran',
      date: '2026-09-03',
      today,
    })
    const secondEntry = createWorkoutHistoryEntry({
      wodId: 'fran',
      date: today,
      today,
    })

    expect(firstEntry.wodId).toBe(secondEntry.wodId)
    expect(firstEntry.id).not.toBe(secondEntry.id)
    expect(firstEntry.date).not.toBe(secondEntry.date)
  })

  it('permite registrar el mismo WOD varias veces el mismo día', () => {
    const firstEntry = createWorkoutHistoryEntry({
      wodId: 'fran',
      date: today,
      today,
    })
    const secondEntry = createWorkoutHistoryEntry({
      wodId: 'fran',
      date: today,
      today,
    })

    expect(firstEntry.date).toBe(secondEntry.date)
    expect(firstEntry.id).not.toBe(secondEntry.id)
  })

  it('normaliza result y notes antes de crear la entrada', () => {
    const entry = createWorkoutHistoryEntry({
      wodId: 'fran',
      date: today,
      result: '  05:42  ',
      notes: '  Thrusters sin cortar.  ',
      today,
    })

    expect(entry.result).toBe('05:42')
    expect(entry.notes).toBe('Thrusters sin cortar.')
  })

  it.each(['7 rondas + 12 reps', '100 kg', 'Completed'])(
    'conserva un resultado textual con formato %s',
    (result) => {
      const entry = createWorkoutHistoryEntry({
        wodId: 'fran',
        date: today,
        result,
        today,
      })

      expect(entry.result).toBe(result)
    },
  )

  it('omite result y notes cuando solo contienen espacios', () => {
    const entry = createWorkoutHistoryEntry({
      wodId: 'fran',
      date: today,
      result: '   ',
      notes: '\t\n',
      today,
    })

    expect(entry).not.toHaveProperty('result')
    expect(entry).not.toHaveProperty('notes')
  })

  it('rechaza una fecha futura antes de generar la entrada', () => {
    expect(() =>
      createWorkoutHistoryEntry({
        wodId: 'fran',
        date: '2026-09-05',
        today,
      }),
    ).toThrow('fecha future')
  })
})
