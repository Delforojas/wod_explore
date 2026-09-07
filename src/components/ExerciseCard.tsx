import type { Exercise } from '../types/exercise'

interface ExerciseCardProps {
  exercise: Exercise
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  const titleId = `exercise-${exercise.id}-title`

  return (
    <article
      aria-labelledby={titleId}
      className="exercise-row"
    >
      <header className="exercise-card-header">
        <p className="exercise-category">
          <span className="exercise-category-label">Categoría</span>
          <span className="exercise-category-value">{exercise.category}</span>
        </p>
        <h2 id={titleId} className="mt-2 break-words text-balance text-2xl font-bold tracking-[-0.02em] text-board-text">
          {exercise.name}
        </h2>
      </header>

      <p className="exercise-card-description">
        {exercise.description}
      </p>
    </article>
  )
}
