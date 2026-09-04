import { describe, expect, it } from 'vitest'
import {
  getLocalDateString,
  normalizeOptionalText,
  validateWorkoutDate,
} from '../src/lib/workoutHistoryValidation'

describe('validateWorkoutDate', () => {
  const today = '2026-09-04'

  it('acepta la fecha de hoy', () => {
    expect(validateWorkoutDate(today, today)).toEqual({
      valid: true,
      status: 'today',
    })
  })

  it('acepta una fecha anterior', () => {
    expect(validateWorkoutDate('2026-09-03', today)).toEqual({
      valid: true,
      status: 'past',
    })
  })

  it('rechaza una fecha futura', () => {
    expect(validateWorkoutDate('2026-09-05', today)).toEqual({
      valid: false,
      status: 'future',
    })
  })

  it.each(['2026-9-4', '2026-02-30', 'not-a-date'])(
    'rechaza una fecha inválida: %s',
    (date) => {
      expect(validateWorkoutDate(date, today)).toEqual({
        valid: false,
        status: 'invalid',
      })
    },
  )

  it.each(['', '   '])('rechaza una fecha vacía: %j', (date) => {
    expect(validateWorkoutDate(date, today)).toEqual({
      valid: false,
      status: 'empty',
    })
  })
})

describe('getLocalDateString', () => {
  it('obtiene la fecha usando los componentes locales', () => {
    const localDate = new Date(2026, 8, 4, 23, 59)

    expect(getLocalDateString(localDate)).toBe('2026-09-04')
  })
})

describe('normalizeOptionalText', () => {
  it('recorta el resultado conservando su contenido', () => {
    expect(normalizeOptionalText('  05:42  ')).toBe('05:42')
  })

  it('recorta las notas conservando su contenido', () => {
    expect(normalizeOptionalText('  Thrusters sin cortar.  ')).toBe(
      'Thrusters sin cortar.',
    )
  })

  it.each(['', '   ', '\t\n'])(
    'convierte un valor vacío en ausencia: %j',
    (value) => {
      expect(normalizeOptionalText(value)).toBeUndefined()
    },
  )

  it('mantiene la ausencia de un campo opcional', () => {
    expect(normalizeOptionalText()).toBeUndefined()
  })
})
