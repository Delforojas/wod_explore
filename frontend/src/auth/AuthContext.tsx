import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { getCurrentUser, login as loginRequest, register as registerRequest } from "../api/client";
import type { LoginRequest, RegisterRequest, User } from "../api/schemas";
import { AuthContext } from "./context";

const TOKEN_KEY = "wod-explorer.jwt";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(token));
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const handleExpiredSession = () => {
      sessionStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
      setSessionExpired(true);
      window.location.hash = "/login";
    };

    window.addEventListener("wod-explorer:session-expired", handleExpiredSession);
    return () => window.removeEventListener("wod-explorer:session-expired", handleExpiredSession);
  }, []);

  useEffect(() => {
    if (!token) return;

    getCurrentUser(token)
      .then(setUser)
      .catch(() => {
        sessionStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
        setSessionExpired(true);
        window.location.hash = "/login";
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  async function login(request: LoginRequest) {
    const response = await loginRequest(request);
    sessionStorage.setItem(TOKEN_KEY, response.token);
    setSessionExpired(false);
    setIsLoading(true);
    setToken(response.token);
    setUser(await getCurrentUser(response.token));
    setIsLoading(false);
  }

  async function register(request: RegisterRequest) {
    await registerRequest(request);
    await login({ email: request.email, password: request.password });
  }

  function logout() {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setSessionExpired(false);
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, sessionExpired, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
