import { useEffect, useState } from "react";

import { getUserWod } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { LoadingMessage, StateMessage } from "../components/StateMessage";
import { getErrorStateKind } from "../components/stateMessageUtils";
import type { UserWodDetail, WodExercisePrescriptionUnit, WodLevel, WodType } from "../api/schemas";

const dateFormatter = new Intl.DateTimeFormat("es-ES");
const numberFormatter = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 2 });
const WOD_TYPE_LABELS: Record<WodType, string> = {
  FOR_TIME: "Por tiempo",
  AMRAP: "AMRAP",
  EMOM: "EMOM",
};
const WOD_LEVEL_LABELS: Record<WodLevel, string> = {
  BEGINNER: "Principiante",
  INTERMEDIATE: "Intermedio",
  RX: "RX",
};
const MEASUREMENT_LABELS = {
  WEIGHT: "Peso",
  REPS: "Repeticiones",
  TIME: "Tiempo",
  DISTANCE: "Distancia",
  WEIGHT_DISTANCE: "Peso y distancia",
  OTHER: "Otra medida",
} as const;
const EXERCISE_CATEGORY_LABELS = {
  WEIGHTLIFTING: "Halterofilia",
  GYMNASTICS: "Gimnasia",
  STRONGMAN: "Strongman",
  CARDIO: "Cardio",
  OTHER: "Otros",
} as const;
const UNIT_LABELS: Record<Exclude<WodExercisePrescriptionUnit, "OTHER">, string> = {
  REPS: "repeticiones",
  METERS: "metros",
  KG: "kg",
  SECONDS: "segundos",
};

function formatPrescription(unit: WodExercisePrescriptionUnit, value: number, unitLabel: string | null) {
  const label = unit === "OTHER" ? unitLabel?.trim() || "unidad" : UNIT_LABELS[unit];
  return `${numberFormatter.format(value)} ${label}`;
}

export function MyWodDetailPage({ id }: { id: number }) {
  const { token } = useAuth();
  const [wod, setWod] = useState<UserWodDetail | null>(null);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [errorKind, setErrorKind] = useState<"error" | "network-error">("error");
  const requestKey = token ? `${token}:${id}:${reloadToken}` : null;

  useEffect(() => {
    if (!token || !requestKey) return;
    let active = true;
    getUserWod(id, token)
      .then((data) => {
        if (!active) return;
        setWod(data);
        setError(null);
        setLoadedKey(requestKey);
      })
      .catch((caughtError: unknown) => {
        if (!active) return;
        setError(caughtError instanceof Error ? caughtError.message : "No se pudo abrir este WOD.");
        setErrorKind(getErrorStateKind(caughtError));
        setLoadedKey(requestKey);
      });
    return () => {
      active = false;
    };
  }, [id, requestKey, token]);

  function retry() {
    setError(null);
    setLoadedKey(null);
    setReloadToken((current) => current + 1);
  }

  if (!token) {
    return <StateMessage kind="private" title="Tus WODs son privados" message="Inicia sesión para consultar los WODs que has creado." action={{ label: "Entrar", href: "#/login" }} />;
  }
  if (loadedKey !== requestKey) return <LoadingMessage message="Estamos abriendo tu WOD personal." />;
  if (error || !wod) {
    return (
      <section className="my-wod-error-state">
        <a className="back-link" href="#/my-wods">Volver a Mis WODs</a>
        <StateMessage kind={errorKind} title={errorKind === "network-error" ? "No hay conexión con este WOD" : "No pudimos abrir este WOD"} message={error ?? "Este WOD no está disponible."} action={{ label: "Reintentar", onClick: retry }} />
      </section>
    );
  }

  return (
    <section className="detail-page detail-page--my-wod" aria-labelledby="my-wod-detail-title">
      <a className="back-link" href="#/my-wods">Volver a Mis WODs</a>
      <header className="detail-heading">
        <div className="detail-heading__body">
          <h1 id="my-wod-detail-title">{wod.name}</h1>
          <p className="detail-summary">{WOD_TYPE_LABELS[wod.type]} · {WOD_LEVEL_LABELS[wod.level]}</p>
        </div>
        <div className="detail-heading__meta">
          <span className="tag tag--accent">WOD personal</span>
          <span className="detail-reference">WOD #{wod.id}</span>
        </div>
      </header>

      <div className="my-wod-detail-grid">
        <article className="my-wod-detail-manifest">
          <section className="detail-section" aria-labelledby="my-wod-overview-title">
            <div className="section-intro">
              <h2 id="my-wod-overview-title">Ficha de la sesión</h2>
              <p>La estructura que guardaste para volver a repetir este entrenamiento.</p>
            </div>
            <dl className="manifest-list">
              <div className="manifest-line"><dt>Tipo</dt><dd>{WOD_TYPE_LABELS[wod.type]}</dd></div>
              <div className="manifest-line"><dt>Nivel</dt><dd>{WOD_LEVEL_LABELS[wod.level]}</dd></div>
              <div className="manifest-line"><dt>Límite</dt><dd>{wod.timeLimit !== null ? `${wod.timeLimit} segundos` : "Sin límite"}</dd></div>
              <div className="manifest-line"><dt>Rondas</dt><dd>{wod.rounds ?? "Variable"}</dd></div>
              <div className="manifest-line"><dt>Ejercicios</dt><dd><data value={wod.exercises.length}>{wod.exercises.length}</data></dd></div>
            </dl>
            <p className="detail-date">Creado <time dateTime={wod.createdAt}>{dateFormatter.format(new Date(wod.createdAt))}</time></p>
          </section>

          <section className="detail-section my-wod-exercises" aria-labelledby="my-wod-exercises-title">
            <div className="section-heading"><div><h2 id="my-wod-exercises-title">Ejercicios de la sesión</h2><p className="section-description">La secuencia y las medidas que definiste.</p></div><span>{wod.exercises.length}</span></div>
            {wod.exercises.length === 0 ? <StateMessage kind="empty" title="Este WOD no tiene ejercicios asociados." /> : (
              <ol className="my-wod-exercise-list">
                {wod.exercises.map((exercise, index) => (
                  <li className="my-wod-exercise" key={`${exercise.exerciseId}-${exercise.position}-${index}`}>
                    <div className="my-wod-exercise__header">
                      <span className="my-wod-exercise__position" aria-label={`Posición ${index + 1}`}>{String(index + 1).padStart(2, "0")}</span>
                      <div>
                        <h3>{exercise.name}</h3>
                        <p>{MEASUREMENT_LABELS[exercise.measurementType]} · {EXERCISE_CATEGORY_LABELS[exercise.category]}</p>
                      </div>
                    </div>
                    <ul className="my-wod-prescriptions" aria-label={`Prescripciones de ${exercise.name}`}>
                      {exercise.prescriptions.map((prescription) => <li key={`${prescription.unit}-${prescription.unitLabel ?? ""}`}><strong>{formatPrescription(prescription.unit, prescription.value, prescription.unitLabel)}</strong><span>{prescription.unit === "OTHER" ? "Medida personalizada" : "Prescripción"}</span></li>)}
                    </ul>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </article>

        <aside className="my-wod-detail-aside" aria-label="Resumen del WOD personal">
          <p className="my-wod-detail-aside__label">Archivo personal</p>
          <strong>{String(wod.exercises.length).padStart(2, "0")}</strong>
          <p>{wod.exercises.length === 1 ? "movimiento en la sesión" : "movimientos en la sesión"}</p>
          <a className="button button--secondary" href="#/create-wod">Crear otro WOD</a>
        </aside>
      </div>
    </section>
  );
}
