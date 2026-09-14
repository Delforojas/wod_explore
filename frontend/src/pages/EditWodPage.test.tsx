import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getExercises, getUserWod, updateUserWod } from "../api/client";
import type { UserWodDetail } from "../api/schemas";
import { renderWithAuth } from "../test/test-utils";
import { EditWodPage } from "./EditWodPage";

vi.mock("../api/client", () => ({
  createUserWod: vi.fn(),
  getExercises: vi.fn(),
  getUserWod: vi.fn(),
  updateUserWod: vi.fn(),
}));

const personalWod: UserWodDetail = {
  id: 31,
  name: "Fran personal",
  type: "FOR_TIME",
  category: null,
  timeLimit: 600,
  rounds: null,
  level: "RX",
  createdAt: "2026-09-14T10:00:00",
  exercises: [
    {
      exerciseId: 2,
      name: "Run",
      category: "CARDIO",
      measurementType: "DISTANCE",
      position: 1,
      prescriptions: [{ value: 500, unit: "METERS", unitLabel: null }],
    },
    {
      exerciseId: 1,
      name: "Calorías",
      category: "OTHER",
      measurementType: "OTHER",
      position: 2,
      prescriptions: [{ value: 30, unit: "OTHER", unitLabel: "calorías" }],
    },
  ],
};

describe("EditWodPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("keeps the editor private for anonymous users", () => {
    renderWithAuth(<EditWodPage id={31} />);

    expect(screen.getByText("Tus WODs son privados")).toBeTruthy();
    expect(getUserWod).not.toHaveBeenCalled();
  });

  it("loads the WOD and prepopulates the editable form", async () => {
    vi.mocked(getUserWod).mockResolvedValue(personalWod);
    renderWithAuth(<EditWodPage id={31} />, { token: "token-edit" });

    expect(await screen.findByRole("heading", { name: "Editar WOD" })).toBeTruthy();
    expect(screen.getByDisplayValue("Fran personal")).toBeTruthy();
    expect(screen.getByDisplayValue("600")).toBeTruthy();
    expect(screen.getByDisplayValue("500")).toBeTruthy();
    expect(screen.getByDisplayValue("30")).toBeTruthy();
    expect(screen.getByText("Run")).toBeTruthy();
    expect(screen.getByText("Calorías")).toBeTruthy();
    expect(getUserWod).toHaveBeenCalledWith(31, "token-edit");
  });

  it("sends the edited values through PUT and preserves the loaded exercises", async () => {
    const user = userEvent.setup();
    vi.mocked(getUserWod).mockResolvedValue(personalWod);
    vi.mocked(updateUserWod).mockResolvedValue({ ...personalWod, name: "Fran actualizada" });
    renderWithAuth(<EditWodPage id={31} />, { token: "token-edit" });

    await screen.findByRole("heading", { name: "Editar WOD" });
    await user.clear(screen.getByLabelText("Nombre del WOD"));
    await user.type(screen.getByLabelText("Nombre del WOD"), "Fran actualizada");
    await user.click(screen.getByRole("button", { name: "Guardar cambios" }));

    await waitFor(() => expect(updateUserWod).toHaveBeenCalledOnce());
    expect(updateUserWod).toHaveBeenCalledWith(31, expect.objectContaining({
      name: "Fran actualizada",
      timeLimit: 600,
      exercises: [
        { exerciseId: 2, position: 1, prescriptions: [{ value: 500, unit: "METERS", unitLabel: null }] },
        { exerciseId: 1, position: 2, prescriptions: [{ value: 30, unit: "OTHER", unitLabel: "calorías" }] },
      ],
    }), "token-edit");
    expect(await screen.findByText("WOD actualizado")).toBeTruthy();
  });

  it("shows a retryable load error without querying the catalog", async () => {
    vi.mocked(getUserWod).mockRejectedValue(new Error("WOD personalizado no disponible"));
    renderWithAuth(<EditWodPage id={999} />, { token: "token-edit" });

    await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("WOD personalizado no disponible"));
    expect(screen.getByRole("link", { name: "Volver a Mis WODs" }).getAttribute("href")).toBe("#/my-wods");
    expect(getExercises).not.toHaveBeenCalled();
  });
});
