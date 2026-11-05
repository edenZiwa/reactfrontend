import React from "react";

export default function ErrorState({
  title = "Something went wrong",
  message = "We could not load this information. Please try again.",
  onRetry,
  retryLabel = "Try again",
  className = "",
}) {
  return (
    <section className={`gom-state gom-error-state ${className}`.trim()} role="alert">
      <span className="gom-state-icon" aria-hidden="true">
        <i className="bi bi-exclamation-triangle" />
      </span>
      <div className="gom-state-copy">
        <h2 className="gom-state-title">{title}</h2>
        <p className="gom-state-message">{message}</p>
        {typeof onRetry === "function" && (
          <button type="button" className="btn btn-outline-success" onClick={onRetry}>
            <i className="bi bi-arrow-clockwise me-2" aria-hidden="true" />
            {retryLabel}
          </button>
        )}
      </div>
    </section>
  );
}
