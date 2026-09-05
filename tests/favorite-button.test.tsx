/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { FavoriteButton } from '../src/components/FavoriteButton'

afterEach(() => {
  cleanup()
})

describe('FavoriteButton', () => {
  it('muestra el estado no favorito con una etiqueta accesible', () => {
    render(<FavoriteButton isFavorite={false} onToggle={() => {}} wodName="Fran" />)

    const button = screen.getByRole('button', { name: 'Añadir Fran a favoritos' })

    expect(button.getAttribute('aria-pressed')).toBe('false')
    expect(button.className).toContain('border-board-line')
    expect(button.className).toContain('button-base')
  })

  it('muestra el estado favorito con una etiqueta accesible', () => {
    render(<FavoriteButton isFavorite onToggle={() => {}} wodName="Fran" />)

    const button = screen.getByRole('button', { name: 'Quitar Fran de favoritos' })

    expect(button.getAttribute('aria-pressed')).toBe('true')
    expect(button.className).toContain('border-board-accent/60')
  })

  it('ejecuta onToggle al activarse mediante el botón', () => {
    const onToggle = vi.fn()
    render(<FavoriteButton isFavorite={false} onToggle={onToggle} wodName="Fran" />)

    const button = screen.getByRole('button', { name: 'Añadir Fran a favoritos' })
    fireEvent.click(button)

    expect(button.tagName).toBe('BUTTON')
    expect(button.getAttribute('type')).toBe('button')
    expect(onToggle).toHaveBeenCalledTimes(1)
  })
})
