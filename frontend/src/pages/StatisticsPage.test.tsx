import { screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getEvolution, getStatistics } from "../api/client";
import type { UserEvolution, UserStatistics } from "../api/schemas";
import { renderWithAuth } from "../test/test-utils";
import { StatisticsPage } from "./StatisticsPage";

vi.mock("../api/client", () => ({
  getEvolution: vi.fn(),
  getStatistics: vi.fn(),
}));

const emptyStatistics: UserStatistics = {
  wodResultsCount: 0,
  exerciseResultsCount: 0,
  wodPersonalRecords: [],
  exercisePersonalRecords: [],
};

const emptyEvolution: UserEvolution = {
  wodResults: [],
  exerciseResults: [],
};

const populatedStatistics: UserStatistics = {
  wodResultsCount: 2,
  exerciseResultsCount: 1,
  wodPersonalRecords: [{
    resultId: 4,
    wodId: 1,
    wodName: "Fran",
    wodType: "FOR_TIME",
    level: "RX",
    timeSeconds: 180,
    rounds: null,
    reps: null,
    completedAt: "2026-09-13T10:00:00",
  }],
  exercisePersonalRecords: [{
    resultId: 5,
    exerciseId: 2,
    exerciseName: "Back Squat",
    measurementType: "WEIGHT",
    recordType: "1RM",
    value: 100,
    unit: "KG",
    performedAt: "2026-09-12T10:00:00",
  }],
};

const populatedEvolution: UserEvolution = {
  wodResults: populatedStatistics.wodPersonalRecords,
  exerciseResults: populatedStatistics.exercisePersonalRecords,
};

describe("StatisticsPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows the private state to anonymous users", () => {
    renderWithAuth(<StatisticsPage />);

    expect(screen.getByText("Tus marcas son privadas")).toBeTruthy();
    expect(getStatistics).not.toHaveBeenCalled();
    expect(getEvolution).not.toHaveBeenCalled();
  });

  it("shows loading while statistics and evolution are pending", () => {
    vi.mocked(getStatistics).mockReturnValue(new Promise(() => undefined));
    vi.mocked(getEvolution).mockReturnValue(new Promise(() => undefined));
    renderWithAuth(<StatisticsPage />, { token: "token" });

    expect(screen.getByText("Cargando")).toBeTruthy();
  });

  it("renders empty statistics and evolution", async () => {
    vi.mocked(getStatistics).mockResolvedValue(emptyStatistics);
    vi.mocked(getEvolution).mockResolvedValue(emptyEvolution);
    renderWithAuth(<StatisticsPage />, { token: "token" });

    await waitFor(() => expect(screen.getByRole("heading", { name: "Estadísticas" })).toBeTruthy());
    expect(screen.getByText("Todavía no hay marcas WOD.")).toBeTruthy();
    expect(screen.getByText("Todavía no hay marcas de ejercicios.")).toBeTruthy();
    expect(screen.getAllByText("Sin intentos todavía.")).toHaveLength(2);
  });

  it("renders populated records and evolution", async () => {
    vi.mocked(getStatistics).mockResolvedValue(populatedStatistics);
    vi.mocked(getEvolution).mockResolvedValue(populatedEvolution);
    renderWithAuth(<StatisticsPage />, { token: "token" });

    await waitFor(() => expect(screen.getAllByText("Fran")).toHaveLength(2));
    expect(screen.getAllByText("Back Squat")).toHaveLength(2);
    expect(screen.getAllByText("2", { selector: ".stat-value strong" })).toHaveLength(2);
    expect(screen.getByText("Evolución")).toBeTruthy();
  });

  it("shows API errors visibly", async () => {
    vi.mocked(getStatistics).mockRejectedValue(new Error("Estadísticas no disponibles"));
    vi.mocked(getEvolution).mockResolvedValue(emptyEvolution);
    renderWithAuth(<StatisticsPage />, { token: "token" });

    expect((await screen.findByRole("alert")).textContent).toContain("Estadísticas no disponibles");
  });
});
