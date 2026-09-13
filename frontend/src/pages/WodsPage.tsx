import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { getWods } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { LoadingMessage, StateMessage } from "../components/StateMessage";
import { getErrorStateKind } from "../components/stateMessageUtils";
import { PaginationControls } from "../components/PaginationControls";
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

export function WodsPage() {
  const { token } = useAuth();
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

  return (
    <section className="catalog-page">
      <div className="page-heading">
        <div>
          <h1>WODs</h1>
          <p className="heading-support">Entrenamientos listos para encontrar, consultar y repetir.</p>
        </div>
        <p className="heading-note" aria-live="polite">
          {catalog ? `${catalog.totalElements} ${catalog.totalElements === 1 ? "sesión disponible" : "sesiones disponibles"}` : "Busca tu próximo entrenamiento"}
        </p>
      </div>
      <form className="filter-strip" onSubmit={handleSubmit} aria-label="Filtrar WODs">
        <label>Nombre<input name="name" autoComplete="off" value={name} onChange={(event) => setName(event.target.value)} placeholder="Ej. Fran…" /></label>
        <label>Tipo<select name="type" autoComplete="off" value={type} onChange={(event) => setType(event.target.value)}><option value="">Todos</option><option value="FOR_TIME">FOR TIME</option><option value="AMRAP">AMRAP</option><option value="EMOM">EMOM</option></select></label>
        <label>Nivel<select name="level" autoComplete="off" value={level} onChange={(event) => setLevel(event.target.value)}><option value="">Todos</option><option value="BEGINNER">Principiante</option><option value="INTERMEDIATE">Intermedio</option><option value="RX">RX</option></select></label>
        <button className="button button--accent" type="submit">Aplicar filtros</button>
      </form>
      <p className="catalog-hint">Combina nombre, tipo y nivel para acotar el archivo.</p>
      {activeFilters.length > 0 && (
        <p className="active-filters" aria-live="polite">
          <strong>Filtros activos:</strong> {activeFilters.join(" · ")}
        </p>
      )}
       {!token && <StateMessage kind="private" title="El archivo es privado" message="Inicia sesión para consultar WODs y sus detalles." action={{ label: "Entrar", href: "#/login" }} />}
       {token && isLoading && <LoadingMessage />}
       {token && !isLoading && error && <StateMessage kind={errorKind} title={errorKind === "network-error" ? "No hay conexión con los WODs" : "No pudimos cargar los WODs"} message={error} action={{ label: "Reintentar", onClick: () => { setIsLoading(true); setError(null); setReloadToken((currentToken) => currentToken + 1); } }} />}
       {token && !isLoading && !error && catalog?.items.length === 0 && <StateMessage kind="empty" title="No hay WODs para estos filtros" message="Prueba a ampliar tu búsqueda." />}
      {token && !isLoading && !error && catalog && catalog.items.length > 0 && (
        <div className="catalog-list">
          {catalog.items.map((wod) => (
            <a className="catalog-row" key={wod.id} href={`#/wods/${wod.id}`}>
              <span className="row-number">{String(wod.id).padStart(3, "0")}</span>
              <span className="row-main"><strong>{wod.name}</strong><small>{WOD_TYPE_LABELS[wod.type]} · {wod.level ? WOD_LEVEL_LABELS[wod.level] : "Todos los niveles"}</small></span>
              <span className="row-meta"><small>Nivel</small>{wod.level ? WOD_LEVEL_LABELS[wod.level] : "Todos"}</span>
              <span className="row-arrow" aria-hidden="true">-&gt;</span>
            </a>
          ))}
        </div>
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
  );
}
