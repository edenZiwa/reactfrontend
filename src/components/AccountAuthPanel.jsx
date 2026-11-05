import React, { useState } from "react";
import { useAuth } from "../auth/AuthProvider.jsx";

export default function AccountAuthPanel() {
  const { user, logout } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await logout();
      window.location.assign("/");
    } catch (err) {
      setError(err?.message || "Sign out failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!user) return null;
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ")
    || user.fullName || user.name || "Garden of Mercy account";

  return (
    <section className="d-flex flex-column flex-sm-row align-items-sm-center gap-3 justify-content-between border rounded-4 p-3 p-md-4 bg-body">
      <div className="d-flex align-items-center gap-3 min-w-0">
        {user.pictureUrl || user.photoURL ? (
          <img
            src={user.pictureUrl || user.photoURL}
            alt=""
            width="52"
            height="52"
            className="rounded-circle object-fit-cover flex-shrink-0"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="rounded-circle bg-success-subtle text-success d-inline-flex align-items-center justify-content-center fw-bold flex-shrink-0" style={{ width: 52, height: 52 }} aria-hidden="true">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <strong className="d-block text-body text-truncate">{name}</strong>
          <span className="small text-secondary text-break">{user.email || "Signed in to your account"}</span>
          <span className="d-block small text-success"><i className="bi bi-shield-check me-1" aria-hidden="true" />Secure account session</span>
        </div>
      </div>
      <div className="d-flex flex-column align-items-sm-end gap-1">
        <button type="button" className="btn btn-outline-success" onClick={handleLogout} disabled={busy}>
          <i className="bi bi-box-arrow-right me-2" aria-hidden="true" />
          {busy ? "Signing out…" : "Sign out"}
        </button>
        {error ? <span className="small text-danger" role="alert">{error}</span> : null}
      </div>
    </section>
  );
}
