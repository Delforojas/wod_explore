import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getUserWod, getUserWods } from "../api/client";
import type { UserWodDetail, UserWodPage } from "../api/schemas";
import { renderWithAuth } from "../test/test-utils";
import { MyWodsPage } from "./MyWodsPage";

vi.mock("../api/client", () => ({
  getUserWod: vi.fn(),
  getUserWods: vi.fn(),
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
      exerciseId: 1,
      name: "Back Squat",
      category: "WEIGHTLIFTING",
      measurementType: "WEIGHT",
      position: 1,
      prescriptions: [{ value: 60, unit: "KG", unitLabel: null }],
    },
    {
      exerciseId: 2,
      name: "Run",
      category: "CARDIO",
      measurementType: "DISTANCE",
      position: 2,
      prescriptions: [{ value: 500, unit: "METERS", unitLabel: null }],
    },
  ],
};

const pageWithWod: UserWodPage = {
  items: [{
    id: 31,
    name: "Fran personal",
    type: "FOR_TIME",
    category: null,
    timeLimit: 600,
    rounds: null,
    level: "RX",
    createdAt: "2026-09-14T10:00:00",
  }],
  page: 0,
  size: 20,
  totalElements: 1,
  totalPages: 1,
  hasNext: false,
};

describe("MyWodsPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("keeps personal WODs private for anonymous users", () => {
    renderWithAuth(<MyWodsPage />);

    expect(screen.getByText("Tus WODs son privados")).toBeTruthy();
    expect(getUserWods).not.toHaveBeenCalled();
    expect(getUserWod).not.toHaveBeenCalled();
  });

  it("shows loading while the personal archive is pending", () => {
    vi.mocked(getUserWods).mockReturnValue(new Promise(() => undefined));
    renderWithAuth(<MyWodsPage />, { token: "token" });

    expect(screen.getByText("Cargando")).toBeTruthy();
  });

  it("renders the archive with exercise counts and detail links", async () => {
    vi.mocked(getUserWods).mockResolvedValue(pageWithWod);
    vi.mocked(getUserWod).mockResolvedValue(personalWod);
    renderWithAuth(<MyWodsPage />, { token: "token" });

    expect(await screen.findByText("Fran personal")).toBeTruthy();
    expect(screen.getByText("2 ejercicios")).toBeTruthy();
    expect(screen.getByText("Por tiempo · 600 s")).toBeTruthy();
    const link = screen.getByRole("link", { name: /Fran personal.*Ver detalle/ });
    expect(link.getAttribute("href")).toBe("#/my-wods/31");
  });

  it("paginates the personal archive with the current token", async () => {
    const secondPage: UserWodPage = { ...pageWithWod, page: 1, totalPages: 2, hasNext: false, items: [] };
    vi.mocked(getUserWods).mockResolvedValueOnce({ ...pageWithWod, totalPages: 2, hasNext: true }).mockResolvedValue(secondPage);
    vi.mocked(getUserWod).mockResolvedValue(personalWod);
    const user = userEvent.setup();
    renderWithAuth(<MyWodsPage />, { token: "token" });
    await screen.findByText("Fran personal");

    await user.click(screen.getByRole("button", { name: "Siguiente" }));
    await waitFor(() => expect(getUserWods).toHaveBeenLastCalledWith("token", { page: 1, size: 20 }));
  });

  it("renders an actionable empty state", async () => {
    vi.mocked(getUserWods).mockResolvedValue({ ...pageWithWod, items: [], totalElements: 0, totalPages: 0 });
    renderWithAuth(<MyWodsPage />, { token: "token" });

    expect(await screen.findByText("Aún no tienes WODs personalizados")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Crear mi primer WOD" }).getAttribute("href")).toBe("#/create-wod");
  });

  it("shows backend errors without exposing a broken page", async () => {
    vi.mocked(getUserWods).mockRejectedValue(new Error("Archivo no disponible"));
    renderWithAuth(<MyWodsPage />, { token: "token" });

    expect((await screen.findByRole("alert")).textContent).toContain("Archivo no disponible");
  });
});
