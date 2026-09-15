import { act, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createUserWod, getExercises } from "../api/client";
import type { Exercise, ExercisePage, UserWodDetail } from "../api/schemas";
import { renderWithAuth } from "../test/test-utils";
import { CreateWodPage } from "./CreateWodPage";

vi.mock("../api/client", () => ({
  createUserWod: vi.fn(),
  getExercises: vi.fn(),
  updateUserWod: vi.fn(),
}));

const backSquat: Exercise = {
  id: 1,
  name: "Back Squat",
  category: "WEIGHTLIFTING",
  measurementType: "WEIGHT",
};
const run: Exercise = {
  id: 2,
  name: "Run",
  category: "CARDIO",
  measurementType: "DISTANCE",
};
const exercisePage: ExercisePage = {
  items: [backSquat, run],
  page: 0,
  size: 12,
  totalElements: 2,
  totalPages: 1,
  hasNext: false,
};
const createdWod: UserWodDetail = {
  id: 31,
  name: "Fran personal",
  type: "FOR_TIME",
  category: null,
  timeLimit: 600,
  rounds: null,
  level: "RX",
  createdAt: "2026-09-14T10:00:00",
  exercises: [],
};

function renderPage() {
  vi.mocked(getExercises).mockResolvedValue(exercisePage);
  return renderWithAuth(<CreateWodPage />, { token: "token" });
}

async function openPickerAndAdd(index: number) {
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "Añadir ejercicio" }));
  const dialog = await screen.findByRole("dialog");
  const addButtons = within(dialog).getAllByRole("button", { name: "Añadir" });
  await user.click(addButtons[index]);
}

describe("CreateWodPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows a private state without querying the catalog when anonymous", () => {
    renderWithAuth(<CreateWodPage />);

    expect(screen.getByText("El archivo es privado")).toBeTruthy();
    expect(getExercises).not.toHaveBeenCalled();
  });

  it("presents creation as a clear sequence with a live review", () => {
    renderPage();

    expect(screen.getByRole("heading", { name: "Crear WOD" })).toBeTruthy();
    expect(screen.getByText("Define la sesión")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Añade los movimientos" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Guarda tu sesión" })).toBeTruthy();
    expect(screen.getByRole("complementary", { name: "Revisión del diseño" })).toBeTruthy();
    expect(screen.getByText("Falta la secuencia")).toBeTruthy();
  });

  it("adds several catalog exercises and keeps their measurement fields", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: "Añadir ejercicio" }));
    const dialog = await screen.findByRole("dialog");
    await user.click(within(dialog).getAllByRole("button", { name: "Añadir" })[0]!);
    await user.click(screen.getByRole("button", { name: "Añadir ejercicio" }));
    const secondDialog = await screen.findByRole("dialog");
    await user.click(within(secondDialog).getAllByRole("button", { name: "Añadir" })[1]!);

    const selectedExercises = screen.getByRole("list", { name: "Ejercicios añadidos" });
    expect(within(selectedExercises).getByText("Back Squat")).toBeTruthy();
    expect(within(selectedExercises).getByText("Run")).toBeTruthy();
    expect(screen.getByLabelText("kg")).toBeTruthy();
    expect(screen.getByLabelText("metros")).toBeTruthy();
  });

  it("searches and paginates the exercise catalog", async () => {
    const user = userEvent.setup();
    const firstPage = { ...exercisePage, totalPages: 2, hasNext: true };
    const secondPage = { ...exercisePage, page: 1, totalPages: 2, hasNext: false };
    vi.mocked(getExercises).mockResolvedValueOnce(firstPage).mockResolvedValueOnce(firstPage).mockResolvedValue(secondPage);
    renderWithAuth(<CreateWodPage />, { token: "token" });

    await user.click(screen.getByRole("button", { name: "Añadir ejercicio" }));
    await screen.findByRole("button", { name: "Siguiente" });
    await user.type(screen.getByLabelText("Buscar ejercicios"), "snatch");
    await user.click(screen.getByRole("button", { name: "Buscar" }));

    await waitFor(() => expect(getExercises).toHaveBeenLastCalledWith(
      "token",
      { name: "snatch" },
      { page: 0, size: 12 },
    ));
    await user.click(screen.getByRole("button", { name: "Siguiente" }));

    await waitFor(() => expect(getExercises).toHaveBeenLastCalledWith(
      "token",
      { name: "snatch" },
      { page: 1, size: 12 },
    ));
  });

  it("removes an exercise from the visible sequence", async () => {
    const user = userEvent.setup();
    renderPage();

    await openPickerAndAdd(0);
    const selectedExercises = screen.getByRole("list", { name: "Ejercicios añadidos" });
    await user.click(within(selectedExercises).getByRole("button", { name: "Eliminar Back Squat" }));

    expect(screen.queryByRole("list", { name: "Ejercicios añadidos" })).toBeNull();
    expect(screen.getByText("Aún no hay movimientos.")).toBeTruthy();
  });

  it("shows only the time cap for AMRAP and validates missing fields", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.selectOptions(screen.getByLabelText("Estructura"), "AMRAP");
    expect(screen.getByLabelText(/Time cap/)).toBeTruthy();
    expect(screen.queryByLabelText("Rondas")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Guardar WOD" }));

    expect(screen.getByText("Escribe un nombre para tu WOD.")).toBeTruthy();
    expect(screen.getByText("Indica una duración entera mayor que cero.")).toBeTruthy();
    expect(screen.getByText("Añade al menos un ejercicio.")).toBeTruthy();
  });

  it("sends exercises in visible order with their prescriptions", async () => {
    const user = userEvent.setup();
    vi.mocked(createUserWod).mockResolvedValue(createdWod);
    renderPage();

    await user.type(screen.getByLabelText("Nombre del WOD"), "  Sesión propia  ");
    await user.type(screen.getByLabelText(/Time cap/), "600");
    await user.click(screen.getByRole("button", { name: "Añadir ejercicio" }));
    const dialog = await screen.findByRole("dialog");
    await user.click(within(dialog).getAllByRole("button", { name: "Añadir" })[0]!);
    await user.click(screen.getByRole("button", { name: "Añadir ejercicio" }));
    const secondDialog = await screen.findByRole("dialog");
    await user.click(within(secondDialog).getAllByRole("button", { name: "Añadir" })[1]!);
    await user.type(screen.getByLabelText("repeticiones"), "10");
    await user.type(screen.getByLabelText("kg"), "60");
    await user.type(screen.getByLabelText("metros"), "500");
    await user.click(screen.getByRole("button", { name: "Subir Run" }));
    await user.click(screen.getByRole("button", { name: "Guardar WOD" }));

    await waitFor(() => expect(createUserWod).toHaveBeenCalledOnce());
    expect(vi.mocked(createUserWod).mock.calls[0]?.[0]).toMatchObject({
      name: "Sesión propia",
      timeLimit: 600,
      exercises: [
        { exerciseId: 2, position: 1, prescriptions: [{ value: 500, unit: "METERS", unitLabel: null }] },
        { exerciseId: 1, position: 2, prescriptions: [
          { value: 10, unit: "REPS", unitLabel: null },
          { value: 60, unit: "KG", unitLabel: null },
        ] },
      ],
    });
    expect(screen.getByText("WOD guardado")).toBeTruthy();
  });

  it("preserves the draft and prevents duplicate saves while the request is pending", async () => {
    const user = userEvent.setup();
    let resolveSave!: (value: UserWodDetail) => void;
    const pendingSave = new Promise<UserWodDetail>((resolve) => { resolveSave = resolve; });
    vi.mocked(createUserWod).mockReturnValue(pendingSave);
    renderPage();

    await user.type(screen.getByLabelText("Nombre del WOD"), "Mi WOD");
    await user.type(screen.getByLabelText(/Time cap/), "300");
    await openPickerAndAdd(0);
    await user.type(screen.getByLabelText("repeticiones"), "10");
    await user.type(screen.getByLabelText("kg"), "40");
    await user.click(screen.getByRole("button", { name: "Guardar WOD" }));
    await user.click(screen.getByRole("button", { name: "Guardando…" }));

    expect(createUserWod).toHaveBeenCalledOnce();
    expect(screen.getByDisplayValue("Mi WOD")).toBeTruthy();
    expect(screen.getByDisplayValue("40")).toBeTruthy();
    await act(async () => resolveSave(createdWod));
    expect(await screen.findByText("WOD guardado")).toBeTruthy();
  });

  it("shows API errors without clearing the form", async () => {
    const user = userEvent.setup();
    vi.mocked(createUserWod).mockRejectedValue(new Error("El servidor no responde"));
    renderPage();

    await user.type(screen.getByLabelText("Nombre del WOD"), "WOD con error");
    await user.type(screen.getByLabelText(/Time cap/), "300");
    await openPickerAndAdd(0);
    await user.type(screen.getByLabelText("repeticiones"), "10");
    await user.type(screen.getByLabelText("kg"), "40");
    await user.click(screen.getByRole("button", { name: "Guardar WOD" }));

    expect(await screen.findByText("El servidor no responde")).toBeTruthy();
    expect(screen.getByDisplayValue("WOD con error")).toBeTruthy();
    expect(screen.getByDisplayValue("40")).toBeTruthy();
  });
});
