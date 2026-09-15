import { useEffect, useState } from "react";

import { getEvolution, getStatistics } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { LoadingMessage, StateMessage } from "../components/StateMessage";
import { getErrorStateKind } from "../components/stateMessageUtils";
import type { ExerciseRecordType, ExerciseResultUnit, UserEvolution, UserStatistics, WodLevel, WodType } from "../api/schemas";

const WOD_TYPE_LABELS: Record<WodType, string> = { FOR_TIME: "Por tiempo", AMRAP: "AMRAP", EMOM: "EMOM" };
const WOD_LEVEL_LABELS: Record<WodLevel, string> = { BEGINNER: "Principiante", INTERMEDIATE: "Intermedio", RX: "RX" };
const RECORD_TYPE_LABELS: Record<ExerciseRecordType, string> = { "1RM": "1RM", "3RM": "3RM", "5RM": "5RM", "10RM": "10RM", MAX_REPS: "Máximo de repeticiones", BEST_TIME: "Mejor tiempo" };
const UNIT_LABELS: Record<ExerciseResultUnit, string> = { KG: "kg", REPS: "repeticiones", SECONDS: "segundos", METERS: "metros" };
const dateFormatter = new Intl.DateTimeFormat("es-ES");

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
    <section className="catalog-page statistics-page" aria-labelledby="statistics-title">
      <header className="page-heading statistics-page__heading">
        <div>
          <h1 id="statistics-title">Estadísticas</h1>
          <p className="heading-support">Tu actividad, tus marcas y tu evolución.</p>
        </div>
      </header>
      <section className="stats-overview statistics-page__overview" aria-labelledby="activity-title">
        <header className="section-heading">
          <div>
            <h2 id="activity-title">Actividad registrada</h2>
            <p className="section-description">El volumen de resultados que forma tu archivo personal.</p>
          </div>
        </header>
        <div className="stat-strip" aria-label="Resumen de actividad">
          <StatValue value={statistics.wodPersonalRecords.length + statistics.exercisePersonalRecords.length} label="Marcas personales" emphasis />
          <StatValue value={statistics.wodResultsCount} label="Resultados WOD" />
          <StatValue value={statistics.exerciseResultsCount} label="Marcas de ejercicios" />
        </div>
      </section>
      <section className="personal-records statistics-page__records" aria-labelledby="records-title">
        <header className="section-heading section-heading--spacious">
          <div>
            <h2 id="records-title">Marcas personales</h2>
            <p className="section-description">Tus mejores referencias, enlazadas al detalle de cada movimiento o WOD.</p>
          </div>
          <span className="statistics-page__records-total" aria-label={`${statistics.wodPersonalRecords.length + statistics.exercisePersonalRecords.length} marcas`}>
            <data className="metric-value metric-value--compact" value={statistics.wodPersonalRecords.length + statistics.exercisePersonalRecords.length}>{statistics.wodPersonalRecords.length + statistics.exercisePersonalRecords.length}</data>
          </span>
        </header>
        <div className="stats-columns">
          <RecordColumn
            title="Marcas WOD"
            empty="Todavía no hay marcas WOD."
            emptyAction={{ label: "Explorar WODs", href: "#/wods" }}
            items={statistics.wodPersonalRecords.map((record) => ({
              id: record.resultId,
              kind: "wod" as const,
              title: record.wodName,
              type: "Marca WOD",
              value: record.timeSeconds !== null ? `${record.timeSeconds}` : `${record.rounds ?? 0} rondas + ${record.reps ?? 0} repeticiones`,
              unit: record.timeSeconds !== null ? "segundos" : undefined,
              meta: `${WOD_TYPE_LABELS[record.wodType]} · ${WOD_LEVEL_LABELS[record.level]}`,
              date: record.completedAt,
              href: `#/wods/${record.wodId}`,
              ariaLabel: `${record.wodName}, marca WOD de ${record.timeSeconds !== null ? `${record.timeSeconds} segundos` : `${record.rounds ?? 0} rondas y ${record.reps ?? 0} repeticiones`}. Ver detalle del WOD`,
            }))}
          />
          <RecordColumn
            title="Marcas de ejercicios"
            empty="Todavía no hay marcas de ejercicios."
            emptyAction={{ label: "Explorar ejercicios", href: "#/exercises" }}
            items={statistics.exercisePersonalRecords.map((record) => ({
              id: record.resultId,
              kind: "exercise" as const,
              title: record.exerciseName,
              type: "Marca de ejercicio",
              value: `${record.value}`,
              unit: UNIT_LABELS[record.unit],
              meta: RECORD_TYPE_LABELS[record.recordType],
              date: record.performedAt,
              href: `#/exercises/${record.exerciseId}`,
              ariaLabel: `${record.exerciseName}, ${RECORD_TYPE_LABELS[record.recordType]} de ${record.value} ${UNIT_LABELS[record.unit]}. Ver detalle del ejercicio`,
            }))}
          />
        </div>
      </section>
      <section className="evolution-section statistics-page__evolution" aria-labelledby="evolution-title">
        <header className="section-heading section-heading--spacious">
          <div>
            <h2 id="evolution-title">Evolución</h2>
            <p className="section-description">Una secuencia temporal de tus intentos. El detalle completo aparece en cada fila.</p>
          </div>
          <span className="statistics-page__evolution-total">
            <data className="metric-value metric-value--compact" value={evolution.wodResults.length + evolution.exerciseResults.length}>{evolution.wodResults.length + evolution.exerciseResults.length}</data> intentos
          </span>
        </header>
        <div className="evolution-grid">
          <EvolutionColumn
            title="WODs"
            emptyAction={{ label: "Explorar WODs", href: "#/wods" }}
            items={evolution.wodResults.map((point) => ({
              id: point.resultId,
              kind: "wod" as const,
              date: point.completedAt,
              title: point.wodName,
              value: point.timeSeconds !== null ? `${point.timeSeconds}` : `${point.rounds ?? 0} rondas + ${point.reps ?? 0} repeticiones`,
              unit: point.timeSeconds !== null ? "segundos" : undefined,
              meta: `${WOD_TYPE_LABELS[point.wodType]} · ${WOD_LEVEL_LABELS[point.level]}`,
              href: `#/wods/${point.wodId}`,
              ariaLabel: `${point.wodName}, ${point.timeSeconds !== null ? `${point.timeSeconds} segundos` : `${point.rounds ?? 0} rondas y ${point.reps ?? 0} repeticiones`}. Ver detalle del WOD`,
            }))}
          />
          <EvolutionColumn
            title="Ejercicios"
            emptyAction={{ label: "Explorar ejercicios", href: "#/exercises" }}
            items={evolution.exerciseResults.map((point) => ({
              id: point.resultId,
              kind: "exercise" as const,
              date: point.performedAt,
              title: point.exerciseName,
              value: `${point.value}`,
              unit: UNIT_LABELS[point.unit],
              meta: RECORD_TYPE_LABELS[point.recordType],
              href: `#/exercises/${point.exerciseId}`,
              ariaLabel: `${point.exerciseName}, ${RECORD_TYPE_LABELS[point.recordType]} de ${point.value} ${UNIT_LABELS[point.unit]}. Ver detalle del ejercicio`,
            }))}
          />
        </div>
      </section>
    </section>
  );
}

function StatValue({ value, label, emphasis = false }: { value: number; label: string; emphasis?: boolean }) {
  return <div className={`stat-value${emphasis ? " stat-value--primary" : ""}`}><strong className={`metric-value ${emphasis ? "metric-value--hero" : "metric-value--summary"}`}><data value={value}>{value}</data></strong><span>{label}</span></div>;
}

type RecordItemKind = "wod" | "exercise";

interface RecordColumnProps { title: string; empty: string; emptyAction: { label: string; href: string }; items: Array<{ id: number; kind: RecordItemKind; title: string; type: string; value: string; unit?: string; meta: string; date: string; href: string; ariaLabel: string }>; }

function RecordColumn({ title, empty, emptyAction, items }: RecordColumnProps) {
  const headingId = `records-${title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <section className="record-column" aria-labelledby={headingId}>
      <header className="section-heading">
        <h3 id={headingId}>{title}</h3>
        <span className="record-column__total" aria-label={`${items.length} registros`}>
          <data className="metric-value metric-value--compact" value={items.length}>{items.length}</data>
        </span>
      </header>
      {items.length === 0 ? <StateMessage kind="empty" title={empty} action={emptyAction} /> : (
        <ol className="record-list">
          {items.map((item) => (
            <li key={item.id}>
              <a className={`record-row record-row--${item.kind}`} href={item.href} aria-label={item.ariaLabel}>
                <span className="record-row__value">
                  <b className="metric-value metric-value--row"><data value={item.value}>{item.value}</data></b>
                  {item.unit && <small className="record-row__unit">{item.unit}</small>}
                  <small className="record-row__link-label">Ver detalle</small>
                </span>
                <span className="record-row__content">
                  <small className="record-row__type">{item.type}</small>
                  <strong>{item.title}</strong>
                  <span className="record-row__meta">
                    <small>{item.meta}</small>
                    <time dateTime={item.date}>{dateFormatter.format(new Date(item.date))}</time>
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function EvolutionColumn({ title, emptyAction, items }: { title: string; emptyAction: { label: string; href: string }; items: Array<{ id: number; kind: RecordItemKind; date: string; title: string; value: string; unit?: string; meta: string; href: string; ariaLabel: string }> }) {
  const headingId = `evolution-${title.toLowerCase()}`;

  return (
    <section className="evolution-column" aria-labelledby={headingId}>
      <header className="evolution-column__heading">
        <h3 id={headingId}>{title}</h3>
        <span>{items.length} {items.length === 1 ? "intento" : "intentos"}</span>
      </header>
      {items.length === 0 ? <StateMessage kind="empty" title="Sin intentos todavía." message="Registra un resultado para empezar a ver tu secuencia." action={emptyAction} /> : (
        <>
          <div className="evolution-band" aria-hidden="true">
            {items.map((item) => <span className="evolution-band__segment" key={item.id} />)}
          </div>
          <p className="evolution-band__label">Secuencia temporal de intentos</p>
          <ol className="evolution-list">
            {items.map((item) => (
              <li className="evolution-row" key={item.id}>
                <a className={`evolution-row__link evolution-row__link--${item.kind}`} href={item.href} aria-label={item.ariaLabel}>
                  <span className="evolution-row__value">
                    <b className="metric-value metric-value--row"><data value={item.value}>{item.value}</data></b>
                    {item.unit && <small className="evolution-row__unit">{item.unit}</small>}
                  </span>
                  <span className="evolution-row__content">
                    <strong>{item.title}</strong>
                    <small>{item.meta}</small>
                  </span>
                  <time dateTime={item.date}>{dateFormatter.format(new Date(item.date))}</time>
                </a>
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  );
}
