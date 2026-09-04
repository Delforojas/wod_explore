/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { WodsPage } from '../src/pages/WodsPage'
import { loadWods } from '../src/lib/loadWods'
import type { Wod } from '../src/types/wod'

const loadedWods = loadWods()

if (!loadedWods.success) {
  throw new Error('Los WODs locales deben ser válidos para ejecutar estos tests.')
}

const wods = loadedWods.data

function renderWodsPage(testWods: Wod[]) {
  return render(
    <MemoryRouter>
      <WodsPage wods={testWods} />
    </MemoryRouter>,
  )
}

afterEach(() => {
  cleanup()
})

describe('WodsPage filters', () => {
  it('muestra los cuatro filtros y todos los WODs por defecto', () => {
    renderWodsPage(wods)

    expect(
      screen.getByRole('button', { name: 'All' }).getAttribute('aria-pressed'),
    ).toBe('true')
    expect(screen.getByRole('button', { name: 'For Time' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'AMRAP' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'EMOM' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Fran' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Cindy' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'EMOM Strength' })).toBeTruthy()
  })

  it.each([
    ['For Time', 'Fran', 'Cindy'],
    ['AMRAP', 'Cindy', 'Fran'],
    ['EMOM', 'EMOM Strength', 'Fran'],
  ] as const)('filtra WODs con %s', (filter, visibleWod, hiddenWod) => {
    renderWodsPage(wods)

    fireEvent.click(screen.getByRole('button', { name: filter }))

    expect(screen.getByRole('heading', { name: visibleWod })).toBeTruthy()
    expect(screen.queryByRole('heading', { name: hiddenWod })).toBeNull()
    expect(
      screen.getByRole('button', { name: filter }).getAttribute('aria-pressed'),
    ).toBe('true')
  })

  it('vuelve a mostrar todos los WODs con All', () => {
    renderWodsPage(wods)

    fireEvent.click(screen.getByRole('button', { name: 'AMRAP' }))
    fireEvent.click(screen.getByRole('button', { name: 'All' }))

    expect(screen.getByRole('heading', { name: 'Fran' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Cindy' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'EMOM Strength' })).toBeTruthy()
  })

  it('muestra el estado sin resultados cuando el filtro no coincide', () => {
    const forTimeWods = wods.filter((wod) => wod.type === 'For Time')
    renderWodsPage(forTimeWods)

    fireEvent.click(screen.getByRole('button', { name: 'AMRAP' }))

    expect(screen.getByRole('status').textContent).toContain('No hay resultados')
  })
})
