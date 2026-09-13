import { useState } from "react";
import type { FormEvent } from "react";

import { ApiError } from "../api/client";
import { navigate } from "../app/router";
import { useAuth } from "../auth/useAuth";

interface AuthPageProps {
  mode: "login" | "register";
}

export function AuthPage({ mode }: AuthPageProps) {
  const { login, register } = useAuth();
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isRegister = mode === "register";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isRegister) {
        await register({ name, lastName, email, password });
      } else {
        await login({ email, password });
      }
      navigate("/");
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError.message : "No se pudo completar la operación.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-copy">
        <h1>{isRegister ? "Abre tu archivo." : "Vuelve a tu archivo."}</h1>
        <p>{isRegister ? "Crea tu cuenta para registrar sesiones y seguir tus marcas." : "Inicia sesión para consultar tu historial y evolución."}</p>
      </div>
      <form className="form-panel" onSubmit={handleSubmit}>
        <div className="form-heading">
          <span>{isRegister ? "Nueva cuenta" : "Acceso"}</span>
          <strong>{isRegister ? "Registro" : "Login"}</strong>
        </div>
        {isRegister && (
          <>
            <label>
              Nombre
              <input value={name} onChange={(event) => setName(event.target.value)} required maxLength={100} />
            </label>
            <label>
              Apellidos
              <input value={lastName} onChange={(event) => setLastName(event.target.value)} required maxLength={150} />
            </label>
          </>
        )}
        <label>
          Email
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength={150} autoComplete="email" />
        </label>
        <label>
          Contraseña
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete={isRegister ? "new-password" : "current-password"} />
        </label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button button--accent button--wide" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : isRegister ? "Crear cuenta" : "Entrar"}
        </button>
        <a className="form-switch" href={`#${isRegister ? "/login" : "/register"}`}>
          {isRegister ? "Ya tengo una cuenta" : "Quiero crear una cuenta"}
        </a>
      </form>
    </section>
  );
}
