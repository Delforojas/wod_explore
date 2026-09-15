import { useEffect, useState } from "react";

import { getUserWod, getUserWods } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { LoadingMessage, StateMessage } from "../components/StateMessage";
import { getErrorStateKind } from "../components/stateMessageUtils";
import { PaginationControls } from "../components/PaginationControls";
import type { UserWodDetail, UserWodPage, WodLevel, WodType } from "../api/schemas";

const PAGE_SIZE = 20;
const dateFormatter = new Intl.DateTimeFormat("es-ES");
const numberFormatter = new Intl.NumberFormat("es-ES");
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

function formatWodMetrics(type: WodType, timeLimit: number | null, rounds: number | null) {
  const metrics: string[] = [];
  if (timeLimit !== null) metrics.push(`${numberFormatter.format(timeLimit)} s`);
  if (rounds !== null) metrics.push(`${numberFormatter.format(rounds)} rondas`);
  if (metrics.length === 0) return "Sin límite ni rondas fijas";
  return `${WOD_TYPE_LABELS[type]} · ${metrics.join(" · ")}`;
}

export function MyWodsPage({ deletionFeedback = false }: { deletionFeedback?: boolean }) {
  const { token } = useAuth();
  const [catalog, setCatalog] = useState<UserWodPage | null>(null);
  const [details, setDetails] = useState<Record<number, UserWodDetail>>({});
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [reloadToken, setReloadToken] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [errorKind, setErrorKind] = useState<"error" | "network-error">("error");

  const requestKey = token ? `${token}:${page}:${reloadToken}` : null;

  useEffect(() => {
    if (!token || !requestKey) return;
    let active = true;

    getUserWods(token, { page, size: PAGE_SIZE })
      .then(async (pageData) => {
        const loadedDetails = await Promise.all(pageData.items.map((wod) => getUserWod(wod.id, token)));
        if (!active) return;
        const detailsById = loadedDetails.reduce<Record<number, UserWodDetail>>((byId, detail) => {
          byId[detail.id] = detail;
          return byId;
        }, {});
        setCatalog(pageData);
        setDetails(detailsById);
        setError(null);
        setLoadedKey(requestKey);
      })
      .catch((caughtError: unknown) => {
        if (!active) return;
        setError(caughtError instanceof Error ? caughtError.message : "No se pudieron cargar tus WODs.");
        setErrorKind(getErrorStateKind(caughtError));
        setLoadedKey(requestKey);
      });

    return () => {
      active = false;
    };
  }, [page, reloadToken, requestKey, token]);

  function goToPage(nextPage: number) {
    setError(null);
    setLoadedKey(null);
    setPage(nextPage);
  }

  function retry() {
    setError(null);
    setLoadedKey(null);
    setReloadToken((current) => current + 1);
  }

  if (!token) {
    return <StateMessage kind="private" title="Tus WODs son privados" message="Inicia sesión para consultar los WODs que has creado." action={{ label: "Entrar", href: "#/login" }} />;
  }
  if (loadedKey !== requestKey) return <LoadingMessage message="Estamos abriendo tu archivo personal." />;
  if (error || !catalog) {
    return <StateMessage kind={errorKind} title={errorKind === "network-error" ? "No hay conexión con tus WODs" : "No pudimos cargar tus WODs"} message={error ?? "Inténtalo de nuevo."} action={{ label: "Reintentar", onClick: retry }} />;
  }

  return (
    <section className="catalog-page my-wods-page" aria-labelledby="my-wods-title">
      <header className="page-heading my-wods-page__heading">
        <div className="page-heading__body">
          <h1 id="my-wods-title">Mis WODs</h1>
          <p className="heading-support">El archivo de las sesiones que has diseñado para volver a entrenar.</p>
        </div>
        <div className="page-heading__actions">
          <p className="heading-note" aria-live="polite">{catalog.totalElements} {catalog.totalElements === 1 ? "WOD guardado" : "WODs guardados"}</p>
          <a className="button button--accent" href="#/create-wod">Crear WOD</a>
        </div>
      </header>

      {deletionFeedback && (
        <StateMessage
          kind="success"
          title="WOD eliminado"
          message="El WOD personalizado se ha eliminado de tu archivo."
        />
      )}

      {catalog.items.length === 0 ? (
        <StateMessage kind="empty" title="Aún no tienes WODs personalizados" message="Diseña una sesión propia y aparecerá aquí para consultarla cuando quieras." action={{ label: "Crear mi primer WOD", href: "#/create-wod" }} />
      ) : (
        <section className="my-wods-results" aria-labelledby="my-wods-results-title">
          <div className="catalog-results-heading">
            <h2 id="my-wods-results-title">Tu archivo personal</h2>
            <p className="catalog-results-heading__status">Ordenado por creación más reciente</p>
          </div>
          <ul className="catalog-list my-wods-list">
            {catalog.items.map((wod) => {
              const detail = details[wod.id];
              const exerciseCount = detail?.exercises.length ?? 0;
              return (
                <li className="catalog-list__item" key={wod.id}>
                  <a className="catalog-row my-wod-row" href={`#/my-wods/${wod.id}`} aria-label={`${wod.name}. Ver detalle de Mis WODs`}>
                    <span className="row-number">{String(wod.id).padStart(3, "0")}</span>
                    <span className="row-main">
                      <strong>{wod.name}</strong>
                      <small className="row-main__type"><span>Formato</span>{formatWodMetrics(wod.type, wod.timeLimit, wod.rounds)}</small>
                    </span>
                    <span className="my-wod-row__meta">
                      <small>{wod.level ? WOD_LEVEL_LABELS[wod.level] : "Todos los niveles"}</small>
                      <b className="metric-value metric-value--compact">{exerciseCount} {exerciseCount === 1 ? "ejercicio" : "ejercicios"}</b>
                      <time dateTime={wod.createdAt}>{dateFormatter.format(new Date(wod.createdAt))}</time>
                    </span>
                    <span className="row-arrow" aria-hidden="true">-&gt;</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      )}
      {(catalog.items.length > 0 || page > 0) && <PaginationControls page={page} hasNext={catalog.hasNext} totalPages={catalog.totalPages} isLoading={false} onPrevious={() => goToPage(Math.max(0, page - 1))} onNext={() => goToPage(page + 1)} />}
    </section>
  );
}
