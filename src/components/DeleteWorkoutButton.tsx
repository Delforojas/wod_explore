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
      className="button-danger-secondary"
    >
      Eliminar
    </button>
  )
}
