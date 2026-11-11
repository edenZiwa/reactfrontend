import { useEffect, useState } from "react";
import { usePWA } from "./PWAProvider.jsx";

const DISMISSED_UPDATE_PREFIX = "gom:pwa-update-dismissed:";

function readDismissedVersion(version) {
  try {
    return window.localStorage.getItem(
      `${DISMISSED_UPDATE_PREFIX}${version}`
    ) === "true";
  } catch {
    return false;
  }
}

export default function PWAUpdatePrompt() {
  const { needRefresh, updateApp, updateVersion } = usePWA();
  const [updating, setUpdating] = useState(false);
  const [dismissed, setDismissed] = useState(() =>
    readDismissedVersion(updateVersion)
  );
  const [updateError, setUpdateError] = useState(false);

  useEffect(() => {
    setDismissed(readDismissedVersion(updateVersion));
    setUpdating(false);
    setUpdateError(false);
  }, [updateVersion]);

  if (!needRefresh || dismissed) return null;

  function handleLater() {
    try {
      window.localStorage.setItem(
        `${DISMISSED_UPDATE_PREFIX}${updateVersion}`,
        "true"
      );
    } catch {
      // The prompt can still be dismissed for this page session.
    }
    setDismissed(true);
  }

  async function handleUpdate() {
    if (updating) return;
    setUpdating(true);
    setUpdateError(false);

    try {
      await updateApp();
    } catch (error) {
      console.error("Garden of Mercy PWA update failed:", error);
      setUpdating(false);
      setUpdateError(true);
    }
  }

  return (
    <aside
      className="gom-update-prompt"
      role="region"
      aria-label="Application update"
      aria-live="polite"
      aria-busy={updating}
    >
      <div className="gom-update-copy">
        <span className="gom-update-icon" aria-hidden="true">
          <i className="bi bi-arrow-repeat" />
        </span>
        <div>
          <strong className="gom-update-title">
            {updating ? "Updating Garden of Mercy…" : "A new version is ready"}
          </strong>
          <p className="gom-update-description">
            {updating
              ? "Please keep this window open. The app will reload when the update is ready."
              : "Update now to use the latest improvements. You can also do this later."}
          </p>
          {updateError && (
            <p className="gom-update-error" role="alert">
              The update could not start. Please check your connection and try again.
            </p>
          )}
        </div>
      </div>

      <div className="gom-update-actions">
        {!updating && (
          <button
            type="button"
            className="gom-update-later"
            onClick={handleLater}
          >
            Later
          </button>
        )}
        <button
          type="button"
          className="gom-update-action"
          onClick={handleUpdate}
          disabled={updating}
        >
          {updating ? (
            <>
              <span className="spinner-border spinner-border-sm" aria-hidden="true" />
              <span>Updating…</span>
            </>
          ) : (
            <>
              <i className="bi bi-arrow-clockwise" aria-hidden="true" />
              <span>Update now</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
