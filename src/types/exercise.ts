import { z } from 'zod'
import {
  exerciseCategorySchema,
  exerciseSchema,
  exercisesSchema,
} from '../schemas/exercise.schema'

export type ExerciseCategory = z.infer<typeof exerciseCategorySchema>
export type Exercise = z.infer<typeof exerciseSchema>
export type Exercises = z.infer<typeof exercisesSchema>
