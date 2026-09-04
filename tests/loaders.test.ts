import { describe, expect, it } from 'vitest'
import { loadExercises, parseExercises } from '../src/lib/loadExercises'
import { loadWods, parseWods } from '../src/lib/loadWods'

describe('data loaders', () => {
  it('carga los WODs locales válidos', () => {
    const result = loadWods()

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.length).toBeGreaterThan(0)
    }
  })

  it('carga los Exercises locales válidos', () => {
    const result = loadExercises()

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.length).toBeGreaterThan(0)
    }
  })

  it('devuelve un error controlado para WODs inválidos', () => {
    const result = parseWods({ exercises: 'invalid' })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(0)
    }
  })

  it('devuelve un error controlado para Exercises inválidos', () => {
    const result = parseExercises([{ category: 'Mobility' }])

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(0)
    }
  })
})
