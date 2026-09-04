import { describe, expect, it } from 'vitest'
import wodsData from '../src/data/wods.json'
import { wodSchema } from '../src/schemas/wod.schema'

describe('wodSchema', () => {
  it('acepta un WOD válido', () => {
    const result = wodSchema.safeParse(wodsData[0])

    expect(result.success).toBe(true)
  })

  it('rechaza un WOD sin campos obligatorios', () => {
    const invalidWod = { ...wodsData[0], name: undefined }
    const result = wodSchema.safeParse(invalidWod)

    expect(result.success).toBe(false)
  })

  it('rechaza un tipo de WOD inválido', () => {
    const invalidWod = { ...wodsData[0], type: 'Interval' }
    const result = wodSchema.safeParse(invalidWod)

    expect(result.success).toBe(false)
  })

  it('rechaza una estructura de exercises inválida', () => {
    const invalidWod = {
      ...wodsData[0],
      exercises: [{ exerciseId: 'thruster' }],
    }
    const result = wodSchema.safeParse(invalidWod)

    expect(result.success).toBe(false)
  })
})
