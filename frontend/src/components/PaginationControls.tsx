interface PaginationControlsProps {
  page: number;
  hasNext: boolean;
  totalPages?: number;
  isLoading: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export function PaginationControls({
  page,
  hasNext,
  totalPages,
  isLoading,
  onPrevious,
  onNext,
}: PaginationControlsProps) {
  return (
    <nav className="pagination-controls" aria-label="Paginación">
      <button
        className="button button--secondary"
        type="button"
        aria-label="Anterior"
        onClick={onPrevious}
        disabled={isLoading || page === 0}
      >
        Anterior
      </button>
      <span className="pagination-status" aria-live="polite">
        Página {page + 1}{totalPages !== undefined && totalPages > 0 ? ` de ${totalPages}` : ""}
      </span>
      <button
        className="button button--secondary"
        type="button"
        aria-label="Siguiente"
        onClick={onNext}
        disabled={isLoading || !hasNext}
      >
        Siguiente
      </button>
    </nav>
  );
}
