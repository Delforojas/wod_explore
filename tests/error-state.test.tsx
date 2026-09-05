/** @vitest-environment jsdom */

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { ErrorState } from '../src/components/ErrorState'

afterEach(() => {
  cleanup()
})

describe('ErrorState', () => {
  it('expone el mensaje de error como una alerta accesible', () => {
    render(
      <ErrorState
        title="No se pudo cargar el contenido"
        message="Comprueba los datos locales e inténtalo de nuevo."
      />,
    )

    const alert = screen.getByRole('alert')
    const heading = screen.getByRole('heading', { name: 'No se pudo cargar el contenido' })

    expect(alert).toBeTruthy()
    expect(alert.getAttribute('data-state-kind')).toBe('error')
    expect(alert.getAttribute('aria-labelledby')).toBe(heading.id)
    expect(heading.id).not.toBe('')
    expect(alert.textContent).toContain('Comprueba los datos locales e inténtalo de nuevo.')
  })

  it('muestra contenido de acción cuando se proporciona', () => {
    render(
      <ErrorState title="Error" message="No se pudo completar la operación.">
        <button type="button">Volver a intentar</button>
      </ErrorState>,
    )

    expect(screen.getByRole('button', { name: 'Volver a intentar' })).toBeTruthy()
  })
})
