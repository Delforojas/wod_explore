import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getExercises } from "../api/client";
import type { ExercisePage } from "../api/schemas";
import { renderWithAuth } from "../test/test-utils";
import { ExercisesPage } from "./ExercisesPage";

vi.mock("../api/client", () => ({
  getExercises: vi.fn(),
}));

const emptyPage: ExercisePage = {
  items: [],
  page: 0,
  size: 20,
  totalElements: 0,
  totalPages: 0,
  hasNext: false,
};

const populatedPage: ExercisePage = {
  items: [{ id: 2, name: "Back Squat", category: "WEIGHTLIFTING", measurementType: "WEIGHT" }],
  page: 0,
  size: 20,
  totalElements: 1,
  totalPages: 1,
  hasNext: false,
};

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((promiseResolve) => {
    resolve = promiseResolve;
  });
  return { promise, resolve };
}

describe("ExercisesPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows loading and then the empty state", async () => {
    const pending = deferred<ExercisePage>();
    vi.mocked(getExercises).mockReturnValue(pending.promise);
    renderWithAuth(<ExercisesPage />, { token: "token" });

    expect(screen.getByText("Cargando")).toBeTruthy();
    await act(async () => {
      pending.resolve(emptyPage);
      await pending.promise;
    });

    expect(screen.getByText("No hay coincidencias")).toBeTruthy();
  });

  it("shows API errors and valid exercise results", async () => {
    vi.mocked(getExercises).mockRejectedValueOnce(new Error("No hay conexión"));
    renderWithAuth(<ExercisesPage />, { token: "token" });
    expect((await screen.findByRole("alert")).textContent).toContain("No hay conexión");

    vi.mocked(getExercises).mockResolvedValue(populatedPage);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Reintentar" }));

    expect(await screen.findByRole("link", { name: /Back Squat/ })).toBeTruthy();
    expect(screen.getByText("1 movimientos disponibles")).toBeTruthy();
  });

  it("sends the search query and page navigation to the API", async () => {
    vi.mocked(getExercises).mockResolvedValue(populatedPage);
    const user = userEvent.setup();
    renderWithAuth(<ExercisesPage />, { token: "token" });
    await screen.findByRole("link", { name: /Back Squat/ });

    await user.type(screen.getByLabelText("Buscar ejercicios"), "snatch");
    await user.click(screen.getByRole("button", { name: "Buscar" }));

    await waitFor(() => expect(getExercises).toHaveBeenLastCalledWith(
      "token",
      { name: "snatch" },
      { page: 0, size: 20 },
    ));
  });

  it("invites an anonymous visitor to log in", () => {
    renderWithAuth(<ExercisesPage />);

    expect(screen.getByText("El catálogo es privado")).toBeTruthy();
    expect(getExercises).not.toHaveBeenCalled();
  });
});
