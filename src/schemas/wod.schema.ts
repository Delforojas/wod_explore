import { z } from 'zod'

export const wodTypeSchema = z.enum(['For Time', 'AMRAP', 'EMOM'])

export const wodExerciseSchema = z
  .object({
    exerciseId: z.string().min(1),
    repetitions: z.string().min(1),
  })
  .strict()

export const wodSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    type: wodTypeSchema,
    level: z.string().min(1),
    structure: z.string().min(1),
    description: z.string().min(1),
    exercises: z.array(wodExerciseSchema).min(1),
  })
  .strict()

export const wodsSchema = z.array(wodSchema)
