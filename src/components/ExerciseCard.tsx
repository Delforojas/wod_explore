import type { Exercise } from '../types/exercise'

interface ExerciseCardProps {
  exercise: Exercise
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  const titleId = `exercise-${exercise.id}-title`

  return (
    <article
      aria-labelledby={titleId}
      className="flex h-full min-w-0 flex-col rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-slate-950/20"
    >
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-400">
          {exercise.category}
        </p>
        <h2 id={titleId} className="mt-2 break-words text-balance text-2xl font-semibold text-white">
          {exercise.name}
        </h2>
      </header>

      <dl className="mt-6 border-y border-slate-800 py-4">
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-slate-400">Categoría</dt>
          <dd className="mt-1 text-sm font-medium text-slate-200">{exercise.category}</dd>
        </div>
      </dl>

      <p className="mt-5 flex-1 break-words text-sm leading-6 text-pretty text-slate-300">
        {exercise.description}
      </p>
    </article>
  )
}
