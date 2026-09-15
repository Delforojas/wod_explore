import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import {
  addFavorite,
  getCurrentUser,
  getFavorites,
  login as loginRequest,
  register as registerRequest,
  removeFavorite,
} from "../api/client";
import type { LoginRequest, RegisterRequest, User } from "../api/schemas";
import { AuthContext } from "./context";

const TOKEN_KEY = "wod-explorer.jwt";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(token));
  const [sessionExpired, setSessionExpired] = useState(false);
  const [favoriteWodIds, setFavoriteWodIds] = useState<ReadonlySet<number>>(new Set());
  const [favoritesStatus, setFavoritesStatus] = useState<"idle" | "loading" | "ready" | "error">(token ? "loading" : "idle");
  const [favoritesError, setFavoritesError] = useState<string | null>(null);
  const [favoritesErrorKind, setFavoritesErrorKind] = useState<"error" | "network-error" | null>(null);
  const [pendingFavoriteIds, setPendingFavoriteIds] = useState<ReadonlySet<number>>(new Set());
  const [favoritesReloadToken, setFavoritesReloadToken] = useState(0);

  useEffect(() => {
    const handleExpiredSession = () => {
      sessionStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
      setSessionExpired(true);
      setFavoriteWodIds(new Set());
      setFavoritesStatus("idle");
      setFavoritesError(null);
      setFavoritesErrorKind(null);
      setPendingFavoriteIds(new Set());
      window.location.hash = "/login";
    };

    window.addEventListener("wod-explorer:session-expired", handleExpiredSession);
    return () => window.removeEventListener("wod-explorer:session-expired", handleExpiredSession);
  }, []);

  useEffect(() => {
    let active = true;

    if (!token) {
      return () => {
        active = false;
      };
    }

    getFavorites(token)
      .then((favorites) => {
        if (!active) return;
        setFavoriteWodIds(new Set(favorites.map(({ wodId }) => wodId)));
        setFavoritesStatus("ready");
        setFavoritesErrorKind(null);
      })
      .catch((caughtError: unknown) => {
        if (!active) return;
        setFavoritesStatus("error");
        setFavoritesError(caughtError instanceof Error ? caughtError.message : "No se pudieron cargar tus favoritos.");
        setFavoritesErrorKind(
          typeof caughtError === "object" && caughtError !== null && "status" in caughtError && caughtError.status === 0
            ? "network-error"
            : "error",
        );
      });

    return () => {
      active = false;
    };
  }, [favoritesReloadToken, token]);

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
    setFavoriteWodIds(new Set());
    setFavoritesStatus("loading");
    setFavoritesError(null);
    setFavoritesErrorKind(null);
    setPendingFavoriteIds(new Set());
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
    setFavoriteWodIds(new Set());
    setFavoritesStatus("idle");
    setFavoritesError(null);
    setFavoritesErrorKind(null);
    setPendingFavoriteIds(new Set());
  }

  function retryFavorites() {
    if (!token) return;
    setFavoriteWodIds(new Set());
    setFavoritesStatus("loading");
    setFavoritesError(null);
    setFavoritesErrorKind(null);
    setFavoritesReloadToken((currentToken) => currentToken + 1);
  }

  async function toggleFavorite(wodId: number) {
    if (!token || favoritesStatus !== "ready" || pendingFavoriteIds.has(wodId)) return;

    const shouldAdd = !favoriteWodIds.has(wodId);
    setPendingFavoriteIds((currentIds) => new Set(currentIds).add(wodId));
    setFavoritesError(null);
    setFavoritesErrorKind(null);

    try {
      if (shouldAdd) {
        await addFavorite(wodId, token);
      } else {
        await removeFavorite(wodId, token);
      }

      setFavoriteWodIds((currentIds) => {
        const nextIds = new Set(currentIds);
        if (shouldAdd) {
          nextIds.add(wodId);
        } else {
          nextIds.delete(wodId);
        }
        return nextIds;
      });
    } catch (caughtError: unknown) {
      setFavoritesError(caughtError instanceof Error ? caughtError.message : "No se pudo actualizar el favorito.");
      setFavoritesErrorKind(
        typeof caughtError === "object" && caughtError !== null && "status" in caughtError && caughtError.status === 0
          ? "network-error"
          : "error",
      );
    } finally {
      setPendingFavoriteIds((currentIds) => {
        const nextIds = new Set(currentIds);
        nextIds.delete(wodId);
        return nextIds;
      });
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        sessionExpired,
        favoriteWodIds,
        favoritesStatus,
        favoritesError,
        favoritesErrorKind,
        pendingFavoriteIds,
        login,
        register,
        logout,
        retryFavorites,
        toggleFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
