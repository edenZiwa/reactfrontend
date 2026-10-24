import React, { useEffect, useRef } from "react";

export default function PopupModal({
  titleId,
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
    const focusable = dialog?.querySelector(
      'button:not([disabled]), a[href], input:not([disabled]), [tabindex="0"]'
    );

    focusable?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }

      if (event.key === "Tab" && dialog) {
        const items = dialog.querySelectorAll(
          'button:not([disabled]), a[href], input:not([disabled]), [tabindex="0"]'
        );

        const first = items[0];
        const last = items[items.length - 1];

        if (!first || !last) return;

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === last
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;

      if (previousFocus?.isConnected) {
        previousFocus.focus();
      }
    };
  }, [onClose]);

  return (
    <>
      <div
        className="modal-backdrop show"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="modal show d-block"
        role="presentation"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            onClose();
          }
        }}
      >
        <div
          ref={dialogRef}
          className={`modal-dialog modal-dialog-centered modal-${size} modal-dialog-scrollable`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <div className="modal-content border-0 rounded-4 shadow-lg">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}