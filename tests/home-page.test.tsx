/** @vitest-environment jsdom */

import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { HomePage } from '../src/pages/HomePage'

afterEach(() => {
  cleanup()
})

describe('HomePage', () => {
  it('comunica el propósito del producto y ofrece accesos principales', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Encuentra tu próximo WOD.' })).toBeTruthy()
    expect(screen.getByText(/Consulta entrenamientos con su formato/)).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Explorar WODs' }).getAttribute('href')).toBe('/wods')
    expect(screen.getByRole('link', { name: 'Ver historial' }).getAttribute('href')).toBe('/history')
  })
})
