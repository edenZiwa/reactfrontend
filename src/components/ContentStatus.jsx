import React from "react";

/**
 * Editorial notice used where sample media or draft copy is displayed.
 * Remove the notice only after the related content has been verified
 * and approved for public publication.
 */
export default function ContentStatus({
  title = "Content note",
  children,
  tone = "info",
}) {
  const styles = {
    info: "alert-info",
    warning: "alert-warning",
    secondary: "alert-secondary",
  };

  return (
    <aside
      className={`alert ${styles[tone] || styles.info} d-flex align-items-start gap-3 rounded-4 my-4`}
      role="note"
    >
      <i className="bi bi-info-circle-fill mt-1" aria-hidden="true" />
      <div>
        <p className="fw-semibold mb-1">{title}</p>
        <p className="mb-0 small">{children}</p>
      </div>
    </aside>
  );
}
