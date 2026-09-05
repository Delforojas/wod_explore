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
      className="history-log-form"
    >
      <h2 id="workout-log-title" className="text-2xl font-bold tracking-[-0.02em] text-board-text">
        Registrar entrenamiento
      </h2>
      <p className="history-log-form-intro">
        Guarda cuándo realizaste este WOD y añade un resultado o notas si quieres.
      </p>

      <form noValidate onSubmit={handleSubmit} className="history-log-form-fields">
        <div className="history-log-field">
          <label htmlFor="workout-date" className="field-label">
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
            className="input-control"
          />
          {dateError ? (
            <p id="workout-date-error" role="alert" className="mt-2 text-sm text-board-accent-hover">
              {dateError}
            </p>
          ) : null}
        </div>

        <div className="history-log-field">
          <label htmlFor="workout-result" className="field-label">
            Resultado <span className="text-board-muted">(opcional)</span>
          </label>
          <input
            id="workout-result"
            name="result"
            type="text"
            value={result}
            onChange={(event) => setResult(event.target.value)}
            className="input-control"
            placeholder="Ej. 05:42 o 7 rondas + 12 reps"
          />
        </div>

        <div className="history-log-field history-log-field-wide">
          <label htmlFor="workout-notes" className="field-label">
            Notas <span className="text-board-muted">(opcional)</span>
          </label>
          <textarea
            id="workout-notes"
            name="notes"
            value={notes}
            rows={4}
            onChange={(event) => setNotes(event.target.value)}
            className="textarea-control"
            placeholder="Añade cualquier detalle que quieras recordar"
          />
        </div>

        <div className="history-log-form-actions">
          <button
            type="submit"
            className="button-primary"
          >
            Guardar entrenamiento
          </button>
          {successMessage ? (
            <p role="status" aria-live="polite" className="text-sm text-board-success">
              {successMessage}
            </p>
          ) : null}
        </div>
      </form>
    </section>
  )
}
