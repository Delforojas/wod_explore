import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import App from "./App";
import { renderWithAuth } from "./test/test-utils";

describe("App navigation", () => {
  beforeEach(() => {
    window.location.hash = "/";
  });

  it("renders the selected page after navigating through a visible link", async () => {
    const user = userEvent.setup();
    renderWithAuth(<App />);

    expect(screen.getByRole("heading", { name: "Tu archivo de WODs empieza aquí." })).toBeTruthy();
    await user.click(screen.getByRole("link", { name: "Explorar WODs" }));

    await waitFor(() => expect(screen.getByRole("heading", { name: "WODs" })).toBeTruthy());
    expect(window.location.hash).toBe("#/wods");
    expect(screen.getByText("El archivo es privado")).toBeTruthy();
  });
});
