import {
  initializeApp,
  getApps,
} from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
} from "firebase/auth";

const APP_NAME = "garden-of-mercy-web";
let authPromise;
let csrfPromise;

async function getFirebaseAuth() {
  if (!authPromise) {
    authPromise = (async () => {
      const response = await fetch("/auth/google-config", {
        credentials: "same-origin",
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      const config = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(config.error || "Google sign-in is unavailable right now.");
      if (!config.apiKey || !config.authDomain || !config.projectId || !config.appId) {
        throw new Error("Google sign-in has not been configured. Please contact the foundation.");
      }
      const app = getApps().find((item) => item.name === APP_NAME)
        || initializeApp(config, APP_NAME);
      return getAuth(app);
    })().catch((error) => {
      authPromise = null;
      throw error;
    });
  }
  return authPromise;
}

async function getCsrfToken() {
  if (!csrfPromise) {
    csrfPromise = fetch("/auth/csrf", {
      credentials: "same-origin",
      cache: "no-store",
      headers: { Accept: "application/json" },
    }).then(async (response) => {
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.csrfToken) throw new Error(data.error || "Could not start a secure sign-in session.");
      return data.csrfToken;
    }).catch((error) => {
      csrfPromise = null;
      throw error;
    });
  }
  return csrfPromise;
}

async function exchangeFirebaseToken(user) {
  const credential = await user.getIdToken(true);
  const csrfToken = await getCsrfToken();
  const response = await fetch("/auth/google", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-CSRF-Token": csrfToken,
    },
    body: JSON.stringify({ credential }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Google sign-in failed. Please try again.");
  csrfPromise = null; // Session regeneration creates a new CSRF token.
  return data;
}

export async function signInWithGoogle() {
  const auth = await getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  try {
    const result = await signInWithPopup(auth, provider);
    try {
      return await exchangeFirebaseToken(result.user);
    } catch (error) {
      await signOut(auth).catch(() => {});
      throw error;
    }
  } catch (error) {
    const redirectCodes = new Set([
      "auth/popup-blocked",
      "auth/operation-not-supported-in-this-environment",
      "auth/web-storage-unsupported",
    ]);
    if (!redirectCodes.has(error?.code)) throw error;
    try { window.sessionStorage.setItem("gom_google_redirect_pending", "true"); } catch {}
    await signInWithRedirect(auth, provider);
    return null; // Redirect is underway; this is not a completed sign-in.
  }
}

export async function completeGoogleRedirect() {
  let pending = false;
  try {
    pending = window.sessionStorage.getItem("gom_google_redirect_pending") === "true";
    if (pending) window.sessionStorage.removeItem("gom_google_redirect_pending");
  } catch {}
  if (!pending) return null;

  const auth = await getFirebaseAuth();
  const result = await getRedirectResult(auth);
  if (!result?.user) return null;
  try {
    return await exchangeFirebaseToken(result.user);
  } catch (error) {
    await signOut(auth).catch(() => {});
    throw error;
  }
}

export async function signOutGoogle() {
  const auth = await getFirebaseAuth().catch(() => null);
  if (auth) await signOut(auth).catch(() => {});
}
