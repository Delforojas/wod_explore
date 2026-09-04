import { useState } from 'react'
import { EmptyState } from '../components/EmptyState'
import { WodCard } from '../components/WodCard'
import { WodFilters } from '../components/WodFilters'
import { filterWods, type WodFilter } from '../lib/filterWods'
import { loadWods } from '../lib/loadWods'
import type { Wod } from '../types/wod'

interface WodsPageProps {
  wods?: Wod[]
}

export function WodsPage({ wods }: WodsPageProps = {}) {
  const [selectedFilter, setSelectedFilter] = useState<WodFilter>('All')
  const result =
    wods === undefined
      ? loadWods()
      : {
          success: true as const,
          data: wods,
        }
  const filteredWods = result.success
    ? filterWods(result.data, selectedFilter)
    : []

  return (
    <main
      id="main-content"
      className="mx-auto min-h-[calc(100vh-81px)] max-w-6xl px-6 py-12 sm:px-8 sm:py-16"
    >
      <header className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
          Biblioteca de entrenamientos
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          WODs para cada sesión.
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-300">
          Consulta entrenamientos con su formato, nivel y resumen para encontrar tu
          próximo reto.
        </p>
      </header>

      <section aria-labelledby="wods-heading" className="mt-12">
        <h2 id="wods-heading" className="sr-only">
          Lista de WODs
        </h2>

        {!result.success ? (
          <p role="alert" className="rounded-2xl border border-red-400/40 bg-red-400/10 p-6 text-red-200">
            No se pudieron cargar los entrenamientos locales.
          </p>
        ) : result.data.length === 0 ? (
          <EmptyState
            title="No hay entrenamientos disponibles"
            message="Todavía no hay WODs para mostrar. Vuelve a intentarlo más adelante."
          />
        ) : (
          <>
            <WodFilters
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />
            {filteredWods.length === 0 ? (
              <div className="mt-8">
                <EmptyState
                  title="No hay resultados"
                  message="No hay WODs que coincidan con el tipo de entrenamiento seleccionado."
                />
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredWods.map((wod) => (
                  <WodCard key={wod.id} wod={wod} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  )
}
