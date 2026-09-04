import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import wodsData from '../src/data/wods.json'
import { EmptyState } from '../src/components/EmptyState'
import { WodCard } from '../src/components/WodCard'
import { WodsPage } from '../src/pages/WodsPage'
import { loadWods } from '../src/lib/loadWods'
import { emptyFavorites } from './favorites-fixtures'

describe('WOD catalog', () => {
  it('muestra los campos principales de un WOD', () => {
    const result = loadWods()

    expect(result.success).toBe(true)
    if (!result.success) return

    const wod = result.data[0]
    if (!wod) throw new Error('Se esperaba al menos un WOD local.')

    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <WodCard wod={wod} isFavorite={false} onToggleFavorite={() => {}} />
      </MemoryRouter>,
    )

    expect(markup).toContain(wod.name)
    expect(markup).toContain(wod.type)
    expect(markup).toContain(wod.level)
    expect(markup).toContain(wod.description)
  })

  it('muestra todos los WODs validados', () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <WodsPage favorites={emptyFavorites} />
      </MemoryRouter>,
    )

    for (const wod of wodsData) {
      expect(markup).toContain(wod.name)
    }
  })

  it('muestra el estado vacío con un mensaje accesible', () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <WodsPage wods={[]} favorites={emptyFavorites} />
      </MemoryRouter>,
    )

    expect(markup).toContain('role="status"')
    expect(markup).toContain('No hay entrenamientos disponibles')
    expect(markup).toContain('Todavía no hay WODs para mostrar. Vuelve a intentarlo más adelante.')
  })

  it('expone el componente de estado vacío de forma reutilizable', () => {
    const markup = renderToStaticMarkup(
      <EmptyState
        title="Sin WODs"
        message="Todavía no hay WODs para mostrar."
      />,
    )

    expect(markup).toContain('role="status"')
    expect(markup).toContain('Sin WODs')
  })
})
