import { createContext } from "react";

import type { LoginRequest, RegisterRequest, User } from "../api/schemas";

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  sessionExpired: boolean;
  login: (request: LoginRequest) => Promise<void>;
  register: (request: RegisterRequest) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
