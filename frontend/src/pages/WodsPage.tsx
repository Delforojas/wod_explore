import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { getWods } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { LoadingMessage, StateMessage } from "../components/StateMessage";
import type { WodSummary } from "../api/schemas";

export function WodsPage() {
  const { token } = useAuth();
  const [wods, setWods] = useState<WodSummary[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [level, setLevel] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function loadWods(filters = { name, type, level }) {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    getWods(filters, token).then(setWods).catch((caughtError: Error) => setError(caughtError.message)).finally(() => setIsLoading(false));
  }

  useEffect(() => {
    let active = true;
    if (!token) return;
    getWods({ name: "", type: "", level: "" }, token)
      .then((data) => { if (active) setWods(data); })
      .catch((caughtError: Error) => { if (active) setError(caughtError.message); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [token]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    loadWods();
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
        <label>Nombre<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ej. Fran" /></label>
        <label>Tipo<select value={type} onChange={(event) => setType(event.target.value)}><option value="">Todos</option><option value="FOR_TIME">FOR TIME</option><option value="AMRAP">AMRAP</option><option value="EMOM">EMOM</option></select></label>
        <label>Nivel<select value={level} onChange={(event) => setLevel(event.target.value)}><option value="">Todos</option><option value="BEGINNER">Principiante</option><option value="INTERMEDIATE">Intermedio</option><option value="RX">RX</option></select></label>
        <button className="button button--accent" type="submit">Aplicar filtros</button>
      </form>
      {!token && <StateMessage title="El archivo es privado" message="Inicia sesión para consultar WODs y sus detalles." action={{ label: "Entrar", href: "#/login" }} />}
      {token && isLoading && <LoadingMessage />}
      {token && !isLoading && error && <StateMessage title="No pudimos cargar los WODs" message={error} tone="error" action={{ label: "Reintentar", onClick: () => loadWods() }} />}
      {token && !isLoading && !error && wods.length === 0 && <StateMessage title="No hay WODs para estos filtros" message="Prueba a ampliar tu búsqueda." />}
      {token && !isLoading && !error && wods.length > 0 && (
        <div className="catalog-list">
          {wods.map((wod) => (
            <a className="catalog-row" key={wod.id} href={`#/wods/${wod.id}`}>
              <span className="row-number">{String(wod.id).padStart(3, "0")}</span>
              <span className="row-main"><strong>{wod.name}</strong><small>{wod.type.replace("_", " ")}</small></span>
              <span className="row-meta">{wod.level ?? "Todos los niveles"}</span>
              <span className="row-arrow" aria-hidden="true">-&gt;</span>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
