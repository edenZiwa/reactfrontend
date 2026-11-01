import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  completeGoogleRedirect,
  signInWithGoogle,
  signOutGoogle,
} from "../services/firebase-auth.js";

const AuthContext = createContext(null);

async function readBackendSession() {
  const response = await fetch("/auth/me", {
    credentials: "same-origin",
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  const data = await response.json().catch(() => ({}));
  if (response.status === 401) return null;
  if (!response.ok) throw new Error(data.error || "Could not check your account session.");
  return data.user || null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");
  const [authError, setAuthError] = useState("");

  const refreshSession = useCallback(async () => {
    const currentUser = await readBackendSession();
    setUser(currentUser);
    setStatus(currentUser ? "authenticated" : "anonymous");
    return currentUser;
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await completeGoogleRedirect();
        const currentUser = await readBackendSession();
        if (!active) return;
        setUser(currentUser);
        setStatus(currentUser ? "authenticated" : "anonymous");
      } catch (error) {
        if (!active) return;
        setAuthError(error?.message || "Could not restore your sign-in session.");
        try {
          const currentUser = await readBackendSession();
          if (!active) return;
          setUser(currentUser);
          setStatus(currentUser ? "authenticated" : "anonymous");
        } catch {
          if (active) setStatus("anonymous");
        }
      }
    })();
    return () => { active = false; };
  }, []);

  const login = useCallback(async () => {
    setAuthError("");
    try {
      const result = await signInWithGoogle();
      if (result === null) return null; // Redirect fallback has started.
      const currentUser = await refreshSession();
      if (!currentUser) throw new Error("Google sign-in completed, but the website session could not be confirmed.");
      return currentUser;
    } catch (error) {
      setAuthError(error?.message || "Google sign-in failed.");
      throw error;
    }
  }, [refreshSession]);

  const logout = useCallback(async () => {
    setAuthError("");
    const response = await fetch("/auth/google/logout", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "X-CSRF-Token": await (async () => {
          const r = await fetch("/auth/csrf", { credentials: "same-origin", cache: "no-store" });
          const d = await r.json().catch(() => ({}));
          if (!r.ok || !d.csrfToken) throw new Error(d.error || "Could not start a secure logout.");
          return d.csrfToken;
        })(),
      },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Could not sign out. Please try again.");
    await signOutGoogle();
    setUser(null);
    setStatus("anonymous");
  }, []);

  const value = useMemo(() => ({
    user,
    status,
    loading: status === "loading",
    isAuthenticated: Boolean(user),
    isPublicUser: Boolean(user?.roles?.includes("public_user")),
    authError,
    login,
    logout,
    refreshSession,
    clearAuthError: () => setAuthError(""),
  }), [user, status, authError, login, logout, refreshSession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
