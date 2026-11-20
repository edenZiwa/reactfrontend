import { useEffect, useState } from "react";
import { apiRequest } from "../services/api.js";
import { API_ORIGIN } from "../services/api-config.js";

const DISMISS_KEY = "gom:push-prompt-dismissed";
function decodeKey(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

export default function PushNotificationPrompt() {
  const [state, setState] = useState("checking");
  const [busy, setBusy] = useState(false);
  const [preferences, setPreferences] = useState({announcements:true,programs:true,events:true,impact:true});

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
      setState("unsupported");
      return;
    }
    if (Notification.permission === "denied") {
      setState("denied");
      return;
    }
    if (Notification.permission === "granted") {
      navigator.serviceWorker.ready.then((registration) =>
        registration.pushManager.getSubscription().then((subscription) => {
          if (subscription) {
            setState("subscribed");
            return;
          }
          try {
            setState(sessionStorage.getItem(DISMISS_KEY) === "1" ? "dismissed" : "ready");
          } catch {
            setState("ready");
          }
        })
      ).catch(() => setState("ready"));
      return;
    }
    try {
      setState(sessionStorage.getItem(DISMISS_KEY) === "1" ? "dismissed" : "ready");
    } catch {
      setState("ready");
    }
  }, []);

  async function subscribe() {
    setBusy(true);
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
      await apiRequest("/push/subscriptions", {
        method: "POST",
        headers: { "X-CSRF-Token": csrf.csrfToken || csrf.token },
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
  if (state === "ready" && Notification.permission === "default" && (() => {
    try { return sessionStorage.getItem(DISMISS_KEY) === "1"; } catch { return false; }
  })()) return null;

  return (
    <aside className="gom-push-prompt container my-3" aria-label="Notification settings">
      <div className="alert alert-success d-flex flex-column flex-sm-row align-items-sm-center gap-3 mb-0">
        <div className="flex-grow-1">
          <strong>Stay connected with Garden of Mercy</strong>
          <div className="small">Receive important foundation announcements, program updates and impact stories.</div>
          {state === "error" && <div className="small mt-1" role="alert">We couldn't enable notifications. Please try again later.</div>}
        </div>
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-success" onClick={subscribe} disabled={busy}>
            {busy ? "Enabling…" : "Enable notifications"}
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={() => {
            try { sessionStorage.setItem(DISMISS_KEY, "1"); } catch {}
            setState("dismissed");
          }}>Not now</button>
        </div>
      </div>
    </aside>
  );
}
