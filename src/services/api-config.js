const rawApiBase = (import.meta.env.VITE_API_BASE_URL || "").trim().replace(/\/$/, "");
const isProduction = import.meta.env.PROD === true;

if (isProduction) {
  let valid = false;
  try {
    const parsed = new URL(rawApiBase);
    valid =
      parsed.protocol === "https:" &&
      parsed.pathname.replace(/\/$/, "").toLowerCase() === "/api" &&
      !parsed.search &&
      !parsed.hash &&
      !parsed.username &&
      !parsed.password;
  } catch {
    valid = false;
  }
  if (!valid) {
    throw new Error("Production API configuration is missing or invalid. Set VITE_API_BASE_URL to the HTTPS backend origin ending exactly in /api in Cloudflare Pages build variables.");
  }
}

export const API_BASE = rawApiBase || "/api";
export const API_ORIGIN = API_BASE.replace(/\/api$/i, "");
