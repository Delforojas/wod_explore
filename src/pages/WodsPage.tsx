import { useState } from 'react'
import { EmptyState } from '../components/EmptyState'
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
    <main
      id="main-content"
      className="page-container"
    >
      <header className="page-header">
        <p className="page-kicker">
          Biblioteca de entrenamientos
        </p>
        <h1 className="page-title">
          WODs para cada sesión.
        </h1>
        <p className="page-description">
          Consulta entrenamientos con su formato, nivel y resumen para encontrar tu
          próximo reto.
        </p>
      </header>

      <section aria-labelledby="wods-heading" className="page-section">
        <h2 id="wods-heading" className="catalog-section-title">
          Entrenamientos disponibles
        </h2>

        {!result.success ? (
          <p role="alert" className="state-error text-board-danger">
            No se pudieron cargar los entrenamientos locales.
          </p>
        ) : result.data.length === 0 ? (
          <EmptyState
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
                  title="No tienes favoritos"
                  message="Marca algún WOD como favorito para encontrarlo aquí."
                />
              </div>
            ) : filteredWods.length === 0 ? (
              <div className="mt-8">
                <EmptyState
                  title="No hay resultados"
                  message="No hay WODs que coincidan con los criterios seleccionados."
                />
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:mt-10 lg:grid-cols-3">
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
