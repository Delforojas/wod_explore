import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import { ApiError, createWodResult, getWod, getWodResults } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { LoadingMessage, StateMessage } from "../components/StateMessage";
import type { WodDetail, WodLevel, WodResult, WodResultRequest } from "../api/schemas";

function toApiDate(value: string) {
  return value ? `${value}:00` : undefined;
}

export function WodDetailPage({ id }: { id: number }) {
  const { token } = useAuth();
  const [wod, setWod] = useState<WodDetail | null>(null);
  const [results, setResults] = useState<WodResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [timeSeconds, setTimeSeconds] = useState("");
  const [rounds, setRounds] = useState("");
  const [reps, setReps] = useState("");
  const [level, setLevel] = useState<WodLevel>("RX");
  const [completedAt, setCompletedAt] = useState("");

  useEffect(() => {
    let active = true;
    if (!token) {
      return;
    }
    const wodRequest = getWod(id, token);
    const resultsRequest: Promise<WodResult[]> = token ? getWodResults(id, token) : Promise.resolve([]);

    Promise.all([wodRequest, resultsRequest])
      .then(([loadedWod, loadedResults]) => {
        if (!active) return;
        setWod(loadedWod);
        setResults(loadedResults);
      })
      .catch((caughtError: Error) => {
        if (active) setError(caughtError.message);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, token]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || !wod) return;
    setIsSaving(true);
    setFormError(null);
    const body: WodResultRequest = { level, completedAt: toApiDate(completedAt) };

    if (wod.type === "FOR_TIME") body.timeSeconds = Number(timeSeconds);
    if (wod.type === "AMRAP") {
      body.rounds = Number(rounds);
      body.reps = Number(reps);
    }
    if (wod.type === "EMOM") body.reps = Number(reps);

    try {
      const created = await createWodResult(wod.id, body, token);
      setResults((current) => [created, ...current]);
      setTimeSeconds("");
      setRounds("");
      setReps("");
      setCompletedAt("");
    } catch (caughtError) {
      setFormError(caughtError instanceof ApiError ? caughtError.message : "No se pudo guardar el resultado.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!token) return <StateMessage title="El archivo es privado" message="Inicia sesión para consultar WODs y sus detalles." action={{ label: "Entrar", href: "#/login" }} />;
  if (isLoading) return <LoadingMessage />;
  if (error || !wod) return <StateMessage title="No pudimos abrir este WOD" message={error ?? "El WOD no existe."} tone="error" action={{ label: "Volver al catálogo", href: "#/wods" }} />;

  return (
    <section className="detail-page">
      <a className="back-link" href="#/wods">Volver a WODs</a>
      <div className="detail-heading">
        <div><h1>{wod.name}</h1></div>
        <span className="tag tag--accent">{wod.type.replace("_", " ")}</span>
      </div>
      <div className="detail-grid">
        <article className="detail-manifest">
          <div className="manifest-line"><span>Tipo</span><strong>{wod.type}</strong></div>
          <div className="manifest-line"><span>Nivel</span><strong>{wod.level ?? "Todos"}</strong></div>
          <div className="manifest-line"><span>Límite</span><strong>{wod.timeLimit ? `${wod.timeLimit} s` : "Sin límite"}</strong></div>
          <div className="manifest-line"><span>Rondas</span><strong>{wod.rounds ?? "Variable"}</strong></div>
          <p className="detail-date">Añadido {new Date(wod.createdAt).toLocaleDateString("es-ES")}</p>
          <h2>Ejercicios de la sesión</h2>
          {wod.exercises.length === 0 ? <p className="muted">Este WOD no tiene ejercicios asociados.</p> : <ol className="exercise-list">{wod.exercises.map((exercise) => <li key={`${exercise.id}-${exercise.position}`}><span>{exercise.position ?? "-"}</span><strong>{exercise.name}</strong><small>{exercise.reps ? `${exercise.reps} reps` : exercise.measurementType}</small></li>)}</ol>}
        </article>
        <div className="detail-side">
          {token ? (
            <form className="form-panel result-form" onSubmit={handleSubmit}>
              <div className="form-heading"><span>Tu sesión</span><strong>Registrar resultado</strong></div>
              {wod.type === "FOR_TIME" && <label>Tiempo en segundos<input type="number" min="1" value={timeSeconds} onChange={(event) => setTimeSeconds(event.target.value)} required /></label>}
              {wod.type === "AMRAP" && <><label>Rondas<input type="number" min="0" value={rounds} onChange={(event) => setRounds(event.target.value)} required /></label><label>Repeticiones extra<input type="number" min="0" value={reps} onChange={(event) => setReps(event.target.value)} required /></label></>}
              {wod.type === "EMOM" && <label>Repeticiones<input type="number" min="0" value={reps} onChange={(event) => setReps(event.target.value)} required /></label>}
              <label>Nivel<select value={level} onChange={(event) => { const nextLevel = event.target.value; if (nextLevel === "BEGINNER" || nextLevel === "INTERMEDIATE" || nextLevel === "RX") setLevel(nextLevel); }}><option value="BEGINNER">Principiante</option><option value="INTERMEDIATE">Intermedio</option><option value="RX">RX</option></select></label>
              <label>Fecha y hora<input type="datetime-local" value={completedAt} onChange={(event) => setCompletedAt(event.target.value)} /></label>
              {formError && <p className="form-error" role="alert">{formError}</p>}
              <button className="button button--accent button--wide" type="submit" disabled={isSaving}>{isSaving ? "Guardando..." : "Guardar resultado"}</button>
            </form>
          ) : <StateMessage title="Registra tu sesión" message="Inicia sesión para guardar resultados y ver tu historial." action={{ label: "Entrar", href: "#/login" }} />}
          <section className="result-list"><div className="section-heading"><h2>Tus intentos</h2><span>{results.length}</span></div>{results.length === 0 ? <p className="muted">Todavía no tienes resultados para este WOD.</p> : results.map((result) => <div className="result-row" key={result.id}><strong>{result.timeSeconds ? `${result.timeSeconds} s` : `${result.rounds ?? 0} + ${result.reps ?? 0}`}</strong><span>{result.level}</span><small>{new Date(result.completedAt).toLocaleDateString("es-ES")}</small></div>)}</section>
        </div>
      </div>
    </section>
  );
}
