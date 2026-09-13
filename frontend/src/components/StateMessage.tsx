interface StateMessageProps {
  title: string;
  message?: string;
  action?: { label: string; onClick?: () => void; href?: string };
  tone?: "neutral" | "error";
}

export function StateMessage({ title, message, action, tone = "neutral" }: StateMessageProps) {
  return (
    <section
      className={`state-message state-message--${tone}`}
      role={tone === "error" ? "alert" : undefined}
      aria-live={tone === "error" ? "assertive" : "polite"}
    >
      <h2>{title}</h2>
      {message && <p>{message}</p>}
      {action?.href ? <a className="button button--secondary" href={action.href}>{action.label}</a> : action && (
        <button className="button button--secondary" type="button" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </section>
  );
}

export function LoadingMessage() {
  return <StateMessage title="Cargando" message="Estamos trayendo los datos de tu entrenamiento." />;
}
