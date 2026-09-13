import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Layout } from "./Layout";
import { renderWithAuth } from "../test/test-utils";

const authenticatedUser = {
  id: 1,
  name: "Delfin",
  lastName: "Rojas",
  email: "delfin@example.com",
  createdAt: "2026-09-12T16:00:00",
};

describe("Layout", () => {
  it("shows public authentication actions when there is no session", () => {
    renderWithAuth(<Layout currentPage="home"><p>Contenido</p></Layout>);

    expect(screen.getByRole("link", { name: "Entrar" }).getAttribute("href")).toBe("#/login");
    expect(screen.getByRole("link", { name: "Crear cuenta" }).getAttribute("href")).toBe("#/register");
    const primaryNavigation = screen.getByRole("navigation", { name: "Navegación principal" });
    expect(within(primaryNavigation).getByRole("link", { name: "WODs" }).getAttribute("href")).toBe("#/wods");
  });

  it("shows profile and logout actions for an authenticated user", async () => {
    const logout = vi.fn();
    const user = userEvent.setup();
    renderWithAuth(<Layout currentPage="profile"><p>Contenido</p></Layout>, {
      user: authenticatedUser,
      token: "token",
      logout,
    });

    expect(screen.getByRole("link", { name: "Abrir perfil de Delfin" }).getAttribute("href")).toBe("#/profile");
    expect(screen.getByRole("link", { name: "Abrir perfil de Delfin" }).getAttribute("aria-current")).toBe("page");
    await user.click(screen.getByRole("button", { name: "Salir" }));
    expect(logout).toHaveBeenCalledOnce();
  });
});
