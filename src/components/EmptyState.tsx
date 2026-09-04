interface EmptyStateProps {
  title: string
  message: string
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <section
      role="status"
      className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 px-6 py-12 text-center"
    >
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">{message}</p>
    </section>
  )
}
