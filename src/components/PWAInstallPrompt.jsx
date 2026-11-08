import { useState } from "react";
import { usePWA } from "./PWAProvider.jsx";

export default function PWAInstallPrompt() {
  const { canInstall, installApp } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  if (!canInstall || dismissed) return null;

  return (
    <aside className="gom-install-prompt" aria-label="Install Garden of Mercy Foundation">
      <span className="gom-install-icon" aria-hidden="true"><img src="/images/logo.png" alt="" /></span>
      <strong className="gom-install-title">Install our app</strong>
      <button type="button" className="gom-install-action" onClick={installApp}>
        Install
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
