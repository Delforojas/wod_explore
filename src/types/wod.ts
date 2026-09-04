import { z } from 'zod'
import {
  wodExerciseSchema,
  wodSchema,
  wodTypeSchema,
  wodsSchema,
} from '../schemas/wod.schema'

export type WodType = z.infer<typeof wodTypeSchema>
export type WodExercise = z.infer<typeof wodExerciseSchema>
export type Wod = z.infer<typeof wodSchema>
export type Wods = z.infer<typeof wodsSchema>
