import { useState } from 'react'
import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { WodCard } from '../components/WodCard'
import { WodFilters } from '../components/WodFilters'
import { WodSearch } from '../components/WodSearch'
import type { UseFavoritesResult } from '../hooks/useFavorites'
import { filterWods, type WodFilter } from '../lib/filterWods'
import { loadWods } from '../lib/loadWods'
import type { Wod } from '../types/wod'

interface WodsPageProps {
  favorites: UseFavoritesResult
  wods?: Wod[]
}

export function WodsPage({ favorites, wods }: WodsPageProps) {
  const [selectedFilter, setSelectedFilter] = useState<WodFilter>('All')
  const [search, setSearch] = useState('')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const result =
    wods === undefined
      ? loadWods()
      : {
          success: true as const,
        data: wods,
      }
  const { favoriteIds, isFavorite, toggleFavorite } = favorites
  const filteredWods = result.success
    ? filterWods(result.data, selectedFilter, search, {
        favoritesOnly,
        favoriteIds,
      })
    : []

  return (
    <main id="main-content" className="app-page catalog-page">
      <header className="catalog-intro">
        <h1 className="catalog-title">
          WODs para cada sesión.
        </h1>
        <p className="catalog-description">
          Consulta entrenamientos con su formato, nivel y resumen para encontrar tu
          próximo reto.
        </p>
        <p className="catalog-index">Biblioteca / Entrenamientos</p>
      </header>

      <section aria-labelledby="wods-heading" className="catalog-stage">
        <div className="catalog-stage-heading">
          <h2 id="wods-heading" className="catalog-section-title">
            Entrenamientos disponibles
          </h2>
          <span className="catalog-stage-rule" aria-hidden="true" />
        </div>

        {!result.success ? (
          <ErrorState
            title="No se pudieron cargar los WODs"
            message="Revisa los datos locales e inténtalo de nuevo."
          />
        ) : result.data.length === 0 ? (
          <EmptyState
            kind="catalog"
            title="No hay entrenamientos disponibles"
            message="Todavía no hay WODs para mostrar. Vuelve a intentarlo más adelante."
          />
        ) : (
          <>
            <div className="catalog-controls">
              <WodSearch value={search} onChange={setSearch} />
              <div className="catalog-filters">
                <WodFilters
                  favoritesOnly={favoritesOnly}
                  onFavoritesOnlyChange={setFavoritesOnly}
                  selectedFilter={selectedFilter}
                  onFilterChange={setSelectedFilter}
                />
              </div>
            </div>
            {favoritesOnly && favoriteIds.length === 0 ? (
              <div className="mt-8">
                <EmptyState
                  kind="favorites"
                  title="No tienes favoritos"
                  message="Marca algún WOD como favorito para encontrarlo aquí."
                />
              </div>
            ) : filteredWods.length === 0 ? (
              <div className="mt-8">
                <EmptyState
                  kind={search.trim() ? 'search' : 'filters'}
                  title={search.trim() ? 'No encontramos WODs' : 'No hay resultados'}
                  message={
                    search.trim()
                      ? 'Prueba con otro término de búsqueda.'
                      : 'No hay WODs que coincidan con los filtros seleccionados.'
                  }
                />
              </div>
            ) : (
              <div className="catalog-list">
                {filteredWods.map((wod) => (
                  <WodCard
                    key={wod.id}
                    wod={wod}
                    isFavorite={isFavorite(wod.id)}
                    onToggleFavorite={() => toggleFavorite(wod.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  )
}
