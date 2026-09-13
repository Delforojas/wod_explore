import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createWodResult, getWod, getWodResults } from "../api/client";
import type { WodDetail, WodResult, WodType } from "../api/schemas";
import { renderWithAuth } from "../test/test-utils";
import { WodDetailPage } from "./WodDetailPage";

vi.mock("../api/client", () => ({
  createWodResult: vi.fn(),
  getWod: vi.fn(),
  getWodResults: vi.fn(),
}));

const emptyResults: WodResult[] = [];

function makeWod(type: WodType): WodDetail {
  return {
    id: 1,
    name: "Fran",
    type,
    timeLimit: null,
    rounds: 3,
    level: "RX",
    createdAt: "2026-09-12T16:00:00",
    exercises: [],
  };
}

const createdResult: WodResult = {
  id: 8,
  wodId: 1,
  timeSeconds: 60,
  rounds: null,
  reps: null,
  level: "RX",
  completedAt: "2026-09-13T10:00:00",
};

function renderLoadedWod(type: WodType) {
  vi.mocked(getWod).mockResolvedValue(makeWod(type));
  vi.mocked(getWodResults).mockResolvedValue(emptyResults);
  vi.mocked(createWodResult).mockResolvedValue(createdResult);
  return renderWithAuth(<WodDetailPage id={1} />, { token: "token" });
}

describe("WodDetailPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows loading before the detail requests resolve", () => {
    vi.mocked(getWod).mockReturnValue(new Promise(() => undefined));
    vi.mocked(getWodResults).mockReturnValue(new Promise(() => undefined));
    renderWithAuth(<WodDetailPage id={1} />, { token: "token" });

    expect(screen.getByText("Cargando")).toBeTruthy();
  });

  it("shows an API error and keeps the recovery link visible", async () => {
    vi.mocked(getWod).mockRejectedValue(new Error("WOD no disponible"));
    vi.mocked(getWodResults).mockResolvedValue(emptyResults);
    renderWithAuth(<WodDetailPage id={1} />, { token: "token" });

    expect((await screen.findByRole("alert")).textContent).toContain("WOD no disponible");
    expect(screen.getByRole("link", { name: "Volver al catálogo" })).toBeTruthy();
  });

  it("renders an empty result state for a valid WOD", async () => {
    renderLoadedWod("FOR_TIME");

    expect(await screen.findByRole("heading", { name: "Fran" })).toBeTruthy();
    expect(screen.getByText("Este WOD no tiene ejercicios asociados.")).toBeTruthy();
    expect(screen.getByText("Todavía no tienes resultados para este WOD.")).toBeTruthy();
  });

  it("sends the FOR_TIME payload", async () => {
    const user = userEvent.setup();
    renderLoadedWod("FOR_TIME");
    await screen.findByRole("heading", { name: "Fran" });

    await user.type(screen.getByLabelText("Tiempo en segundos"), "60");
    await user.click(screen.getByRole("button", { name: "Guardar resultado" }));

    await waitFor(() => expect(createWodResult).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ level: "RX", timeSeconds: 60 }),
      "token",
    ));
  });

  it("shows accessible feedback after saving a result", async () => {
    const user = userEvent.setup();
    renderLoadedWod("FOR_TIME");
    await screen.findByRole("heading", { name: "Fran" });

    await user.type(screen.getByLabelText("Tiempo en segundos"), "60");
    await user.click(screen.getByRole("button", { name: "Guardar resultado" }));

    expect(await screen.findByRole("status", { name: "Resultado guardado" })).toBeTruthy();
    expect(screen.getByText("Resultado guardado correctamente.")).toBeTruthy();
  });

  it("sends the AMRAP payload", async () => {
    const user = userEvent.setup();
    renderLoadedWod("AMRAP");
    await screen.findByRole("heading", { name: "Fran" });

    await user.type(screen.getByLabelText("Rondas"), "10");
    await user.type(screen.getByLabelText("Repeticiones extra"), "5");
    await user.click(screen.getByRole("button", { name: "Guardar resultado" }));

    await waitFor(() => expect(createWodResult).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ level: "RX", rounds: 10, reps: 5 }),
      "token",
    ));
  });

  it("sends the EMOM payload", async () => {
    const user = userEvent.setup();
    renderLoadedWod("EMOM");
    await screen.findByRole("heading", { name: "Fran" });

    await user.type(screen.getByLabelText("Repeticiones"), "12");
    await user.click(screen.getByRole("button", { name: "Guardar resultado" }));

    await waitFor(() => expect(createWodResult).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ level: "RX", reps: 12 }),
      "token",
    ));
  });

  it("invites an anonymous visitor to log in", () => {
    renderWithAuth(<WodDetailPage id={1} />);

    expect(screen.getByText("El archivo es privado")).toBeTruthy();
    expect(getWod).not.toHaveBeenCalled();
  });
});
