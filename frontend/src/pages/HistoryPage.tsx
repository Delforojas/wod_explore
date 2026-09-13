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
  const totalResults = history.wodResults.totalElements + history.exerciseResults.totalElements;

  return (
    <section className="catalog-page">
      <div className="page-heading"><div><h1>Historial</h1></div><p className="heading-note">{totalResults} registros guardados</p></div>
      {isEmpty && page === 0 ? <StateMessage kind="empty" title="Aún no hay sesiones" message="Registra un resultado desde cualquier detalle para empezar tu historial." action={{ label: "Explorar WODs", href: "#/wods" }} /> : <div className="history-grid"><HistoryColumn title="Resultados WOD" empty="No hay resultados WOD." total={history.wodResults.totalElements} items={history.wodResults.items.map((result) => ({ id: result.id, title: `WOD #${result.wodId}`, value: result.timeSeconds ? `${result.timeSeconds} s` : `${result.rounds ?? 0} rondas + ${result.reps ?? 0}`, meta: `${result.level} · ${dateFormatter.format(new Date(result.completedAt))}`, href: `#/wods/${result.wodId}` }))} /><HistoryColumn title="Marcas de ejercicios" empty="No hay marcas de ejercicios." total={history.exerciseResults.totalElements} items={history.exerciseResults.items.map((result) => ({ id: result.id, title: `Ejercicio #${result.exerciseId}`, value: `${result.value} ${result.unit}`, meta: `${result.recordType} · ${dateFormatter.format(new Date(result.performedAt))}`, href: `#/exercises/${result.exerciseId}` }))} /></div>}
      {!isEmpty || page > 0 ? <PaginationControls page={page} hasNext={history.wodResults.hasNext || history.exerciseResults.hasNext} isLoading={false} onPrevious={() => goToPage(Math.max(0, page - 1))} onNext={() => goToPage(page + 1)} /> : null}
    </section>
  );
}

interface HistoryColumnProps {
  title: string;
  empty: string;
  total: number;
  items: Array<{ id: number; title: string; value: string; meta: string; href: string }>;
}

function HistoryColumn({ title, empty, total, items }: HistoryColumnProps) {
  return <section className="history-column"><div className="section-heading"><h2>{title}</h2><span>{total}</span></div>{items.length === 0 ? <StateMessage kind="empty" title={empty} /> : items.map((item) => <a className="history-row" href={item.href} key={item.id}><span><strong>{item.title}</strong><small>{item.meta}</small></span><b>{item.value}</b></a>)}</section>;
}
