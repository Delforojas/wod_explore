import { z } from 'zod'

export const workoutDateSchema = z.iso.date()

export const workoutHistoryEntrySchema = z
  .object({
    id: z.string().min(1),
    wodId: z.string().min(1),
    date: workoutDateSchema,
    result: z.string().trim().min(1).optional(),
    notes: z.string().trim().min(1).optional(),
  })
  .strict()

export const workoutHistorySchema = z
  .array(workoutHistoryEntrySchema)
  .superRefine((entries, context) => {
    const seenIds = new Set<string>()

    entries.forEach((entry, index) => {
      if (seenIds.has(entry.id)) {
        context.addIssue({
          code: 'custom',
          message: 'Los IDs de los registros deben ser únicos.',
          path: [index, 'id'],
        })
        return
      }

      seenIds.add(entry.id)
    })
  })
