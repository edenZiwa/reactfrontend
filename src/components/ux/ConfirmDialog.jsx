import React, { useEffect, useRef } from "react";

export default function ConfirmDialog({
  open = false,
  title = "Are you sure?",
  message = "Please confirm that you want to continue.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "danger",
  busy = false,
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null);
  const titleId = "gom-confirm-dialog-title";
  const messageId = "gom-confirm-dialog-message";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const handleCancel = (event) => {
    event.preventDefault();
    if (!busy) onCancel?.();
  };

  return (
    <dialog
      ref={dialogRef}
      className="gom-confirm-dialog"
      aria-labelledby={titleId}
      aria-describedby={messageId}
      onCancel={handleCancel}
    >
      <div className="gom-confirm-dialog-body">
        <span className="gom-confirm-dialog-icon" aria-hidden="true">
          <i className="bi bi-question-circle" />
        </span>
        <h2 id={titleId}>{title}</h2>
        <p id={messageId}>{message}</p>
        <div className="gom-confirm-dialog-actions">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onCancel}
            disabled={busy}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`btn btn-${confirmVariant}`}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy && <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />}
            {busy ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
