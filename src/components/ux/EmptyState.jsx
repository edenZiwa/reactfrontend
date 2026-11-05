import React from "react";

export default function EmptyState({
  title = "Nothing to show yet",
  message = "There is no information to display here right now.",
  icon = "bi-inbox",
  actionLabel,
  onAction,
  className = "",
}) {
  return (
    <section className={`gom-state gom-empty-state ${className}`.trim()}>
      <span className="gom-state-icon" aria-hidden="true">
        <i className={`bi ${icon}`} />
      </span>
      <div className="gom-state-copy">
        <h2 className="gom-state-title">{title}</h2>
        <p className="gom-state-message">{message}</p>
        {actionLabel && typeof onAction === "function" && (
          <button type="button" className="btn btn-success" onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </div>
    </section>
  );
}
