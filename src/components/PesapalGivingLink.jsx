import React from "react";

/**
 * A secondary route to the Foundation's separate Pesapal hosted payment page.
 * Payments made there are not automatically matched to website donation records.
 */
export default function PesapalGivingLink({ className = "" }) {
  return (
    <div className={`mt-3 small ${className}`}>
      <span className="text-secondary d-block mb-2">
        Prefer Pesapal's hosted payment page? You can give there directly.
      </span>
      <a
        href="https://store.pesapal.com/gardenofmercy"
        className="link-success fw-semibold text-decoration-none"
        target="_blank"
        rel="noopener noreferrer"
      >
        Open Pesapal payment page
        <i className="bi bi-box-arrow-up-right ms-1" aria-hidden="true" />
      </a>
      <span className="text-secondary d-block mt-2">
        Keep your Pesapal confirmation and transaction reference. This separate
        payment is not yet automatically matched to website donation records.
      </span>
    </div>
  );
}
