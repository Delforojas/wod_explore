import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import { ApiError, createWodResult, getWod, getWodResults } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { LoadingMessage, StateMessage } from "../components/StateMessage";
import { getErrorStateKind } from "../components/stateMessageUtils";
import type { MeasurementType, WodDetail, WodLevel, WodResult, WodResultRequest, WodType } from "../api/schemas";

const WOD_TYPE_LABELS: Record<WodType, string> = {
  FOR_TIME: "For time",
  AMRAP: "AMRAP",
  EMOM: "EMOM",
};
const WOD_LEVEL_LABELS: Record<WodLevel, string> = {
  BEGINNER: "Principiante",
  INTERMEDIATE: "Intermedio",
  RX: "RX",
};
const MEASUREMENT_LABELS: Record<MeasurementType, string> = {
  WEIGHT: "Peso",
  REPS: "Repeticiones",
  TIME: "Tiempo",
  DISTANCE: "Distancia",
  WEIGHT_DISTANCE: "Peso y distancia",
  OTHER: "Otra medida",
};
const dateFormatter = new Intl.DateTimeFormat("es-ES");

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
  const [errorKind, setErrorKind] = useState<"error" | "network-error">("error");
  const [formError, setFormError] = useState<string | null>(null);
  const [timeSeconds, setTimeSeconds] = useState("");
  const [rounds, setRounds] = useState("");
  const [reps, setReps] = useState("");
  const [level, setLevel] = useState<WodLevel>("RX");
  const [completedAt, setCompletedAt] = useState("");
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

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
      .catch((caughtError: unknown) => {
        if (!active) return;
        setError(caughtError instanceof Error ? caughtError.message : "No se pudo abrir este WOD.");
        setErrorKind(getErrorStateKind(caughtError));
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
    setFormSuccess(null);
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
      setFormSuccess("Resultado guardado correctamente.");
    } catch (caughtError) {
      setFormError(caughtError instanceof ApiError ? caughtError.message : "No se pudo guardar el resultado.");
    } finally {
      setIsSaving(false);
    }
  }

   if (!token) return <StateMessage kind="private" title="El archivo es privado" message="Inicia sesión para consultar WODs y sus detalles." action={{ label: "Entrar", href: "#/login" }} />;
   if (isLoading) return <LoadingMessage />;
   if (error || !wod) return <StateMessage kind={errorKind} title={errorKind === "network-error" ? "No hay conexión con este WOD" : "No pudimos abrir este WOD"} message={error ?? "El WOD no existe."} action={{ label: "Volver al catálogo", href: "#/wods" }} />;

  return (
    <section className="detail-page">
      <a className="back-link" href="#/wods">Volver a WODs</a>
      <header className="detail-heading">
        <div className="detail-heading__body">
          <h1>{wod.name}</h1>
          <p className="detail-summary">{WOD_TYPE_LABELS[wod.type]} · {wod.level ? WOD_LEVEL_LABELS[wod.level] : "Todos los niveles"}</p>
        </div>
        <div className="detail-heading__meta">
          <span className="tag tag--accent">{WOD_TYPE_LABELS[wod.type]}</span>
          <span className="detail-reference">WOD #{wod.id}</span>
        </div>
      </header>
      <div className="detail-grid">
        <article className="detail-manifest">
          <section className="detail-section" aria-labelledby="wod-overview-title">
            <div className="section-intro">
              <h2 id="wod-overview-title">Ficha de la sesión</h2>
              <p>La información esencial para preparar y repetir este entrenamiento.</p>
            </div>
            <dl className="manifest-list">
              <div className="manifest-line"><dt>Tipo</dt><dd>{WOD_TYPE_LABELS[wod.type]}</dd></div>
              <div className="manifest-line"><dt>Nivel</dt><dd>{wod.level ? WOD_LEVEL_LABELS[wod.level] : "Todos los niveles"}</dd></div>
              <div className="manifest-line"><dt>Límite</dt><dd>{wod.timeLimit ? `${wod.timeLimit} segundos` : "Sin límite"}</dd></div>
              <div className="manifest-line"><dt>Rondas</dt><dd>{wod.rounds ?? "Variable"}</dd></div>
            </dl>
            <p className="detail-date">Añadido {dateFormatter.format(new Date(wod.createdAt))}</p>
          </section>
          <section className="detail-section exercise-section" aria-labelledby="wod-exercises-title">
            <div className="section-heading"><h2 id="wod-exercises-title">Ejercicios de la sesión</h2><span>{wod.exercises.length}</span></div>
             {wod.exercises.length === 0 ? <StateMessage kind="empty" title="Este WOD no tiene ejercicios asociados." /> : <ol className="exercise-list">{wod.exercises.map((exercise) => <li key={`${exercise.id}-${exercise.position}`}><span>{exercise.position ?? "-"}</span><strong>{exercise.name}</strong><small>{exercise.reps !== null ? `${exercise.reps} reps` : MEASUREMENT_LABELS[exercise.measurementType]}</small></li>)}</ol>}
          </section>
        </article>
        <aside className="detail-side" aria-label="Registro y resultados">
          {token ? (
            <form className="form-panel result-form" onSubmit={handleSubmit} aria-labelledby="wod-result-form-title" aria-busy={isSaving}>
              <div className="form-heading"><h2 id="wod-result-form-title">Registrar resultado</h2><p>Guarda cómo completaste esta sesión.</p></div>
              {wod.type === "FOR_TIME" && <div className="form-field"><label htmlFor={`wod-time-${wod.id}`}>Tiempo en segundos</label><input id={`wod-time-${wod.id}`} name="timeSeconds" type="number" autoComplete="off" min="1" value={timeSeconds} onChange={(event) => setTimeSeconds(event.target.value)} required /></div>}
              {wod.type === "AMRAP" && <><div className="form-field"><label htmlFor={`wod-rounds-${wod.id}`}>Rondas</label><input id={`wod-rounds-${wod.id}`} name="rounds" type="number" autoComplete="off" min="0" value={rounds} onChange={(event) => setRounds(event.target.value)} required /></div><div className="form-field"><label htmlFor={`wod-reps-${wod.id}`}>Repeticiones extra</label><input id={`wod-reps-${wod.id}`} name="reps" type="number" autoComplete="off" min="0" value={reps} onChange={(event) => setReps(event.target.value)} required /></div></>}
              {wod.type === "EMOM" && <div className="form-field"><label htmlFor={`wod-reps-${wod.id}`}>Repeticiones</label><input id={`wod-reps-${wod.id}`} name="reps" type="number" autoComplete="off" min="0" value={reps} onChange={(event) => setReps(event.target.value)} required /></div>}
              <div className="form-field"><label htmlFor={`wod-level-${wod.id}`}>Nivel</label><select id={`wod-level-${wod.id}`} name="level" autoComplete="off" value={level} onChange={(event) => { const nextLevel = event.target.value; if (nextLevel === "BEGINNER" || nextLevel === "INTERMEDIATE" || nextLevel === "RX") setLevel(nextLevel); }}><option value="BEGINNER">Principiante</option><option value="INTERMEDIATE">Intermedio</option><option value="RX">RX</option></select></div>
              <div className="form-field"><label htmlFor={`wod-date-${wod.id}`}>Fecha y hora</label><input id={`wod-date-${wod.id}`} name="completedAt" type="datetime-local" autoComplete="off" value={completedAt} onChange={(event) => setCompletedAt(event.target.value)} /></div>
               {isSaving && <StateMessage kind="loading" title="Guardando" message="Estamos registrando tu resultado." />}
               {formError && <StateMessage kind="error" title="No se pudo guardar el resultado" message={formError} />}
               {formSuccess && <StateMessage kind="success" title="Resultado guardado" message={formSuccess} />}
               <button className="button button--accent button--wide" type="submit" disabled={isSaving} aria-busy={isSaving}>{isSaving ? "Guardando…" : "Guardar resultado"}</button>
             </form>
           ) : <StateMessage kind="private" title="Registra tu sesión" message="Inicia sesión para guardar resultados y ver tu historial." action={{ label: "Entrar", href: "#/login" }} />}
            <section className="result-list" aria-labelledby="wod-results-title"><div className="section-heading"><h2 id="wod-results-title">Tus intentos</h2><span>{results.length}</span></div>{results.length === 0 ? <StateMessage kind="empty" title="Todavía no tienes resultados para este WOD." /> : <ul className="result-items">{results.map((result) => <li className="result-row" key={result.id}><strong>{result.timeSeconds !== null ? `${result.timeSeconds} segundos` : `${result.rounds ?? 0} rondas + ${result.reps ?? 0} reps`}</strong><span>{result.level ? WOD_LEVEL_LABELS[result.level] : "-"}</span><small>{dateFormatter.format(new Date(result.completedAt))}</small></li>)}</ul>}</section>
         </aside>
      </div>
    </section>
  );
}
