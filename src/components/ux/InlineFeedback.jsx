import React from "react";

const ICONS = {
  success: "bi-check-circle-fill",
  error: "bi-exclamation-circle-fill",
  warning: "bi-exclamation-triangle-fill",
  info: "bi-info-circle-fill",
};

export default function InlineFeedback({
  type = "info",
  message,
  title,
  id,
  className = "",
}) {
  if (!message) return null;
  const safeType = Object.prototype.hasOwnProperty.call(ICONS, type) ? type : "info";

  return (
    <div
      id={id}
      className={`gom-inline-feedback gom-inline-feedback--${safeType} ${className}`.trim()}
      role={safeType === "error" ? "alert" : "status"}
      aria-live={safeType === "error" ? "assertive" : "polite"}
    >
      <i className={`bi ${ICONS[safeType]}`} aria-hidden="true" />
      <div>
        {title && <strong className="d-block mb-1">{title}</strong>}
        <span>{message}</span>
      </div>
    </div>
  );
}
