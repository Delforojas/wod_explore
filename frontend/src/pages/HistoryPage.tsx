import { useEffect, useState } from "react";

import { getHistory } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { LoadingMessage, StateMessage } from "../components/StateMessage";
import { getErrorStateKind } from "../components/stateMessageUtils";
import { PaginationControls } from "../components/PaginationControls";
import type { ExerciseRecordType, HistoryExerciseResult, HistoryWodResult, UserHistory } from "../api/schemas";

const DEFAULT_PAGE_SIZE = 20;
const dateFormatter = new Intl.DateTimeFormat("es-ES");

export function HistoryPage() {
  const { token } = useAuth();
  const [history, setHistory] = useState<UserHistory | null>(null);
  const [loadedToken, setLoadedToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorKind, setErrorKind] = useState<"error" | "network-error">("error");
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (!token) return;
    let active = true;
    getHistory(token, { page, size: DEFAULT_PAGE_SIZE })
      .then((data) => { if (active) { setError(null); setHistory(data); } })
      .catch((caughtError: unknown) => {
        if (!active) return;
        setError(caughtError instanceof Error ? caughtError.message : "No se pudo cargar tu historial.");
        setErrorKind(getErrorStateKind(caughtError));
      })
      .finally(() => { if (active) setLoadedToken(token); });
    return () => { active = false; };
  }, [token, page]);

  function goToPage(nextPage: number) {
    setLoadedToken(null);
    setError(null);
    setPage(nextPage);
  }

  if (!token) return <StateMessage kind="private" title="Tu historial es privado" message="Inicia sesión para consultar las sesiones que has registrado." action={{ label: "Entrar", href: "#/login" }} />;
  if (token && loadedToken !== token) return <LoadingMessage />;
  if (error || !history) return <StateMessage kind={errorKind} title={errorKind === "network-error" ? "No hay conexión con tu historial" : "No pudimos cargar tu historial"} message={error ?? "Inténtalo de nuevo."} action={{ label: "Reintentar", onClick: () => window.location.reload() }} />;
  const isEmpty = history.wodResults.items.length === 0 && history.exerciseResults.items.length === 0;
  const historyItems = getHistoryItems(history);

  return (
    <section className="catalog-page history-page" aria-labelledby="history-title">
      <header className="page-heading history-page__heading">
        <div>
          <h1 id="history-title">Historial</h1>
          <p className="heading-support">Una lectura de todas las sesiones y marcas que has guardado.</p>
        </div>
        <dl className="history-summary" aria-label="Resumen del historial">
          <div>
            <dt>Resultados WOD</dt>
            <dd><data className="metric-value metric-value--summary" value={history.wodResults.totalElements}>{history.wodResults.totalElements}</data></dd>
          </div>
          <div>
            <dt>Marcas de ejercicios</dt>
            <dd><data className="metric-value metric-value--summary" value={history.exerciseResults.totalElements}>{history.exerciseResults.totalElements}</data></dd>
          </div>
        </dl>
      </header>
      {isEmpty && page === 0 ? <StateMessage kind="empty" title="Aún no hay sesiones" message="Registra un resultado desde cualquier detalle para empezar tu historial." action={{ label: "Explorar WODs", href: "#/wods" }} /> : (
        <section className="history-activity" aria-labelledby="history-activity-title">
          <header className="section-heading history-activity__heading">
            <div>
              <h2 id="history-activity-title">Actividad registrada</h2>
              <p className="section-description">Tus resultados, de más reciente a más antiguo.</p>
            </div>
            <span className="history-activity__legend">Resultado y contexto</span>
          </header>
          {historyItems.length === 0 ? <StateMessage kind="empty" title="No hay resultados en esta página" message="Vuelve a la página anterior para consultar tu historial." action={{ label: "Anterior", onClick: () => goToPage(Math.max(0, page - 1)) }} /> : (
            <ol className="history-list" aria-label="Actividad ordenada por fecha">
              {historyItems.map((item) => <HistoryRow key={`${item.kind}-${item.id}`} item={item} />)}
            </ol>
          )}
        </section>
      )}
      {!isEmpty || page > 0 ? <PaginationControls page={page} hasNext={history.wodResults.hasNext || history.exerciseResults.hasNext} isLoading={false} onPrevious={() => goToPage(Math.max(0, page - 1))} onNext={() => goToPage(page + 1)} /> : null}
    </section>
  );
}

function formatLevel(level: "BEGINNER" | "INTERMEDIATE" | "RX") {
  return { BEGINNER: "Principiante", INTERMEDIATE: "Intermedio", RX: "RX" }[level];
}

function formatUnit(unit: "KG" | "REPS" | "SECONDS" | "METERS") {
  return { KG: "kg", REPS: "repeticiones", SECONDS: "segundos", METERS: "metros" }[unit];
}

const RECORD_TYPE_LABELS: Record<ExerciseRecordType, string> = {
  "1RM": "1RM",
  "3RM": "3RM",
  "5RM": "5RM",
  "10RM": "10RM",
  MAX_REPS: "Máximo de repeticiones",
  BEST_TIME: "Mejor tiempo",
};

function formatResourceName(name: string | null, resourceLabel: "WOD" | "Ejercicio", id: number) {
  const normalizedName = name?.trim();
  return normalizedName || `${resourceLabel} #${id}`;
}

type HistoryItemKind = "wod" | "exercise";

interface HistoryItem {
  id: number;
  sortIndex: number;
  kind: HistoryItemKind;
  title: string;
  type: string;
  value: string;
  unit?: string;
  meta: string;
  dateTime: string;
  href: string;
  ariaLabel: string;
}

function getHistoryItems(history: UserHistory): HistoryItem[] {
  const wodItems = history.wodResults.items.map((result, index) => createWodHistoryItem(result, index));
  const exerciseItems = history.exerciseResults.items.map((result, index) => createExerciseHistoryItem(result, history.wodResults.items.length + index));

  return [...wodItems, ...exerciseItems].sort((left, right) => {
    const dateDifference = getTimestamp(right.dateTime) - getTimestamp(left.dateTime);
    return dateDifference || left.sortIndex - right.sortIndex;
  });
}

function getTimestamp(dateTime: string) {
  const timestamp = Date.parse(dateTime);
  return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp;
}

function createWodHistoryItem(result: HistoryWodResult, sortIndex: number): HistoryItem {
  const title = formatResourceName(result.wodName, "WOD", result.wodId);
  const value = result.timeSeconds !== null
    ? `${result.timeSeconds}`
    : `${result.rounds ?? 0} rondas + ${result.reps ?? 0} repeticiones`;
  const accessibleValue = result.timeSeconds !== null
    ? `${result.timeSeconds} segundos`
    : `${result.rounds ?? 0} rondas y ${result.reps ?? 0} repeticiones`;

  return {
    id: result.id,
    kind: "wod",
    title,
    type: "Resultado WOD",
    value,
    unit: result.timeSeconds !== null ? "segundos" : undefined,
    meta: formatLevel(result.level),
    dateTime: result.completedAt,
    href: `#/wods/${result.wodId}`,
    ariaLabel: `${title}, ${accessibleValue}. Ver detalle del WOD`,
    sortIndex,
  };
}

function createExerciseHistoryItem(result: HistoryExerciseResult, sortIndex: number): HistoryItem {
  const title = formatResourceName(result.exerciseName, "Ejercicio", result.exerciseId);
  const unit = formatUnit(result.unit);

  return {
    id: result.id,
    kind: "exercise",
    title,
    type: "Marca de ejercicio",
    value: `${result.value}`,
    unit,
    meta: RECORD_TYPE_LABELS[result.recordType],
    dateTime: result.performedAt,
    href: `#/exercises/${result.exerciseId}`,
    ariaLabel: `${title}, ${RECORD_TYPE_LABELS[result.recordType]} de ${result.value} ${unit}. Ver detalle del ejercicio`,
    sortIndex,
  };
}

function HistoryRow({ item }: { item: HistoryItem }) {

  return (
    <li className="history-list__item">
      <a className={`history-row history-row--${item.kind}`} href={item.href} aria-label={item.ariaLabel}>
        <span className="history-row__value">
          <b className="metric-value metric-value--row history-row__metric"><data value={item.value}>{item.value}</data></b>
          {item.unit && <small className="history-row__unit">{item.unit}</small>}
          <small className="history-row__link-label">Ver detalle</small>
        </span>
        <span className="history-row__content">
          <small className="history-row__type">{item.type}</small>
          <strong>{item.title}</strong>
          <span className="history-row__meta">
            <small>{item.meta}</small>
            <time dateTime={item.dateTime}>{dateFormatter.format(new Date(item.dateTime))}</time>
          </span>
        </span>
      </a>
    </li>
  );
}
