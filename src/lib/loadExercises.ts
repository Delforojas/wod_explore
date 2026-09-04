import exercisesData from '../data/exercises.json'
import { exercisesSchema } from '../schemas/exercise.schema'

export function parseExercises(input: unknown) {
  return exercisesSchema.safeParse(input)
}

export function loadExercises() {
  return parseExercises(exercisesData)
}
