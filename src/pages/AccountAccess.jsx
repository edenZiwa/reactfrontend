import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider.jsx";
import "../css/auth-experience.css";

const STAFF_ROLES = [
  "super_admin",
  "admin",
  "staff",
  "finance",
  "programs",
  "volunteers",
  "communications",
];

const MEMBER_BENEFITS = [
  {
    icon: "bi-clipboard-check",
    title: "Follow your applications",
    description: "Keep track of volunteer and programme applications.",
  },
  {
    icon: "bi-heart",
    title: "Stay connected to impact",
    description: "View sponsorship updates and your giving history.",
  },
  {
    icon: "bi-people",
    title: "Manage your involvement",
    description: "Keep your community and volunteer activity together.",
  },
];

function AccountAccess({ navigate }) {
  const { login, user, status, authError, clearAuthError, refreshSession } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status !== "authenticated") return;
    const isStaff = user?.roles?.some((role) => STAFF_ROLES.includes(role));
    navigate?.(isStaff ? "/admin" : "/account");
  }, [status, user, navigate]);

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
      const signedInUser = await login();
      if (signedInUser) {
        const isStaff = signedInUser.roles?.some((role) => STAFF_ROLES.includes(role));
        navigate?.(isStaff ? "/admin" : "/account");
      }
      // A null result means Firebase has started its redirect sign-in flow.
    } catch (err) {
      setError(err?.message || "We could not complete sign-in. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const message = error || authError;

  return (
    <main className="gom-login-page" id="main-content">
      <div className="container gom-login-container">
        <div className="gom-login-heading text-center">
          <span className="gom-auth-eyebrow">
            <span className="gom-login-eyebrow-dot" aria-hidden="true" />
            YOUR GARDEN OF MERCY ACCOUNT
          </span>
          <h1>Welcome back.</h1>
          <p>Sign in to stay connected with the people and programmes you support.</p>
        </div>

        <div className="gom-login-layout">
          <section className="gom-login-story" aria-labelledby="gom-login-story-title">
            <div className="gom-login-story-mark" aria-hidden="true">
              <i className="bi bi-flower1" />
            </div>
            <span className="gom-login-kicker">SOWING SEEDS OF MERCY AND COMPASSION</span>
            <h2 id="gom-login-story-title">Your kindness is part of a bigger story.</h2>
            <p className="gom-login-story-copy">
              Your account brings your connection with Garden of Mercy Foundation into one place,
              so you can follow your involvement and the difference we are making together.
            </p>

            <div className="gom-login-benefits">
              {MEMBER_BENEFITS.map((benefit) => (
                <div className="gom-login-benefit" key={benefit.title}>
                  <span className="gom-login-benefit-icon" aria-hidden="true">
                    <i className={`bi ${benefit.icon}`} />
                  </span>
                  <span>
                    <strong>{benefit.title}</strong>
                    <small>{benefit.description}</small>
                  </span>
                </div>
              ))}
            </div>
            <p className="gom-login-scripture">
              “Whatever you did for one of the least of these brothers and sisters of mine,
              you did for me.” <span>Matthew 25:40</span>
            </p>
          </section>

          <section className="gom-login-panel" aria-labelledby="gom-login-panel-title">
            <div className="gom-login-panel-heading">
              <span className="gom-login-panel-icon" aria-hidden="true">
                <i className="bi bi-person-check" />
              </span>
              <div>
                <span className="gom-login-panel-kicker">MEMBER ACCESS</span>
                <h2 id="gom-login-panel-title">Sign in to your account</h2>
              </div>
            </div>

            <p className="gom-login-panel-intro">
              Use your Google account to securely access your foundation profile.
            </p>

            {message && (
              <div
                className={status === "unavailable" ? "alert alert-warning" : "alert alert-danger"}
                role="alert"
                aria-live="polite"
              >
                {message}
              </div>
            )}

            {status === "unavailable" ? (
              <div className="gom-login-unavailable">
                <i className="bi bi-cloud-slash" aria-hidden="true" />
                <strong>We could not check your session</strong>
                <p>This may be a temporary connection issue. Your account has not been deleted.</p>
                <button
                  type="button"
                  className="btn btn-outline-success btn-lg w-100"
                  onClick={retrySessionCheck}
                  disabled={busy}
                >
                  {busy ? "Checking session…" : "Try again"}
                </button>
              </div>
            ) : status === "loading" ? (
              <div className="gom-auth-status" role="status" aria-live="polite">
                <span className="spinner-border spinner-border-sm text-success" aria-hidden="true" />
                <span>Checking your secure session…</span>
              </div>
            ) : (
              <button
                type="button"
                className="gom-login-google-button"
                onClick={continueWithGoogle}
                disabled={busy}
              >
                {busy ? (
                  <span className="spinner-border spinner-border-sm" aria-hidden="true" />
                ) : (
                  <svg width="21" height="21" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
                    <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.7c3.9-3.6 6-8.9 6-15Z" />
                    <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.7-5.1c-1.8 1.2-4.1 2-6.8 2-5.2 0-9.6-3.5-11.2-8.2H5.9v5.3A20 20 0 0 0 24 44Z" />
                    <path fill="#FBBC05" d="M12.8 27.8a12 12 0 0 1 0-7.6v-5.3H5.9a20 20 0 0 0 0 18.2l6.9-5.3Z" />
                    <path fill="#EA4335" d="M24 12.1c3 0 5.7 1 7.8 3.1l5.8-5.8A19.4 19.4 0 0 0 24 4a20 20 0 0 0-18.1 10.9l6.9 5.3c1.6-4.7 6-8.1 11.2-8.1Z" />
                  </svg>
                )}
                <span>{busy ? "Connecting securely…" : "Continue with Google"}</span>
                {!busy && <i className="bi bi-arrow-up-right ms-auto" aria-hidden="true" />}
              </button>
            )}

            <div className="gom-login-account-note">
              <i className="bi bi-stars" aria-hidden="true" />
              <p>
                <strong>First time here?</strong> Your community account is created automatically
                after your first verified Google sign-in. No separate registration form is needed.
              </p>
            </div>

            <div className="gom-login-security">
              <i className="bi bi-shield-lock" aria-hidden="true" />
              <span>
                Secure sign-in. Your Google password is never shared with Garden of Mercy Foundation.
              </span>
            </div>

            <div className="gom-login-divider"><span>Need assistance?</span></div>
            <p className="gom-login-help">
              If you have trouble accessing your account, <a href="/contact" onClick={(event) => {
                event.preventDefault();
                navigate?.("/contact");
              }}>contact our team</a>.
            </p>

            <div className="gom-login-staff">
              <div>
                <strong>Foundation staff?</strong>
                <span>Staff and administrators use a separate secure sign-in.</span>
              </div>
              <a href="/admin" aria-label="Go to staff and administrator sign-in">
                Staff sign-in <i className="bi bi-arrow-right" aria-hidden="true" />
              </a>
            </div>
          </section>
        </div>

        <div className="gom-login-back">
          <a href="/" onClick={(event) => {
            event.preventDefault();
            navigate?.("/");
          }}>
            <i className="bi bi-arrow-left" aria-hidden="true" /> Back to Garden of Mercy website
          </a>
          <span>Compassion. Dignity. Accountability.</span>
        </div>
      </div>
    </main>
  );
}

export default AccountAccess;
