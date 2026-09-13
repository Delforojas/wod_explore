import { describe, expect, it } from "vitest";

import { parseRoute } from "./router";

describe("hash router", () => {
  it("parses the protected profile route", () => {
    expect(parseRoute("#/profile")).toEqual({ page: "profile" });
  });

  it("keeps the existing home fallback for unknown routes", () => {
    expect(parseRoute("#/not-a-route")).toEqual({ page: "home" });
  });
});
