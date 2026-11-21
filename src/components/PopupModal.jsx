import React, { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function PopupModal({
  titleId,
  descriptionId,
  onClose,
  children,
  size = "lg",
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const dialog = dialogRef.current;
    const focusable = dialog?.querySelector(FOCUSABLE_SELECTOR);
    focusable?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialog) return;

      const items = Array.from(dialog.querySelectorAll(FOCUSABLE_SELECTOR))
        .filter((item) => item.getClientRects().length > 0);
      if (!items.length) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [onClose]);

  return (
    <>
      <div className="modal-backdrop show" aria-hidden="true" />

      <div className="modal show d-block" role="presentation">
        <div
          ref={dialogRef}
          className={`modal-dialog modal-dialog-centered modal-${size} modal-dialog-scrollable`}
          role="dialog"
          tabIndex={-1}
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <div className="modal-content border-0 rounded-4 shadow-lg">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
