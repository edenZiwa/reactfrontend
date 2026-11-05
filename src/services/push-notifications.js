
const API_BASE = "/api/push";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat(
    (4 - base64String.length % 4) % 4
  );

  const base64 = (
    base64String + padding
  )
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from(
    [...rawData].map((char) => char.charCodeAt(0))
  );
}

export async function subscribeToNotifications() {
  if (
    !("serviceWorker" in navigator) ||
    !("PushManager" in window) ||
    !("Notification" in window)
  ) {
    throw new Error(
      "Push notifications are not supported by this browser."
    );
  }

  if (Notification.permission === "denied") {
    throw new Error(
      "Notifications are blocked in browser settings."
    );
  }

  const registration =
    await navigator.serviceWorker.ready;

  const publicKey =
    import.meta.env.VITE_VAPID_PUBLIC_KEY;

  if (!publicKey) {
    throw new Error(
      "Push notification configuration is missing."
    );
  }

  const permission =
    await Notification.requestPermission();

  if (permission !== "granted") {
    throw new Error(
      "Notification permission was not granted."
    );
  }

  let subscription =
    await registration.pushManager.getSubscription();

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,

      applicationServerKey:
        urlBase64ToUint8Array(publicKey)
    });
  }

  let response;
  try {
    response = await fetch(`${API_BASE}/subscribe`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(subscription)
    });
  } catch {
    throw new Error("We could not connect to the notification service. Check your connection and try again.");
  }
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.message || result.error || (response.status === 401
      ? "Please sign in again before enabling notifications."
      : response.status === 403
        ? "The notification service could not authorise this request."
        : response.status >= 500
          ? "The notification service is temporarily unavailable. Please try again shortly."
          : "We could not save your notification settings. Please try again."));
  }

  return subscription;
}

export async function unsubscribeFromNotifications() {
  const registration =
    await navigator.serviceWorker.ready;

  const subscription =
    await registration.pushManager.getSubscription();

  if (!subscription) return true;

  let response;
  try {
    response = await fetch(`${API_BASE}/unsubscribe`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(subscription)
    });
  } catch {
    throw new Error("We could not connect to the notification service. Your browser subscription has not been changed.");
  }
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.message || result.error || (response.status === 401
      ? "Please sign in again before changing notification settings."
      : response.status >= 500
        ? "The notification service is temporarily unavailable. Please try again shortly."
        : "We could not remove your notification settings. Please try again."));
  }

  await subscription.unsubscribe();

  return true;
}
