export type StateMessageKind =
  | "loading"
  | "empty"
  | "error"
  | "network-error"
  | "private"
  | "session-expired"
  | "success";

interface StateMessageProps {
  kind?: StateMessageKind;
  title: string;
  message?: string;
  action?: { label: string; onClick?: () => void; href?: string };
}

const stateMarkers: Record<StateMessageKind, string> = {
  loading: "state-message__marker--loading",
  empty: "state-message__marker--empty",
  error: "state-message__marker--error",
  "network-error": "state-message__marker--network-error",
  private: "state-message__marker--private",
  "session-expired": "state-message__marker--session-expired",
  success: "state-message__marker--success",
};

export function StateMessage({ kind = "empty", title, message, action }: StateMessageProps) {
  const isUrgent = kind === "error" || kind === "network-error";
  const liveProps = isUrgent
    ? { role: "alert" as const, "aria-atomic": true }
    : { role: "status" as const, "aria-live": "polite" as const, "aria-atomic": true };

  return (
    <section
      className={`state-message state-message--${kind}`}
      {...liveProps}
      aria-label={title}
      aria-busy={kind === "loading" ? true : undefined}
    >
      <span className={`state-message__marker ${stateMarkers[kind]}`} aria-hidden="true" />
      <div className="state-message__content">
        <h2>{title}</h2>
        {message && <p>{message}</p>}
        {action?.href ? <a className="button button--secondary" href={action.href}>{action.label}</a> : action && (
          <button className="button button--secondary" type="button" onClick={action.onClick}>
            {action.label}
          </button>
        )}
      </div>
    </section>
  );
}

export function LoadingMessage({ message = "Estamos trayendo tus datos." }: { message?: string }) {
  return <StateMessage kind="loading" title="Cargando" message={message} />;
}
