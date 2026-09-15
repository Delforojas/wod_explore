import { useEffect, useState } from "react";

import { getWod } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { LoadingMessage, StateMessage } from "../components/StateMessage";
import { getErrorStateKind } from "../components/stateMessageUtils";
import { WodResultsPanel } from "../components/WodResultsPanel";
import { WodFavoriteButton } from "../components/WodFavoriteButton";
import type { ExerciseCategory, MeasurementType, WodDetail, WodType } from "../api/schemas";

const WOD_TYPE_LABELS: Record<WodType, string> = {
  FOR_TIME: "For time",
  AMRAP: "AMRAP",
  EMOM: "EMOM",
};
const WOD_LEVEL_LABELS = {
  BEGINNER: "Principiante",
  INTERMEDIATE: "Intermedio",
  RX: "RX",
} as const;
const MEASUREMENT_LABELS: Record<MeasurementType, string> = {
  WEIGHT: "Peso",
  REPS: "Repeticiones",
  TIME: "Tiempo",
  DISTANCE: "Distancia",
  WEIGHT_DISTANCE: "Peso y distancia",
  OTHER: "Otra medida",
};
const EXERCISE_CATEGORY_LABELS: Record<ExerciseCategory, string> = {
  WEIGHTLIFTING: "Halterofilia",
  GYMNASTICS: "Gimnasia",
  STRONGMAN: "Strongman",
  CARDIO: "Cardio",
  OTHER: "Otros",
};
const dateFormatter = new Intl.DateTimeFormat("es-ES");

function formatTimeLimit(timeLimit: number | null) {
  if (timeLimit === null) return "Sin límite";
  const minutes = Math.floor(timeLimit / 60);
  const seconds = timeLimit % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatRounds(rounds: number | null) {
  return rounds === null ? "Variable" : String(rounds);
}

function formatExercisePrescription(reps: number | null, measurementType: MeasurementType) {
  return reps !== null ? `${reps} reps` : MEASUREMENT_LABELS[measurementType];
}

export function WodDetailPage({ id }: { id: number }) {
  const { token } = useAuth();
  const [wod, setWod] = useState<WodDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorKind, setErrorKind] = useState<"error" | "network-error">("error");

  useEffect(() => {
    let active = true;
    if (!token) {
      return;
    }
    const wodRequest = getWod(id, token);
    wodRequest
      .then((loadedWod) => {
        if (!active) return;
        setWod(loadedWod);
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

  if (!token) return <StateMessage kind="private" title="El archivo es privado" message="Inicia sesión para consultar WODs y sus detalles." action={{ label: "Entrar", href: "#/login" }} />;
  if (isLoading) return <LoadingMessage />;
  if (error || !wod) return <StateMessage kind={errorKind} title={errorKind === "network-error" ? "No hay conexión con este WOD" : "No pudimos abrir este WOD"} message={error ?? "El WOD no existe."} action={{ label: "Volver al catálogo", href: "#/wods" }} />;

  return (
    <section className="detail-page wod-detail-page" aria-labelledby="wod-detail-title">
      <a className="back-link wod-detail-back-link" href="#/wods">Volver al catálogo de WODs</a>
      <header className="wod-detail-header">
        <div className="wod-detail-header__body">
          <h1 id="wod-detail-title">{wod.name}</h1>
          <p className="wod-detail-summary">{WOD_TYPE_LABELS[wod.type]} · {wod.level ? WOD_LEVEL_LABELS[wod.level] : "Todos los niveles"}</p>
        </div>
        <div className="wod-detail-header__meta">
          <WodFavoriteButton wodId={wod.id} wodName={wod.name} />
          <span className="wod-detail-reference">WOD #{wod.id}</span>
        </div>
      </header>

      <dl className="wod-performance-summary" aria-label="Resumen de rendimiento">
        <div className="wod-performance-metric"><dt>Tipo</dt><dd>{WOD_TYPE_LABELS[wod.type]}</dd></div>
        <div className="wod-performance-metric"><dt>Nivel</dt><dd>{wod.level ? WOD_LEVEL_LABELS[wod.level] : "Todos"}</dd></div>
        <div className="wod-performance-metric"><dt>Límite</dt><dd>{formatTimeLimit(wod.timeLimit)}</dd></div>
        <div className="wod-performance-metric"><dt>Rondas</dt><dd>{formatRounds(wod.rounds)}</dd></div>
        <div className="wod-performance-metric"><dt>Ejercicios</dt><dd>{wod.exercises.length}</dd></div>
      </dl>
      <p className="wod-detail-date">Añadido <time dateTime={wod.createdAt}>{dateFormatter.format(new Date(wod.createdAt))}</time></p>

      <div className="wod-detail-layout">
        <article className="wod-detail-main">
          <section className="wod-exercise-section" aria-labelledby="wod-exercises-title">
            <div className="wod-section-heading">
              <div>
                <h2 id="wod-exercises-title">Secuencia de ejercicios</h2>
                <p>La prescripción disponible para ejecutar esta sesión en orden.</p>
              </div>
              <span className="wod-section-count" aria-label={`${wod.exercises.length} ejercicios`}>{wod.exercises.length}</span>
            </div>
            {wod.exercises.length === 0 ? <StateMessage kind="empty" title="Este WOD no tiene ejercicios asociados." /> : (
              <ol className="wod-exercise-list">
                {wod.exercises.map((exercise, index) => {
                  const position = exercise.position ?? index + 1;
                  return (
                    <li className="wod-exercise-row" key={`${exercise.id}-${exercise.position}`}>
                      <span className="wod-exercise-position" aria-label={`Posición ${position}`}>{String(position).padStart(2, "0")}</span>
                      <div className="wod-exercise-identity">
                        <h3>{exercise.name}</h3>
                        <p>{EXERCISE_CATEGORY_LABELS[exercise.category]}</p>
                      </div>
                      <div className="wod-exercise-prescription">
                        <small>Prescripción</small>
                        <strong>{formatExercisePrescription(exercise.reps, exercise.measurementType)}</strong>
                        <span>{MEASUREMENT_LABELS[exercise.measurementType]}</span>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </section>
        </article>
        <aside className="wod-detail-side" aria-label="Registro y resultados">
          <WodResultsPanel wodId={wod.id} wodType={wod.type} token={token} />
        </aside>
      </div>
    </section>
  );
}
