// Lightweight popup analytics bridge. A configured analytics provider can
// subscribe to this event without coupling popup UI to a vendor SDK.
export function trackPopupEvent(eventName, details = {}) {
  if (typeof window === "undefined") return;

  const payload = {
    event: eventName,
    popup: "education_gift",
    timestamp: new Date().toISOString(),
    ...details,
  };

  window.dispatchEvent(
    new CustomEvent("gom:popup-analytics", { detail: payload })
  );
}
