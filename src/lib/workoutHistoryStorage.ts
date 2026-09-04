import { workoutHistorySchema } from '../schemas/workoutHistory.schema'
import type {
  WorkoutHistory,
  WorkoutHistoryEntry,
} from '../types/workoutHistory'

export const WORKOUT_HISTORY_STORAGE_KEY = 'wod-explorer:workout-history'

export function loadWorkoutHistory(): WorkoutHistory {
  try {
    const storedHistory = globalThis.localStorage.getItem(
      WORKOUT_HISTORY_STORAGE_KEY,
    )

    if (storedHistory === null) {
      return []
    }

    const parsedHistory: unknown = JSON.parse(storedHistory)
    const validationResult = workoutHistorySchema.safeParse(parsedHistory)

    return validationResult.success ? validationResult.data : []
  } catch {
    return []
  }
}

export function saveWorkoutHistory(
  entries: readonly WorkoutHistoryEntry[],
): void {
  const validationResult = workoutHistorySchema.safeParse(entries)

  if (!validationResult.success) {
    return
  }

  try {
    globalThis.localStorage.setItem(
      WORKOUT_HISTORY_STORAGE_KEY,
      JSON.stringify(validationResult.data),
    )
  } catch {
    // Storage failures must not break the application.
  }
}
