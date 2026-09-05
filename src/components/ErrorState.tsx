import type { ReactNode } from 'react'
import { useId } from 'react'

interface ErrorStateProps {
  title: string
  message: string
  children?: ReactNode
}

export function ErrorState({ title, message, children }: ErrorStateProps) {
  const titleId = useId()

  return (
    <section
      role="alert"
      aria-labelledby={titleId}
      data-state-kind="error"
      className="state-error"
    >
      <h2 id={titleId} className="text-xl font-bold tracking-[-0.02em] text-board-text">
        {title}
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-board-danger">{message}</p>
      {children ? <div className="mt-6">{children}</div> : null}
    </section>
  )
}
