import React from "react";
import { AppLink } from "./SiteChrome.jsx";
import "./gallery-preview.css";

/**
 * Reusable, page-level gallery preview.
 * The dedicated Gallery page intentionally keeps its own richer experience.
 */
export default function GalleryPreview({
  items = [],
  navigate,
  variant = "grid",
  className = "",
  linkLabel = "Explore the gallery",
}) {
  const validItems = items.filter((item) => item && item.src);

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
              <img src={featured.src} alt={featured.alt || featured.title || ""} loading="lazy" />
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
                    <img src={item.src} alt={item.alt || item.title || ""} loading="lazy" />
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
            <img src={item.src} alt={item.alt || item.title || ""} loading="lazy" />
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
