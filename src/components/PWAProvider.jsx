import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import { useRegisterSW } from "virtual:pwa-register/react";

const PWAContext = createContext(null);
const UPDATE_CHECK_INTERVAL = 60 * 60 * 1000;

function readWaitingWorkerBuildId(worker) {
  return new Promise((resolve) => {
    if (!worker || typeof MessageChannel === "undefined") {
      resolve(worker?.scriptURL || "available-update");
      return;
    }

    const channel = new MessageChannel();
    const timeout = window.setTimeout(() => {
      channel.port1.close();
      resolve(worker.scriptURL || "available-update");
    }, 1500);

    channel.port1.onmessage = (event) => {
      window.clearTimeout(timeout);
      channel.port1.close();
      resolve(event.data?.buildId || worker.scriptURL || "available-update");
    };

    worker.postMessage({ type: "GET_BUILD_ID" }, [channel.port2]);
  });
}

export function PWAProvider({ children }) {
  const [online, setOnline] = useState(
    () => typeof navigator === "undefined" ? true : navigator.onLine
  );
  const [installEvent, setInstallEvent] = useState(null);
  const [installed, setInstalled] = useState(false);
  const [registration, setRegistration] = useState(null);
  const [updateVersion, setUpdateVersion] = useState("available-update");
  const [registrationError, setRegistrationError] = useState(false);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker
  } = useRegisterSW({
    immediate: true,
    onRegisteredSW(_swUrl, swRegistration) {
      setRegistration(swRegistration || null);
      setRegistrationError(false);
    },
    onRegisterError(error) {
      console.error("Garden of Mercy service worker registration failed:", error);
      setRegistrationError(true);
    }
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
    window.addEventListener("beforeinstallprompt", installHandler);
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("online", onlineHandler);
      window.removeEventListener("offline", offlineHandler);
      window.removeEventListener("beforeinstallprompt", installHandler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  // Check at startup/registration, periodically, when the app is foregrounded,
  // and after connectivity returns. Never force an update from this check.
  useEffect(() => {
    if (!registration?.update) return undefined;

    let checking = false;
    const checkForUpdate = async () => {
      if (!navigator.onLine || checking) return;
      checking = true;
      try {
        await registration.update();
      } catch (error) {
        console.warn("PWA update check could not complete:", error);
      } finally {
        checking = false;
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") checkForUpdate();
    };

    const interval = window.setInterval(checkForUpdate, UPDATE_CHECK_INTERVAL);
    window.addEventListener("focus", checkForUpdate);
    window.addEventListener("online", checkForUpdate);
    document.addEventListener("visibilitychange", onVisibilityChange);
    checkForUpdate();

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", checkForUpdate);
      window.removeEventListener("online", checkForUpdate);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [registration]);

  // Ask the waiting worker for its build identifier. Dismissal is then tied
  // to that exact build, so a later deployment can display a fresh prompt.
  useEffect(() => {
    if (!needRefresh) return undefined;

    let active = true;
    const worker = registration?.waiting;

    readWaitingWorkerBuildId(worker).then((buildId) => {
      if (active) setUpdateVersion(String(buildId));
    });

    return () => {
      active = false;
    };
  }, [needRefresh, registration]);

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
    updateVersion,
    registrationError,
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
    throw new Error("usePWA must be used inside PWAProvider");
  }

  return context;
}
