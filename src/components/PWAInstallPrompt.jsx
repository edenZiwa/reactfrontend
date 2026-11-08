import { useState } from "react";
import { usePWA } from "./PWAProvider.jsx";

export default function PWAInstallPrompt() {
  const { canInstall, installApp } = usePWA();
  const [dismissed, setDismissed] = useState(false);
  const [installing, setInstalling] = useState(false);

  if (!canInstall || dismissed) return null;

  async function handleInstall() {
    if (installing) return;
    setInstalling(true);
    try {
      const accepted = await installApp();
      if (accepted) setDismissed(true);
    } catch (error) {
      console.error("App installation could not be completed:", error);
    } finally {
      setInstalling(false);
    }
  }

  return (
    <aside className="gom-install-prompt" aria-label="Install Garden of Mercy Foundation">
      <span className="gom-install-icon" aria-hidden="true"><img src="/images/logo.png" alt="" /></span>
      <strong className="gom-install-title">Install our app</strong>
      <button type="button" className="gom-install-action" onClick={handleInstall} disabled={installing}>
        {installing ? "Opening…" : "Install"}
      </button>
      <button
        type="button"
        className="gom-dismiss"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss installation prompt"
      >
        <span aria-hidden="true">×</span>
      </button>
    </aside>
  );
}
