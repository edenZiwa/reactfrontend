import React from "react";

export default function LoadingState({
  label = "Loading information…",
  compact = false,
  className = "",
}) {
  return (
    <div
      className={`gom-state gom-loading-state ${compact ? "gom-state--compact" : ""} ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="spinner-border text-success" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
