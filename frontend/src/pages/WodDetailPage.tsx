import { useEffect, useState } from "react";

import { getWod } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { LoadingMessage, StateMessage } from "../components/StateMessage";
import { getErrorStateKind } from "../components/stateMessageUtils";
import { WodResultsPanel } from "../components/WodResultsPanel";
import type { MeasurementType, WodDetail, WodType } from "../api/schemas";

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
const dateFormatter = new Intl.DateTimeFormat("es-ES");

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
     <section className="detail-page detail-page--wod">
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
          {token ? <WodResultsPanel wodId={wod.id} wodType={wod.type} token={token} /> : <StateMessage kind="private" title="Registra tu sesión" message="Inicia sesión para guardar resultados y ver tu historial." action={{ label: "Entrar", href: "#/login" }} />}
          </aside>
      </div>
    </section>
  );
}
