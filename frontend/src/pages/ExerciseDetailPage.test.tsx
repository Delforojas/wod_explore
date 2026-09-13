import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createExerciseResult,
  getBestExerciseResult,
  getExercise,
  getExerciseResults,
} from "../api/client";
import type {
  Exercise,
  ExerciseResult,
} from "../api/schemas";
import { renderWithAuth } from "../test/test-utils";
import { ExerciseDetailPage } from "./ExerciseDetailPage";

vi.mock("../api/client", () => ({
  createExerciseResult: vi.fn(),
  getBestExerciseResult: vi.fn(),
  getExercise: vi.fn(),
  getExerciseResults: vi.fn(),
}));

const emptyResults: ExerciseResult[] = [];

function makeExercise(measurementType: Exercise["measurementType"]): Exercise {
  return {
    id: 2,
    name: "Back Squat",
    category: "WEIGHTLIFTING",
    measurementType,
  };
}

const createdResult: ExerciseResult = {
  id: 9,
  exerciseId: 2,
  value: 100,
  unit: "KG",
  recordType: "1RM",
  performedAt: "2026-09-13T10:00:00",
};

function renderLoadedExercise(measurementType: Exercise["measurementType"]) {
  vi.mocked(getExercise).mockResolvedValue(makeExercise(measurementType));
  vi.mocked(getExerciseResults).mockResolvedValue(emptyResults);
  vi.mocked(getBestExerciseResult).mockRejectedValue(new Error("Sin marca"));
  vi.mocked(createExerciseResult).mockResolvedValue(createdResult);
  return renderWithAuth(<ExerciseDetailPage id={2} />, { token: "token" });
}

describe("ExerciseDetailPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows loading before the detail requests resolve", () => {
    vi.mocked(getExercise).mockReturnValue(new Promise(() => undefined));
    vi.mocked(getExerciseResults).mockReturnValue(new Promise(() => undefined));
    renderWithAuth(<ExerciseDetailPage id={2} />, { token: "token" });

    expect(screen.getByText("Cargando")).toBeTruthy();
  });

  it("shows an API error for an unavailable exercise", async () => {
    vi.mocked(getExercise).mockRejectedValue(new Error("Ejercicio no disponible"));
    vi.mocked(getExerciseResults).mockResolvedValue(emptyResults);
    renderWithAuth(<ExerciseDetailPage id={2} />, { token: "token" });

    expect((await screen.findByRole("alert")).textContent).toContain("Ejercicio no disponible");
  });

  it("renders a valid exercise and its empty result state", async () => {
    renderLoadedExercise("WEIGHT");

    expect(await screen.findByRole("heading", { name: "Back Squat" })).toBeTruthy();
    expect(screen.getByText("Sin marca todavía")).toBeTruthy();
    expect(screen.getByText("Todavía no tienes marcas para este ejercicio.")).toBeTruthy();
  });

  it.each([
    ["WEIGHT", "5RM", "KG"],
    ["REPS", "MAX_REPS", "REPS"],
    ["TIME", "BEST_TIME", "SECONDS"],
  ] as const)("builds the %s exercise result payload", async (measurementType, recordType, unit) => {
    const user = userEvent.setup();
    renderLoadedExercise(measurementType);
    await screen.findByRole("heading", { name: "Back Squat" });

    await user.type(screen.getByLabelText("Valor"), "100");
    const recordTypeSelects = screen.getAllByLabelText("Tipo de marca");
    await user.selectOptions(recordTypeSelects[recordTypeSelects.length - 1]!, recordType);
    await user.click(screen.getByRole("button", { name: "Guardar marca" }));

    await waitFor(() => expect(createExerciseResult).toHaveBeenCalledWith(
      2,
      expect.objectContaining({ value: 100, unit, recordType }),
      "token",
    ));
  });

  it("explains when an exercise measurement cannot be registered", async () => {
    renderLoadedExercise("DISTANCE");

    await screen.findByRole("heading", { name: "Back Squat" });
    expect(screen.getByText("Medición no registrable")).toBeTruthy();
    expect(screen.getByText("Este ejercicio todavía no tiene un tipo de marca compatible en la API.")).toBeTruthy();
    expect(createExerciseResult).not.toHaveBeenCalled();
  });

  it("invites an anonymous visitor to log in", () => {
    renderWithAuth(<ExerciseDetailPage id={2} />);

    expect(screen.getByText("El catálogo es privado")).toBeTruthy();
    expect(getExercise).not.toHaveBeenCalled();
  });
});
