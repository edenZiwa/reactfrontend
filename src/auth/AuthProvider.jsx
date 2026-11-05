import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { API_ORIGIN } from "../services/api-config.js";
import {
  completeGoogleRedirect,
  signInWithGoogle,
  signOutGoogle,
} from "../services/firebase-auth.js";

const AuthContext = createContext(null);
async function readBackendSession() {
  let response;
  try {
    response = await fetch(`${API_ORIGIN}/auth/me`, {
      credentials: "include",
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
  } catch {
    throw new Error("We could not verify your sign-in session. Check your connection and try again.");
  }

  const data = await response.json().catch(() => ({}));
  if (response.status === 401) return null;
  if (!response.ok) {
    throw new Error(data.message || data.error || "Could not check your account session.");
  }

  const user = data.user || null;
  if (!user?.id) {
    throw new Error("The session service returned an incomplete account. Please sign in again.");
  }

  return {
    ...user,
    roles: Array.isArray(user.roles) ? user.roles : Array.isArray(data.roles) ? data.roles : [],
  };
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
    const clearLocalSession = async () => {
      setUser(null);
      setStatus("anonymous");
      try { await signOutGoogle(); } catch { /* Backend session is already cleared or expired. */ }
    };
    let csrfResponse;
    try {
      csrfResponse = await fetch(`${API_ORIGIN}/auth/csrf`, {
      credentials: "include",
      cache: "no-store",
      headers: { Accept: "application/json" },
      });
    } catch {
      throw new Error("We could not reach the secure sign-out service. Check your connection and try again.");
    }
    const csrfData = await csrfResponse.json().catch(() => ({}));
    if (!csrfResponse.ok || !csrfData.csrfToken) {
      if (csrfResponse.status === 401) { await clearLocalSession(); return; }
      throw new Error(csrfData.error || csrfData.message || "Could not start a secure logout.");
    }

    let response;
    try {
      response = await fetch(`${API_ORIGIN}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "X-CSRF-Token": csrfData.csrfToken,
      },
      });
    } catch {
      throw new Error("We could not reach the secure sign-out service. Check your connection and try again.");
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 401) { await clearLocalSession(); return; }
      throw new Error(data.error || data.message || "Could not sign out. Please try again.");
    }
    await clearLocalSession();
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
