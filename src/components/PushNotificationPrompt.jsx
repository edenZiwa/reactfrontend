import { useEffect, useState } from "react";
import { apiRequest } from "../services/api.js";
import { API_ORIGIN } from "../services/api-config.js";
import "./PushNotificationPrompt.css";

const DISMISS_KEY = "gom:push-prompt-dismissed";
const AUTO_DISMISS_MS = 7000;

function decodeKey(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function wasDismissed() {
  try { return sessionStorage.getItem(DISMISS_KEY) === "1"; } catch { return false; }
}
function markDismissed() {
  try { sessionStorage.setItem(DISMISS_KEY, "1"); } catch {}
}

export default function PushNotificationPrompt() {
  const [state, setState] = useState("checking");
  const [busy, setBusy] = useState(false);
  const [closing, setClosing] = useState(false);
  const preferences = { announcements: true, programs: true, events: true, impact: true };

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
      setState("unsupported");
      return;
    }
    if (Notification.permission === "denied") {
      setState("denied");
      return;
    }

    let cancelled = false;
    const update = (next) => { if (!cancelled) setState(next); };

    if (Notification.permission === "granted") {
      navigator.serviceWorker.ready.then(async (registration) => {
        const subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
          update(wasDismissed() ? "dismissed" : "ready");
          return;
        }
        try {
          const csrfResponse = await fetch(`${API_ORIGIN}/auth/csrf`, { credentials: "include", cache: "no-store" });
          if (!csrfResponse.ok) throw new Error("Could not obtain CSRF token.");
          const csrfData = await csrfResponse.json();
          if (!csrfData.csrfToken) throw new Error("Secure session token unavailable.");
          await apiRequest("/push/subscriptions", {
            method: "POST",
            headers: { "X-CSRF-Token": csrfData.csrfToken },
            body: JSON.stringify({ subscription: subscription.toJSON(), preferences }),
          });
          update("subscribed");
        } catch (error) {
          console.error("Existing push subscription could not be synchronized:", error);
          update("error");
        }
      }).catch(() => update(wasDismissed() ? "dismissed" : "ready"));
      return () => { cancelled = true; };
    }
    update(wasDismissed() ? "dismissed" : "ready");
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!["ready", "error"].includes(state)) return undefined;
    const timeout = window.setTimeout(() => setClosing(true), AUTO_DISMISS_MS);
    return () => window.clearTimeout(timeout);
  }, [state]);

  useEffect(() => {
    if (!closing) return undefined;
    const timeout = window.setTimeout(() => setState("dismissed"), 350);
    return () => window.clearTimeout(timeout);
  }, [closing]);

  async function subscribe() {
    setBusy(true);
    setClosing(false);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState(permission === "denied" ? "denied" : "ready");
        return;
      }
      const keyData = await apiRequest("/push/vapid-public-key");
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription = await registration.pushManager.getSubscription();
      const subscription = existingSubscription || await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: decodeKey(keyData.publicKey),
      });
      const csrfResponse = await fetch(`${API_ORIGIN}/auth/csrf`, { credentials: "include" });
      if (!csrfResponse.ok) throw new Error("Could not obtain CSRF token.");
      const csrf = await csrfResponse.json();
      const csrfToken = csrf.csrfToken || csrf.token;
      if (!csrfToken) throw new Error("Secure session token unavailable.");
      await apiRequest("/push/subscriptions", {
        method: "POST",
        headers: { "X-CSRF-Token": csrfToken },
        body: JSON.stringify({ subscription: subscription.toJSON(), preferences }),
      });
      setState("subscribed");
    } catch (error) {
      console.error("Push subscription could not be completed:", error);
      setState("error");
    } finally {
      setBusy(false);
    }
  }

  if (!["ready", "error"].includes(state)) return null;

  return (
    <aside className={`gom-push-prompt ${closing ? "is-closing" : ""}`} aria-label="Notification settings">
      <div className="gom-push-prompt__inner container">
        <div className="gom-push-prompt__icon" aria-hidden="true"><i className="bi bi-bell-fill" /></div>
        <div className="gom-push-prompt__content">
          <strong>Stay connected with Garden of Mercy</strong>
          <p>Receive important foundation announcements, program updates and impact stories.</p>
          {state === "error" && <span className="gom-push-prompt__error" role="alert">We couldn't enable notifications. Please try again.</span>}
        </div>
        <div className="gom-push-prompt__actions">
          <button type="button" className="btn btn-success btn-sm" onClick={subscribe} disabled={busy}>
            {busy ? <><span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />Enabling…</> : "Enable"}
          </button>
          <button type="button" className="gom-push-prompt__dismiss" aria-label="Dismiss notification prompt" onClick={() => {
            markDismissed();
            setClosing(true);
          }}><i className="bi bi-x-lg" aria-hidden="true" /></button>
        </div>
      </div>
    </aside>
  );
}
