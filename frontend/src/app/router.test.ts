import { describe, expect, it } from "vitest";

import { navigate, parseRoute } from "./router";

describe("hash router", () => {
  it("parses the protected profile route", () => {
    expect(parseRoute("#/profile")).toEqual({ page: "profile" });
  });

  it("keeps the existing home fallback for unknown routes", () => {
    expect(parseRoute("#/not-a-route")).toEqual({ page: "home" });
  });

  it.each([
    ["#/", { page: "home" }],
    ["#/login/", { page: "login" }],
    ["#/wods/18", { page: "wod-detail", id: 18 }],
    ["#/create-wod", { page: "create-wod" }],
    ["#/my-wods", { page: "my-wods" }],
    ["#/my-wods?deleted=1", { page: "my-wods", feedback: "deleted" }],
    ["#/my-wods/31", { page: "my-wod-detail", id: 31 }],
    ["#/my-wods/31/edit", { page: "my-wod-edit", id: 31 }],
    ["#/exercises/7", { page: "exercise-detail", id: 7 }],
    ["#/history", { page: "history" }],
    ["#/statistics", { page: "statistics" }],
  ])("parses %s", (hash, expected) => {
    expect(parseRoute(hash)).toEqual(expected);
  });

  it("navigates by updating the hash", () => {
    navigate("/statistics");
    expect(window.location.hash).toBe("#/statistics");
  });
});
