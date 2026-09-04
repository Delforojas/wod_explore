import {
  WOD_FILTERS,
  type WodFilter,
} from '../lib/filterWods'

interface WodFiltersProps {
  selectedFilter: WodFilter
  onFilterChange: (filter: WodFilter) => void
}

export function WodFilters({
  selectedFilter,
  onFilterChange,
}: WodFiltersProps) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-slate-200">
        Filtrar WODs por tipo
      </legend>
      <div className="mt-4 flex flex-wrap gap-2" role="group">
        {WOD_FILTERS.map((filter) => {
          const isSelected = selectedFilter === filter

          return (
            <button
              key={filter}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onFilterChange(filter)}
              className={
                isSelected
                  ? 'rounded-full bg-orange-400 px-4 py-2 text-sm font-semibold text-slate-950'
                  : 'rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-orange-400 hover:text-orange-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400'
              }
            >
              {filter}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
