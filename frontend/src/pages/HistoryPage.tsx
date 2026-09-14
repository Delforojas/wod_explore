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
            <dd>{history.wodResults.totalElements}</dd>
          </div>
          <div>
            <dt>Marcas de ejercicios</dt>
            <dd>{history.exerciseResults.totalElements}</dd>
          </div>
        </dl>
      </header>
      {isEmpty && page === 0 ? <StateMessage kind="empty" title="Aún no hay sesiones" message="Registra un resultado desde cualquier detalle para empezar tu historial." action={{ label: "Explorar WODs", href: "#/wods" }} /> : <div className="history-grid"><HistoryColumn title="Resultados WOD" description="Sesiones registradas" empty="No hay resultados WOD." total={history.wodResults.totalElements} emptyAction={{ label: "Explorar WODs", href: "#/wods" }} items={history.wodResults.items.map((result) => ({ id: result.id, title: `WOD #${result.wodId}`, type: "Resultado WOD", value: result.timeSeconds !== null ? `${result.timeSeconds} s` : `${result.rounds ?? 0} rondas + ${result.reps ?? 0} repeticiones`, meta: formatLevel(result.level), dateTime: result.completedAt, href: `#/wods/${result.wodId}`, ariaLabel: `WOD #${result.wodId}, ${result.timeSeconds !== null ? `${result.timeSeconds} segundos` : `${result.rounds ?? 0} rondas y ${result.reps ?? 0} repeticiones`}. Ver detalle del WOD` }))} /><HistoryColumn title="Marcas de ejercicios" description="Mejores registros guardados" empty="No hay marcas de ejercicios." total={history.exerciseResults.totalElements} emptyAction={{ label: "Explorar ejercicios", href: "#/exercises" }} items={history.exerciseResults.items.map((result) => ({ id: result.id, title: `Ejercicio #${result.exerciseId}`, type: "Marca de ejercicio", value: `${result.value} ${formatUnit(result.unit)}`, meta: result.recordType, dateTime: result.performedAt, href: `#/exercises/${result.exerciseId}`, ariaLabel: `Ejercicio #${result.exerciseId}, ${result.value} ${formatUnit(result.unit)}. Ver detalle del ejercicio` }))} /></div>}
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

interface HistoryColumnProps {
  title: string;
  description: string;
  empty: string;
  total: number;
  emptyAction: { label: string; href: string };
  items: Array<{ id: number; title: string; type: string; value: string; meta: string; dateTime: string; href: string; ariaLabel: string }>;
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
        <span>{total}</span>
      </header>
      {items.length === 0 ? <StateMessage kind="empty" title={empty} action={emptyAction} /> : (
        <ol className="history-list">
          {items.map((item) => (
            <li key={item.id}>
              <a className="history-row" href={item.href} aria-label={item.ariaLabel}>
                <span className="history-row__content">
                  <small className="history-row__type">{item.type}</small>
                  <strong>{item.title}</strong>
                  <small>{item.meta} · <time dateTime={item.dateTime}>{dateFormatter.format(new Date(item.dateTime))}</time></small>
                </span>
                <span className="history-row__value"><b>{item.value}</b><small>Ver detalle</small></span>
              </a>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
