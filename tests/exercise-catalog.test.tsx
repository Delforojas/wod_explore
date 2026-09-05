/** @vitest-environment jsdom */

import { cleanup, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { AppRoutes } from '../src/App'
import { EmptyState } from '../src/components/EmptyState'
import { ExerciseCard } from '../src/components/ExerciseCard'
import { ExercisesPage } from '../src/pages/ExercisesPage'
import { loadExercises } from '../src/lib/loadExercises'

const loadedExercises = loadExercises()

if (!loadedExercises.success) {
  throw new Error('Los ejercicios locales deben ser válidos para ejecutar estos tests.')
}

const exercises = loadedExercises.data

afterEach(() => {
  cleanup()
})

function renderExercisesPage() {
  return render(
    <MemoryRouter>
      <ExercisesPage exercises={exercises} />
    </MemoryRouter>,
  )
}

describe('exercise catalog', () => {
  it('muestra nombre, categoría y descripción en una tarjeta', () => {
    const exercise = exercises[0]
    if (!exercise) throw new Error('Se esperaba al menos un ejercicio local.')

    render(<ExerciseCard exercise={exercise} />)

    const card = screen.getByRole('article', { name: exercise.name })

    expect(within(card).getByRole('heading', { name: exercise.name })).toBeTruthy()
    expect(within(card).getAllByText(exercise.category).length).toBeGreaterThan(0)
    expect(within(card).getByText(exercise.description)).toBeTruthy()
  })

  it('muestra todos los ejercicios locales', () => {
    renderExercisesPage()

    for (const exercise of exercises) {
      expect(screen.getByRole('heading', { name: exercise.name })).toBeTruthy()
    }
  })

  it('representa las categorías existentes y permitidas por la spec', () => {
    renderExercisesPage()

    const allowedCategories = ['Weightlifting', 'Gymnastics', 'Cardio']
    const categories = new Set(exercises.map((exercise) => exercise.category))

    for (const category of categories) {
      expect(allowedCategories).toContain(category)
      expect(screen.getAllByText(category).length).toBeGreaterThan(0)
    }
  })

  it('muestra el estado vacío para una colección sin ejercicios', () => {
    render(
      <ExercisesPage exercises={[]} />,
    )

    const emptyState = screen.getByRole('status')

    expect(emptyState.textContent).toContain(
      'No hay ejercicios disponibles',
    )
    expect(emptyState.getAttribute('data-state-kind')).toBe('exercises')
  })

  it('expone el catálogo mediante la ruta /exercises', () => {
    render(
      <MemoryRouter initialEntries={['/exercises']}>
        <AppRoutes />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Ejercicios de CrossFit.' })).toBeTruthy()
  })

  it('reutiliza el estado vacío como componente independiente', () => {
    render(
      <EmptyState
        title="Sin ejercicios"
        message="No hay ejercicios para mostrar."
      />,
    )

    expect(screen.getByRole('status').textContent).toContain('Sin ejercicios')
  })
})
