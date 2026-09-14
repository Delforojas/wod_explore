import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LoadingMessage, StateMessage } from "./StateMessage";
import { getErrorStateKind } from "./stateMessageUtils";
import { renderWithAuth } from "../test/test-utils";

describe("StateMessage", () => {
  it("announces loading as a polite busy status", () => {
    renderWithAuth(<LoadingMessage />);

    const message = screen.getByRole("status");
    expect(message.getAttribute("aria-live")).toBe("polite");
    expect(message.getAttribute("aria-atomic")).toBe("true");
    expect(message.getAttribute("aria-busy")).toBe("true");
    expect(message.textContent).toContain("Cargando");
  });

  it("uses an alert without a duplicate live-region attribute for urgent errors", () => {
    renderWithAuth(<StateMessage kind="error" title="No se pudo cargar" message="Inténtalo de nuevo." />);

    const message = screen.getByRole("alert");
    expect(message.getAttribute("aria-live")).toBeNull();
    expect(message.getAttribute("aria-atomic")).toBe("true");
  });

  it("keeps recovery actions as native links", () => {
    renderWithAuth(
      <StateMessage
        kind="private"
        title="Contenido privado"
        action={{ label: "Iniciar sesión", href: "#/login" }}
      />,
    );

    expect(screen.getByRole("link", { name: "Iniciar sesión" }).getAttribute("href")).toBe("#/login");
  });

  it("distinguishes network failures from other errors", () => {
    expect(getErrorStateKind({ status: 0 })).toBe("network-error");
    expect(getErrorStateKind({ status: 500 })).toBe("error");
  });
});
