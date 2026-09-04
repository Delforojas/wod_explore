interface DeleteWorkoutButtonProps {
  entryId: string
  wodName: string
  date: string
  onDelete: (entryId: string) => void
}

export function DeleteWorkoutButton({
  entryId,
  wodName,
  date,
  onDelete,
}: DeleteWorkoutButtonProps) {
  return (
    <button
      type="button"
      aria-label={`Eliminar registro de ${wodName} del ${date}`}
      onClick={() => onDelete(entryId)}
      className="inline-flex min-h-11 touch-manipulation items-center justify-center rounded-md border border-red-400/50 px-3 py-2 text-sm font-semibold text-red-200 transition-colors hover:border-red-300 hover:bg-red-400/10 hover:text-red-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-300 focus-visible:ring-2 focus-visible:ring-red-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
    >
      Eliminar
    </button>
  )
}
