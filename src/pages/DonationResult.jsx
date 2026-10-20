import React, { useEffect, useState } from "react";
import { PageIntro } from "../components/SiteChrome.jsx";
import { getDonationStatus, describeDonationStatus } from "../services/api.js";

function DonationResult({ navigate }) {
  const reference =
    new URLSearchParams(window.location.search).get("reference") || "";
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  async function refreshStatus() {
    if (!reference) {
      setError(
        "No donation reference was provided. Please use the link from your payment journey or return to the donation page.",
      );
      return;
    }
    setRefreshing(true);
    setError("");
    try {
      setResult(await getDonationStatus(reference));
    } catch (requestError) {
      setError(
        requestError.message ||
          "We could not retrieve the donation status. Please try again.",
      );
    } finally {
      setRefreshing(false);
    }
  }
  useEffect(() => {
    refreshStatus();
  }, [reference]);
  useEffect(() => {
    if (!result || ["completed", "failed", "reversed"].includes(result.status))
      return undefined;
    const timer = window.setInterval(() => {
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
          <p>{error || detail.message}</p>
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
              onClick={refreshStatus}
              disabled={refreshing}
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
