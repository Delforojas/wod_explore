import { describe, expect, it } from 'vitest'
import exercisesData from '../src/data/exercises.json'
import { exerciseSchema } from '../src/schemas/exercise.schema'

describe('exerciseSchema', () => {
  it('acepta un Exercise válido', () => {
    const result = exerciseSchema.safeParse(exercisesData[0])

    expect(result.success).toBe(true)
  })

  it('rechaza un Exercise sin campos obligatorios', () => {
    const invalidExercise = { ...exercisesData[0], description: undefined }
    const result = exerciseSchema.safeParse(invalidExercise)

    expect(result.success).toBe(false)
  })

  it('rechaza una categoría de ejercicio inválida', () => {
    const invalidExercise = { ...exercisesData[0], category: 'Mobility' }
    const result = exerciseSchema.safeParse(invalidExercise)

    expect(result.success).toBe(false)
  })
})
