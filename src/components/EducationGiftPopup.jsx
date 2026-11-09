import React, { useCallback } from "react";
import PopupModal from "./PopupModal";

export default function EducationGiftPopup({ onClose, navigate }) {
  const handleDonate = useCallback(() => {
    onClose();
    navigate?.("/donate?amount=30&currency=USD&purpose=children&frequency=one-time#donation-form");
  }, [navigate, onClose]);

  return (
    <PopupModal
      titleId="education-popup-title"
      onClose={onClose}
      size="md"
    >
      <div className="modal-header border-0 pb-0">
        <span className="badge text-bg-success rounded-pill">
          Give the Gift of Education
        </span>
        <button
          type="button"
          className="btn-close ms-auto"
          onClick={onClose}
          aria-label="Close education donation message"
        />
      </div>

      <div className="modal-body p-4 p-md-5">
        <div
          className="d-flex align-items-center justify-content-center bg-success-subtle text-success rounded-4 mb-4"
          style={{ height: 64, width: 64 }}
          aria-hidden="true"
        >
          <i className="bi bi-mortarboard-fill fs-1" />
        </div>

        <h2 id="education-popup-title" className="h2 fw-bold lh-sm mb-3">
          Help a child take the next step.
        </h2>

        <p className="text-secondary mb-4">
          A $30 gift can help provide school fees and learning essentials.
        </p>

        <div className="bg-light border rounded-4 p-3 p-md-4 mb-4">
          <div className="d-flex align-items-baseline gap-2">
            <span className="display-4 fw-bold text-success">$30</span>
            <span className="text-secondary">toward a child’s education</span>
          </div>
          <p className="small text-secondary mb-0 mt-2">
            Support is directed according to each child’s needs and available program resources.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-success btn-lg w-100 rounded-pill"
          onClick={handleDonate}
        >
          Support a Child
          <i className="bi bi-arrow-right ms-2" aria-hidden="true" />
        </button>

        <button
          type="button"
          className="btn btn-link text-secondary text-decoration-none w-100 mt-2"
          onClick={onClose}
        >
          Maybe later
        </button>
      </div>
    </PopupModal>
  );
}
