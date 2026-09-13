import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import { ApiError, createExerciseResult, getBestExerciseResult, getExercise, getExerciseResults } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { LoadingMessage, StateMessage } from "../components/StateMessage";
import type { Exercise, ExerciseRecordType, ExerciseResult, ExerciseResultRequest } from "../api/schemas";

const optionsByMeasurement: Record<string, ExerciseRecordType[]> = {
  WEIGHT: ["1RM", "3RM", "5RM", "10RM"],
  REPS: ["MAX_REPS"],
  TIME: ["BEST_TIME"],
};

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
  const [formError, setFormError] = useState<string | null>(null);

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
      .catch((caughtError: Error) => { if (active) setError(caughtError.message); })
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
    const body: ExerciseResultRequest = { value: Number(value), unit: exercise.measurementType === "REPS" ? "REPS" : exercise.measurementType === "TIME" ? "SECONDS" : "KG", recordType, performedAt: toApiDate(performedAt) };
    try {
      const created = await createExerciseResult(exercise.id, body, token);
      setResults((current) => [created, ...current]);
      setValue("");
      setPerformedAt("");
    } catch (caughtError) {
      setFormError(caughtError instanceof ApiError ? caughtError.message : "No se pudo guardar la marca.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!token) return <StateMessage title="El catálogo es privado" message="Inicia sesión para consultar ejercicios y sus detalles." action={{ label: "Entrar", href: "#/login" }} />;
  if (isLoading) return <LoadingMessage />;
  if (error || !exercise) return <StateMessage title="No pudimos abrir este ejercicio" message={error ?? "El ejercicio no existe."} tone="error" action={{ label: "Volver al catálogo", href: "#/exercises" }} />;
  const recordTypes = optionsByMeasurement[exercise.measurementType] ?? [];

  return (
    <section className="detail-page">
      <a className="back-link" href="#/exercises">Volver a ejercicios</a>
      <div className="detail-heading"><div><h1>{exercise.name}</h1></div><span className="tag">{exercise.measurementType}</span></div>
      <div className="detail-grid">
        <article className="detail-manifest"><div className="manifest-line"><span>Categoría</span><strong>{exercise.category}</strong></div><div className="manifest-line"><span>Medición</span><strong>{exercise.measurementType}</strong></div>{token && <div className="best-record"><span>Mejor marca / {recordType}</span>{best ? <strong>{best.value} {best.unit}</strong> : <strong className="muted">Sin marca todavía</strong>}<select value={recordType} onChange={(event) => { if (isExerciseRecordType(event.target.value)) setRecordType(event.target.value); }} aria-label="Tipo de marca"><option value="" disabled>Tipo de marca</option>{recordTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></div>}<section className="result-list"><div className="section-heading"><h2>Tus marcas</h2><span>{results.length}</span></div>{results.length === 0 ? <p className="muted">Todavía no tienes marcas para este ejercicio.</p> : results.map((result) => <div className="result-row" key={result.id}><strong>{result.value} {result.unit}</strong><span>{result.recordType}</span><small>{new Date(result.performedAt).toLocaleDateString("es-ES")}</small></div>)}</section></article>
        <div className="detail-side">{token ? recordTypes.length > 0 ? <form className="form-panel result-form" onSubmit={handleSubmit}><div className="form-heading"><span>Tu progreso</span><strong>Registrar marca</strong></div><label>Valor<input type="number" min="0.01" step="0.01" value={value} onChange={(event) => setValue(event.target.value)} required /></label><label>Tipo de marca<select value={recordType} onChange={(event) => { if (isExerciseRecordType(event.target.value)) setRecordType(event.target.value); }}>{recordTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></label><label>Fecha y hora<input type="datetime-local" value={performedAt} onChange={(event) => setPerformedAt(event.target.value)} /></label>{formError && <p className="form-error" role="alert">{formError}</p>}<button className="button button--accent button--wide" type="submit" disabled={isSaving}>{isSaving ? "Guardando..." : "Guardar marca"}</button></form> : <StateMessage title="Medición no registrable" message="Este ejercicio todavía no tiene un tipo de marca compatible en la API." /> : <StateMessage title="Registra tu progreso" message="Inicia sesión para guardar marcas y consultar tu mejor resultado." action={{ label: "Entrar", href: "#/login" }} />}</div>
      </div>
    </section>
  );
}
