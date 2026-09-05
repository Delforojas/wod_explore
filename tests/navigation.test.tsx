/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AppRoutes } from '../src/App'
import { Header } from '../src/components/Header'

afterEach(() => {
  cleanup()
})

function renderNavigation(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Header />
      <AppRoutes />
    </MemoryRouter>,
  )
}

describe('main navigation', () => {
  it('expone enlaces internos para las secciones principales', () => {
    renderNavigation()

    const navigation = screen.getByRole('navigation', { name: 'Navegación principal' })
    const navigationLinks = within(navigation).getAllByRole('link')

    expect(screen.getByRole('link', { name: 'WOD Explorer' }).getAttribute('href')).toBe('/')
    expect(navigationLinks.map((link) => link.textContent)).toEqual([
      'Inicio',
      'WODs',
      'Ejercicios',
      'Historial',
    ])
    expect(navigationLinks.map((link) => link.getAttribute('href'))).toEqual([
      '/',
      '/wods',
      '/exercises',
      '/history',
    ])
  })

  it('cambia entre las páginas sin recargar la aplicación', () => {
    renderNavigation()

    fireEvent.click(screen.getByRole('link', { name: 'Ejercicios' }))
    expect(screen.getByRole('heading', { name: 'Ejercicios de CrossFit.' })).toBeTruthy()
    expect(window.location.pathname).toBe('/')

    fireEvent.click(screen.getByRole('link', { name: 'WODs' }))
    expect(screen.getByRole('heading', { name: 'WODs para cada sesión.' })).toBeTruthy()
    expect(window.location.pathname).toBe('/')

    fireEvent.click(screen.getByRole('link', { name: 'Historial' }))
    expect(screen.getByRole('heading', { name: 'Historial de entrenamientos.' })).toBeTruthy()
    expect(window.location.pathname).toBe('/')

    fireEvent.click(screen.getByRole('link', { name: 'Inicio' }))
    expect(screen.getByRole('heading', { name: 'Encuentra tu próximo WOD.' })).toBeTruthy()
  })

  it('indica la sección activa también en rutas anidadas', () => {
    renderNavigation('/')

    expect(screen.getByRole('link', { name: 'Inicio' }).getAttribute('aria-current')).toBe('page')
    expect(screen.getByRole('link', { name: 'Inicio' }).className).toContain('nav-link-active')
    expect(screen.getByRole('link', { name: 'WODs' }).getAttribute('aria-current')).toBeNull()

    cleanup()
    renderNavigation('/wods/fran')

    expect(screen.getByRole('link', { name: 'WODs' }).getAttribute('aria-current')).toBe('page')
    expect(screen.getByRole('link', { name: 'WODs' }).className).toContain('nav-link-active')
    expect(screen.getByRole('link', { name: 'Inicio' }).getAttribute('aria-current')).toBeNull()
  })
})
