import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { API_ORIGIN } from "../services/api-config.js";
import { completeGoogleRedirect, signInWithGoogle } from "../services/firebase-auth.js";

const AuthContext = createContext(null);
const AUTH_EVENT_KEY = "gom:auth-session-event";
const CHANNEL_NAME = "gom-auth-session";

function announceSessionChange(type) {
  const event = { type, at: Date.now() };
  try { localStorage.setItem(AUTH_EVENT_KEY, JSON.stringify(event)); } catch {}
  try {
    if ("BroadcastChannel" in window) {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channel.postMessage(event);
      channel.close();
    }
  } catch {}
}

async function readBackendSession() {
  let response;
  try {
    response = await fetch(`${API_ORIGIN}/auth/me`, {
      credentials: "include", cache: "no-store",
      headers: { Accept: "application/json" },
    });
  } catch {
    throw new Error("We could not verify your sign-in session. Check your connection and try again.");
  }
  const data = await response.json().catch(() => ({}));
  if (response.status === 401 || response.status === 403 && data.authenticated === false) return null;
  if (!response.ok) throw new Error(data.message || data.error || "Could not check your account session.");
  const user = data.user || null;
  if (!user?.id) throw new Error("The session service returned an incomplete account. Please sign in again.");
  return { ...user, pictureUrl: user.pictureUrl || user.picture_url || user.photoURL || user.photoUrl || null, roles: Array.isArray(user.roles) ? user.roles : Array.isArray(data.roles) ? data.roles : [] };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");
  const [authError, setAuthError] = useState("");
  const refreshInFlight = useRef(false);

  const refreshSession = useCallback(async () => {
    if (refreshInFlight.current) return user;
    refreshInFlight.current = true;
    try {
      const currentUser = await readBackendSession();
      setUser(currentUser);
      setAuthError("");
      setStatus(currentUser ? "authenticated" : "anonymous");
      return currentUser;
    } catch (error) {
      setAuthError(error?.message || "We could not verify your sign-in session. Please try again.");
      setStatus("unavailable");
      throw error;
    } finally { refreshInFlight.current = false; }
  }, [user]);

  useEffect(() => {
    let active = true;
    (async () => {
      let redirectError = "";
      let redirectCompleted = false;
      try {
        const redirectResult = await completeGoogleRedirect();
        redirectCompleted = Boolean(redirectResult?.user || redirectResult?.ok);
      } catch (error) {
        redirectError = error?.message || "Could not complete Google sign-in.";
      }

      try {
        const currentUser = await readBackendSession();
        if (!active) return;
        setUser(currentUser);
        // A normal anonymous session check must not erase a more useful
        // Google redirect/exchange failure from the same page load.
        setAuthError(redirectError);
        setStatus(currentUser ? "authenticated" : "anonymous");
        if (currentUser && redirectCompleted) announceSessionChange("login");
      } catch (error) {
        if (!active) return;
        setAuthError(redirectError || error?.message || "We could not restore your sign-in session.");
        setStatus("unavailable");
      }
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let channel;
    const handleSessionEvent = event => {
      const data = event?.data || event;
      if (data?.type === "logout") {
        setUser(null);
        setStatus("anonymous");
        setAuthError("");
      } else if (data?.type === "login") {
        refreshSession().catch(() => {});
      }
    };
    const onStorage = event => {
      if (event.key !== AUTH_EVENT_KEY || !event.newValue) return;
      try { handleSessionEvent(JSON.parse(event.newValue)); } catch {}
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") refreshSession().catch(() => {});
    };
    const onFocus = () => refreshSession().catch(() => {});
    try {
      if ("BroadcastChannel" in window) {
        channel = new BroadcastChannel(CHANNEL_NAME);
        channel.addEventListener("message", handleSessionEvent);
      }
    } catch {}
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      channel?.removeEventListener("message", handleSessionEvent);
      channel?.close();
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [refreshSession]);

  const login = useCallback(async () => {
    setAuthError("");
    try {
      const result = await signInWithGoogle();
      if (result === null) return null;
      const currentUser = await readBackendSession();
      if (!currentUser) throw new Error("Google sign-in completed, but your secure session could not be confirmed. Please try again.");
      setUser(currentUser);
      setAuthError("");
      setStatus("authenticated");
      announceSessionChange("login");
      return currentUser;
    } catch (error) {
      setAuthError(error?.message || "Google sign-in failed.");
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    setAuthError("");
    let csrfResponse;
    try {
      csrfResponse = await fetch(`${API_ORIGIN}/auth/csrf`, {
        credentials: "include", cache: "no-store",
        headers: { Accept: "application/json" },
      });
    } catch {
      throw new Error("We could not reach the secure sign-out service. Check your connection and try again.");
    }
    const csrfData = await csrfResponse.json().catch(() => ({}));
    if (!csrfResponse.ok || !csrfData.csrfToken) {
      if (csrfResponse.status === 401) {
        setUser(null); setStatus("anonymous"); announceSessionChange("logout"); return;
      }
      throw new Error(csrfData.error || csrfData.message || "Could not start a secure logout.");
    }
    let response;
    try {
      response = await fetch(`${API_ORIGIN}/auth/logout`, {
        method: "POST", credentials: "include",
        headers: { Accept: "application/json", "X-CSRF-Token": csrfData.csrfToken },
      });
    } catch {
      throw new Error("We could not reach the secure sign-out service. Check your connection and try again.");
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 401) {
        setUser(null); setStatus("anonymous"); announceSessionChange("logout"); return;
      }
      throw new Error(data.error || data.message || "Could not sign out. Please try again.");
    }
    setUser(null);
    setStatus("anonymous");
    announceSessionChange("logout");
  }, []);

  const value = useMemo(() => ({
    user, status, loading: status === "loading",
    isAuthenticated: Boolean(user),
    isPublicUser: Boolean(user?.roles?.includes("public_user")),
    authError, login, logout, refreshSession,
    clearAuthError: () => setAuthError(""),
  }), [user, status, authError, login, logout, refreshSession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
