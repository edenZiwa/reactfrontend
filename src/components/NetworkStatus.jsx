import { useEffect, useRef } from "react";
import { usePWA } from "./PWAProvider.jsx";
import { useToast } from "./ux/ToastProvider.jsx";

export default function NetworkStatus() {
  const { online } = usePWA();
  const toast = useToast();
  const previousOnline = useRef(online);

  useEffect(() => {
    if (online && !previousOnline.current) {
      toast.success("Connection restored.");
    }
    previousOnline.current = online;
  }, [online, toast]);

  if (online) return null;

  return (
    <div className="gom-offline-status" role="status" aria-live="polite">
      <i className="bi bi-wifi-off me-2" aria-hidden="true" />
      Offline · Some features unavailable
    </div>
  );
}
