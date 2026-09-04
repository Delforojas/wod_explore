import { z } from 'zod'

export const exerciseCategorySchema = z.enum([
  'Weightlifting',
  'Gymnastics',
  'Cardio',
])

export const exerciseSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    category: exerciseCategorySchema,
    description: z.string().min(1),
  })
  .strict()

export const exercisesSchema = z.array(exerciseSchema)
