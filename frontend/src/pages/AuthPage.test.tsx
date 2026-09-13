import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "../api/client";
import { AuthPage } from "./AuthPage";
import { renderWithAuth } from "../test/test-utils";

describe("AuthPage", () => {
  beforeEach(() => {
    window.location.hash = "/login";
  });

  it("submits login credentials and navigates home", async () => {
    const login = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderWithAuth(<AuthPage mode="login" />, { login });

    await user.type(screen.getByLabelText("Email"), "delfin@example.com");
    await user.type(screen.getByLabelText("Contraseña"), "ExamplePassword123");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => expect(login).toHaveBeenCalledWith({
      email: "delfin@example.com",
      password: "ExamplePassword123",
    }));
    expect(window.location.hash).toBe("#/");
  });

  it("submits all registration fields", async () => {
    const register = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderWithAuth(<AuthPage mode="register" />, { register });

    await user.type(screen.getByLabelText("Nombre"), "Delfin");
    await user.type(screen.getByLabelText("Apellidos"), "Rojas");
    await user.type(screen.getByLabelText("Email"), "delfin@example.com");
    await user.type(screen.getByLabelText("Contraseña"), "ExamplePassword123");
    await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

    await waitFor(() => expect(register).toHaveBeenCalledWith({
      name: "Delfin",
      lastName: "Rojas",
      email: "delfin@example.com",
      password: "ExamplePassword123",
    }));
  });

  it("shows a safe API error to the user", async () => {
    const login = vi.fn().mockRejectedValue(new ApiError("Credenciales inválidas", 401));
    const user = userEvent.setup();
    renderWithAuth(<AuthPage mode="login" />, { login });

    await user.type(screen.getByLabelText("Email"), "delfin@example.com");
    await user.type(screen.getByLabelText("Contraseña"), "wrong-password");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect((await screen.findByRole("alert")).textContent).toContain("Credenciales inválidas");
  });
});
