import React, { useCallback } from "react";
import PopupModal from "./PopupModal";

export default function WelcomePopup({ onClose, navigate }) {
  const handleNavigate = useCallback(
    (path) => {
      onClose();
      navigate?.(path);
    },
    [navigate, onClose]
  );

  return (
    <PopupModal titleId="welcome-popup-title" onClose={onClose}>
      <div className="modal-header border-0 pb-0">
        <span className="badge text-bg-success rounded-pill">Welcome</span>
        <button
          type="button"
          className="btn-close ms-auto"
          onClick={onClose}
          aria-label="Close welcome message"
        />
      </div>

      <div className="modal-body p-4 p-md-5 pt-3">
        <div
          className="rounded-4 bg-success-subtle text-success d-flex align-items-center justify-content-center mb-4"
          style={{ width: 64, height: 64 }}
          aria-hidden="true"
        >
          <img src="/images/garden_of_mercy_logo.png" alt="" width="48" height="48" className="img-fluid" />
        </div>

        <h2 id="welcome-popup-title" className="h2 fw-bold lh-sm mb-3">
          Every seed of mercy makes a difference.
        </h2>

        <p className="text-secondary mb-4">
          Together, we bring hope and opportunity to vulnerable children and communities.
        </p>

        <button
          type="button"
          className="btn btn-success btn-lg w-100 rounded-pill"
          onClick={() => handleNavigate("/about")}
        >
          Discover Our Mission
          <i className="bi bi-arrow-right ms-2" aria-hidden="true" />
        </button>
      </div>

      <div className="modal-footer border-0 pt-0 justify-content-center">
        <p className="small text-secondary mb-2 text-center">
          Sowing Seeds of Mercy and Compassion.
        </p>
      </div>
    </PopupModal>
  );
}
