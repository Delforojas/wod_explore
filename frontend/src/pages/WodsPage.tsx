import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { getWods } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { LoadingMessage, StateMessage } from "../components/StateMessage";
import { getErrorStateKind } from "../components/stateMessageUtils";
import { PaginationControls } from "../components/PaginationControls";
import { WodFavoriteButton } from "../components/WodFavoriteButton";
import type { WodLevel, WodPage, WodType } from "../api/schemas";

const DEFAULT_PAGE_SIZE = 20;
const WOD_TYPE_LABELS: Record<WodType, string> = {
  FOR_TIME: "For time",
  AMRAP: "AMRAP",
  EMOM: "EMOM",
};
const WOD_LEVEL_LABELS: Record<WodLevel, string> = {
  BEGINNER: "Principiante",
  INTERMEDIATE: "Intermedio",
  RX: "RX",
};

function formatWodType(type: string) {
  return type === "FOR_TIME" ? "For time" : type;
}

function formatWodLevel(level: string) {
  return level === "BEGINNER" ? "Principiante" : level === "INTERMEDIATE" ? "Intermedio" : level;
}

function formatWodCount(total: number) {
  return `${total} ${total === 1 ? "sesión disponible" : "sesiones disponibles"}`;
}

export function WodsPage() {
  const {
    favoriteWodIds,
    favoritesError,
    favoritesErrorKind,
    favoritesStatus,
    retryFavorites,
    token,
  } = useAuth();
  const [catalog, setCatalog] = useState<WodPage | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [level, setLevel] = useState("");
  const [filters, setFilters] = useState({ name: "", type: "", level: "" });
  const [page, setPage] = useState(0);
  const [reloadToken, setReloadToken] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorKind, setErrorKind] = useState<"error" | "network-error">("error");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  useEffect(() => {
    let active = true;
    if (!token) {
      return;
    }
    getWods(filters, token, { page, size: DEFAULT_PAGE_SIZE })
      .then((data) => { if (active) setCatalog(data); })
      .catch((caughtError: unknown) => {
        if (!active) return;
        setError(caughtError instanceof Error ? caughtError.message : "No se pudieron cargar los WODs.");
        setErrorKind(getErrorStateKind(caughtError));
      })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [token, filters, page, reloadToken]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setPage(0);
    setFilters({ name, type, level });
  }

  function goToPage(nextPage: number) {
    setIsLoading(true);
    setError(null);
    setPage(nextPage);
  }

  const activeFilters = [
    filters.name ? `Nombre: ${filters.name}` : null,
    filters.type ? `Tipo: ${formatWodType(filters.type)}` : null,
    filters.level ? `Nivel: ${formatWodLevel(filters.level)}` : null,
  ].filter((value): value is string => value !== null);
  const visibleItems = catalog
    ? catalog.items.filter((wod) => !favoritesOnly || favoriteWodIds.has(wod.id))
    : [];

  return (
    <section className="catalog-page catalog-page--wods">
      <header className="page-heading">
        <div className="page-heading__body">
          <h1>WODs</h1>
          <p className="heading-support">Entrenamientos listos para encontrar, consultar y repetir.</p>
        </div>
        <div className="page-heading__actions">
          <p className="heading-note" aria-live="polite">
            {catalog
              ? formatWodCount(favoritesOnly ? visibleItems.length : catalog.totalElements)
              : "Busca tu próximo entrenamiento"}
          </p>
          <a className="button button--accent" href="#/create-wod">Crear WOD</a>
        </div>
      </header>
      <form className="filter-strip" onSubmit={handleSubmit} aria-label="Filtrar WODs">
        <label>Nombre<input name="name" autoComplete="off" value={name} onChange={(event) => setName(event.target.value)} placeholder="Ej. Fran…" /></label>
        <label>Tipo<select name="type" autoComplete="off" value={type} onChange={(event) => setType(event.target.value)}><option value="">Todos</option><option value="FOR_TIME">FOR TIME</option><option value="AMRAP">AMRAP</option><option value="EMOM">EMOM</option></select></label>
        <label>Nivel<select name="level" autoComplete="off" value={level} onChange={(event) => setLevel(event.target.value)}><option value="">Todos</option><option value="BEGINNER">Principiante</option><option value="INTERMEDIATE">Intermedio</option><option value="RX">RX</option></select></label>
        <button className="button button--accent" type="submit">Aplicar filtros</button>
      </form>
      <div className="favorites-filter" aria-label="Filtrar por favoritos">
        <button
          className="button button--secondary"
          type="button"
          aria-pressed={favoritesOnly}
          disabled={favoritesStatus !== "ready"}
          onClick={() => setFavoritesOnly((current) => !current)}
        >
          {favoritesOnly ? "Ver todos los WODs" : "Solo favoritos"}
        </button>
        <p aria-live="polite">
          {favoritesOnly ? "El catálogo muestra únicamente tus favoritos." : "También puedes consultar únicamente tus favoritos."}
        </p>
      </div>
      <p className="catalog-hint">Combina nombre, tipo y nivel para acotar el archivo.</p>
      {activeFilters.length > 0 && (
        <p className="active-filters" aria-live="polite">
          <strong>Filtros activos:</strong> {activeFilters.join(" · ")}
        </p>
      )}
      <section className="catalog-results" aria-labelledby="wod-results-title">
        <div className="catalog-results-heading">
          <h2 id="wod-results-title">Resultados de WODs</h2>
          <p className="catalog-results-heading__status" aria-live="polite">
            {catalog ? (activeFilters.length > 0 ? "Mostrando los filtros aplicados" : "Todos los entrenamientos") : "Los resultados aparecerán aquí"}
          </p>
        </div>
        {token && favoritesStatus === "loading" && <StateMessage kind="loading" title="Cargando favoritos" message="Estamos recuperando tus WODs guardados." />}
        {token && favoritesStatus === "error" && <StateMessage kind={favoritesErrorKind ?? "error"} title={favoritesErrorKind === "network-error" ? "No hay conexión con tus favoritos" : "No pudimos cargar tus favoritos"} message={favoritesError ?? "Inténtalo de nuevo."} action={{ label: "Reintentar favoritos", onClick: retryFavorites }} />}
        {token && favoritesStatus === "ready" && favoritesError && <StateMessage kind={favoritesErrorKind ?? "error"} title={favoritesErrorKind === "network-error" ? "No hay conexión con tus favoritos" : "No pudimos actualizar favoritos"} message={favoritesError} action={{ label: "Reintentar favoritos", onClick: retryFavorites }} />}
        {!token && <StateMessage kind="private" title="El archivo es privado" message="Inicia sesión para consultar WODs y sus detalles." action={{ label: "Entrar", href: "#/login" }} />}
        {token && isLoading && <LoadingMessage />}
        {token && !isLoading && error && <StateMessage kind={errorKind} title={errorKind === "network-error" ? "No hay conexión con los WODs" : "No pudimos cargar los WODs"} message={error} action={{ label: "Reintentar", onClick: () => { setIsLoading(true); setError(null); setReloadToken((currentToken) => currentToken + 1); } }} />}
        {token && !isLoading && !error && catalog && visibleItems.length === 0 && (
          <StateMessage
            kind="empty"
            title={favoritesOnly ? (favoriteWodIds.size === 0 ? "Aún no tienes favoritos" : "No hay favoritos para estos filtros") : "No hay WODs para estos filtros"}
            message={favoritesOnly && favoriteWodIds.size === 0 ? "Marca un WOD como favorito y aparecerá aquí." : "Prueba a ampliar tu búsqueda o cambia el filtro de favoritos."}
          />
        )}
        {token && !isLoading && !error && catalog && visibleItems.length > 0 && (
          <ul className="catalog-list">
            {visibleItems.map((wod) => (
              <li className="catalog-list__item" key={wod.id}>
                <div className="catalog-row catalog-row--wod">
                  <span className="row-number">{String(wod.id).padStart(3, "0")}</span>
                  <a className="catalog-row__link" href={`#/wods/${wod.id}`} aria-label={`${wod.name}. Ver detalle del WOD`}>
                    <span className="row-main"><strong>{wod.name}</strong><small className="row-main__type"><span>Formato</span>{WOD_TYPE_LABELS[wod.type]}</small></span>
                    <span className="row-meta"><small>Nivel</small>{wod.level ? WOD_LEVEL_LABELS[wod.level] : "Todos"}</span>
                    <span className="row-arrow" aria-hidden="true">-&gt;</span>
                  </a>
                  <WodFavoriteButton wodId={wod.id} wodName={wod.name} />
                </div>
              </li>
            ))}
          </ul>
        )}
        {token && !isLoading && !error && catalog && (
          <PaginationControls
            page={page}
            hasNext={catalog.hasNext}
            totalPages={catalog.totalPages}
            isLoading={isLoading}
            onPrevious={() => goToPage(Math.max(0, page - 1))}
            onNext={() => goToPage(page + 1)}
          />
        )}
      </section>
    </section>
  );
}
