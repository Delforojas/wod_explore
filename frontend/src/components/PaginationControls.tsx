interface PaginationControlsProps {
  page: number;
  hasNext: boolean;
  isLoading: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export function PaginationControls({
  page,
  hasNext,
  isLoading,
  onPrevious,
  onNext,
}: PaginationControlsProps) {
  return (
    <nav className="pagination-controls" aria-label="Paginación">
      <button
        className="button button--secondary"
        type="button"
        onClick={onPrevious}
        disabled={isLoading || page === 0}
      >
        Anterior
      </button>
      <span className="pagination-status" aria-live="polite">
        Página {page + 1}
      </span>
      <button
        className="button button--secondary"
        type="button"
        onClick={onNext}
        disabled={isLoading || !hasNext}
      >
        Siguiente
      </button>
    </nav>
  );
}
