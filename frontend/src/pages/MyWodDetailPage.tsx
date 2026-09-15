import { useEffect, useRef, useState } from "react";

import { ApiError, deleteUserWod, getUserWod } from "../api/client";
import { navigate } from "../app/router";
import { useAuth } from "../auth/useAuth";
import { LoadingMessage, StateMessage } from "../components/StateMessage";
import { getErrorStateKind } from "../components/stateMessageUtils";
import { WodResultsPanel } from "../components/WodResultsPanel";
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);
  const deleteTriggerRef = useRef<HTMLButtonElement>(null);
  const cancelDeleteRef = useRef<HTMLButtonElement>(null);
  const requestKey = token ? `${token}:${id}:${reloadToken}` : null;

  useEffect(() => {
    const dialog = deleteDialogRef.current;
    if (!dialog) return;

    if (isDeleteDialogOpen && !dialog.open) {
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
      cancelDeleteRef.current?.focus();
    }

    if (!isDeleteDialogOpen && dialog.open) {
      if (typeof dialog.close === "function") dialog.close();
      else dialog.removeAttribute("open");
      deleteTriggerRef.current?.focus();
    }
  }, [isDeleteDialogOpen]);

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

  function openDeleteDialog() {
    setDeleteError(null);
    setIsDeleteDialogOpen(true);
  }

  function closeDeleteDialog() {
    if (isDeleting) return;
    setDeleteError(null);
    setIsDeleteDialogOpen(false);
  }

  async function confirmDelete() {
    if (!token || isDeleting) return;

    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteUserWod(id, token);
      navigate("/my-wods?deleted=1");
    } catch (caughtError: unknown) {
      const message = caughtError instanceof ApiError && caughtError.status === 409
        ? "Este WOD conserva resultados históricos y no se puede eliminar."
        : caughtError instanceof Error
          ? caughtError.message
          : "No se pudo eliminar este WOD.";
      setDeleteError(message);
      setIsDeleting(false);
    }
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
    <section className="detail-page detail-page--my-wod my-wod-management-detail" aria-labelledby="my-wod-detail-title">
      <a className="back-link my-wod-back-link" href="#/my-wods">Volver a Mis WODs</a>
      <header className="detail-heading my-wod-management-heading">
        <div className="my-wod-management-heading__body">
          <p className="surface-kicker">Gestión de WOD personal</p>
          <h1 id="my-wod-detail-title">{wod.name}</h1>
          <p className="detail-summary">{WOD_TYPE_LABELS[wod.type]} · {WOD_LEVEL_LABELS[wod.level]}</p>
        </div>
        <div className="my-wod-management-heading__actions">
          <div className="my-wod-management-heading__meta">
            <span className="tag tag--accent">WOD personal</span>
            <span className="detail-reference">WOD #{wod.id}</span>
          </div>
          <div className="my-wod-management-actions">
            <a className="button button--accent" href={`#/my-wods/${wod.id}/edit`} aria-label={`Editar ${wod.name}`}>Editar</a>
            <button
              className="button button--danger"
              type="button"
              ref={deleteTriggerRef}
              aria-haspopup="dialog"
              onClick={openDeleteDialog}
            >
              Eliminar WOD
            </button>
          </div>
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
              <div className="manifest-line"><dt>Ejercicios</dt><dd><data className="metric-value metric-value--compact" value={wod.exercises.length}>{wod.exercises.length}</data></dd></div>
            </dl>
            <p className="detail-date">Creado <time dateTime={wod.createdAt}>{dateFormatter.format(new Date(wod.createdAt))}</time></p>
          </section>

          <section className="detail-section my-wod-exercises" aria-labelledby="my-wod-exercises-title">
            <div className="section-heading"><div><h2 id="my-wod-exercises-title">Ejercicios de la sesión</h2><p className="section-description">La secuencia y las medidas que definiste.</p></div><span className="metric-value metric-value--compact">{wod.exercises.length}</span></div>
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
                      {exercise.prescriptions.map((prescription) => <li key={`${prescription.unit}-${prescription.unitLabel ?? ""}`}><strong className="metric-value metric-value--row">{formatPrescription(prescription.unit, prescription.value, prescription.unitLabel)}</strong><span>{prescription.unit === "OTHER" ? "Medida personalizada" : "Prescripción"}</span></li>)}
                    </ul>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </article>

        <div className="my-wod-detail-side">
          <WodResultsPanel wodId={wod.id} wodType={wod.type} token={token} />
          <aside className="my-wod-detail-aside" aria-label="Resumen del WOD personal">
            <p className="my-wod-detail-aside__label">Archivo personal</p>
            <strong className="metric-value metric-value--hero">{String(wod.exercises.length).padStart(2, "0")}</strong>
            <p>{wod.exercises.length === 1 ? "movimiento en la sesión" : "movimientos en la sesión"}</p>
            <a className="button button--secondary" href="#/create-wod">Crear otro WOD</a>
          </aside>
        </div>
      </div>

      <dialog
        ref={deleteDialogRef}
        className="delete-confirmation"
        aria-labelledby="delete-confirmation-title"
        aria-describedby="delete-confirmation-description"
        onCancel={(event) => {
          event.preventDefault();
          closeDeleteDialog();
        }}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <div className="delete-confirmation__body">
          <p className="delete-confirmation__label">Confirmar eliminación</p>
          <h2 id="delete-confirmation-title">¿Eliminar {wod.name}?</h2>
          <p id="delete-confirmation-description">
            Esta acción eliminará el WOD personalizado y su configuración de ejercicios. No se borrarán ejercicios del catálogo.
          </p>
          {deleteError && <p className="delete-confirmation__error" role="alert">{deleteError}</p>}
        </div>
        <div className="delete-confirmation__actions">
          <button
            className="button button--secondary"
            type="button"
            ref={cancelDeleteRef}
            disabled={isDeleting}
            onClick={closeDeleteDialog}
          >
            Cancelar
          </button>
          <button
            className="button button--accent"
            type="button"
            disabled={isDeleting}
            onClick={() => void confirmDelete()}
          >
            {isDeleting ? "Eliminando…" : "Eliminar WOD"}
          </button>
        </div>
      </dialog>
    </section>
  );
}
