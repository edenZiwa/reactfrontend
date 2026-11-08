const rawApiBase = (import.meta.env.VITE_API_BASE_URL || "").trim().replace(/\/$/, "");
const isProduction = import.meta.env.PROD === true;

function isValidProductionApiBase(value) {
  try {
    const parsed = new URL(value);
    return (
      parsed.protocol === "https:" &&
      parsed.pathname.replace(/\/$/, "").toLowerCase() === "/api" &&
      !parsed.search &&
      !parsed.hash &&
      !parsed.username &&
      !parsed.password
    );
  } catch {
    return false;
  }
}

// A missing API URL must never prevent the public React application from rendering.
// API-backed features can report their own connection errors while public pages remain usable.
export const API_CONFIG_ERROR =
  isProduction && !isValidProductionApiBase(rawApiBase)
    ? "Production API configuration is missing or invalid. Set VITE_API_BASE_URL to the HTTPS backend origin ending exactly in /api in the Cloudflare build environment."
    : "";

if (API_CONFIG_ERROR && typeof console !== "undefined") {
  console.error("[Garden of Mercy] " + API_CONFIG_ERROR);
}

export const API_BASE = rawApiBase && (!isProduction || !API_CONFIG_ERROR)
  ? rawApiBase
  : "/api";

export const API_ORIGIN = API_BASE.replace(/\\/api$/i, "");
