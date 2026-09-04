import { workoutDateSchema } from '../schemas/workoutHistory.schema'

export type WorkoutDateValidation =
  | { valid: true; status: 'today' | 'past' }
  | { valid: false; status: 'empty' | 'invalid' | 'future' }

export function getLocalDateString(now: Date = new Date()): string {
  const year = now.getFullYear().toString().padStart(4, '0')
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function validateWorkoutDate(
  date: string,
  today: string = getLocalDateString(),
): WorkoutDateValidation {
  if (date.trim() === '') {
    return { valid: false, status: 'empty' }
  }

  if (!workoutDateSchema.safeParse(date).success) {
    return { valid: false, status: 'invalid' }
  }

  if (date > today) {
    return { valid: false, status: 'future' }
  }

  return { valid: true, status: date === today ? 'today' : 'past' }
}

export function normalizeOptionalText(value?: string): string | undefined {
  const normalizedValue = value?.trim()

  return normalizedValue === '' ? undefined : normalizedValue
}
