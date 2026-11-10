import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider.jsx";
import "../css/auth-experience.css";

function AccountAccess({ navigate }) {
  const { login, status, authError, clearAuthError, refreshSession } = useAuth();

  useEffect(() => {
    if (status === "authenticated") navigate?.("/account");
  }, [status, navigate]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function retrySessionCheck() {
    if (busy) return;
    setBusy(true);
    setError("");
    clearAuthError();
    try {
      await refreshSession();
    } catch (err) {
      setError(err?.message || "The account service is still unavailable. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function continueWithGoogle() {
    if (busy) return;
    setBusy(true);
    setError("");
    clearAuthError();
    try {
      const user = await login();
      if (user) navigate?.("/account");
      // A null result means the provider has started its redirect flow.
    } catch (err) {
      setError(err?.message || "We could not complete sign-in. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="gom-auth-page container py-5" id="main-content">
      <div className="gom-auth-card mx-auto">
        <div className="gom-auth-brand-mark" aria-hidden="true">
          <i className="bi bi-flower1" />
        </div>
        <span className="gom-auth-eyebrow">GARDEN OF MERCY FOUNDATION</span>
        <h1 className="h2 fw-bold mt-2">Your account, your impact</h1>
        <p className="text-secondary">
          Sign in to follow your applications, volunteer activity, programme registrations,
          sponsorship updates and donation history.
        </p>

        {(error || authError) && (
          <div className={status === "unavailable" ? "alert alert-warning" : "alert alert-danger"} role="alert">{error || authError}</div>
        )}

        {status === "unavailable" ? (
          <div className="d-grid gap-2">
            <p className="small text-secondary mb-1">
              We could not verify your account session. This does not mean you have been signed out.
            </p>
            <button type="button" className="btn btn-outline-success btn-lg" onClick={retrySessionCheck} disabled={busy}>
              {busy ? "Checking session…" : "Retry session check"}
            </button>
          </div>
        ) : status === "loading" ? (
          <div className="gom-auth-status" role="status">
            <span className="spinner-border spinner-border-sm text-success" aria-hidden="true" />
            <span>Checking your secure session…</span>
          </div>
        ) : (
          <button
            type="button"
            className="btn btn-success btn-lg w-100 d-flex align-items-center justify-content-center gap-3"
            onClick={continueWithGoogle}
            disabled={busy}
          >
            {busy ? (
              <span className="spinner-border spinner-border-sm" aria-hidden="true" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.7c3.9-3.6 6-8.9 6-15Z" />
                <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.7-5.1c-1.8 1.2-4.1 2-6.8 2-5.2 0-9.6-3.5-11.2-8.2H5.9v5.3A20 20 0 0 0 24 44Z" />
                <path fill="#FBBC05" d="M12.8 27.8a12 12 0 0 1 0-7.6v-5.3H5.9a20 20 0 0 0 0 18.2l6.9-5.3Z" />
                <path fill="#EA4335" d="M24 12.1c3 0 5.7 1 7.8 3.1l5.8-5.8A19.4 19.4 0 0 0 24 4a20 20 0 0 0-18.1 10.9l6.9 5.3c1.6-4.7 6-8.1 11.2-8.1Z" />
              </svg>
            )}
            {busy ? "Connecting securely…" : "Continue with Google"}
          </button>
        )}

        <div className="gom-auth-divider"><span>New to the foundation?</span></div>
        <p className="small text-secondary mb-4">
          Your first verified Google sign-in creates your community account automatically.
          Returning members can use the same button to sign in.
        </p>

        <div className="gom-auth-help">
          <i className="bi bi-shield-check text-success" aria-hidden="true" />
          <span>We use a secure server-side session. Your Google password is never shared with the foundation.</span>
        </div>

        <div className="d-flex flex-wrap justify-content-between gap-2 mt-4">
          <a href="/" onClick={(event) => { event.preventDefault(); navigate?.("/"); }} className="link-secondary small">
            <i className="bi bi-arrow-left me-1" />Back to website
          </a>
          <a href="/admin" className="small">Staff and administrator sign-in</a>
        </div>
      </div>
    </main>
  );
}

export default AccountAccess;
