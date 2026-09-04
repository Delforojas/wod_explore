import { workoutHistoryEntrySchema } from '../schemas/workoutHistory.schema'
import type {
  CreateWorkoutHistoryEntryInput,
  WorkoutHistoryEntry,
} from '../types/workoutHistory'
import {
  normalizeOptionalText,
  validateWorkoutDate,
} from './workoutHistoryValidation'

export function createWorkoutHistoryEntry(
  input: CreateWorkoutHistoryEntryInput,
): WorkoutHistoryEntry {
  const dateValidation = validateWorkoutDate(input.date, input.today)

  if (!dateValidation.valid) {
    throw new Error(`No se puede crear el registro: fecha ${dateValidation.status}.`)
  }

  const result = normalizeOptionalText(input.result)
  const notes = normalizeOptionalText(input.notes)

  return workoutHistoryEntrySchema.parse({
    id: globalThis.crypto.randomUUID(),
    wodId: input.wodId,
    date: input.date,
    ...(result === undefined ? {} : { result }),
    ...(notes === undefined ? {} : { notes }),
  })
}
