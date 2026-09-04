import { describe, expect, it } from 'vitest'
import { findWodById } from '../src/lib/findWodById'
import { loadWods } from '../src/lib/loadWods'

const loadedWods = loadWods()

if (!loadedWods.success) {
  throw new Error('Los WODs locales deben ser válidos para ejecutar estos tests.')
}

describe('findWodById', () => {
  it('encuentra un WOD existente por su identificador', () => {
    const wod = findWodById(loadedWods.data, 'fran')

    expect(wod?.name).toBe('Fran')
  })

  it('devuelve undefined para un identificador inexistente', () => {
    expect(findWodById(loadedWods.data, 'not-found')).toBeUndefined()
  })

  it('devuelve undefined cuando no recibe identificador', () => {
    expect(findWodById(loadedWods.data, undefined)).toBeUndefined()
  })
})
