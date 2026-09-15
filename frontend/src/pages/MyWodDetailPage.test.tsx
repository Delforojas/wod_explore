import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError, createWodResult, deleteUserWod, getUserWod, getWodResults } from "../api/client";
import type { UserWodDetail, WodResult } from "../api/schemas";
import { renderWithAuth } from "../test/test-utils";
import { MyWodDetailPage } from "./MyWodDetailPage";

vi.mock("../api/client", () => ({
  ApiError: class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
      super(message);
      this.status = status;
    }
  },
  createWodResult: vi.fn(),
  deleteUserWod: vi.fn(),
  getUserWod: vi.fn(),
  getWodResults: vi.fn(),
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

const emptyResults: WodResult[] = [];
const createdResult = {
  id: 42,
  wodId: 31,
  timeSeconds: 342,
  rounds: null,
  reps: null,
  level: "RX" as const,
  completedAt: "2026-09-14T18:30:00",
};

describe("MyWodDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.location.hash = "#/my-wods/31";
  });

  it("keeps personal WOD details private for anonymous users", () => {
    renderWithAuth(<MyWodDetailPage id={31} />);

    expect(screen.getByText("Tus WODs son privados")).toBeTruthy();
    expect(getUserWod).not.toHaveBeenCalled();
  });

  it("shows loading while the detail request is pending", () => {
    vi.mocked(getUserWod).mockReturnValue(new Promise(() => undefined));
    renderWithAuth(<MyWodDetailPage id={31} />, { token: "token" });

    expect(screen.getByText("Cargando")).toBeTruthy();
  });

  it("shows loading while the results request is pending", async () => {
    vi.mocked(getUserWod).mockResolvedValue(personalWod);
    vi.mocked(getWodResults).mockReturnValue(new Promise(() => undefined));
    renderWithAuth(<MyWodDetailPage id={31} />, { token: "token" });

    expect(await screen.findByText("Estamos cargando tus resultados.")).toBeTruthy();
  });

  it("renders exercises in API order with their prescription units", async () => {
    vi.mocked(getUserWod).mockResolvedValue(personalWod);
    vi.mocked(getWodResults).mockResolvedValue(emptyResults);
    renderWithAuth(<MyWodDetailPage id={31} />, { token: "token" });

    expect(await screen.findByRole("heading", { name: "Fran personal" })).toBeTruthy();
    const exerciseList = screen.getByRole("list", { name: "Prescripciones de Run" }).parentElement?.parentElement;
    expect(exerciseList?.textContent).toContain("Run");
    expect(screen.getByText("500 metros")).toBeTruthy();
    expect(screen.getByText("30 calorías")).toBeTruthy();
    const orderedNames = screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent);
    expect(orderedNames).toEqual(["Run", "Calorías"]);
    expect(screen.getByRole("link", { name: "Volver a Mis WODs" }).getAttribute("href")).toBe("#/my-wods");
    expect(screen.getByRole("link", { name: "Editar Fran personal" }).getAttribute("href")).toBe("#/my-wods/31/edit");
    expect(screen.getByRole("button", { name: "Eliminar WOD" })).toBeTruthy();
  });

  it("shows the empty result state and FOR_TIME fields", async () => {
    vi.mocked(getUserWod).mockResolvedValue(personalWod);
    vi.mocked(getWodResults).mockResolvedValue(emptyResults);
    renderWithAuth(<MyWodDetailPage id={31} />, { token: "token" });

    await screen.findByLabelText("Tiempo en segundos");

    expect(await screen.findByText("Todavía no tienes resultados para este WOD.")).toBeTruthy();
    expect(screen.getByLabelText("Tiempo en segundos")).toBeTruthy();
    expect(screen.queryByLabelText("Rondas")).toBeNull();
  });

  it("sends the AMRAP payload from a personal WOD", async () => {
    const user = userEvent.setup();
    vi.mocked(getUserWod).mockResolvedValue({ ...personalWod, type: "AMRAP", timeLimit: null, rounds: 10 });
    vi.mocked(getWodResults).mockResolvedValue(emptyResults);
    vi.mocked(createWodResult).mockResolvedValue({ ...createdResult, timeSeconds: null, rounds: 10, reps: 5 });
    renderWithAuth(<MyWodDetailPage id={31} />, { token: "token" });

    await screen.findByLabelText("Rondas");
    await user.type(screen.getByLabelText("Rondas"), "10");
    await user.type(screen.getByLabelText("Repeticiones extra"), "5");
    await user.click(screen.getByRole("button", { name: "Guardar resultado" }));

    await waitFor(() => expect(createWodResult).toHaveBeenCalledWith(
      31,
      expect.objectContaining({ level: "RX", rounds: 10, reps: 5 }),
      "token",
    ));
  });

  it("sends the EMOM payload and shows the created result", async () => {
    const user = userEvent.setup();
    vi.mocked(getUserWod).mockResolvedValue({ ...personalWod, type: "EMOM", timeLimit: 600, rounds: null });
    vi.mocked(getWodResults).mockResolvedValue(emptyResults);
    vi.mocked(createWodResult).mockResolvedValue({ ...createdResult, timeSeconds: null, reps: 12 });
    renderWithAuth(<MyWodDetailPage id={31} />, { token: "token" });

    await screen.findByLabelText("Repeticiones");
    await user.type(screen.getByLabelText("Repeticiones"), "12");
    await user.click(screen.getByRole("button", { name: "Guardar resultado" }));

    await waitFor(() => expect(createWodResult).toHaveBeenCalledWith(
      31,
      expect.objectContaining({ level: "RX", reps: 12 }),
      "token",
    ));
    expect(await screen.findByText("12 reps")).toBeTruthy();
    expect(screen.getByText("Resultado guardado correctamente.")).toBeTruthy();
  });

  it("shows result request errors with a retry action", async () => {
    vi.mocked(getUserWod).mockResolvedValue(personalWod);
    vi.mocked(getWodResults).mockRejectedValue(new ApiError("Resultados no disponibles", 404));
    renderWithAuth(<MyWodDetailPage id={31} />, { token: "token" });

    await screen.findByRole("heading", { name: "Fran personal" });

    expect((await screen.findByRole("alert")).textContent).toContain("Resultados no disponibles");
    expect(screen.getByRole("button", { name: "Reintentar" })).toBeTruthy();
  });

  it("shows save errors and leaves the form usable", async () => {
    const user = userEvent.setup();
    vi.mocked(getUserWod).mockResolvedValue(personalWod);
    vi.mocked(getWodResults).mockResolvedValue(emptyResults);
    vi.mocked(createWodResult).mockRejectedValue(new ApiError("Datos inválidos", 400));
    renderWithAuth(<MyWodDetailPage id={31} />, { token: "token" });

    await screen.findByLabelText("Tiempo en segundos");
    await user.type(screen.getByLabelText("Tiempo en segundos"), "342");
    await user.click(screen.getByRole("button", { name: "Guardar resultado" }));

    expect((await screen.findByRole("alert")).textContent).toContain("Datos inválidos");
    expect(screen.getByRole("button", { name: "Guardar resultado" }).hasAttribute("disabled")).toBe(false);
  });

  it("prevents duplicate result submissions while saving", async () => {
    const user = userEvent.setup();
    let resolveCreate: (value: typeof createdResult) => void = () => undefined;
    const pendingCreate = new Promise<typeof createdResult>((resolve) => {
      resolveCreate = resolve;
    });
    vi.mocked(getUserWod).mockResolvedValue(personalWod);
    vi.mocked(getWodResults).mockResolvedValue(emptyResults);
    vi.mocked(createWodResult).mockReturnValue(pendingCreate);
    renderWithAuth(<MyWodDetailPage id={31} />, { token: "token" });

    await screen.findByLabelText("Tiempo en segundos");
    await user.type(screen.getByLabelText("Tiempo en segundos"), "342");
    const saveButton = screen.getByRole("button", { name: "Guardar resultado" });
    await user.click(saveButton);
    await user.click(screen.getByRole("button", { name: "Guardando…" }));

    expect(createWodResult).toHaveBeenCalledTimes(1);
    resolveCreate(createdResult);
  });

  it("shows a safe not-found error for unavailable personal WODs", async () => {
    vi.mocked(getUserWod).mockRejectedValue(new Error("WOD personalizado no disponible"));
    renderWithAuth(<MyWodDetailPage id={999} />, { token: "token" });

    await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("WOD personalizado no disponible"));
    expect(screen.getByRole("link", { name: "Volver a Mis WODs" }).getAttribute("href")).toBe("#/my-wods");
  });

  it("requires confirmation and does not delete when cancelled", async () => {
    const user = userEvent.setup();
    vi.mocked(getUserWod).mockResolvedValue(personalWod);
    vi.mocked(getWodResults).mockResolvedValue(emptyResults);
    renderWithAuth(<MyWodDetailPage id={31} />, { token: "token" });

    await screen.findByRole("heading", { name: "Fran personal" });
    await user.click(screen.getByRole("button", { name: "Eliminar WOD" }));

    const dialog = screen.getByRole("dialog");
    expect(dialog.textContent).toContain("¿Eliminar Fran personal?");
    expect(document.activeElement).toBe(within(dialog).getByRole("button", { name: "Cancelar" }));

    await user.click(within(dialog).getByRole("button", { name: "Cancelar" }));

    expect(deleteUserWod).not.toHaveBeenCalled();
  });

  it("deletes after confirmation and navigates back with success feedback", async () => {
    const user = userEvent.setup();
    vi.mocked(getUserWod).mockResolvedValue(personalWod);
    vi.mocked(getWodResults).mockResolvedValue(emptyResults);
    vi.mocked(deleteUserWod).mockResolvedValue(null);
    renderWithAuth(<MyWodDetailPage id={31} />, { token: "token" });

    await screen.findByRole("heading", { name: "Fran personal" });
    await user.click(screen.getByRole("button", { name: "Eliminar WOD" }));
    await user.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Eliminar WOD" }));

    await waitFor(() => expect(deleteUserWod).toHaveBeenCalledWith(31, "token"));
    expect(window.location.hash).toBe("#/my-wods?deleted=1");
  });

  it("keeps the confirmation open and explains why history blocks deletion", async () => {
    const user = userEvent.setup();
    vi.mocked(getUserWod).mockResolvedValue(personalWod);
    vi.mocked(getWodResults).mockResolvedValue(emptyResults);
    vi.mocked(deleteUserWod).mockRejectedValue(new ApiError("blocked", 409));
    renderWithAuth(<MyWodDetailPage id={31} />, { token: "token" });

    await screen.findByRole("heading", { name: "Fran personal" });
    await user.click(screen.getByRole("button", { name: "Eliminar WOD" }));
    await user.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Eliminar WOD" }));

    expect((await screen.findByRole("alert")).textContent).toContain("conserva resultados históricos");
    expect(screen.getByRole("dialog").hasAttribute("open")).toBe(true);
    expect(window.location.hash).toBe("#/my-wods/31");
  });
});
