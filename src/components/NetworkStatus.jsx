
import { usePWA } from "./PWAProvider.jsx";

export default function NetworkStatus() {
  const { online } = usePWA();

  if (online) return null;

  return (
    <div
      className="gom-offline-status"
      role="status"
      aria-live="polite"
    >
      <span aria-hidden="true">●</span>
      You're offline. Some features may be unavailable.
    </div>
  );
}
