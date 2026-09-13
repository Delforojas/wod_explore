import type { ReactElement } from "react";

import { render } from "@testing-library/react";

import type { AuthContextValue } from "../auth/context";
import { AuthContext } from "../auth/context";

export function createAuthValue(overrides: Partial<AuthContextValue> = {}): AuthContextValue {
  return {
    user: null,
    token: null,
    isLoading: false,
    login: async () => undefined,
    register: async () => undefined,
    logout: () => undefined,
    ...overrides,
  };
}

export function renderWithAuth(
  element: ReactElement,
  overrides: Partial<AuthContextValue> = {},
) {
  return render(
    <AuthContext.Provider value={createAuthValue(overrides)}>
      {element}
    </AuthContext.Provider>,
  );
}
