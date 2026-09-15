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
  return `${total} ${total === 1 ? "movimiento disponible" : "movimientos disponibles"}`;
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
    <section className="catalog-page exercise-catalog-page">
      <header className="exercise-catalog-header">
        <div className="exercise-catalog-header__body">
          <h1>Ejercicios</h1>
          <p>Elige el movimiento que necesitas para preparar, ejecutar y revisar tu entrenamiento.</p>
        </div>
        <p className="exercise-catalog-count" aria-live="polite">
          {catalog ? formatExerciseCount(catalog.totalElements) : "Explora por nombre"}
        </p>
      </header>

      <form className="exercise-search" onSubmit={handleSubmit} aria-label="Buscar ejercicios">
        <div className="exercise-search__field">
          <label htmlFor="exercise-search">Buscar por nombre</label>
          <p id="exercise-search-hint">Usa el nombre del movimiento para ir directo al resultado.</p>
        </div>
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

      <section className="exercise-results" aria-labelledby="exercise-results-title">
        <header className="exercise-results-heading">
          <div>
            <h2 id="exercise-results-title">Catálogo de movimientos</h2>
            <p>Compara categoría y medición antes de abrir el detalle del ejercicio.</p>
          </div>
          <p className="exercise-results-heading__status" aria-live="polite">
            {catalog
              ? appliedQuery
                ? `Resultados para “${appliedQuery}”`
                : "Todos los movimientos"
              : "Los resultados aparecerán aquí"}
          </p>
        </header>
        {!token && <StateMessage kind="private" title="El catálogo es privado" message="Inicia sesión para consultar ejercicios y sus detalles." action={{ label: "Entrar", href: "#/login" }} />}
        {token && isLoading && <LoadingMessage />}
        {token && !isLoading && error && <StateMessage kind={errorKind} title={errorKind === "network-error" ? "No hay conexión con los ejercicios" : "No pudimos cargar los ejercicios"} message={error} action={{ label: "Reintentar", onClick: () => { setIsLoading(true); setError(null); setReloadToken((currentToken) => currentToken + 1); } }} />}
        {token && !isLoading && !error && catalog?.items.length === 0 && <StateMessage kind="empty" title="No hay coincidencias" message="Prueba con otro nombre de ejercicio." />}
        {token && !isLoading && !error && catalog && catalog.items.length > 0 && (
          <>
            <div className="exercise-list-heading" aria-hidden="true">
              <span>Movimiento</span>
              <span>Perfil deportivo</span>
              <span>Abrir</span>
            </div>
            <ul className="exercise-list">
            {catalog.items.map((exercise) => (
              <li className="exercise-list__item" key={exercise.id}>
                <a
                  className="exercise-row"
                  href={`#/exercises/${exercise.id}`}
                  aria-label={`${exercise.name}. Categoría ${EXERCISE_CATEGORY_LABELS[exercise.category]}. Medición ${MEASUREMENT_LABELS[exercise.measurementType]}. Ver detalle del ejercicio`}
                >
                  <span className="exercise-row__number" aria-hidden="true">{String(exercise.id).padStart(3, "0")}</span>
                  <span className="exercise-row__identity"><strong>{exercise.name}</strong><small>Movimiento #{exercise.id}</small></span>
                  <span className="exercise-row__details">
                    <span><small>Categoría</small><strong>{EXERCISE_CATEGORY_LABELS[exercise.category]}</strong></span>
                    <span><small>Medición</small><strong>{MEASUREMENT_LABELS[exercise.measurementType]}</strong></span>
                  </span>
                  <span className="exercise-row__arrow" aria-hidden="true">-&gt;</span>
                </a>
              </li>
            ))}
            </ul>
          </>
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
