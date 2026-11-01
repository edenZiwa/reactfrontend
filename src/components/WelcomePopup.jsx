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
        <span className="badge text-bg-success rounded-pill">
          Welcome
        </span>

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
          <img src="../images/garden_of_mercy_logo.png" />
        </div>

        <p className="small text-success fw-bold text-uppercase mb-2">
          Garden of Mercy Foundation
        </p>

        <h2
          id="welcome-popup-title"
          className="h2 fw-bold lh-sm mb-3"
        >
          Welcome to a place where compassion creates hope.
        </h2>

        <p className="text-secondary mb-3">
          We believe every child deserves an opportunity to learn,
          every person deserves dignity, and every community deserves hope.
        </p>

        <p className="text-secondary mb-4">
          Through your kindness and generosity, we can support vulnerable
          children and communities and help create a brighter future.
        </p>

        <div className="d-grid gap-2">
          <button
            type="button"
            className="btn btn-success btn-lg rounded-pill"
            onClick={() => handleNavigate("/donate")}
          >
            <i className="bi bi-heart-fill me-2" aria-hidden="true" />
            Sow a Seed of Mercy
          </button>

          <button
            type="button"
            className="btn btn-outline-success rounded-pill"
            onClick={() => handleNavigate("/about")}
          >
            Discover Our Mission
          </button>

          <button
            type="button"
            className="btn btn-link text-secondary text-decoration-none"
            onClick={onClose}
          >
            Continue exploring
          </button>
        </div>
      </div>

      <div className="modal-footer border-0 pt-0 justify-content-center">
        <p className="small text-secondary mb-2 text-center">
          Sowing Seeds of Mercy and Compassion.
        </p>
      </div>
    </PopupModal>
  );
}