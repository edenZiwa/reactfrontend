import React, { useCallback } from "react";
import PopupModal from "./PopupModal";

export default function EducationGiftPopup({ onClose, navigate }) {
  const handleDonate = useCallback(() => {
    onClose();
    navigate?.("/donate?amount=30&currency=USD&purpose=children&frequency=one-time#donation-form");
  }, [navigate, onClose]);

  const handleLearnMore = useCallback(() => {
    onClose();
    navigate?.("/programs");
  }, [navigate, onClose]);

  return (
    <PopupModal
      titleId="education-popup-title"
      descriptionId="education-popup-description"
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

      <div className="modal-body p-3 p-sm-4 p-md-5">
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

        <p id="education-popup-description" className="text-secondary mb-4">
          Your generosity can help vulnerable children access education, school supplies, and opportunities for a brighter future.
        </p>

        <div className="bg-body-tertiary border rounded-4 p-3 p-md-4 mb-4">
          <div className="d-flex flex-wrap align-items-baseline gap-2">
            <span className="display-4 fw-bold text-success">$30</span>
            <span className="text-body-secondary">A gift toward a child’s education</span>
          </div>
          <p className="small text-body-secondary mb-0 mt-2">
            Contributions support children according to individual needs and available program resources.
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
          className="btn btn-outline-secondary w-100 rounded-pill mt-2"
          onClick={handleLearnMore}
        >
          Learn About Our Programs
        </button>

        <button
          type="button"
          className="btn btn-link text-body-secondary text-decoration-none w-100 mt-2"
          onClick={onClose}
        >
          Maybe later
        </button>
      </div>
    </PopupModal>
  );
}
