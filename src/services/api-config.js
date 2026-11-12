import { resolveApiConfig } from "./api-url.js";

const { apiBase, apiOrigin, error } = resolveApiConfig({
  value: import.meta.env.VITE_API_BASE_URL,
  production: import.meta.env.PROD === true,
});

export const API_CONFIG_ERROR = error;
export const API_BASE = apiBase;
export const API_ORIGIN = apiOrigin;

if (API_CONFIG_ERROR && typeof console !== "undefined") {
  console.error("[Garden of Mercy] " + API_CONFIG_ERROR);
}
