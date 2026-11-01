import React, { useMemo, useState } from "react";
import "../css/donate.css";
import { startDonation } from "../services/api.js";
import { validateDonation } from "../services/donation-validation.js";

const AMOUNTS = {
  UGX: [10000, 25000, 50000, 100000],
  USD: [10, 25, 50, 100],
};

const PURPOSES = {
  general: "Where the need is greatest",
  children: "Children and education",
  community: "Community support",
  emergency: "Emergency assistance",
};

const formatAmount = (amount, currency) =>
  new Intl.NumberFormat(currency === "UGX" ? "en-UG" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "UGX" ? 0 : 2,
  }).format(Number(amount) || 0);

function Donate() {
  const [form, setForm] = useState({
    amount: "25000",
    currency: "UGX",
    purpose: "general",
    frequency: "one-time",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [status, setStatus] = useState({ type: "", message: "" });
  const [busy, setBusy] = useState(false);

  const donorName = [form.firstName.trim(), form.lastName.trim()]
    .filter(Boolean)
    .join(" ");

  const selectedAmounts = AMOUNTS[form.currency];

  const summaryAmount = useMemo(
    () => formatAmount(form.amount, form.currency),
    [form.amount, form.currency],
  );

  const update = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setStatus({ type: "", message: "" });
  };

  const changeCurrency = (event) => {
    const currency = event.target.value;

    setForm((previous) => ({
      ...previous,
      currency,
      amount: currency === "UGX" ? "25000" : "25",
    }));

    setStatus({ type: "", message: "" });
  };

  const chooseAmount = (amount) => {
    setForm((previous) => ({
      ...previous,
      amount: String(amount),
    }));

    setStatus({ type: "", message: "" });
  };

  async function submit(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    const donationData = {
      ...form,
      name: donorName,
      amount: Number(form.amount),
    };

    const validationError = validateDonation(donationData);

    if (validationError) {
      setStatus({
        type: "error",
        message: validationError,
      });
      return;
    }

    if (!form.email.trim() && !form.phone.trim()) {
      setStatus({
        type: "error",
        message: "Please provide an email address or phone number.",
      });
      return;
    }

    setBusy(true);

    try {
      const result = await startDonation(donationData);

      if (
        !result?.checkoutUrl ||
        typeof result.checkoutUrl !== "string" ||
        !/^https:\/\//i.test(result.checkoutUrl)
      ) {
        throw new Error(
          "The payment provider did not return a valid secure checkout link. Please contact the foundation.",
        );
      }

      window.location.assign(result.checkoutUrl);
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error?.message ||
          "We could not start your donation. Please try again later.",
      });

      setBusy(false);
    }
  }

  return (
    <main id="main-content" className="donate-page">
      {/* Donation hero */}
      <section className="donate-hero py-5">
        <div className="donate-overlay" aria-hidden="true" />

        <div className="container text-white py-lg-4 donate-hero-content">
          <span className="section-label eyebrow eyebrow-light">
            <span className="eyebrow-dot" />
            SUPPORT THE MISSION
          </span>

          <h1 className="display-5 fw-bold mt-3">
            Sow a seed of <em>mercy.</em>
          </h1>

          <p className="donate-intro text-white">
            Your generosity can help provide practical support, restore hope
            and build stronger communities.
          </p>

          <div className="d-flex flex-wrap gap-3 mt-4 donate-hero-values">
            <span>
              <i className="bi bi-heart-fill me-2" aria-hidden="true" />
              Compassion
            </span>
            <span>
              <i className="bi bi-people-fill me-2" aria-hidden="true" />
              Community
            </span>
            <span>
              <i className="bi bi-shield-check me-2" aria-hidden="true" />
              Responsible giving
            </span>
          </div>
        </div>
      </section>

      {/* Donation form and payment information */}
      <section className="py-5 donation-section">
        <div className="container">
          <div className="row g-4 g-lg-5 align-items-start">
            <div className="col-lg-7">
              <div className="donation-card p-4 p-md-5">
                <div className="mb-4">
                  <div className="icon-circle mb-3" aria-hidden="true">
                    <i className="bi bi-heart-fill" />
                  </div>

                  <h2 className="h3 fw-bold">Plan your donation</h2>

                  <p className="text-secondary mb-0">
                    Choose an amount and tell us how you would like your
                    contribution to be used.
                  </p>
                </div>

                <form onSubmit={submit} noValidate>
                  {/* Currency */}
                  <fieldset className="mb-4">
                    <legend className="form-label fw-semibold">
                      1. Choose your currency
                    </legend>

                    <div className="d-flex flex-wrap gap-2">
                      <React.Fragment>
                        <input
                          className="btn-check"
                          type="radio"
                          name="currency"
                          id="currency-ugx"
                          value="UGX"
                          checked={form.currency === "UGX"}
                          onChange={changeCurrency}
                        />
                        <label
                          className="btn btn-outline-success donation-choice"
                          htmlFor="currency-ugx"
                        >
                          UGX — Uganda shillings
                        </label>
                      </React.Fragment>

                      <React.Fragment>
                        <input
                          className="btn-check"
                          type="radio"
                          name="currency"
                          id="currency-usd"
                          value="USD"
                          checked={form.currency === "USD"}
                          onChange={changeCurrency}
                        />
                        <label
                          className="btn btn-outline-success donation-choice"
                          htmlFor="currency-usd"
                        >
                          USD — US dollars
                        </label>
                      </React.Fragment>
                    </div>
                  </fieldset>

                  {/* Preset and custom amounts */}
                  <fieldset className="mb-4">
                    <legend className="form-label fw-semibold">
                      2. Choose an amount
                    </legend>

                    <div className="amount-grid">
                      {selectedAmounts.map((amount) => {
                        const selected = Number(form.amount) === amount;

                        return (
                          <button
                            key={amount}
                            className={`amount-option ${
                              selected ? "active" : ""
                            }`}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => chooseAmount(amount)}
                          >
                            {new Intl.NumberFormat(
                              form.currency === "UGX" ? "en-UG" : "en-US",
                            ).format(amount)}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-3">
                      <label
                        className="form-label fw-semibold"
                        htmlFor="custom-amount"
                      >
                        Or enter another amount
                      </label>

                      <input
                        className="form-control form-control-lg"
                        type="number"
                        id="custom-amount"
                        name="amount"
                        min="1"
                        step={form.currency === "UGX" ? "1" : "0.01"}
                        inputMode="decimal"
                        placeholder="Enter amount"
                        value={form.amount}
                        onChange={update}
                        required
                        aria-describedby="amount-help"
                      />

                      <div className="form-text" id="amount-help">
                        Enter an amount in{" "}
                        {form.currency === "UGX"
                          ? "Uganda shillings"
                          : "US dollars"}.
                      </div>
                    </div>
                  </fieldset>

                  {/* Frequency */}
                  <fieldset className="mb-4">
                    <legend className="form-label fw-semibold">
                      3. How often would you like to give?
                    </legend>

                    <div className="d-flex flex-wrap gap-2">
                      <input
                        className="btn-check"
                        type="radio"
                        name="frequency"
                        id="frequency-once"
                        value="one-time"
                        checked={form.frequency === "one-time"}
                        onChange={update}
                      />
                      <label
                        className="btn btn-outline-success donation-choice"
                        htmlFor="frequency-once"
                      >
                        One-time
                      </label>

                      <input
                        className="btn-check"
                        type="radio"
                        name="frequency"
                        id="frequency-monthly"
                        value="monthly"
                        checked={form.frequency === "monthly"}
                        onChange={update}
                      />
                      <label
                        className="btn btn-outline-success donation-choice"
                        htmlFor="frequency-monthly"
                      >
                        Monthly
                      </label>
                    </div>

                    <div className="form-text mt-2">
                      Monthly giving is a preference only. Recurring payments
                      are not activated on this page.
                    </div>
                  </fieldset>

                  {/* Purpose */}
                  <div className="mb-4">
                    <label
                      className="form-label fw-semibold"
                      htmlFor="donation-purpose"
                    >
                      4. Where would you like to help?
                    </label>

                    <select
                      className="form-select form-select-lg"
                      id="donation-purpose"
                      name="purpose"
                      value={form.purpose}
                      onChange={update}
                      required
                    >
                      <option value="general">
                        Where the need is greatest
                      </option>
                      <option value="children">
                        Children and education
                      </option>
                      <option value="community">Community support</option>
                      <option value="emergency">Emergency assistance</option>
                    </select>
                  </div>

                  {/* Donor details */}
                  <fieldset className="mb-4">
                    <legend className="form-label fw-semibold">
                      5. Your contact details
                    </legend>

                    <div className="mb-3">
                      <label
                        htmlFor="donor-first-name"
                        className="form-label"
                      >
                        First name
                      </label>
                      <input
                        className="form-control"
                        id="donor-first-name"
                        name="firstName"
                        autoComplete="given-name"
                        maxLength={80}
                        value={form.firstName}
                        onChange={update}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="donor-last-name"
                        className="form-label"
                      >
                        Last name (optional)
                      </label>
                      <input
                        className="form-control"
                        id="donor-last-name"
                        name="lastName"
                        autoComplete="family-name"
                        maxLength={80}
                        value={form.lastName}
                        onChange={update}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="donor-email" className="form-label">
                        Email address
                      </label>
                      <input
                        className="form-control"
                        type="email"
                        id="donor-email"
                        name="email"
                        autoComplete="email"
                        maxLength={254}
                        value={form.email}
                        onChange={update}
                        required={!form.phone.trim()}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="donor-phone" className="form-label">
                        Phone number
                      </label>
                      <input
                        className="form-control"
                        type="tel"
                        id="donor-phone"
                        name="phone"
                        autoComplete="tel"
                        maxLength={30}
                        value={form.phone}
                        onChange={update}
                        required={!form.email.trim()}
                      />
                      <div className="form-text">
                        Provide an email address or phone number.
                      </div>
                    </div>
                  </fieldset>

                  {/* Live summary */}
                  <div
                    className="donation-summary p-4 rounded-3 mb-4"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    <span className="text-secondary small">
                      YOUR PROPOSED CONTRIBUTION
                    </span>

                    <div className="summary-amount fw-bold mt-2">
                      {summaryAmount}
                    </div>

                    <div className="text-secondary mt-1">
                      {form.frequency === "monthly"
                        ? "Monthly preference"
                        : "One-time donation"}
                    </div>

                    <div className="text-secondary small mt-2">
                      {PURPOSES[form.purpose]}
                    </div>
                  </div>

                  {status.message && (
                    <div
                      className={`alert ${
                        status.type === "error"
                          ? "alert-danger"
                          : "alert-success"
                      }`}
                      role="alert"
                    >
                      {status.message}
                    </div>
                  )}

                  <button
                    className="btn btn-success btn-lg w-100 donation-submit"
                    type="submit"
                    disabled={busy}
                  >
                    {busy ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          aria-hidden="true"
                        />
                        Connecting securely...
                      </>
                    ) : (
                      <>
                        Continue to secure payment
                        <i
                          className="bi bi-arrow-up-right ms-2"
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </button>

                  <p className="small text-secondary text-center mt-3 mb-0">
                    Your payment details are entered on the payment provider’s
                    secure checkout page.
                  </p>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="col-lg-5">
              <div className="donation-aside p-4 p-md-5 rounded-4">
                <div className="icon-circle mb-3" aria-hidden="true">
                  <i className="bi bi-flower1" />
                </div>

                <h2 className="h4 fw-bold">Your kindness matters</h2>

                <p className="text-secondary">
                  Every contribution can be an opportunity to show mercy,
                  serve people in need and strengthen communities.
                </p>

                <hr />

                <div className="d-flex align-items-start gap-3 mb-4">
                  <i
                    className="bi bi-phone text-success fs-3"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="h6 fw-bold">Mobile money</h3>
                    <p className="small text-secondary mb-1">
                      MTN merchant code: <strong>XXXXXXXX</strong>
                    </p>
                    <p className="small text-secondary mb-0">
                      Airtel merchant code: <strong>XXXXXXXX</strong>
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3 mb-4">
                  <i
                    className="bi bi-bank text-success fs-3"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="h6 fw-bold">Bank transfer</h3>
                    <p className="small text-secondary mb-1">
                      Stanbic Bank account: <strong>XXXXXXXXXXXX</strong>
                    </p>
                    <p className="small text-secondary mb-0">
                      Account name: Garden of Mercy Foundation
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <i
                    className="bi bi-shield-lock text-success fs-3"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="h6 fw-bold">Give with confidence</h3>
                    <p className="small text-secondary mb-0">
                      Verify official payment instructions before sending
                      money. Never share your mobile-money PIN or password.
                    </p>
                  </div>
                </div>

                <a
                  href="/contact"
                  className="btn btn-outline-success w-100 mt-4"
                >
                  <i
                    className="bi bi-chat-dots me-2"
                    aria-hidden="true"
                  />
                  Contact the Foundation
                </a>

                <p className="small text-secondary mt-3 mb-0">
                  “Sowing Seeds of Mercy and Compassion.”
                </p>
              </div>

              <div className="donation-trust-note mt-4 p-4 rounded-4">
                <i
                  className="bi bi-shield-check text-success fs-4"
                  aria-hidden="true"
                />
                <h3 className="h6 fw-bold mt-2">
                  Your security matters
                </h3>
                <p className="small text-secondary mb-0">
                  The payment provider and backend must confirm the transaction.
                  This page does not independently confirm that a donation has
                  been received.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Donate;
