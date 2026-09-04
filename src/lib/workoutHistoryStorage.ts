import { workoutHistorySchema } from '../schemas/workoutHistory.schema'
import type {
  WorkoutHistory,
  WorkoutHistoryEntry,
} from '../types/workoutHistory'
import { validateWorkoutDate } from './workoutHistoryValidation'

export const WORKOUT_HISTORY_STORAGE_KEY = 'wod-explorer:workout-history'

function validateStoredHistory(value: unknown): WorkoutHistory {
  const validationResult = workoutHistorySchema.safeParse(value)

  if (!validationResult.success) {
    return []
  }

  const hasInvalidDate = validationResult.data.some(
    (entry) => !validateWorkoutDate(entry.date).valid,
  )

  return hasInvalidDate ? [] : validationResult.data
}

export function loadWorkoutHistory(): WorkoutHistory {
  try {
    const storedHistory = globalThis.localStorage.getItem(
      WORKOUT_HISTORY_STORAGE_KEY,
    )

    if (storedHistory === null) {
      return []
    }

    const parsedHistory: unknown = JSON.parse(storedHistory)

    return validateStoredHistory(parsedHistory)
  } catch {
    return []
  }
}

export function saveWorkoutHistory(
  entries: readonly WorkoutHistoryEntry[],
): void {
  const validatedHistory = validateStoredHistory(entries)

  if (validatedHistory.length !== entries.length) {
    return
  }

  try {
    globalThis.localStorage.setItem(
      WORKOUT_HISTORY_STORAGE_KEY,
      JSON.stringify(validatedHistory),
    )
  } catch {
    // Storage failures must not break the application.
  }
}
