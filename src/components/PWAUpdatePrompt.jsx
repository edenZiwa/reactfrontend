
import { useState } from "react";
import { usePWA } from "./PWAProvider.jsx";

export default function PWAUpdatePrompt() {
  const { needRefresh, updateApp } = usePWA();

  const [updating, setUpdating] = useState(false);

  if (!needRefresh) return null;

  async function handleUpdate() {
    setUpdating(true);

    try {
      await updateApp();
    } catch (error) {
      console.error("Update failed:", error);
      setUpdating(false);
    }
  }

  return (
    <div className="gom-update-prompt">
      <span>
        A new Garden of Mercy version is available.
      </span>

      <button
        onClick={handleUpdate}
        disabled={updating}
      >
        {updating ? "Updating..." : "Update Now"}
      </button>
    </div>
  );
}
