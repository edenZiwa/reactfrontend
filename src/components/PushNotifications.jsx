
import { useState } from "react";

import {
  subscribeToNotifications,
  unsubscribeFromNotifications
} from "../services/push-notifications";

export default function PushNotifications() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function enableNotifications() {
    setLoading(true);
    setStatus("");

    try {
      await subscribeToNotifications();

      setStatus(
        "Notifications successfully enabled."
      );
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function disableNotifications() {
    setLoading(true);
    setStatus("");

    try {
      await unsubscribeFromNotifications();

      setStatus(
        "Notifications successfully disabled."
      );
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="gom-notification-settings">
      <h3>Stay connected with us</h3>

      <p>
        Receive important announcements, program
        updates and community event notifications.
      </p>

      <button
        onClick={enableNotifications}
        disabled={loading}
      >
        Enable Notifications
      </button>

      <button
        onClick={disableNotifications}
        disabled={loading}
      >
        Disable Notifications
      </button>

      {status && (
        <p role="status" aria-live="polite">
          {status}
        </p>
      )}
    </section>
  );
}
