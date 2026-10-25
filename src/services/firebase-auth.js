import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut } from "firebase/auth";

let authPromise;

async function getFirebaseAuth() {
  if (!authPromise) {
    authPromise = (async () => {
      const response = await fetch("/auth/google-config", { credentials: "include", cache: "no-store" });
      if (!response.ok) throw new Error("Google sign-in is not available right now.");
      const config = await response.json();
      if (!config.apiKey || !config.authDomain || !config.projectId || !config.appId) {
        throw new Error("Google sign-in has not been configured yet. Please contact the foundation.");
      }
      const app = getApps().find((item) => item.name === "garden-of-mercy-web")
        || initializeApp(config, "garden-of-mercy-web");
      return getAuth(app);
    })().catch((error) => {
      authPromise = null;
      throw error;
    });
  }
  return authPromise;
}

export async function signInWithGoogle() {
  const auth = await getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  let result;
  try {
    result = await signInWithPopup(auth, provider);
  } catch (error) {
    // Some mobile browsers and strict privacy settings block popups. Use redirect there.
    if (["auth/popup-blocked", "auth/operation-not-supported-in-this-environment"].includes(error?.code)) {
      try { window.sessionStorage.setItem("gom_google_redirect_pending", "true"); } catch {}
      await signInWithRedirect(auth, provider);
      return null;
    }
    throw error;
  }
  const credential = await result.user.getIdToken(true);
  const response = await fetch("/auth/google", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    await signOut(auth).catch(() => {});
    throw new Error(data.error || "Google sign-in failed. Please try again.");
  }
  return data;
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
  const credential = await result.user.getIdToken(true);
  const response = await fetch("/auth/google", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    await signOut(auth).catch(() => {});
    throw new Error(data.error || "Google sign-in failed. Please try again.");
  }
  return data;
}

export async function signOutGoogle() {
  const auth = await getFirebaseAuth().catch(() => null);
  if (auth) await signOut(auth).catch(() => {});
}
