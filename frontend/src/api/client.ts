import { z } from "zod";

import {
  apiErrorSchema,
  exercisePageSchema,
  exerciseResultSchema,
  exerciseSchema,
  evolutionSchema,
  historySchema,
  loginResponseSchema,
  statisticsSchema,
  userSchema,
  userWodCreateRequestSchema,
  userWodDetailSchema,
  userWodPageSchema,
  wodDetailSchema,
  wodPageSchema,
  wodResultSchema,
  type ExerciseResultRequest,
  type LoginRequest,
  type RegisterRequest,
  type UserWodCreateRequest,
  type WodResultRequest,
} from "./schemas";

interface PaginationOptions {
  page?: number;
  size?: number;
}

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:8080/api").replace(
  /\/$/,
  "",
);

export class ApiError extends Error {
  readonly status: number;
  readonly details: Record<string, string> | undefined;

  constructor(message: string, status: number, details?: Record<string, string>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

async function request<T>(
  path: string,
  schema: z.ZodType<T>,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (options.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError("No se pudo conectar con el servidor. Comprueba tu conexión.", 0);
  }

  const payload = await readJson(response);
  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      window.dispatchEvent(new Event("wod-explorer:session-expired"));
    }
    const error = apiErrorSchema.safeParse(payload);
    throw new ApiError(
      error.success && error.data.message
        ? error.data.message
        : "La API no pudo completar la operación.",
      response.status,
      error.success ? error.data.details : undefined,
    );
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    throw new ApiError("La respuesta del servidor no tiene un formato válido.", response.status);
  }

  return parsed.data;
}

const jsonBody = (body: unknown): RequestInit => ({
  method: "POST",
  body: JSON.stringify(body),
});

export function register(requestData: RegisterRequest) {
  return request("/users", userSchema, jsonBody(requestData));
}

export function login(requestData: LoginRequest) {
  return request("/auth/login", loginResponseSchema, jsonBody(requestData));
}

export function getCurrentUser(token: string) {
  return request("/users/me", userSchema, {}, token);
}

export function getExercises(
  token: string,
  filters: { name?: string } = {},
  pagination: PaginationOptions = {},
) {
  const params = new URLSearchParams({
    page: String(pagination.page ?? 0),
    size: String(pagination.size ?? 20),
  });
  if (filters.name) params.set("name", filters.name);
  return request(`/exercises?${params.toString()}`, exercisePageSchema, {}, token);
}

export function getExercise(id: number, token: string) {
  return request(`/exercises/${id}`, exerciseSchema, {}, token);
}

export function getWods(
  filters: { name?: string; type?: string; level?: string } = {},
  token: string,
  pagination: PaginationOptions = {},
) {
  const params = new URLSearchParams({
    page: String(pagination.page ?? 0),
    size: String(pagination.size ?? 20),
  });
  if (filters.name) params.set("name", filters.name);
  if (filters.type) params.set("type", filters.type);
  if (filters.level) params.set("level", filters.level);
  return request(`/wods?${params.toString()}`, wodPageSchema, {}, token);
}

export function getWod(id: number, token: string) {
  return request(`/wods/${id}`, wodDetailSchema, {}, token);
}

export function getUserWods(token: string, pagination: PaginationOptions = {}) {
  const params = new URLSearchParams({
    page: String(pagination.page ?? 0),
    size: String(pagination.size ?? 20),
  });
  return request(`/user-wods?${params.toString()}`, userWodPageSchema, {}, token);
}

export function getUserWod(id: number, token: string) {
  return request(`/user-wods/${id}`, userWodDetailSchema, {}, token);
}

export function createUserWod(body: UserWodCreateRequest, token: string) {
  const parsedBody = userWodCreateRequestSchema.parse(body);
  return request("/user-wods", userWodDetailSchema, jsonBody(parsedBody), token);
}

export function createWodResult(id: number, body: WodResultRequest, token: string) {
  return request(`/wods/${id}/results`, wodResultSchema, jsonBody(body), token);
}

export function getWodResults(id: number, token: string) {
  return request(`/wods/${id}/results`, z.array(wodResultSchema), {}, token);
}

export function createExerciseResult(id: number, body: ExerciseResultRequest, token: string) {
  return request(`/exercises/${id}/results`, exerciseResultSchema, jsonBody(body), token);
}

export function getExerciseResults(id: number, token: string) {
  return request(`/exercises/${id}/results`, z.array(exerciseResultSchema), {}, token);
}

export function getBestExerciseResult(id: number, recordType: string, token: string) {
  return request(
    `/exercises/${id}/results/best?recordType=${encodeURIComponent(recordType)}`,
    exerciseResultSchema,
    {},
    token,
  );
}

export function getHistory(token: string, pagination: PaginationOptions = {}) {
  const params = new URLSearchParams({
    page: String(pagination.page ?? 0),
    size: String(pagination.size ?? 20),
  });
  return request(`/users/me/history?${params.toString()}`, historySchema, {}, token);
}

export function getStatistics(token: string) {
  return request("/users/me/statistics", statisticsSchema, {}, token);
}

export function getEvolution(token: string) {
  return request("/users/me/evolution", evolutionSchema, {}, token);
}
