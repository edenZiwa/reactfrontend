
import { useState } from "react";
import { usePWA } from "./PWAProvider.jsx";

export default function PWAInstallPrompt() {
  const { canInstall, installApp } = usePWA();

  const [dismissed, setDismissed] = useState(false);

  if (!canInstall || dismissed) return null;

  return (
    <aside className="gom-install-prompt">
      <div className="gom-install-icon">
        🌱
      </div>

      <div className="gom-install-content">
        <strong>Garden of Mercy Foundation</strong>

        <p>
          Install our app for easier access to
          our programs, updates and community work.
        </p>

        <button onClick={installApp}>
          Install App
        </button>
      </div>

      <button
        className="gom-dismiss"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss installation prompt"
      >
        ×
      </button>
    </aside>
  );
}
