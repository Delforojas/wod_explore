import { useState } from 'react'
import type { FormEvent } from 'react'
import { getLocalDateString, validateWorkoutDate } from '../lib/workoutHistoryValidation'
import type {
  CreateWorkoutHistoryEntryInput,
  WorkoutHistoryEntry,
} from '../types/workoutHistory'

interface WorkoutLogFormProps {
  wodId: string
  addWorkout: (input: CreateWorkoutHistoryEntryInput) => WorkoutHistoryEntry
}

type InvalidWorkoutDateStatus = 'empty' | 'invalid' | 'future'

function getDateErrorMessage(status: InvalidWorkoutDateStatus): string {
  if (status === 'empty') {
    return 'Selecciona una fecha para registrar el entrenamiento.'
  }

  if (status === 'future') {
    return 'La fecha no puede ser posterior a hoy.'
  }

  return 'Introduce una fecha válida.'
}

export function WorkoutLogForm({ wodId, addWorkout }: WorkoutLogFormProps) {
  const [date, setDate] = useState(() => getLocalDateString())
  const [result, setResult] = useState('')
  const [notes, setNotes] = useState('')
  const [dateError, setDateError] = useState<string>()
  const [successMessage, setSuccessMessage] = useState<string>()
  const today = getLocalDateString()

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    setDateError(undefined)
    setSuccessMessage(undefined)

    const dateValidation = validateWorkoutDate(date, today)

    if (!dateValidation.valid) {
      setDateError(getDateErrorMessage(dateValidation.status))
      return
    }

    addWorkout({ wodId, date, result, notes, today })
    setSuccessMessage('Entrenamiento registrado correctamente.')
  }

  return (
    <section
      aria-labelledby="workout-log-title"
      className="mt-8 rounded-2xl border border-orange-400/30 bg-orange-400/5 p-5 sm:p-6"
    >
      <h2 id="workout-log-title" className="text-2xl font-semibold text-white">
        Registrar entrenamiento
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
        Guarda cuándo realizaste este WOD y añade un resultado o notas si quieres.
      </p>

      <form noValidate onSubmit={handleSubmit} className="mt-6 grid gap-5">
        <div>
          <label htmlFor="workout-date" className="text-sm font-medium text-slate-200">
            Fecha del entrenamiento
          </label>
          <input
            id="workout-date"
            name="date"
            type="date"
            value={date}
            max={today}
            required
            aria-required="true"
            aria-invalid={dateError ? 'true' : 'false'}
            aria-describedby={dateError ? 'workout-date-error' : undefined}
            onChange={(event) => setDate(event.target.value)}
            className="mt-2 block min-h-11 w-full rounded-md border border-slate-700 bg-slate-950/70 px-3 py-2 text-slate-100 outline-none transition-colors focus-visible:border-orange-400 focus-visible:ring-2 focus-visible:ring-orange-400/40"
          />
          {dateError ? (
            <p id="workout-date-error" role="alert" className="mt-2 text-sm text-orange-300">
              {dateError}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="workout-result" className="text-sm font-medium text-slate-200">
            Resultado <span className="text-slate-500">(opcional)</span>
          </label>
          <input
            id="workout-result"
            name="result"
            type="text"
            value={result}
            onChange={(event) => setResult(event.target.value)}
            className="mt-2 block min-h-11 w-full rounded-md border border-slate-700 bg-slate-950/70 px-3 py-2 text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus-visible:border-orange-400 focus-visible:ring-2 focus-visible:ring-orange-400/40"
            placeholder="Ej. 05:42 o 7 rondas + 12 reps"
          />
        </div>

        <div>
          <label htmlFor="workout-notes" className="text-sm font-medium text-slate-200">
            Notas <span className="text-slate-500">(opcional)</span>
          </label>
          <textarea
            id="workout-notes"
            name="notes"
            value={notes}
            rows={4}
            onChange={(event) => setNotes(event.target.value)}
            className="mt-2 block w-full resize-y rounded-md border border-slate-700 bg-slate-950/70 px-3 py-2 text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus-visible:border-orange-400 focus-visible:ring-2 focus-visible:ring-orange-400/40"
            placeholder="Añade cualquier detalle que quieras recordar"
          />
        </div>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-orange-400 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-orange-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-300 focus-visible:ring-2 focus-visible:ring-orange-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Guardar entrenamiento
          </button>
          {successMessage ? (
            <p role="status" aria-live="polite" className="text-sm text-emerald-300">
              {successMessage}
            </p>
          ) : null}
        </div>
      </form>
    </section>
  )
}
