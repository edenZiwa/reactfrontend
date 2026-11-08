import React, { useEffect, useRef, useState } from "react";
import { PageIntro } from "../components/SiteChrome.jsx";
import { getDonationStatus, describeDonationStatus } from "../services/api.js";

function DonationResult({ navigate }) {
  const reference =
    new URLSearchParams(window.location.search).get("reference") || "";
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const requestLock = useRef(false);
  async function refreshStatus(signal) {
    if (!reference) {
      setError(
        "No donation reference was provided. Please use the link from your payment journey or return to the donation page.",
      );
      return;
    }
    if (requestLock.current) return;
    requestLock.current = true;
    setRefreshing(true);
    setError("");
    try {
      setResult(await getDonationStatus(reference, signal ? { signal } : {}));
    } catch (requestError) {
      if (requestError?.name === "AbortError") return;
      setError(
        requestError.message ||
          "We could not retrieve the donation status. Please try again.",
      );
    } finally {
      requestLock.current = false;
      setRefreshing(false);
    }
  }
  useEffect(() => {
    const controller = new AbortController();
    refreshStatus(controller.signal);
    return () => controller.abort();
  }, [reference]);

  useEffect(() => {
    if (!result || ["completed", "failed", "reversed"].includes(String(result.status || "").toLowerCase())) {
      return undefined;
    }

    let attempts = 0;
    const maxAttempts = 24;
    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      if (attempts >= maxAttempts) {
        window.clearInterval(timer);
        return;
      }
      attempts += 1;
      refreshStatus();
    }, 5000);

    return () => window.clearInterval(timer);
  }, [result?.status, reference]);
  const detail = describeDonationStatus(result?.status);
  return (
    <>
      <PageIntro
        eyebrow="DONATION UPDATE"
        title={
          <>
            Thank you for your <em>kindness.</em>
          </>
        }
        text="Your payment status is retrieved from the foundation’s backend, which verifies payment information with the provider."
      />
      <section className="result-layout">
        <div className={`result-card result-${detail.tone}`}>
          <span className="result-symbol" aria-hidden="true">
            {detail.tone === "success"
              ? "✓"
              : detail.tone === "error"
                ? "!"
                : "…"}
          </span>
          <h2>{detail.title}</h2>
          <p role={error ? "alert" : "status"} aria-live={error ? "assertive" : "polite"}>{error || detail.message}</p>
          {reference && (
            <p className="result-reference">
              <strong>Donation reference</strong>
              <br />
              <code>{reference}</code>
            </p>
          )}
          {result?.amount != null && (
            <p className="result-amount">
              <strong>Donation amount:</strong> {result.currency}{" "}
              {Number(result.amount).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </p>
          )}
          <div className="result-actions">
            <button
              className="button button-primary"
              type="button"
              onClick={() => refreshStatus()}
              disabled={refreshing || !reference}
              aria-live="polite"
            >
              {refreshing ? "Checking…" : "Check status again"}
            </button>
            <button
              className="button button-outline"
              type="button"
              onClick={() => navigate("/donate")}
            >
              Return to donations
            </button>
          </div>
          <small>
            Only a verified provider status can confirm a donation. A redirect
            alone is not proof of payment.
          </small>
        </div>
      </section>
    </>
  );
}

export default DonationResult;
