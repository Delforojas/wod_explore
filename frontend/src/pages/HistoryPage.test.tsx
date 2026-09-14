import { screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getHistory } from "../api/client";
import type { UserHistory } from "../api/schemas";
import { renderWithAuth } from "../test/test-utils";
import { HistoryPage } from "./HistoryPage";

vi.mock("../api/client", () => ({
  getHistory: vi.fn(),
}));

const emptyPage = {
  items: [],
  page: 0,
  size: 20,
  totalElements: 0,
  totalPages: 0,
  hasNext: false,
};

const historyWithData: UserHistory = {
  wodResults: {
    ...emptyPage,
    items: [{
      id: 4,
      wodId: 1,
      timeSeconds: 180,
      rounds: null,
      reps: null,
      level: "RX",
      completedAt: "2026-09-13T10:00:00",
    }],
    totalElements: 1,
  },
  exerciseResults: {
    ...emptyPage,
    items: [{
      id: 5,
      exerciseId: 2,
      value: 100,
      unit: "KG",
      recordType: "1RM",
      performedAt: "2026-09-12T10:00:00",
    }],
    totalElements: 1,
  },
};

describe("HistoryPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows the private state to anonymous users", () => {
    renderWithAuth(<HistoryPage />);

    expect(screen.getByText("Tu historial es privado")).toBeTruthy();
    expect(getHistory).not.toHaveBeenCalled();
  });

  it("shows loading while the history request is pending", () => {
    vi.mocked(getHistory).mockReturnValue(new Promise(() => undefined));
    renderWithAuth(<HistoryPage />, { token: "token" });

    expect(screen.getByText("Cargando")).toBeTruthy();
  });

  it("renders the empty history state", async () => {
    vi.mocked(getHistory).mockResolvedValue({
      wodResults: emptyPage,
      exerciseResults: emptyPage,
    });
    renderWithAuth(<HistoryPage />, { token: "token" });

    expect(await screen.findByText("Aún no hay sesiones")).toBeTruthy();
  });

  it("renders populated history and its detail links", async () => {
    vi.mocked(getHistory).mockResolvedValue(historyWithData);
    const view = renderWithAuth(<HistoryPage />, { token: "token" });

    await waitFor(() => expect(screen.getByText("WOD #1")).toBeTruthy());
    expect(view.container.querySelectorAll(".history-summary data")).toHaveLength(2);
    expect(view.container.querySelector("time")?.getAttribute("dateTime")).toBe("2026-09-13T10:00:00");
    expect(screen.getByText("segundos")).toBeTruthy();
    expect(screen.getByText("kg")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Resultados WOD" })).toBeTruthy();
    expect(screen.getByText("Resultado WOD")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Marcas de ejercicios" })).toBeTruthy();
    expect(screen.getByText("Ejercicio #2")).toBeTruthy();
    expect(screen.getByRole("link", { name: /Ver detalle del WOD/ }).getAttribute("href")).toBe("#/wods/1");
    expect(screen.getByRole("link", { name: /Ver detalle del ejercicio/ }).getAttribute("href")).toBe("#/exercises/2");
  });

  it("shows a network error with retry feedback", async () => {
    vi.mocked(getHistory).mockRejectedValue(new Error("Historial no disponible"));
    renderWithAuth(<HistoryPage />, { token: "token" });

    expect((await screen.findByRole("alert")).textContent).toContain("Historial no disponible");
  });
});
