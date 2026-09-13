import { useEffect, useState } from "react";

import { getCurrentUser } from "../api/client";
import type { User } from "../api/schemas";
import { useAuth } from "../auth/useAuth";
import { LoadingMessage, StateMessage } from "../components/StateMessage";
import { getErrorStateKind } from "../components/stateMessageUtils";

export function ProfilePage() {
  const { token } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loadedRequestKey, setLoadedRequestKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorKind, setErrorKind] = useState<"error" | "network-error">("error");
  const [retryCount, setRetryCount] = useState(0);
  const requestKey = token ? `${token}:${retryCount}` : null;

  useEffect(() => {
    if (!token) return;

    let active = true;

    getCurrentUser(token)
      .then((data) => {
        if (!active) return;
        setError(null);
        setProfile(data);
      })
      .catch((caughtError: unknown) => {
        if (!active) return;
        setError(caughtError instanceof Error
          ? caughtError.message
          : "No pudimos cargar los datos de tu perfil.");
        setErrorKind(getErrorStateKind(caughtError));
      })
      .finally(() => {
        if (active) setLoadedRequestKey(`${token}:${retryCount}`);
      });

    return () => {
      active = false;
    };
  }, [token, retryCount]);

  if (!token) {
    return (
      <StateMessage
        kind="private"
        title="Tu perfil es privado"
        message="Inicia sesión para consultar los datos de tu cuenta."
        action={{ label: "Entrar", href: "#/login" }}
      />
    );
  }

  if (loadedRequestKey !== requestKey) return <LoadingMessage />;

  if (error || !profile) {
    return (
      <StateMessage
        kind={errorKind}
        title={errorKind === "network-error" ? "No hay conexión con tu perfil" : "No pudimos cargar tu perfil"}
        message={error ?? "La respuesta del servidor no está disponible."}
        action={{ label: "Reintentar", onClick: () => setRetryCount((count) => count + 1) }}
      />
    );
  }

  const formattedCreatedAt = formatCreatedAt(profile.createdAt);

  return (
    <section className="profile-page" aria-labelledby="profile-heading">
      <div className="page-heading">
        <div><h1 id="profile-heading">Perfil</h1></div>
        <p className="heading-note">Los datos de tu cuenta, siempre contigo</p>
      </div>

      <article className="profile-sheet">
        <div className="profile-intro">
          <h2>Tu información</h2>
          <p>Esta información pertenece a tu cuenta autenticada y solo tú puedes consultarla.</p>
        </div>
        <dl className="profile-fields">
          <div className="profile-field">
            <dt>Nombre</dt>
            <dd>{profile.name}</dd>
          </div>
          <div className="profile-field">
            <dt>Apellidos</dt>
            <dd>{profile.lastName}</dd>
          </div>
          <div className="profile-field">
            <dt>Email</dt>
            <dd>{profile.email}</dd>
          </div>
          <div className="profile-field">
            <dt>Fecha de alta</dt>
            <dd>
              <time dateTime={profile.createdAt}>{formattedCreatedAt}</time>
            </dd>
          </div>
        </dl>
      </article>
    </section>
  );
}

function formatCreatedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Fecha no disponible";

  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "long",
  }).format(date);
}
