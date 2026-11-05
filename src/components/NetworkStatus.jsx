import { useEffect, useRef } from "react";
import { usePWA } from "./PWAProvider.jsx";
import { useToast } from "./ux/ToastProvider.jsx";

export default function NetworkStatus() {
  const { online } = usePWA();
  const toast = useToast();
  const previousOnline = useRef(online);

  useEffect(() => {
    if (online && !previousOnline.current) {
      toast.success("Your internet connection is back.");
    }
    previousOnline.current = online;
  }, [online, toast]);

  if (online) return null;

  return (
    <div
      className="gom-offline-status background"
      role="status"
      aria-live="polite"
    >
      <span aria-hidden="true">●</span>
      You're offline. Some features may be unavailable. Your connection will be checked automatically.
    </div>
  );
}
