import { z } from 'zod'
import {
  workoutHistoryEntrySchema,
  workoutHistorySchema,
} from '../schemas/workoutHistory.schema'

export type WorkoutHistoryEntry = z.infer<typeof workoutHistoryEntrySchema>
export type WorkoutHistory = z.infer<typeof workoutHistorySchema>

export interface CreateWorkoutHistoryEntryInput {
  wodId: string
  date: string
  result?: string
  notes?: string
  today?: string
}
