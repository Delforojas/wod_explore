import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { getExercises } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { LoadingMessage, StateMessage } from "../components/StateMessage";
import { PaginationControls } from "../components/PaginationControls";
import type { ExercisePage } from "../api/schemas";

const DEFAULT_PAGE_SIZE = 20;

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
        </div>
        <p className="heading-note">{catalog?.totalElements ?? 0} movimientos disponibles</p>
      </div>
      <form className="search-field" onSubmit={handleSubmit}>
        <label htmlFor="exercise-search">Buscar ejercicios</label>
        <input id="exercise-search" name="name" type="search" autoComplete="off" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ej. Back Squat…" />
        <button className="button button--accent" type="submit">Buscar</button>
      </form>
      {!token && <StateMessage title="El catálogo es privado" message="Inicia sesión para consultar ejercicios y sus detalles." action={{ label: "Entrar", href: "#/login" }} />}
      {token && isLoading && <LoadingMessage />}
      {token && !isLoading && error && <StateMessage title="No pudimos cargar los ejercicios" message={error} tone="error" action={{ label: "Reintentar", onClick: () => { setIsLoading(true); setError(null); setReloadToken((currentToken) => currentToken + 1); } }} />}
      {token && !isLoading && !error && catalog?.items.length === 0 && <StateMessage title="No hay coincidencias" message="Prueba con otro nombre de ejercicio." />}
      {token && !isLoading && !error && catalog && catalog.items.length > 0 && (
        <div className="catalog-list">
          {catalog.items.map((exercise) => (
            <a className="catalog-row" key={exercise.id} href={`#/exercises/${exercise.id}`}>
              <span className="row-number">{String(exercise.id).padStart(3, "0")}</span>
              <span className="row-main"><strong>{exercise.name}</strong><small>{exercise.category}</small></span>
              <span className="row-meta">{exercise.measurementType}</span>
              <span className="row-arrow" aria-hidden="true">-&gt;</span>
            </a>
          ))}
        </div>
      )}
      {token && !isLoading && !error && catalog && (
        <PaginationControls
          page={page}
          hasNext={catalog.hasNext}
          isLoading={isLoading}
          onPrevious={() => goToPage(Math.max(0, page - 1))}
          onNext={() => goToPage(page + 1)}
        />
      )}
    </section>
  );
}
