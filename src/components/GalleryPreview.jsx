import React, { useEffect, useState } from "react";
import { apiRequest } from "../services/api.js";
import { AppLink } from "./SiteChrome.jsx";
import "./gallery-preview.css";

function normalizePublicGalleryItem(item, index) {
  if (!item || item.media_type !== "image") return null;
  if (typeof item.media_url !== "string" || typeof item.alt_text !== "string" || !item.alt_text.trim()) return null;

  let url;
  try {
    url = new URL(item.media_url, window.location.origin);
  } catch {
    return null;
  }
  if (!["https:", "http:"].includes(url.protocol)) return null;
  if (url.protocol === "http:" && url.hostname !== window.location.hostname) return null;

  return {
    id: item.id || `public-gallery-${index}`,
    src: url.href,
    alt: item.alt_text.trim(),
    title: (item.title || item.caption || "Garden of Mercy Foundation").trim(),
    caption: (item.caption || item.location_label || "").trim(),
  };
}

function PreviewImage({ item, className = "" }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span className={`gom-gallery-preview-image-fallback ${className}`.trim()} role="img" aria-label={item.alt || item.title || "Photo unavailable"}>
        <i className="bi bi-image" aria-hidden="true" />
        <span>Photo unavailable</span>
      </span>
    );
  }
  return (
    <img
      className={className}
      src={item.src}
      alt={item.alt || item.title || ""}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

/**
 * Shared page-level gallery preview. Public API responses are already filtered
 * by the backend for publication and verified consent. The dedicated Gallery
 * page intentionally remains its own richer browsing experience.
 */
export default function GalleryPreview({
  items = [],
  navigate,
  variant = "grid",
  className = "",
  linkLabel = "Explore the gallery",
  fetchFromApi = false,
  maxItems = 6,
}) {
  const fallbackItems = items;
  const [apiItems, setApiItems] = useState(null);

  useEffect(() => {
    if (!fetchFromApi) {
      setApiItems(null);
      return undefined;
    }
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);

    apiRequest("/content/gallery", { signal: controller.signal })
      .then((payload) => {
        const records = Array.isArray(payload?.items) ? payload.items : [];
        const normalized = records
          .map(normalizePublicGalleryItem)
          .filter(Boolean)
          .slice(0, Math.max(1, maxItems));
        setApiItems(normalized.length ? normalized : fallbackItems);
      })
      .catch(() => setApiItems(fallbackItems))
      .finally(() => window.clearTimeout(timeout));

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [fetchFromApi, maxItems]);

  const sourceItems = fetchFromApi && apiItems !== null ? apiItems : items;
  const validItems = sourceItems.filter((item) => item && typeof item.src === "string" && item.src.trim()).slice(0, maxItems);

  if (!validItems.length) return null;

  if (variant === "home") {
    const [featured, ...secondary] = validItems;
    return (
      <div className={`gom-gallery-preview gom-gallery-preview-home ${className}`.trim()}>
        <div className="row g-3">
          <div className="col-lg-6">
            <AppLink
              to="/gallery"
              navigate={navigate}
              className="gom-gallery-preview-card gom-gallery-preview-feature d-block"
              aria-label={featured.linkLabel || linkLabel}
            >
              <PreviewImage item={featured} />
              <span className="gom-gallery-preview-overlay">
                {featured.kicker && <span className="badge bg-warning text-dark rounded-pill mb-2">{featured.kicker}</span>}
                <span className="h4 fw-bold mb-1">{featured.title}</span>
                {featured.caption && <span>{featured.caption}</span>}
              </span>
            </AppLink>
          </div>
          <div className="col-lg-6">
            <div className="row g-3">
              {secondary.map((item, index) => (
                <div className="col-6" key={item.id || item.src || index}>
                  <AppLink
                    to="/gallery"
                    navigate={navigate}
                    className="gom-gallery-preview-card gom-gallery-preview-small d-block"
                    aria-label={item.linkLabel || linkLabel}
                  >
                    <PreviewImage item={item} />
                    <span className="gom-gallery-preview-overlay">
                      <span className="fw-semibold">{item.title}</span>
                    </span>
                  </AppLink>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`gom-gallery-preview gom-gallery-preview-grid row g-3 ${className}`.trim()}>
      {validItems.map((item, index) => (
        <div className={item.columnClass || "col-12 col-sm-6 col-lg-4"} key={item.id || item.src || index}>
          <AppLink
            to="/gallery"
            navigate={navigate}
            className="gom-gallery-preview-card gom-gallery-preview-grid-card d-block"
            aria-label={item.linkLabel || linkLabel}
          >
            <PreviewImage item={item} />
            <span className="gom-gallery-preview-overlay">
              <span className="fw-semibold">{item.title}</span>
              {item.caption && <span>{item.caption}</span>}
            </span>
          </AppLink>
        </div>
      ))}
    </div>
  );
}
