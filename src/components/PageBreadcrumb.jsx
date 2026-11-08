import React, { useEffect, useState } from "react";
import { usePWA } from "./PWAProvider.jsx";
import { AppLink } from "./SiteChrome.jsx";

const PAGE_LABELS = {
  "/about": "ABOUT THE FOUNDATION",
  "/programs": "OUR PROGRAMS",
  "/donate": "SUPPORT THE MISSION",
  "/volunteer": "VOLUNTEER WITH US",
  "/success-stories": "STORIES OF HOPE",
  "/contact": "GET IN TOUCH",
  "/impact": "OUR IMPACT",
  "/gallery": "OUR STORIES",
  "/sponsor": "CHILD SPONSORSHIP",
  "/founder": "FOUNDER & VISIONARY LEADER",
  "/cofounder": "CO-FOUNDER & SERVANT LEADER",
};

const SHOW_AFTER = 150;

function normalizePath(path = "/") {
  if (!path || path === "/") return "/";
  return path.replace(/\/+$/, "") || "/";
}

export default function PageBreadcrumb({ path = "/", navigate }) {
  const [visible, setVisible] = useState(false);
  const { online } = usePWA();
  const label = PAGE_LABELS[normalizePath(path)];

  useEffect(() => {
    let frameId = 0;

    const updateVisibility = () => {
      frameId = 0;
      setVisible(window.scrollY > SHOW_AFTER);
    };

    const handleScroll = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updateVisibility);
    };

    updateVisibility();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [path]);

  if (!label || !visible) return null;

  return (
    <nav
      className={`gom-page-breadcrumb${online ? "" : " is-offline"}`}
      aria-label="Breadcrumb"
    >
      <div className="gom-page-breadcrumb__inner container">
        <ol className="gom-page-breadcrumb__trail">
          <li>
            <a href="/" aria-label="Home">
              <i className="bi bi-house-door" aria-hidden="true" />
            </a>
          </li>
          <li className="gom-page-breadcrumb__current" aria-current="page">
            <span className="gom-page-breadcrumb__dot" aria-hidden="true" />
            <span>{label}</span>
          </li>
        </ol>
      </div>
    </nav>
  );
}
