import React, { useEffect, useMemo, useRef, useState } from "react";
import "../css/donate.css";
import { startDonation } from "../services/api.js";
import { validateDonation } from "../services/donation-validation.js";
import InlineFeedback from "../components/ux/InlineFeedback.jsx";

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
  const [form, setForm] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedCurrency = params.get("currency");
    const currency = ["UGX", "USD"].includes(requestedCurrency) ? requestedCurrency : "UGX";
    const rawAmount = params.get("amount");
    const requestedAmount = rawAmount === null ? NaN : Number(rawAmount);
    const validAmount = Number.isFinite(requestedAmount) && requestedAmount > 0 && requestedAmount <= 100000000;
    const purpose = ["general", "children", "community", "emergency"].includes(params.get("purpose"))
      ? params.get("purpose")
      : "general";
    const frequency = ["one-time", "monthly"].includes(params.get("frequency"))
      ? params.get("frequency")
      : "one-time";

    return {
    amount: validAmount ? String(requestedAmount) : currency === "USD" ? "25" : "25000",
    currency,
    purpose,
    frequency,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    };
  });

  const [status, setStatus] = useState({ type: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [invalidField, setInvalidField] = useState("");
  const submissionLock = useRef(false);
  const formRef = useRef(null);

  const focusInvalidField = (fieldName) => {
    setInvalidField(fieldName);
    requestAnimationFrame(() => {
      formRef.current?.querySelector(`[name="${fieldName}"]`)?.focus();
    });
  };

  useEffect(() => {
    if (window.location.hash === "#donation-form") {
      requestAnimationFrame(() => {
        document.getElementById("donation-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, []);

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
    setInvalidField("");
  };

  const changeCurrency = (event) => {
    const currency = event.target.value;

    setForm((previous) => ({
      ...previous,
      currency,
      amount: currency === "UGX" ? "25000" : "25",
    }));

    setStatus({ type: "", message: "" });
    setInvalidField("");
  };

  const chooseAmount = (amount) => {
    setForm((previous) => ({
      ...previous,
      amount: String(amount),
    }));

    setStatus({ type: "", message: "" });
    setInvalidField("");
  };

  async function submit(event) {
    event.preventDefault();
    if (submissionLock.current) return;
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
      const fieldName = validationError.includes("amount")
        ? "amount"
        : validationError.includes("full name")
          ? "firstName"
          : validationError.includes("email")
            ? "email"
            : "email";
      focusInvalidField(fieldName);
      return;
    }

    if (!form.email.trim() && !form.phone.trim()) {
      setStatus({
        type: "error",
        message: "Please provide an email address or phone number.",
      });
      focusInvalidField("email");
      return;
    }

    setInvalidField("");

    submissionLock.current = true;
    setBusy(true);

    try {
      const result = await startDonation(donationData);

      const checkoutUrl = typeof result?.checkoutUrl === "string"
        ? new URL(result.checkoutUrl)
        : null;
      const allowedHosts = (import.meta.env.VITE_PAYMENT_CHECKOUT_HOSTS || "")
        .split(",")
        .map((host) => host.trim().toLowerCase())
        .filter(Boolean);

      if (
        !checkoutUrl ||
        checkoutUrl.protocol !== "https:" ||
        !allowedHosts.includes(checkoutUrl.hostname.toLowerCase()) ||
        checkoutUrl.username ||
        checkoutUrl.password
      ) {
        throw new Error(
          "We could not verify the secure payment destination. Please contact the foundation before trying again.",
        );
      }

      window.location.assign(checkoutUrl.href);
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error?.message ||
          "We could not start your donation. Please try again later.",
      });

      submissionLock.current = false;
      setBusy(false);
    }
  }

  return (
    <div className="donate-page">
      {/* Donation hero */}
      <section className="donate-hero" aria-labelledby="donate-hero-title">
        <div className="donate-overlay" aria-hidden="true" />

        <div className="container donate-hero-content">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div className="donate-hero-copy">
                <span className="donate-hero-eyebrow">
                  <span className="donate-hero-eyebrow-dot" aria-hidden="true" />
                  GARDEN OF MERCY FOUNDATION
                </span>

                <h1 id="donate-hero-title" className="donate-hero-title">
                  Sow a seed of <em>mercy.</em>
                  <span>Help hope take root.</span>
                </h1>

                <p className="donate-intro">
                  Your generosity can help children access education, support
                  vulnerable families and strengthen communities. Together,
                  we can turn compassion into practical care and lasting hope.
                </p>

                <div className="donate-hero-actions">
                  <a className="btn donate-hero-primary" href="#donation-form">
                    Give today
                    <i className="bi bi-arrow-up-right ms-2" aria-hidden="true" />
                  </a>
                  <a className="btn donate-hero-secondary" href="#ways-to-give">
                    Ways to give
                  </a>
                </div>

              </div>
            </div>

            <div className="col-lg-5">
              <article className="donate-hero-feature">
                <div className="donate-hero-feature-top">
                  <span className="donate-hero-feature-icon" aria-hidden="true">
                    <i className="bi bi-book-half" />
                  </span>
                  <span className="donate-hero-feature-label">
                    THE POWER OF A GIFT
                  </span>
                </div>

                <p className="donate-hero-feature-amount">$30</p>
                <h2>A step towards a child’s education.</h2>
                <p className="donate-hero-feature-copy">
                  A gift of $30 can help a child go to school. Your support
                  helps open the door to learning, opportunity and a brighter
                  future.
                </p>

                <a href="/donate?amount=30&currency=USD&purpose=children&frequency=one-time#donation-form" className="donate-hero-feature-link">
                  Make this gift
                  <i className="bi bi-arrow-right" aria-hidden="true" />
                </a>

                <span className="donate-hero-feature-watermark" aria-hidden="true">
                  <i className="bi bi-flower1" />
                </span>
              </article>
              <p className="donate-hero-caption">
                <i className="bi bi-heart-fill me-2" aria-hidden="true" />
                Every act of mercy can plant a seed of hope.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Donation form and payment information */}
      <section id="donation-form" className="py-5 donation-section" aria-labelledby="donation-form-title">
        <div className="container">
          <div className="row g-4 g-lg-5 align-items-start">
            <div className="col-lg-7">
              <div className="donation-card p-4 p-md-5">
                <div className="mb-4">
                  <div className="icon-circle mb-3" aria-hidden="true">
                    <i className="bi bi-heart-fill" />
                  </div>

                  <h2 id="donation-form-title" className="h3 fw-bold">Plan your donation</h2>

                  <p className="text-secondary mb-0">
                    Choose an amount and tell us how you would like your
                    contribution to be used.
                  </p>
                </div>

                <form ref={formRef} onSubmit={submit} noValidate aria-busy={busy}>
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
                        aria-invalid={invalidField === "amount"}
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
                        aria-invalid={invalidField === "firstName"}
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
                        aria-invalid={invalidField === "email"}
                        required={!form.phone.trim()}
                        aria-describedby="donor-contact-help"
                        autoCapitalize="none"
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
                        inputMode="tel"
                        value={form.phone}
                        onChange={update}
                        aria-invalid={invalidField === "phone"}
                        required={!form.email.trim()}
                      />
                      <div className="form-text" id="donor-contact-help">
                        Provide at least one contact method so we can identify your donation.
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
                    <InlineFeedback type={status.type || "info"} message={status.message} className="mb-3" />
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
              <div id="ways-to-give" className="donation-aside p-4 p-md-5 rounded-4">
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
    </div>
  );
}

export default Donate;
