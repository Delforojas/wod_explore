import { useId } from 'react'

export type EmptyStateKind =
  | 'generic'
  | 'catalog'
  | 'search'
  | 'filters'
  | 'favorites'
  | 'history'
  | 'exercises'

interface EmptyStateProps {
  title: string
  message: string
  kind?: EmptyStateKind
}

const emptyStateKindClasses: Record<EmptyStateKind, string> = {
  generic: 'state-empty-generic',
  catalog: 'state-empty-catalog',
  search: 'state-empty-search',
  filters: 'state-empty-filters',
  favorites: 'state-empty-favorites',
  history: 'state-empty-history',
  exercises: 'state-empty-exercises',
}

export function EmptyState({ title, message, kind = 'generic' }: EmptyStateProps) {
  const titleId = useId()

  return (
    <section
      role="status"
      aria-labelledby={titleId}
      data-state-kind={kind}
      className={`state-empty ${emptyStateKindClasses[kind]}`}
    >
      <h2 id={titleId} className="text-xl font-bold tracking-[-0.02em] text-board-text">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-board-muted">{message}</p>
    </section>
  )
}
