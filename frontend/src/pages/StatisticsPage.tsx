import { useEffect, useState } from "react";

import { getEvolution, getStatistics } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { LoadingMessage, StateMessage } from "../components/StateMessage";
import { getErrorStateKind } from "../components/stateMessageUtils";
import type { UserEvolution, UserStatistics } from "../api/schemas";

export function StatisticsPage() {
  const { token } = useAuth();
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [evolution, setEvolution] = useState<UserEvolution | null>(null);
  const [loadedToken, setLoadedToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorKind, setErrorKind] = useState<"error" | "network-error">("error");

  useEffect(() => {
    if (!token) return;
    let active = true;
    Promise.all([getStatistics(token), getEvolution(token)])
      .then(([loadedStatistics, loadedEvolution]) => {
        if (!active) return;
        setError(null);
        setStatistics(loadedStatistics);
        setEvolution(loadedEvolution);
      })
      .catch((caughtError: unknown) => {
        if (!active) return;
        setError(caughtError instanceof Error ? caughtError.message : "No se pudieron cargar tus estadísticas.");
        setErrorKind(getErrorStateKind(caughtError));
      })
      .finally(() => { if (active) setLoadedToken(token); });
    return () => { active = false; };
  }, [token]);

  if (!token) return <StateMessage kind="private" title="Tus marcas son privadas" message="Inicia sesión para consultar estadísticas y evolución." action={{ label: "Entrar", href: "#/login" }} />;
  if (token && loadedToken !== token) return <LoadingMessage />;
  if (error || !statistics || !evolution) return <StateMessage kind={errorKind} title={errorKind === "network-error" ? "No hay conexión con tus estadísticas" : "No pudimos cargar tus estadísticas"} message={error ?? "Inténtalo de nuevo."} action={{ label: "Reintentar", onClick: () => window.location.reload() }} />;

  return (
    <section className="catalog-page statistics-page">
      <div className="page-heading"><div><h1>Estadísticas</h1></div><p className="heading-note">Una lectura de tus sesiones, no una predicción</p></div>
      <div className="stat-strip"><StatValue value={statistics.wodResultsCount} label="Resultados WOD" /><StatValue value={statistics.exerciseResultsCount} label="Marcas de ejercicios" /><StatValue value={statistics.wodPersonalRecords.length + statistics.exercisePersonalRecords.length} label="Marcas personales" /></div>
      <div className="stats-columns"><RecordColumn title="Marcas WOD" empty="Todavía no hay marcas WOD." items={statistics.wodPersonalRecords.map((record) => ({ id: record.resultId, title: record.wodName, value: record.timeSeconds ? `${record.timeSeconds} s` : `${record.rounds ?? 0} rondas + ${record.reps ?? 0}`, meta: `${record.wodType} · ${record.level}`, href: `#/wods/${record.wodId}` }))} /><RecordColumn title="Marcas de ejercicios" empty="Todavía no hay marcas de ejercicios." items={statistics.exercisePersonalRecords.map((record) => ({ id: record.resultId, title: record.exerciseName, value: `${record.value} ${record.unit}`, meta: record.recordType, href: `#/exercises/${record.exerciseId}` }))} /></div>
      <section className="evolution-section"><div className="section-heading"><h2>Evolución</h2><span>{evolution.wodResults.length + evolution.exerciseResults.length} intentos</span></div><div className="evolution-grid"><EvolutionColumn title="WODs" items={evolution.wodResults.map((point) => ({ id: point.resultId, date: point.completedAt, title: point.wodName, value: point.timeSeconds ? `${point.timeSeconds} s` : `${point.rounds ?? 0} + ${point.reps ?? 0}` }))} /><EvolutionColumn title="Ejercicios" items={evolution.exerciseResults.map((point) => ({ id: point.resultId, date: point.performedAt, title: point.exerciseName, value: `${point.value} ${point.unit}` }))} /></div></section>
    </section>
  );
}

function StatValue({ value, label }: { value: number; label: string }) {
  return <div className="stat-value"><strong>{value}</strong><span>{label}</span></div>;
}

interface RecordColumnProps { title: string; empty: string; items: Array<{ id: number; title: string; value: string; meta: string; href: string }>; }

function RecordColumn({ title, empty, items }: RecordColumnProps) {
  return <section className="record-column"><div className="section-heading"><h2>{title}</h2><span>{items.length}</span></div>{items.length === 0 ? <StateMessage kind="empty" title={empty} /> : items.map((item) => <a className="record-row" href={item.href} key={item.id}><span><strong>{item.title}</strong><small>{item.meta}</small></span><b>{item.value}</b></a>)}</section>;
}

function EvolutionColumn({ title, items }: { title: string; items: Array<{ id: number; date: string; title: string; value: string }> }) {
  return <section><h3 className="subheading">{title}</h3>{items.length === 0 ? <StateMessage kind="empty" title="Sin intentos todavía." /> : <div className="evolution-list">{items.map((item) => <div className="evolution-row" key={item.id}><time>{new Date(item.date).toLocaleDateString("es-ES")}</time><strong>{item.title}</strong><b>{item.value}</b></div>)}</div>}</section>;
}
