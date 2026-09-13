import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { getWods } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { LoadingMessage, StateMessage } from "../components/StateMessage";
import { PaginationControls } from "../components/PaginationControls";
import type { WodPage } from "../api/schemas";

const DEFAULT_PAGE_SIZE = 20;

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

  useEffect(() => {
    let active = true;
    if (!token) {
      return;
    }
    getWods(filters, token, { page, size: DEFAULT_PAGE_SIZE })
      .then((data) => { if (active) setCatalog(data); })
      .catch((caughtError: Error) => { if (active) setError(caughtError.message); })
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

  return (
    <section className="catalog-page">
      <div className="page-heading">
        <div>
          <h1>WODs</h1>
        </div>
        <p className="heading-note">Busca tu próximo entrenamiento</p>
      </div>
      <form className="filter-strip" onSubmit={handleSubmit}>
        <label>Nombre<input name="name" autoComplete="off" value={name} onChange={(event) => setName(event.target.value)} placeholder="Ej. Fran…" /></label>
        <label>Tipo<select name="type" autoComplete="off" value={type} onChange={(event) => setType(event.target.value)}><option value="">Todos</option><option value="FOR_TIME">FOR TIME</option><option value="AMRAP">AMRAP</option><option value="EMOM">EMOM</option></select></label>
        <label>Nivel<select name="level" autoComplete="off" value={level} onChange={(event) => setLevel(event.target.value)}><option value="">Todos</option><option value="BEGINNER">Principiante</option><option value="INTERMEDIATE">Intermedio</option><option value="RX">RX</option></select></label>
        <button className="button button--accent" type="submit">Aplicar filtros</button>
      </form>
      {!token && <StateMessage title="El archivo es privado" message="Inicia sesión para consultar WODs y sus detalles." action={{ label: "Entrar", href: "#/login" }} />}
      {token && isLoading && <LoadingMessage />}
      {token && !isLoading && error && <StateMessage title="No pudimos cargar los WODs" message={error} tone="error" action={{ label: "Reintentar", onClick: () => { setIsLoading(true); setError(null); setReloadToken((currentToken) => currentToken + 1); } }} />}
      {token && !isLoading && !error && catalog?.items.length === 0 && <StateMessage title="No hay WODs para estos filtros" message="Prueba a ampliar tu búsqueda." />}
      {token && !isLoading && !error && catalog && catalog.items.length > 0 && (
        <div className="catalog-list">
          {catalog.items.map((wod) => (
            <a className="catalog-row" key={wod.id} href={`#/wods/${wod.id}`}>
              <span className="row-number">{String(wod.id).padStart(3, "0")}</span>
              <span className="row-main"><strong>{wod.name}</strong><small>{wod.type.replace("_", " ")}</small></span>
              <span className="row-meta">{wod.level ?? "Todos los niveles"}</span>
              <span className="row-arrow" aria-hidden="true">-&gt;</span>
            </a>
          ))}
        </div>
      )}
      {token && !isLoading && !error && catalog && (
        <PaginationControls
          page={page}
          hasNext={catalog.hasNext}
          isLoading={isLoading}
          onPrevious={() => goToPage(Math.max(0, page - 1))}
          onNext={() => goToPage(page + 1)}
        />
      )}
    </section>
  );
}
