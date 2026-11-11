import React, { useState } from "react";
import { API_ORIGIN } from "../services/api-config.js";
import InlineFeedback from "../components/ux/InlineFeedback.jsx";
import "../css/auth-experience.css";

async function postAuth(path, payload) {
  let response;
  try {
    response = await fetch(`${API_ORIGIN}${path}`, {
      method: "POST",
      credentials: "include",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("We could not reach the secure account service. Check your connection and try again.");
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || data.error || (
      response.status === 429
        ? "Too many attempts. Please wait before trying again."
        : response.status >= 500
          ? "The account service is temporarily unavailable. Please try again shortly."
          : "We could not complete this request. Please check your details and try again."
    ));
  }
  return data;
}

function PasswordRecovery({ navigate, mode = "forgot" }) {
  const token = new URLSearchParams(window.location.search).get("token") || "";
  const isReset = mode === "reset";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState(null);

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setFeedback(null);

    if (isReset) {
      if (!token) {
        setFeedback({ type: "error", message: "This password-reset link is missing its token. Request a new link to continue." });
        return;
      }
      if (password.length < 12 || password.length > 128) {
        setFeedback({ type: "error", message: "Choose a password between 12 and 128 characters." });
        return;
      }
      if (password !== confirmPassword) {
        setFeedback({ type: "error", message: "The passwords do not match. Please check them and try again." });
        return;
      }
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFeedback({ type: "error", message: "Enter a valid email address." });
      return;
    }

    setBusy(true);
    try {
      const result = await postAuth(
        isReset ? "/auth/password/reset" : "/auth/password/forgot",
        isReset ? { token, password } : { email: email.trim() },
      );
      setFeedback({
        type: "success",
        message: result.message || (isReset
          ? "Your password has been updated. Please sign in again."
          : "If an active account matches that email, password-reset instructions will be sent."),
      });
      if (isReset) {
        setPassword("");
        setConfirmPassword("");
      } else {
        setEmail("");
      }
    } catch (error) {
      setFeedback({ type: "error", message: error.message || "We could not complete this request." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="gom-auth-page container py-5">
      <section className="gom-auth-card mx-auto">
        <div className="gom-auth-brand-mark" aria-hidden="true">
          <i className={isReset ? "bi bi-shield-lock" : "bi bi-envelope-check"} />
        </div>
        <span className="gom-auth-eyebrow">ACCOUNT SECURITY</span>
        <h1 className="h2 fw-bold mt-2">{isReset ? "Choose a new password" : "Reset your password"}</h1>
        <p className="text-secondary">
          {isReset
            ? "Create a new password for your staff account. You will need to sign in again after it is updated."
            : "Enter the email address associated with your staff account. If an active account matches, we will send a time-limited reset link."}
        </p>

        {feedback && <InlineFeedback type={feedback.type} message={feedback.message} className="mb-3" />}

        <form onSubmit={submit} noValidate>
          {isReset ? (
            <>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="new-password">New password</label>
                <input
                  id="new-password"
                  className="form-control form-control-lg"
                  type="password"
                  autoComplete="new-password"
                  minLength={12}
                  maxLength={128}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <div className="form-text">Use at least 12 characters. Maximum 128 characters.</div>
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold" htmlFor="confirm-password">Confirm new password</label>
                <input
                  id="confirm-password"
                  className="form-control form-control-lg"
                  type="password"
                  autoComplete="new-password"
                  minLength={12}
                  maxLength={128}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
              </div>
            </>
          ) : (
            <div className="mb-4">
              <label className="form-label fw-semibold" htmlFor="recovery-email">Email address</label>
              <input
                id="recovery-email"
                className="form-control form-control-lg"
                type="email"
                autoComplete="email"
                maxLength={254}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
          )}

          <button type="submit" className="btn btn-success btn-lg w-100" disabled={busy || (isReset && !token)}>
            {busy ? (
              <><span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />Please wait…</>
            ) : isReset ? "Update password" : "Send reset instructions"}
          </button>
        </form>

        <div className="d-flex flex-wrap justify-content-between gap-2 mt-4">
          <a href="/login" onClick={(event) => { event.preventDefault(); navigate?.("/login"); }} className="link-secondary small">
            <i className="bi bi-arrow-left me-1" />Back to sign in
          </a>
          {!isReset && <a href="/contact" onClick={(event) => { event.preventDefault(); navigate?.("/contact"); }} className="small">Need help?</a>}
        </div>
      </section>
    </div>
  );
}

export default PasswordRecovery;
