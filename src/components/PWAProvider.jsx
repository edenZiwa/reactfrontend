
import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import { useRegisterSW } from "virtual:pwa-register/react";

const PWAContext = createContext(null);

export function PWAProvider({ children }) {
  const [online, setOnline] = useState(
    navigator.onLine
  );

  const [installEvent, setInstallEvent] = useState(null);
  const [installed, setInstalled] = useState(false);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker
  } = useRegisterSW({
    immediate: true
  });

  useEffect(() => {
    const onlineHandler = () => setOnline(true);
    const offlineHandler = () => setOnline(false);

    const installHandler = (event) => {
      event.preventDefault();
      setInstallEvent(event);
    };

    const installedHandler = () => {
      setInstalled(true);
      setInstallEvent(null);
    };

    window.addEventListener("online", onlineHandler);
    window.addEventListener("offline", offlineHandler);

    window.addEventListener(
      "beforeinstallprompt",
      installHandler
    );

    window.addEventListener(
      "appinstalled",
      installedHandler
    );

    return () => {
      window.removeEventListener("online", onlineHandler);
      window.removeEventListener("offline", offlineHandler);

      window.removeEventListener(
        "beforeinstallprompt",
        installHandler
      );

      window.removeEventListener(
        "appinstalled",
        installedHandler
      );
    };
  }, []);

  async function installApp() {
    if (!installEvent) return false;

    await installEvent.prompt();

    const result = await installEvent.userChoice;

    setInstallEvent(null);

    return result.outcome === "accepted";
  }

  async function updateApp() {
    await updateServiceWorker(true);
  }

  const value = {
    online,
    installed,
    canInstall: Boolean(installEvent),
    needRefresh,
    installApp,
    updateApp
  };

  return (
    <PWAContext.Provider value={value}>
      {children}
    </PWAContext.Provider>
  );
}

export function usePWA() {
  const context = useContext(PWAContext);

  if (!context) {
    throw new Error(
      "usePWA must be used inside PWAProvider"
    );
  }

  return context;
}
