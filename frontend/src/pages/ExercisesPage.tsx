import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { getExercises } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { LoadingMessage, StateMessage } from "../components/StateMessage";
import { PaginationControls } from "../components/PaginationControls";
import type { ExerciseCategory, ExercisePage, MeasurementType } from "../api/schemas";

const DEFAULT_PAGE_SIZE = 20;
const EXERCISE_CATEGORY_LABELS: Record<ExerciseCategory, string> = {
  WEIGHTLIFTING: "Halterofilia",
  GYMNASTICS: "Gimnasia",
  STRONGMAN: "Strongman",
  CARDIO: "Cardio",
  OTHER: "Otros",
};
const MEASUREMENT_LABELS: Record<MeasurementType, string> = {
  WEIGHT: "Peso",
  REPS: "Repeticiones",
  TIME: "Tiempo",
  DISTANCE: "Distancia",
  WEIGHT_DISTANCE: "Peso y distancia",
  OTHER: "Otra medida",
};

export function ExercisesPage() {
  const { token } = useAuth();
  const [catalog, setCatalog] = useState<ExercisePage | null>(null);
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [page, setPage] = useState(0);
  const [reloadToken, setReloadToken] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!token) {
      return;
    }
    getExercises(token, { name: appliedQuery }, { page, size: DEFAULT_PAGE_SIZE })
      .then((data) => { if (active) setCatalog(data); })
      .catch((caughtError: Error) => { if (active) setError(caughtError.message); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [token, appliedQuery, page, reloadToken]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setPage(0);
    setAppliedQuery(query);
  }

  function goToPage(nextPage: number) {
    setIsLoading(true);
    setError(null);
    setPage(nextPage);
  }

  return (
    <section className="catalog-page">
      <div className="page-heading">
        <div>
          <h1>Ejercicios</h1>
          <p className="heading-support">Movimientos para entender mejor cada sesión.</p>
        </div>
        <p className="heading-note" aria-live="polite">
          {catalog ? `${catalog.totalElements} movimientos disponibles` : "Explora por nombre"}
        </p>
      </div>
      <form className="search-field" onSubmit={handleSubmit}>
        <label htmlFor="exercise-search">Buscar ejercicios</label>
        <input id="exercise-search" name="name" type="search" autoComplete="off" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ej. Back Squat…" />
        <button className="button button--accent" type="submit">Buscar</button>
      </form>
      <p className="catalog-hint">Busca por nombre para ir directo al movimiento que necesitas.</p>
      {!token && <StateMessage title="El catálogo es privado" message="Inicia sesión para consultar ejercicios y sus detalles." action={{ label: "Entrar", href: "#/login" }} />}
      {token && isLoading && <LoadingMessage />}
      {token && !isLoading && error && <StateMessage title="No pudimos cargar los ejercicios" message={error} tone="error" action={{ label: "Reintentar", onClick: () => { setIsLoading(true); setError(null); setReloadToken((currentToken) => currentToken + 1); } }} />}
      {token && !isLoading && !error && catalog?.items.length === 0 && <StateMessage title="No hay coincidencias" message="Prueba con otro nombre de ejercicio." />}
      {token && !isLoading && !error && catalog && catalog.items.length > 0 && (
        <div className="catalog-list">
          {catalog.items.map((exercise) => (
            <a className="catalog-row" key={exercise.id} href={`#/exercises/${exercise.id}`}>
              <span className="row-number">{String(exercise.id).padStart(3, "0")}</span>
              <span className="row-main"><strong>{exercise.name}</strong><small>{EXERCISE_CATEGORY_LABELS[exercise.category]}</small></span>
              <span className="row-meta"><small>Medición</small>{MEASUREMENT_LABELS[exercise.measurementType]}</span>
              <span className="row-arrow" aria-hidden="true">-&gt;</span>
            </a>
          ))}
        </div>
      )}
      {token && !isLoading && !error && catalog && (
        <PaginationControls
          page={page}
          hasNext={catalog.hasNext}
          totalPages={catalog.totalPages}
          isLoading={isLoading}
          onPrevious={() => goToPage(Math.max(0, page - 1))}
          onNext={() => goToPage(page + 1)}
        />
      )}
    </section>
  );
}
