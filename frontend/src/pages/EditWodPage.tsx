import { useEffect, useState } from "react";

import { getUserWod } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { UserWodForm } from "../components/UserWodForm";
import { LoadingMessage, StateMessage } from "../components/StateMessage";
import { getErrorStateKind } from "../components/stateMessageUtils";
import type { UserWodDetail } from "../api/schemas";

export function EditWodPage({ id }: { id: number }) {
  const { token } = useAuth();
  const [wod, setWod] = useState<UserWodDetail | null>(null);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [errorKind, setErrorKind] = useState<"error" | "network-error">("error");
  const requestKey = token ? `${token}:${id}:${reloadToken}` : null;

  useEffect(() => {
    if (!token || !requestKey) return;
    let active = true;

    getUserWod(id, token)
      .then((data) => {
        if (!active) return;
        setWod(data);
        setError(null);
        setLoadedKey(requestKey);
      })
      .catch((caughtError: unknown) => {
        if (!active) return;
        setError(caughtError instanceof Error ? caughtError.message : "No se pudo cargar este WOD.");
        setErrorKind(getErrorStateKind(caughtError));
        setLoadedKey(requestKey);
      });

    return () => {
      active = false;
    };
  }, [id, requestKey, token]);

  function retry() {
    setError(null);
    setLoadedKey(null);
    setReloadToken((current) => current + 1);
  }

  if (!token) {
    return <StateMessage kind="private" title="Tus WODs son privados" message="Inicia sesión para editar los WODs que has creado." action={{ label: "Entrar", href: "#/login" }} />;
  }
  if (loadedKey !== requestKey) {
    return <LoadingMessage message="Estamos preparando tu WOD para editarlo." />;
  }
  if (error || !wod) {
    return (
      <section className="my-wod-error-state">
        <a className="back-link" href="#/my-wods">Volver a Mis WODs</a>
        <StateMessage kind={errorKind} title={errorKind === "network-error" ? "No hay conexión con este WOD" : "No pudimos cargar este WOD"} message={error ?? "Este WOD no está disponible."} action={{ label: "Reintentar", onClick: retry }} />
      </section>
    );
  }

  return <UserWodForm mode="edit" initialWod={wod} />;
}
