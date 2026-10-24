import React, { useCallback } from "react";
import PopupModal from "./PopupModal";

export default function EducationGiftPopup({ onClose, navigate }) {
  const handleDonate = useCallback(() => {
    onClose();
    navigate?.("/donate");
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
          style={{ height: 72, width: 72 }}
          aria-hidden="true"
        >
          <i className="bi bi-mortarboard-fill fs-1" />
        </div>

        <p className="text-success small fw-bold text-uppercase mb-2">
          Every child deserves a chance
        </p>

        <h2
          id="education-popup-title"
          className="h2 fw-bold lh-sm mb-3"
        >
          Your $30 gift can help a child go to school.
        </h2>

        <p className="text-secondary mb-4">
          Your generosity can help remove barriers to education and
          contribute toward school fees, learning materials, and other
          essential school-related needs.
        </p>

        <div className="bg-light border rounded-4 p-4 mb-4">
          <p className="small text-secondary text-uppercase fw-semibold mb-1">
            Your potential contribution
          </p>

          <div className="d-flex align-items-baseline gap-2">
            <span className="display-3 fw-bold text-success">$30</span>
            <span className="text-secondary">toward education</span>
          </div>

          <p className="small text-secondary mb-0 mt-2">
            The support provided depends on the child's needs and
            available program resources.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-success btn-lg w-100 rounded-pill"
          onClick={handleDonate}
        >
          <i className="bi bi-heart-fill me-2" aria-hidden="true" />
          Donate $30
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