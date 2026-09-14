import { afterEach, describe, expect, it, vi } from "vitest";

import { ApiError, createUserWod, getCurrentUser, getExercises, getHistory, getStatistics, getUserWod, getUserWods, getWods } from "./client";
import { statisticsSchema } from "./schemas";

describe("API client", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

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

  it("turns network failures into a user-facing ApiError", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));

    await expect(getStatistics("token-a")).rejects.toMatchObject({
      status: 0,
      message: "No se pudo conectar con el servidor. Comprueba tu conexión.",
    });
  });

  it("rejects invalid successful payloads with a safe ApiError", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ invalid: true }), { status: 200 })));

    await expect(getStatistics("token-a")).rejects.toMatchObject({
      status: 200,
      message: "La respuesta del servidor no tiene un formato válido.",
    });
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

  it("creates a user WOD with the session token and validates the response", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      id: 31,
      name: "Fran personal",
      type: "FOR_TIME",
      category: null,
      timeLimit: 600,
      rounds: null,
      level: "RX",
      createdAt: "2026-09-14T10:00:00",
      exercises: [{
        exerciseId: 1,
        name: "Back Squat",
        category: "WEIGHTLIFTING",
        measurementType: "WEIGHT",
        position: 1,
        prescriptions: [{ value: 60, unit: "KG", unitLabel: null }],
      }],
    }), { status: 201, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(createUserWod({
      name: "Fran personal",
      type: "FOR_TIME",
      level: "RX",
      timeLimit: 600,
      rounds: null,
      exercises: [{ exerciseId: 1, position: 1, prescriptions: [{ value: 60, unit: "KG", unitLabel: null }] }],
    }, "token-wod")).resolves.toMatchObject({ id: 31, name: "Fran personal" });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/api/user-wods",
      expect.objectContaining({ headers: expect.any(Headers), method: "POST" }),
    );
    const options = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(new Headers(options.headers).get("Authorization")).toBe("Bearer token-wod");
    expect(JSON.parse(String(options.body))).toMatchObject({ name: "Fran personal", exercises: [{ position: 1 }] });
  });

  it("lists and opens personal WODs with the session token", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({
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
      }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        id: 31,
        name: "Fran personal",
        type: "FOR_TIME",
        category: null,
        timeLimit: 600,
        rounds: null,
        level: "RX",
        createdAt: "2026-09-14T10:00:00",
        exercises: [],
      }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(getUserWods("token-my-wods")).resolves.toMatchObject({ totalElements: 1 });
    await expect(getUserWod(31, "token-my-wods")).resolves.toMatchObject({ id: 31 });

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "http://localhost:8080/api/user-wods?page=0&size=20",
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "http://localhost:8080/api/user-wods/31",
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
    expect(new Headers(fetchMock.mock.calls[0]?.[1]?.headers).get("Authorization")).toBe("Bearer token-my-wods");
    expect(new Headers(fetchMock.mock.calls[1]?.[1]?.headers).get("Authorization")).toBe("Bearer token-my-wods");
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
