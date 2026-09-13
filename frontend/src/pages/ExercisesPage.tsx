import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { getExercises } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { LoadingMessage, StateMessage } from "../components/StateMessage";
import { getErrorStateKind } from "../components/stateMessageUtils";
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

function formatExerciseCount(total: number) {
  return `${total} ${total === 1 ? "movimiento" : "movimientos"} disponibles`;
}

export function ExercisesPage() {
  const { token } = useAuth();
  const [catalog, setCatalog] = useState<ExercisePage | null>(null);
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [page, setPage] = useState(0);
  const [reloadToken, setReloadToken] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorKind, setErrorKind] = useState<"error" | "network-error">("error");

  useEffect(() => {
    let active = true;
    if (!token) {
      return;
    }
    getExercises(token, { name: appliedQuery }, { page, size: DEFAULT_PAGE_SIZE })
      .then((data) => { if (active) setCatalog(data); })
      .catch((caughtError: unknown) => {
        if (!active) return;
        setError(caughtError instanceof Error ? caughtError.message : "No se pudieron cargar los ejercicios.");
        setErrorKind(getErrorStateKind(caughtError));
      })
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
    <section className="catalog-page catalog-page--exercises">
      <header className="page-heading">
        <div>
          <h1>Ejercicios</h1>
          <p className="heading-support">Movimientos para entender mejor cada sesión.</p>
        </div>
        <p className="heading-note" aria-live="polite">
          {catalog ? formatExerciseCount(catalog.totalElements) : "Explora por nombre"}
        </p>
      </header>
      <form className="search-field" onSubmit={handleSubmit}>
        <label htmlFor="exercise-search">Buscar ejercicios</label>
        <input
          id="exercise-search"
          name="name"
          type="search"
          aria-describedby="exercise-search-hint"
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ej. Back Squat…"
        />
        <button className="button button--accent" type="submit">Buscar</button>
      </form>
      <p className="catalog-hint" id="exercise-search-hint">Busca por nombre para ir directo al movimiento que necesitas.</p>
      <section className="catalog-results" aria-labelledby="exercise-results-title">
        <div className="catalog-results-heading">
          <h2 id="exercise-results-title">Resultados de ejercicios</h2>
          <p className="catalog-results-heading__status" aria-live="polite">
            {catalog
              ? appliedQuery
                ? `Resultados para “${appliedQuery}”`
                : "Todos los movimientos"
              : "Los resultados aparecerán aquí"}
          </p>
        </div>
        {!token && <StateMessage kind="private" title="El catálogo es privado" message="Inicia sesión para consultar ejercicios y sus detalles." action={{ label: "Entrar", href: "#/login" }} />}
        {token && isLoading && <LoadingMessage />}
        {token && !isLoading && error && <StateMessage kind={errorKind} title={errorKind === "network-error" ? "No hay conexión con los ejercicios" : "No pudimos cargar los ejercicios"} message={error} action={{ label: "Reintentar", onClick: () => { setIsLoading(true); setError(null); setReloadToken((currentToken) => currentToken + 1); } }} />}
        {token && !isLoading && !error && catalog?.items.length === 0 && <StateMessage kind="empty" title="No hay coincidencias" message="Prueba con otro nombre de ejercicio." />}
        {token && !isLoading && !error && catalog && catalog.items.length > 0 && (
          <ul className="catalog-list">
            {catalog.items.map((exercise) => (
              <li className="catalog-list__item" key={exercise.id}>
                <a className="catalog-row catalog-row--exercise" href={`#/exercises/${exercise.id}`}>
                  <span className="row-number">{String(exercise.id).padStart(3, "0")}</span>
                  <span className="row-main"><strong>{exercise.name}</strong><small className="row-main__category"><span>Categoría</span>{EXERCISE_CATEGORY_LABELS[exercise.category]}</small></span>
                  <span className="row-meta"><small>Medición</small>{MEASUREMENT_LABELS[exercise.measurementType]}</span>
                  <span className="row-arrow" aria-hidden="true">-&gt;</span>
                </a>
              </li>
            ))}
          </ul>
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
    </section>
  );
}
