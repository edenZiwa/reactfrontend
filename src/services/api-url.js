const CONFIG_ERROR =
  "Production API configuration is missing or invalid. Set VITE_API_BASE_URL to https://api.gardenofmercy.org/api (or another HTTPS backend origin ending exactly in /api) in Cloudflare Pages, then redeploy.";

function parseAbsoluteUrl(value) {
  try {
    const url = new URL(value);
    if (!["https:", "http:"].includes(url.protocol)) return null;
    if (url.username || url.password || url.search || url.hash) return null;
    return url;
  } catch {
    return null;
  }
}

export function resolveApiConfig({ value = "", production = false } = {}) {
  const raw = String(value || "").trim().replace(/\/+$/, "");

  if (!raw) {
    return production
      ? { apiBase: "/api", apiOrigin: "", error: CONFIG_ERROR }
      : { apiBase: "/api", apiOrigin: "", error: "" };
  }

  const absolute = parseAbsoluteUrl(raw);
  if (absolute) {
    const validPath = absolute.pathname.replace(/\/+$/, "").toLowerCase() === "/api";
    const isFrontendHost = ["gardenofmercy.org", "www.gardenofmercy.org"].includes(absolute.hostname.toLowerCase());
    const validProduction = absolute.protocol === "https:" && validPath && !isFrontendHost;

    if (production && !validProduction) {
      return { apiBase: "/api", apiOrigin: "", error: CONFIG_ERROR };
    }
    if (!validPath) {
      return production
        ? { apiBase: "/api", apiOrigin: "", error: CONFIG_ERROR }
        : { apiBase: raw, apiOrigin: absolute.origin, error: "" };
    }

    return {
      apiBase: absolute.origin + "/api",
      apiOrigin: absolute.origin,
      error: "",
    };
  }

  // Relative API paths are supported only for local development/proxy setups.
  const validRelative = raw.startsWith("/") && !raw.startsWith("//") &&
    !/[?#\\]/.test(raw) && raw.toLowerCase() === "/api";
  if (!production && validRelative) {
    return { apiBase: "/api", apiOrigin: "", error: "" };
  }

  return production
    ? { apiBase: "/api", apiOrigin: "", error: CONFIG_ERROR }
    : { apiBase: "/api", apiOrigin: "", error: "" };
}
