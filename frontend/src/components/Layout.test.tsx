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

    expect(screen.getByRole("link", { name: "Saltar al contenido" }).getAttribute("href")).toBe("#main-content");
    expect(screen.getByRole("main").getAttribute("id")).toBe("main-content");
    expect(screen.getByRole("link", { name: "Entrar" }).getAttribute("href")).toBe("#/login");
    expect(screen.getByRole("link", { name: "Crear cuenta" }).getAttribute("href")).toBe("#/register");
    const primaryNavigation = screen.getByRole("navigation", { name: "Navegación principal" });
    expect(within(primaryNavigation).getByRole("link", { name: "WODs" }).getAttribute("href")).toBe("#/wods");
    expect(within(primaryNavigation).getByRole("link", { name: "Crear WOD" }).getAttribute("href")).toBe("#/create-wod");
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

  it("marks the active destination in desktop and mobile navigation", () => {
    renderWithAuth(<Layout currentPage="wods"><p>Contenido</p></Layout>);

    const primaryNavigation = screen.getByRole("navigation", { name: "Navegación principal" });
    const mobileNavigation = screen.getByRole("navigation", { name: "Navegación móvil" });
    expect(within(primaryNavigation).getByRole("link", { name: "WODs" }).getAttribute("aria-current")).toBe("page");
    expect(within(mobileNavigation).getByRole("link", { name: "WODs" }).getAttribute("aria-current")).toBe("page");
    expect(within(primaryNavigation).getByRole("link", { name: "Inicio" }).getAttribute("aria-current")).toBeNull();
  });

  it("marks Crear WOD as active in both navigation variants", () => {
    renderWithAuth(<Layout currentPage="create-wod"><p>Contenido</p></Layout>);

    expect(within(screen.getByRole("navigation", { name: "Navegación principal" })).getByRole("link", { name: "Crear WOD" }).getAttribute("aria-current")).toBe("page");
    expect(within(screen.getByRole("navigation", { name: "Navegación móvil" })).getByRole("link", { name: "Crear WOD" }).getAttribute("aria-current")).toBe("page");
  });

  it("keeps the parent catalog active on detail pages", () => {
    renderWithAuth(<Layout currentPage="exercise-detail"><p>Contenido</p></Layout>);

    const primaryNavigation = screen.getByRole("navigation", { name: "Navegación principal" });
    expect(within(primaryNavigation).getByRole("link", { name: "Ejercicios" }).getAttribute("aria-current")).toBe("page");
    expect(within(primaryNavigation).getByRole("link", { name: "WODs" }).getAttribute("aria-current")).toBeNull();
  });
});
