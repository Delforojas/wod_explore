import { useEffect, useState } from "react";

import { getHistory } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { LoadingMessage, StateMessage } from "../components/StateMessage";
import { getErrorStateKind } from "../components/stateMessageUtils";
import { PaginationControls } from "../components/PaginationControls";
import type { UserHistory } from "../api/schemas";

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
            <dd><data value={history.wodResults.totalElements}>{history.wodResults.totalElements}</data></dd>
          </div>
          <div>
            <dt>Marcas de ejercicios</dt>
            <dd><data value={history.exerciseResults.totalElements}>{history.exerciseResults.totalElements}</data></dd>
          </div>
        </dl>
      </header>
      {isEmpty && page === 0 ? <StateMessage kind="empty" title="Aún no hay sesiones" message="Registra un resultado desde cualquier detalle para empezar tu historial." action={{ label: "Explorar WODs", href: "#/wods" }} /> : (
        <div className="history-grid">
          <HistoryColumn
            title="Resultados WOD"
            description="Sesiones registradas"
            empty="No hay resultados WOD."
            total={history.wodResults.totalElements}
            emptyAction={{ label: "Explorar WODs", href: "#/wods" }}
            items={history.wodResults.items.map((result) => {
              const title = formatResourceName(result.wodName, "WOD", result.wodId);
              const value = result.timeSeconds !== null
                ? `${result.timeSeconds}`
                : `${result.rounds ?? 0} rondas + ${result.reps ?? 0} repeticiones`;
              const accessibleValue = result.timeSeconds !== null
                ? `${result.timeSeconds} segundos`
                : `${result.rounds ?? 0} rondas y ${result.reps ?? 0} repeticiones`;

              return {
                id: result.id,
                title,
                type: "Resultado WOD",
                value,
                unit: result.timeSeconds !== null ? "segundos" : undefined,
                meta: formatLevel(result.level),
                dateTime: result.completedAt,
                href: `#/wods/${result.wodId}`,
                ariaLabel: `${title}, ${accessibleValue}. Ver detalle del WOD`,
              };
            })}
          />
          <HistoryColumn
            title="Marcas de ejercicios"
            description="Mejores registros guardados"
            empty="No hay marcas de ejercicios."
            total={history.exerciseResults.totalElements}
            emptyAction={{ label: "Explorar ejercicios", href: "#/exercises" }}
            items={history.exerciseResults.items.map((result) => {
              const title = formatResourceName(result.exerciseName, "Ejercicio", result.exerciseId);
              const unit = formatUnit(result.unit);

              return {
                id: result.id,
                title,
                type: "Marca de ejercicio",
                value: `${result.value}`,
                unit,
                meta: result.recordType,
                dateTime: result.performedAt,
                href: `#/exercises/${result.exerciseId}`,
                ariaLabel: `${title}, ${result.value} ${unit}. Ver detalle del ejercicio`,
              };
            })}
          />
        </div>
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

function formatResourceName(name: string | null, resourceLabel: "WOD" | "Ejercicio", id: number) {
  const normalizedName = name?.trim();
  return normalizedName || `${resourceLabel} #${id}`;
}

interface HistoryColumnProps {
  title: string;
  description: string;
  empty: string;
  total: number;
  emptyAction: { label: string; href: string };
  items: Array<{ id: number; title: string; type: string; value: string; unit?: string; meta: string; dateTime: string; href: string; ariaLabel: string }>;
}

function HistoryColumn({ title, description, empty, total, emptyAction, items }: HistoryColumnProps) {
  const headingId = `history-${title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <section className="history-column" aria-labelledby={headingId}>
      <header className="section-heading">
        <div>
          <h2 id={headingId}>{title}</h2>
          <p className="section-description">{description}</p>
        </div>
        <span className="history-column__total" aria-label={`${total} registros`}>
          <data value={total}>{total}</data>
        </span>
      </header>
      {items.length === 0 ? <StateMessage kind="empty" title={empty} action={emptyAction} /> : (
        <ol className="history-list">
          {items.map((item) => (
            <li key={item.id}>
              <a className="history-row" href={item.href} aria-label={item.ariaLabel}>
                <span className="history-row__content">
                  <small className="history-row__type">{item.type}</small>
                  <strong>{item.title}</strong>
                  <span className="history-row__meta">
                    <small>{item.meta}</small>
                    <time dateTime={item.dateTime}>{dateFormatter.format(new Date(item.dateTime))}</time>
                  </span>
                </span>
                <span className="history-row__value">
                  <b>{item.value}</b>
                  {item.unit && <small className="history-row__unit">{item.unit}</small>}
                  <small>Ver detalle</small>
                </span>
              </a>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
