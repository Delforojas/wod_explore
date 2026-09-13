import { describe, expect, it, vi } from "vitest";

import { ApiError, getCurrentUser, getExercises, getHistory, getStatistics, getWods } from "./client";
import { statisticsSchema } from "./schemas";

describe("API client", () => {
  it("requests and validates the current user with the session token", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      id: 4,
      name: "Delfin",
      lastName: "Rojas",
      email: "delfin@example.com",
      createdAt: "2026-09-12T16:00:00",
    }), { status: 200, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(getCurrentUser("token-profile")).resolves.toMatchObject({
      name: "Delfin",
      lastName: "Rojas",
      email: "delfin@example.com",
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/api/users/me",
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Headers;
    expect(headers.get("Authorization")).toBe("Bearer token-profile");
  });

  it("adds the bearer token and validates statistics responses", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      wodResultsCount: 2,
      exerciseResultsCount: 1,
      wodPersonalRecords: [],
      exercisePersonalRecords: [],
    }), { status: 200, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(getStatistics("token-a")).resolves.toMatchObject({
      wodResultsCount: 2,
      exerciseResultsCount: 1,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/api/users/me/statistics",
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Headers;
    expect(headers.get("Authorization")).toBe("Bearer token-a");
  });

  it("turns API errors into a safe ApiError", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      error: "VALIDATION_ERROR",
      message: "Datos inválidos",
      details: { email: "El email es obligatorio" },
    }), { status: 400 })));

    await expect(getStatistics("token-a")).rejects.toMatchObject<ApiError>({
      name: "ApiError",
      status: 400,
      message: "Datos inválidos",
      details: { email: "El email es obligatorio" },
    });
  });

  it("notifies the app when a protected request expires", async () => {
    const expiredSession = vi.fn();
    vi.stubGlobal("window", { dispatchEvent: expiredSession });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 401 })));

    await expect(getStatistics("expired-token")).rejects.toMatchObject({ status: 401 });
    expect(expiredSession).toHaveBeenCalledOnce();
  });

  it("requests a filtered WOD page with explicit pagination", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      items: [],
      page: 2,
      size: 5,
      totalElements: 0,
      totalPages: 0,
      hasNext: false,
    }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(getWods(
      { name: "Fran", type: "FOR_TIME", level: "RX" },
      "token-page",
      { page: 2, size: 5 },
    )).resolves.toMatchObject({ page: 2, size: 5 });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/api/wods?page=2&size=5&name=Fran&type=FOR_TIME&level=RX",
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
  });

  it("sends exercise search to the paginated API", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      items: [],
      page: 0,
      size: 20,
      totalElements: 0,
      totalPages: 0,
      hasNext: false,
    }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await getExercises("token-exercises", { name: "snatch" });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/api/exercises?page=0&size=20&name=snatch",
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
  });

  it("validates independent paginated history collections", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      wodResults: { items: [], page: 1, size: 10, totalElements: 0, totalPages: 0, hasNext: false },
      exerciseResults: { items: [], page: 1, size: 10, totalElements: 0, totalPages: 0, hasNext: false },
    }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(getHistory("token-history", { page: 1, size: 10 })).resolves.toMatchObject({
      wodResults: { page: 1, size: 10 },
      exerciseResults: { page: 1, size: 10 },
    });
  });
});

describe("statistics schema", () => {
  it("rejects a response with missing counters", () => {
    const result = statisticsSchema.safeParse({
      wodPersonalRecords: [],
      exercisePersonalRecords: [],
    });

    expect(result.success).toBe(false);
  });
});
