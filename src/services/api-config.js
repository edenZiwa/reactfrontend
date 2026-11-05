const configuredBase = (import.meta.env.VITE_API_BASE_URL || "/api").trim().replace(/\/$/, "");
export const API_BASE = configuredBase;
export const API_ORIGIN = configuredBase.replace(/\/api$/i, "");
