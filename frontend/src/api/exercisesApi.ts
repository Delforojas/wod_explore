import type { Exercise } from "../types/exercise";

const API_URL = "http://localhost:8080/api/exercises";

export async function getExercises(): Promise<Exercise[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Error al cargar los ejercicios");
  }

  return response.json();
}
