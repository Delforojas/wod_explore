import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import { ApiError, createExerciseResult, getBestExerciseResult, getExercise, getExerciseResults } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { LoadingMessage, StateMessage } from "../components/StateMessage";
import { getErrorStateKind } from "../components/stateMessageUtils";
import type { Exercise, ExerciseCategory, ExerciseRecordType, ExerciseResult, ExerciseResultRequest, MeasurementType } from "../api/schemas";

const optionsByMeasurement: Partial<Record<MeasurementType, ExerciseRecordType[]>> = {
  WEIGHT: ["1RM", "3RM", "5RM", "10RM"],
  REPS: ["MAX_REPS"],
  TIME: ["BEST_TIME"],
};
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
const RECORD_TYPE_LABELS: Record<ExerciseRecordType, string> = {
  "1RM": "1RM",
  "3RM": "3RM",
  "5RM": "5RM",
  "10RM": "10RM",
  MAX_REPS: "Máximo de repeticiones",
  BEST_TIME: "Mejor tiempo",
};
const UNIT_LABELS: Record<ExerciseResult["unit"], string> = {
  KG: "kg",
  REPS: "repeticiones",
  SECONDS: "segundos",
  METERS: "metros",
};
const dateFormatter = new Intl.DateTimeFormat("es-ES");

function isExerciseRecordType(value: string): value is ExerciseRecordType {
  return ["1RM", "3RM", "5RM", "10RM", "MAX_REPS", "BEST_TIME"].some((type) => type === value);
}

function toApiDate(value: string) {
  return value ? `${value}:00` : undefined;
}

export function ExerciseDetailPage({ id }: { id: number }) {
  const { token } = useAuth();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [results, setResults] = useState<ExerciseResult[]>([]);
  const [best, setBest] = useState<ExerciseResult | null>(null);
  const [recordType, setRecordType] = useState<ExerciseRecordType>("1RM");
  const [value, setValue] = useState("");
  const [performedAt, setPerformedAt] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorKind, setErrorKind] = useState<"error" | "network-error">("error");
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!token) {
      return;
    }
    const exerciseRequest = getExercise(id, token);
    const resultsRequest: Promise<ExerciseResult[]> = token ? getExerciseResults(id, token) : Promise.resolve([]);
    Promise.all([exerciseRequest, resultsRequest])
      .then(([loadedExercise, loadedResults]) => {
        if (!active) return;
        setExercise(loadedExercise);
        setResults(loadedResults);
        const firstType = optionsByMeasurement[loadedExercise.measurementType]?.[0];
        if (firstType) setRecordType(firstType);
      })
      .catch((caughtError: unknown) => {
        if (!active) return;
        setError(caughtError instanceof Error ? caughtError.message : "No se pudo abrir este ejercicio.");
        setErrorKind(getErrorStateKind(caughtError));
      })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [id, token]);

  useEffect(() => {
    if (!token || !exercise || !optionsByMeasurement[exercise.measurementType]) return;
    getBestExerciseResult(id, recordType, token).then(setBest).catch(() => setBest(null));
  }, [exercise, id, recordType, token, results]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || !exercise) return;
    setIsSaving(true);
    setFormError(null);
    setFormSuccess(null);
    const body: ExerciseResultRequest = { value: Number(value), unit: exercise.measurementType === "REPS" ? "REPS" : exercise.measurementType === "TIME" ? "SECONDS" : "KG", recordType, performedAt: toApiDate(performedAt) };
    try {
      const created = await createExerciseResult(exercise.id, body, token);
      setResults((current) => [created, ...current]);
      setValue("");
      setPerformedAt("");
      setFormSuccess("Marca guardada correctamente.");
    } catch (caughtError) {
      setFormError(caughtError instanceof ApiError ? caughtError.message : "No se pudo guardar la marca.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!token) return <StateMessage kind="private" title="El catálogo es privado" message="Inicia sesión para consultar ejercicios y sus detalles." action={{ label: "Entrar", href: "#/login" }} />;
  if (isLoading) return <LoadingMessage />;
  if (error || !exercise) return <StateMessage kind={errorKind} title={errorKind === "network-error" ? "No hay conexión con este ejercicio" : "No pudimos abrir este ejercicio"} message={error ?? "El ejercicio no existe."} action={{ label: "Volver al catálogo", href: "#/exercises" }} />;
  const recordTypes = optionsByMeasurement[exercise.measurementType] ?? [];

  return (
     <section className="detail-page detail-page--exercise">
      <a className="back-link" href="#/exercises">Volver a ejercicios</a>
      <header className="detail-heading">
        <div className="detail-heading__body">
          <h1>{exercise.name}</h1>
          <p className="detail-summary">{EXERCISE_CATEGORY_LABELS[exercise.category]} · {MEASUREMENT_LABELS[exercise.measurementType]}</p>
        </div>
        <div className="detail-heading__meta">
          <span className="tag">{MEASUREMENT_LABELS[exercise.measurementType]}</span>
          <span className="detail-reference">Ejercicio #{exercise.id}</span>
        </div>
      </header>
      <div className="detail-grid">
        <article className="detail-manifest">
          <section className="detail-section" aria-labelledby="exercise-overview-title">
            <div className="section-intro"><h2 id="exercise-overview-title">Ficha del movimiento</h2><p>La referencia para entender qué se mide en este ejercicio.</p></div>
            <dl className="manifest-list"><div className="manifest-line"><dt>Categoría</dt><dd>{EXERCISE_CATEGORY_LABELS[exercise.category]}</dd></div><div className="manifest-line"><dt>Medición</dt><dd>{MEASUREMENT_LABELS[exercise.measurementType]}</dd></div></dl>
          </section>
           {token && <section className="best-record" aria-labelledby="best-record-title"><div className="best-record__heading"><h2 id="best-record-title">Mejor marca</h2><span>{RECORD_TYPE_LABELS[recordType]}</span></div>{best ? <strong className="metric-value metric-value--hero">{best.value} {UNIT_LABELS[best.unit]}</strong> : <strong className="metric-value metric-value--hero muted">Sin marca todavía</strong>}<div className="best-record__selector"><label htmlFor={`best-record-type-${exercise.id}`}>Tipo de marca</label><select id={`best-record-type-${exercise.id}`} name="bestRecordType" autoComplete="off" value={recordType} onChange={(event) => { if (isExerciseRecordType(event.target.value)) setRecordType(event.target.value); }}><option value="" disabled>Tipo de marca</option>{recordTypes.map((type) => <option key={type} value={type}>{RECORD_TYPE_LABELS[type]}</option>)}</select></div></section>}
           <section className="result-list" aria-labelledby="exercise-results-title"><div className="section-heading"><h2 id="exercise-results-title">Tus marcas</h2><span className="metric-value metric-value--compact">{results.length}</span></div>{results.length === 0 ? <StateMessage kind="empty" title="Todavía no tienes marcas para este ejercicio." /> : <ul className="result-items">{results.map((result) => <li className="result-row" key={result.id}><strong className="metric-value metric-value--row">{result.value} {UNIT_LABELS[result.unit]}</strong><span>{RECORD_TYPE_LABELS[result.recordType]}</span><small>{dateFormatter.format(new Date(result.performedAt))}</small></li>)}</ul>}</section>
        </article>
        <aside className="detail-side" aria-label="Registrar marca">
           {token ? recordTypes.length > 0 ? <form className="form-panel result-form" onSubmit={handleSubmit} aria-labelledby="exercise-result-form-title" aria-busy={isSaving}><div className="form-heading"><h2 id="exercise-result-form-title">Registrar marca</h2><p>Guarda una marca y compárala con tu mejor resultado.</p></div><div className="form-field"><label htmlFor={`exercise-value-${exercise.id}`}>Valor</label><input id={`exercise-value-${exercise.id}`} name="value" type="number" autoComplete="off" min="0.01" step="0.01" value={value} onChange={(event) => setValue(event.target.value)} required /></div><div className="form-field"><label htmlFor={`exercise-record-type-${exercise.id}`}>Tipo de marca</label><select id={`exercise-record-type-${exercise.id}`} name="recordType" autoComplete="off" value={recordType} onChange={(event) => { if (isExerciseRecordType(event.target.value)) setRecordType(event.target.value); }}>{recordTypes.map((type) => <option key={type} value={type}>{RECORD_TYPE_LABELS[type]}</option>)}</select></div><div className="form-field"><label htmlFor={`exercise-date-${exercise.id}`}>Fecha y hora</label><input id={`exercise-date-${exercise.id}`} name="performedAt" type="datetime-local" autoComplete="off" value={performedAt} onChange={(event) => setPerformedAt(event.target.value)} /></div>{isSaving && <StateMessage kind="loading" title="Guardando" message="Estamos registrando tu marca." />}{formError && <StateMessage kind="error" title="No se pudo guardar la marca" message={formError} />}{formSuccess && <StateMessage kind="success" title="Marca guardada" message={formSuccess} />}<button className="button button--accent button--wide" type="submit" disabled={isSaving} aria-busy={isSaving}>{isSaving ? "Guardando…" : "Guardar marca"}</button></form> : <StateMessage kind="empty" title="Medición no registrable" message="Este ejercicio todavía no tiene un tipo de marca compatible en la API." /> : <StateMessage kind="private" title="Registra tu progreso" message="Inicia sesión para guardar marcas y consultar tu mejor resultado." action={{ label: "Entrar", href: "#/login" }} />}
        </aside>
      </div>
    </section>
  );
}
