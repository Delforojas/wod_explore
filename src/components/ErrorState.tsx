import type { ReactNode } from 'react'

interface ErrorStateProps {
  title: string
  message: string
  children?: ReactNode
}

export function ErrorState({ title, message, children }: ErrorStateProps) {
  return (
    <section
      role="alert"
      aria-labelledby="error-state-title"
      className="rounded-2xl border border-red-400/40 bg-red-400/10 px-6 py-10"
    >
      <h2 id="error-state-title" className="text-xl font-semibold text-red-100">
        {title}
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-red-200">{message}</p>
      {children ? <div className="mt-6">{children}</div> : null}
    </section>
  )
}
