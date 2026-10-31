
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

  const response = await fetch(
    `${API_BASE}/subscribe`,
    {
      method: "POST",

      credentials: "include",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(subscription)
    }
  );

  if (!response.ok) {
    throw new Error(
      "Unable to save notification subscription."
    );
  }

  return subscription;
}

export async function unsubscribeFromNotifications() {
  const registration =
    await navigator.serviceWorker.ready;

  const subscription =
    await registration.pushManager.getSubscription();

  if (!subscription) return true;

  const response = await fetch(
    `${API_BASE}/unsubscribe`,
    {
      method: "POST",

      credentials: "include",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(subscription)
    }
  );

  if (!response.ok) {
    throw new Error(
      "Unable to remove notification subscription."
    );
  }

  await subscription.unsubscribe();

  return true;
}
