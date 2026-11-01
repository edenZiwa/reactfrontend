import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider.jsx";

export default function RequirePublicUser({ children }) {
  const { loading, user, isPublicUser } = useAuth();
  const location = useLocation();

  if (loading) return <main className="container py-5" aria-live="polite">Loading your account…</main>;
  if (!user || !isPublicUser) {
    return <Navigate to="/" replace state={{ from: location.pathname, showSignIn: true }} />;
  }
  return children;
}
