import { z } from 'zod'

export const workoutHistoryEntrySchema = z
  .object({
    id: z.string().min(1),
    wodId: z.string().min(1),
    date: z.iso.date(),
    result: z.string().optional(),
    notes: z.string().optional(),
  })
  .strict()

export const workoutHistorySchema = z.array(workoutHistoryEntrySchema)
