import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { addFavorite, getCurrentUser, getFavorites, login, register, removeFavorite } from "../api/client";
import type { User } from "../api/schemas";
import { AuthProvider } from "./AuthContext";
import { useAuth } from "./useAuth";

vi.mock("../api/client", () => ({
  getCurrentUser: vi.fn(),
  getFavorites: vi.fn(),
  login: vi.fn(),
  register: vi.fn(),
  addFavorite: vi.fn(),
  removeFavorite: vi.fn(),
}));

const currentUser: User = {
  id: 4,
  name: "Delfin",
  lastName: "Rojas",
  email: "delfin@example.com",
  createdAt: "2026-09-12T16:00:00",
};

function AuthProbe() {
  const { favoriteWodIds, favoritesError, favoritesStatus, user, token, isLoading, sessionExpired, login: loginUser, register: registerUser, logout, toggleFavorite } = useAuth();

  return (
    <div>
      <output>{isLoading ? "cargando" : user?.name ?? "sin sesión"}</output>
      <output>{token ?? "sin token"}</output>
      <output>{sessionExpired ? "sesión caducada" : "sesión activa"}</output>
      <output>favoritos: {Array.from(favoriteWodIds).join(",") || "ninguno"}</output>
      <output>{favoritesStatus}</output>
      {favoritesError && <output>{favoritesError}</output>}
      <button type="button" onClick={() => loginUser({ email: currentUser.email, password: "secret" })}>
        iniciar
      </button>
      <button type="button" onClick={() => registerUser({
        name: currentUser.name,
        lastName: currentUser.lastName,
        email: currentUser.email,
        password: "secret",
      })}>
        registrar
      </button>
      <button type="button" onClick={logout}>salir</button>
      <button type="button" onClick={() => void toggleFavorite(1)}>alternar favorito</button>
    </div>
  );
}

function renderProvider() {
  return render(
    <AuthProvider>
      <AuthProbe />
    </AuthProvider>,
  );
}

describe("AuthProvider", () => {
  beforeEach(() => {
    sessionStorage.clear();
    window.location.hash = "/";
    vi.clearAllMocks();
    vi.mocked(getCurrentUser).mockResolvedValue(currentUser);
    vi.mocked(getFavorites).mockResolvedValue([]);
    vi.mocked(addFavorite).mockResolvedValue(null);
    vi.mocked(removeFavorite).mockResolvedValue(null);
  });

  it("recovers the authenticated user from the stored token", async () => {
    sessionStorage.setItem("wod-explorer.jwt", "stored-token");
    vi.mocked(getFavorites).mockResolvedValue([{ wodId: 7, favoritedAt: "2026-09-15T10:00:00" }]);

    renderProvider();

    await waitFor(() => expect(screen.getByText("Delfin")).toBeTruthy());
    expect(getCurrentUser).toHaveBeenCalledWith("stored-token");
    expect(await screen.findByText("favoritos: 7")).toBeTruthy();
  });

  it("logs in, stores the token and loads the current user", async () => {
    vi.mocked(login).mockResolvedValue({ token: "login-token" });
    const user = userEvent.setup();
    renderProvider();

    await user.click(screen.getByRole("button", { name: "iniciar" }));

    await waitFor(() => expect(screen.getByText("login-token")).toBeTruthy());
    expect(login).toHaveBeenCalledWith({ email: currentUser.email, password: "secret" });
    expect(sessionStorage.getItem("wod-explorer.jwt")).toBe("login-token");
    expect(getCurrentUser).toHaveBeenCalledWith("login-token");
  });

  it("registers and completes the flow through login", async () => {
    vi.mocked(register).mockResolvedValue(currentUser);
    vi.mocked(login).mockResolvedValue({ token: "registered-token" });
    const user = userEvent.setup();
    renderProvider();

    await user.click(screen.getByRole("button", { name: "registrar" }));

    await waitFor(() => expect(screen.getByText("Delfin")).toBeTruthy());
    expect(register).toHaveBeenCalledWith({
      name: currentUser.name,
      lastName: currentUser.lastName,
      email: currentUser.email,
      password: "secret",
    });
    expect(login).toHaveBeenCalledWith({ email: currentUser.email, password: "secret" });
  });

  it("logs out and removes the session token", async () => {
    sessionStorage.setItem("wod-explorer.jwt", "stored-token");
    const user = userEvent.setup();
    renderProvider();
    await waitFor(() => expect(screen.getByText("Delfin")).toBeTruthy());

    await user.click(screen.getByRole("button", { name: "salir" }));

    expect(sessionStorage.getItem("wod-explorer.jwt")).toBeNull();
    expect(screen.getByText("sin sesión")).toBeTruthy();
    expect(screen.getByText("favoritos: ninguno")).toBeTruthy();
  });

  it("updates the in-memory collection only after a successful mutation", async () => {
    sessionStorage.setItem("wod-explorer.jwt", "token");
    const user = userEvent.setup();
    renderProvider();

    await screen.findByText("ready");
    await user.click(screen.getByRole("button", { name: "alternar favorito" }));

    await waitFor(() => expect(screen.getByText("favoritos: 1")).toBeTruthy());
    expect(addFavorite).toHaveBeenCalledWith(1, "token");
  });

  it("keeps the collection when a mutation fails", async () => {
    sessionStorage.setItem("wod-explorer.jwt", "token");
    vi.mocked(addFavorite).mockRejectedValue(new Error("No se pudo guardar"));
    const user = userEvent.setup();
    renderProvider();

    await screen.findByText("ready");
    await user.click(screen.getByRole("button", { name: "alternar favorito" }));

    await waitFor(() => expect(screen.getByText("No se pudo guardar")).toBeTruthy());
    expect(screen.getByText("favoritos: ninguno")).toBeTruthy();
  });

  it("clears an expired session and navigates to login", async () => {
    sessionStorage.setItem("wod-explorer.jwt", "expired-token");
    renderProvider();
    await waitFor(() => expect(screen.getByText("Delfin")).toBeTruthy());

    act(() => window.dispatchEvent(new Event("wod-explorer:session-expired")));

    await waitFor(() => expect(screen.getByText("sin sesión")).toBeTruthy());
    expect(screen.getByText("sesión caducada")).toBeTruthy();
    expect(sessionStorage.getItem("wod-explorer.jwt")).toBeNull();
    expect(window.location.hash).toBe("#/login");
  });
});
