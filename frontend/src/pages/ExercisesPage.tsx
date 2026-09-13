import { useEffect, useState } from "react";

import { getExercises } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { LoadingMessage, StateMessage } from "../components/StateMessage";
import type { Exercise } from "../api/schemas";

export function ExercisesPage() {
  const { token } = useAuth();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function loadExercises() {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    getExercises(token).then(setExercises).catch((caughtError: Error) => setError(caughtError.message)).finally(() => setIsLoading(false));
  }

  useEffect(() => {
    let active = true;
    if (!token) return;
    getExercises(token)
      .then((data) => { if (active) setExercises(data); })
      .catch((caughtError: Error) => { if (active) setError(caughtError.message); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [token]);

  const visibleExercises = exercises.filter((exercise) => exercise.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <section className="catalog-page">
      <div className="page-heading">
        <div>
          <h1>Ejercicios</h1>
        </div>
        <p className="heading-note">{exercises.length} movimientos disponibles</p>
      </div>
      <label className="search-field">
        <span>Buscar ejercicios</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ej. Back Squat" />
      </label>
      {!token && <StateMessage title="El catálogo es privado" message="Inicia sesión para consultar ejercicios y sus detalles." action={{ label: "Entrar", href: "#/login" }} />}
      {token && isLoading && <LoadingMessage />}
      {token && !isLoading && error && <StateMessage title="No pudimos cargar los ejercicios" message={error} tone="error" action={{ label: "Reintentar", onClick: loadExercises }} />}
      {token && !isLoading && !error && visibleExercises.length === 0 && <StateMessage title="No hay coincidencias" message="Prueba con otro nombre de ejercicio." />}
      {token && !isLoading && !error && visibleExercises.length > 0 && (
        <div className="catalog-list">
          {visibleExercises.map((exercise) => (
            <a className="catalog-row" key={exercise.id} href={`#/exercises/${exercise.id}`}>
              <span className="row-number">{String(exercise.id).padStart(3, "0")}</span>
              <span className="row-main"><strong>{exercise.name}</strong><small>{exercise.category}</small></span>
              <span className="row-meta">{exercise.measurementType}</span>
              <span className="row-arrow" aria-hidden="true">-&gt;</span>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
