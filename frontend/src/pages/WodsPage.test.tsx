import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getWods } from "../api/client";
import type { WodPage } from "../api/schemas";
import { renderWithAuth } from "../test/test-utils";
import { WodsPage } from "./WodsPage";

vi.mock("../api/client", () => ({
  getWods: vi.fn(),
}));

const emptyPage: WodPage = {
  items: [],
  page: 0,
  size: 20,
  totalElements: 0,
  totalPages: 0,
  hasNext: false,
};

const populatedPage: WodPage = {
  items: [{
    id: 1,
    name: "Fran",
    type: "FOR_TIME",
    timeLimit: 222,
    rounds: 3,
    level: "RX",
  }],
  page: 0,
  size: 20,
  totalElements: 21,
  totalPages: 2,
  hasNext: true,
};

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((promiseResolve) => {
    resolve = promiseResolve;
  });
  return { promise, resolve };
}

describe("WodsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading and then the empty state", async () => {
    const pending = deferred<WodPage>();
    vi.mocked(getWods).mockReturnValue(pending.promise);
    renderWithAuth(<WodsPage />, { token: "token" });

    expect(screen.getByText("Cargando")).toBeTruthy();
    await act(async () => {
      pending.resolve(emptyPage);
      await pending.promise;
    });

    expect(screen.getByText("No hay WODs para estos filtros")).toBeTruthy();
  });

  it("shows a network error with a retry action", async () => {
    vi.mocked(getWods).mockRejectedValue(new Error("Servidor no disponible"));
    renderWithAuth(<WodsPage />, { token: "token" });

    expect((await screen.findByRole("alert")).textContent).toContain("Servidor no disponible");
    expect(screen.getByRole("button", { name: "Reintentar" })).toBeTruthy();
  });

  it("renders results and sends filters and pagination to the API", async () => {
    vi.mocked(getWods).mockResolvedValue(populatedPage);
    const user = userEvent.setup();
    renderWithAuth(<WodsPage />, { token: "token" });

    expect(await screen.findByRole("link", { name: /Fran/ })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Fran/ }).getAttribute("href")).toBe("#/wods/1");
    expect(screen.getByRole("heading", { name: "Sesiones disponibles" })).toBeTruthy();
    expect(screen.getByText("For time", { selector: ".wod-row-metric strong" })).toBeTruthy();
    expect(screen.getByText("03:42", { selector: ".wod-row-metric strong" })).toBeTruthy();
    expect(screen.getByText("3", { selector: ".wod-row-metric strong" })).toBeTruthy();
    expect(screen.getByText("RX", { selector: ".wod-row-metric strong" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Anterior" }).hasAttribute("disabled")).toBe(true);
    expect(screen.getByRole("button", { name: "Siguiente" }).hasAttribute("disabled")).toBe(false);

    await user.type(screen.getByLabelText("Nombre"), "Fran");
    await user.selectOptions(screen.getByLabelText("Tipo"), "FOR_TIME");
    await user.selectOptions(screen.getByLabelText("Nivel"), "RX");
    await user.click(screen.getByRole("button", { name: "Aplicar filtros" }));

    await waitFor(() => expect(getWods).toHaveBeenLastCalledWith(
      { name: "Fran", type: "FOR_TIME", level: "RX" },
      "token",
      { page: 0, size: 20 },
    ));
    expect(screen.getByText("Filtros activos:").parentElement?.textContent).toContain("Nombre: Fran");

    await user.click(screen.getByRole("button", { name: "Siguiente" }));
    await waitFor(() => expect(getWods).toHaveBeenLastCalledWith(
      { name: "Fran", type: "FOR_TIME", level: "RX" },
      "token",
      { page: 1, size: 20 },
    ));
  });

  it("combines the favorites filter with the catalog filters", async () => {
    vi.mocked(getWods).mockResolvedValue({
      ...populatedPage,
      items: [
        ...populatedPage.items,
        { id: 2, name: "Helen", type: "AMRAP", timeLimit: 600, rounds: null, level: "BEGINNER" },
      ],
    });
    const toggleFavorite = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderWithAuth(<WodsPage />, {
      token: "token",
      favoriteWodIds: new Set([1]),
      favoritesStatus: "ready",
      toggleFavorite,
    });

    expect(await screen.findByRole("link", { name: /Fran/ })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Helen/ })).toBeTruthy();
    expect(screen.getByText("10:00", { selector: ".wod-row-metric strong" })).toBeTruthy();
    expect(screen.getByText("Variable", { selector: ".wod-row-metric strong" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Quitar Fran de favoritos" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Añadir Helen a favoritos" }).textContent).toBe("Añadir a favoritos");

    await user.click(screen.getByRole("button", { name: "Solo favoritos" }));

    expect(screen.getByRole("link", { name: /Fran/ })).toBeTruthy();
    expect(screen.queryByRole("link", { name: /Helen/ })).toBeNull();
    expect(screen.getByRole("button", { name: "Quitar Fran de favoritos" }).textContent).toBe("Quitar de favoritos");

    await user.click(screen.getByRole("button", { name: "Quitar Fran de favoritos" }));
    expect(toggleFavorite).toHaveBeenCalledWith(1);
  });

  it("distinguishes an empty favorites collection from unmatched filters", async () => {
    vi.mocked(getWods).mockResolvedValue(populatedPage);
    const user = userEvent.setup();
    renderWithAuth(<WodsPage />, {
      token: "token",
      favoriteWodIds: new Set(),
      favoritesStatus: "ready",
    });

    await screen.findByRole("link", { name: /Fran/ });
    await user.click(screen.getByRole("button", { name: "Solo favoritos" }));

    expect(screen.getByText("Aún no tienes favoritos")).toBeTruthy();
    expect(screen.getByText("Marca un WOD como favorito y aparecerá aquí.")).toBeTruthy();
  });

  it("invites an anonymous visitor to log in", () => {
    renderWithAuth(<WodsPage />);

    expect(screen.getByText("El archivo es privado")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Entrar" }).getAttribute("href")).toBe("#/login");
    expect(getWods).not.toHaveBeenCalled();
  });
});
