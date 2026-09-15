import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import { ApiError, createWodResult, getWodResults } from "../api/client";
import { LoadingMessage, StateMessage } from "./StateMessage";
import { getErrorStateKind } from "./stateMessageUtils";
import type { WodLevel, WodResult, WodResultRequest, WodType } from "../api/schemas";

interface WodResultsPanelProps {
  wodId: number;
  wodType: WodType;
  token: string;
}

const dateFormatter = new Intl.DateTimeFormat("es-ES");
const numberFormatter = new Intl.NumberFormat("es-ES");
const WOD_LEVEL_LABELS: Record<WodLevel, string> = {
  BEGINNER: "Principiante",
  INTERMEDIATE: "Intermedio",
  RX: "RX",
};

function toApiDate(value: string) {
  return value ? `${value}:00` : undefined;
}

function formatResultValue(result: WodResult) {
  if (result.timeSeconds !== null) {
    return `${numberFormatter.format(result.timeSeconds)} segundos`;
  }

  if (result.rounds !== null) {
    return `${numberFormatter.format(result.rounds)} rondas + ${numberFormatter.format(result.reps ?? 0)} reps`;
  }

  return `${numberFormatter.format(result.reps ?? 0)} reps`;
}

export function WodResultsPanel({ wodId, wodType, token }: WodResultsPanelProps) {
  const [results, setResults] = useState<WodResult[] | null>(null);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [resultsError, setResultsError] = useState<string | null>(null);
  const [resultsErrorKind, setResultsErrorKind] = useState<"error" | "network-error">("error");
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [timeSeconds, setTimeSeconds] = useState("");
  const [rounds, setRounds] = useState("");
  const [reps, setReps] = useState("");
  const [level, setLevel] = useState<WodLevel>("RX");
  const [completedAt, setCompletedAt] = useState("");
  const requestKey = `${token}:${wodId}:${reloadToken}`;

  useEffect(() => {
    let active = true;
    getWodResults(wodId, token)
      .then((loadedResults) => {
        if (!active) return;
        setResults(loadedResults);
        setResultsError(null);
        setLoadedKey(requestKey);
      })
      .catch((caughtError: unknown) => {
        if (!active) return;
        setResultsError(caughtError instanceof Error ? caughtError.message : "No se pudieron cargar tus resultados.");
        setResultsErrorKind(getErrorStateKind(caughtError));
        setLoadedKey(requestKey);
      });

    return () => {
      active = false;
    };
  }, [requestKey, token, wodId]);

  function retryResults() {
    setResultsError(null);
    setLoadedKey(null);
    setReloadToken((current) => current + 1);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    setFormError(null);
    setFormSuccess(null);
    const body: WodResultRequest = { level, completedAt: toApiDate(completedAt) };

    if (wodType === "FOR_TIME") body.timeSeconds = Number(timeSeconds);
    if (wodType === "AMRAP") {
      body.rounds = Number(rounds);
      body.reps = Number(reps);
    }
    if (wodType === "EMOM") body.reps = Number(reps);

    try {
      const created = await createWodResult(wodId, body, token);
      setResults((current) => [created, ...(current ?? [])]);
      setTimeSeconds("");
      setRounds("");
      setReps("");
      setCompletedAt("");
      setFormSuccess("Resultado guardado correctamente.");
    } catch (caughtError: unknown) {
      setFormError(caughtError instanceof ApiError ? caughtError.message : "No se pudo guardar el resultado.");
    } finally {
      setIsSaving(false);
    }
  }

  if (loadedKey !== requestKey) return <LoadingMessage message="Estamos cargando tus resultados." />;
  if (resultsError || !results) {
    return (
      <StateMessage
        kind={resultsErrorKind}
        title={resultsErrorKind === "network-error" ? "No hay conexión con tus resultados" : "No pudimos cargar tus resultados"}
        message={resultsError ?? "Inténtalo de nuevo."}
        action={{ label: "Reintentar", onClick: retryResults }}
      />
    );
  }

  return (
    <>
      <form className="form-panel result-form" onSubmit={handleSubmit} aria-labelledby={`wod-result-form-title-${wodId}`} aria-busy={isSaving}>
        <div className="form-heading">
          <h2 id={`wod-result-form-title-${wodId}`}>Registrar resultado</h2>
          <p>Guarda cómo completaste esta sesión.</p>
        </div>
        {wodType === "FOR_TIME" && (
          <div className="form-field">
            <label htmlFor={`wod-time-${wodId}`}>Tiempo en segundos</label>
            <input id={`wod-time-${wodId}`} name="timeSeconds" type="number" autoComplete="off" min="1" value={timeSeconds} onChange={(event) => setTimeSeconds(event.target.value)} required />
          </div>
        )}
        {wodType === "AMRAP" && (
          <>
            <div className="form-field">
              <label htmlFor={`wod-rounds-${wodId}`}>Rondas</label>
              <input id={`wod-rounds-${wodId}`} name="rounds" type="number" autoComplete="off" min="0" value={rounds} onChange={(event) => setRounds(event.target.value)} required />
            </div>
            <div className="form-field">
              <label htmlFor={`wod-reps-${wodId}`}>Repeticiones extra</label>
              <input id={`wod-reps-${wodId}`} name="reps" type="number" autoComplete="off" min="0" value={reps} onChange={(event) => setReps(event.target.value)} required />
            </div>
          </>
        )}
        {wodType === "EMOM" && (
          <div className="form-field">
            <label htmlFor={`wod-reps-${wodId}`}>Repeticiones</label>
            <input id={`wod-reps-${wodId}`} name="reps" type="number" autoComplete="off" min="0" value={reps} onChange={(event) => setReps(event.target.value)} required />
          </div>
        )}
        <div className="form-field">
          <label htmlFor={`wod-level-${wodId}`}>Nivel</label>
          <select id={`wod-level-${wodId}`} name="level" autoComplete="off" value={level} onChange={(event) => {
            const nextLevel = event.target.value;
            if (nextLevel === "BEGINNER" || nextLevel === "INTERMEDIATE" || nextLevel === "RX") setLevel(nextLevel);
          }}>
            <option value="BEGINNER">Principiante</option>
            <option value="INTERMEDIATE">Intermedio</option>
            <option value="RX">RX</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor={`wod-date-${wodId}`}>Fecha y hora</label>
          <input id={`wod-date-${wodId}`} name="completedAt" type="datetime-local" autoComplete="off" value={completedAt} onChange={(event) => setCompletedAt(event.target.value)} />
        </div>
        {isSaving && <StateMessage kind="loading" title="Guardando" message="Estamos registrando tu resultado." />}
        {formError && <StateMessage kind="error" title="No se pudo guardar el resultado" message={formError} />}
        {formSuccess && <StateMessage kind="success" title="Resultado guardado" message={formSuccess} />}
        <button className="button button--accent button--wide" type="submit" disabled={isSaving} aria-busy={isSaving}>{isSaving ? "Guardando…" : "Guardar resultado"}</button>
      </form>

      <section className="result-list" aria-labelledby={`wod-results-title-${wodId}`}>
        <div className="section-heading">
          <h2 id={`wod-results-title-${wodId}`}>Tus intentos</h2>
          <span className="metric-value metric-value--compact">{results.length}</span>
        </div>
        {results.length === 0 ? <StateMessage kind="empty" title="Todavía no tienes resultados para este WOD." /> : (
          <ul className="result-items">
            {results.map((result) => (
              <li className="result-row" key={result.id}>
                <strong className="metric-value metric-value--row">{formatResultValue(result)}</strong>
                <span>{WOD_LEVEL_LABELS[result.level]}</span>
                <small>{dateFormatter.format(new Date(result.completedAt))}</small>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
