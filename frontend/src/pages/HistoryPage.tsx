import { useEffect, useState } from "react";

import { getHistory } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { LoadingMessage, StateMessage } from "../components/StateMessage";
import type { UserHistory } from "../api/schemas";

export function HistoryPage() {
  const { token } = useAuth();
  const [history, setHistory] = useState<UserHistory | null>(null);
  const [loadedToken, setLoadedToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let active = true;
    getHistory(token)
      .then((data) => { if (active) { setError(null); setHistory(data); } })
      .catch((caughtError: Error) => { if (active) setError(caughtError.message); })
      .finally(() => { if (active) setLoadedToken(token); });
    return () => { active = false; };
  }, [token]);

  if (!token) return <StateMessage title="Tu historial es privado" message="Inicia sesión para consultar las sesiones que has registrado." action={{ label: "Entrar", href: "#/login" }} />;
  if (token && loadedToken !== token) return <LoadingMessage />;
  if (error || !history) return <StateMessage title="No pudimos cargar tu historial" message={error ?? "Inténtalo de nuevo."} tone="error" action={{ label: "Reintentar", onClick: () => window.location.reload() }} />;
  const isEmpty = history.wodResults.length === 0 && history.exerciseResults.length === 0;

  return (
    <section className="catalog-page">
      <div className="page-heading"><div><h1>Historial</h1></div><p className="heading-note">{history.wodResults.length + history.exerciseResults.length} registros guardados</p></div>
      {isEmpty ? <StateMessage title="Aún no hay sesiones" message="Registra un resultado desde cualquier detalle para empezar tu historial." action={{ label: "Explorar WODs", href: "#/wods" }} /> : <div className="history-grid"><HistoryColumn title="Resultados WOD" empty="No hay resultados WOD." items={history.wodResults.map((result) => ({ id: result.id, title: `WOD #${result.wodId}`, value: result.timeSeconds ? `${result.timeSeconds} s` : `${result.rounds ?? 0} rondas + ${result.reps ?? 0}`, meta: `${result.level} · ${new Date(result.completedAt).toLocaleDateString("es-ES")}`, href: `#/wods/${result.wodId}` }))} /><HistoryColumn title="Marcas de ejercicios" empty="No hay marcas de ejercicios." items={history.exerciseResults.map((result) => ({ id: result.id, title: `Ejercicio #${result.exerciseId}`, value: `${result.value} ${result.unit}`, meta: `${result.recordType} · ${new Date(result.performedAt).toLocaleDateString("es-ES")}`, href: `#/exercises/${result.exerciseId}` }))} /></div>}
    </section>
  );
}

interface HistoryColumnProps {
  title: string;
  empty: string;
  items: Array<{ id: number; title: string; value: string; meta: string; href: string }>;
}

function HistoryColumn({ title, empty, items }: HistoryColumnProps) {
  return <section className="history-column"><div className="section-heading"><h2>{title}</h2><span>{items.length}</span></div>{items.length === 0 ? <p className="muted">{empty}</p> : items.map((item) => <a className="history-row" href={item.href} key={item.id}><span><strong>{item.title}</strong><small>{item.meta}</small></span><b>{item.value}</b></a>)}</section>;
}
