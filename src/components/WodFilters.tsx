import {
  WOD_FILTERS,
  type WodFilter,
} from '../lib/filterWods'

interface WodFiltersProps {
  favoritesOnly: boolean
  onFavoritesOnlyChange: (favoritesOnly: boolean) => void
  selectedFilter: WodFilter
  onFilterChange: (filter: WodFilter) => void
}

export function WodFilters({
  favoritesOnly,
  onFavoritesOnlyChange,
  selectedFilter,
  onFilterChange,
}: WodFiltersProps) {
  return (
    <fieldset className="catalog-filter-set">
      <legend className="field-label text-board-text">Filtrar WODs</legend>
      <div className="filter-rail">
        <span className="filter-rail-label" aria-hidden="true">Por formato</span>
        {WOD_FILTERS.map((filter) => {
          const isSelected = selectedFilter === filter

          return (
            <button
              key={filter}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onFilterChange(filter)}
              className={`filter-button ${
                isSelected
                  ? 'filter-button-active'
                  : 'filter-button-inactive'
              }`}
            >
              {filter}
            </button>
          )
        })}
        <span className="catalog-filter-divider" aria-hidden="true" />
        <button
          type="button"
          aria-pressed={favoritesOnly}
          onClick={() => onFavoritesOnlyChange(!favoritesOnly)}
          className={`filter-button ${
            favoritesOnly
              ? 'filter-button-active'
              : 'filter-button-inactive'
          }`}
        >
          Solo favoritos
        </button>
      </div>
    </fieldset>
  )
}
