import React, { useState } from "react";
import { useAuth } from "../auth/AuthProvider.jsx";

export default function AccountAuthPanel() {
  const { user, logout } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    setBusy(true);
    setError("");
    try {
      await logout();
      window.location.assign("/");
    } catch (e) {
      setError(e?.message || "Sign out failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!user) return null;
  return (
    <section className="gom-account-auth-panel" aria-label="Account details">
      {user.pictureUrl ? <img src={user.pictureUrl} alt="" width="56" height="56" referrerPolicy="no-referrer" /> : null}
      <div>
        <strong>{[user.firstName, user.lastName].filter(Boolean).join(" ") || "Garden of Mercy account"}</strong>
        <div>{user.email}</div>
      </div>
      <button type="button" onClick={handleLogout} disabled={busy}>
        {busy ? "Signing out…" : "Sign out"}
      </button>
      {error ? <p role="alert">{error}</p> : null}
    </section>
  );
}
