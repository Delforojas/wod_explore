import { createContext } from "react";

import type { LoginRequest, RegisterRequest, User } from "../api/schemas";

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  sessionExpired: boolean;
  favoriteWodIds: ReadonlySet<number>;
  favoritesStatus: "idle" | "loading" | "ready" | "error";
  favoritesError: string | null;
  favoritesErrorKind: "error" | "network-error" | null;
  pendingFavoriteIds: ReadonlySet<number>;
  login: (request: LoginRequest) => Promise<void>;
  register: (request: RegisterRequest) => Promise<void>;
  logout: () => void;
  retryFavorites: () => void;
  toggleFavorite: (wodId: number) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
