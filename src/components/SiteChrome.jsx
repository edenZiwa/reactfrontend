import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import GoogleSignIn from "./GoogleSignIn.jsx";
import { useTheme } from "./ThemeProvider.jsx";
import LanguageSelector from "./LanguageSelector.jsx";

const NAV = [
  ["Home", "/"],
  ["About", "/about"],
  ["Programs", "/programs"],
  ["Impact", "/impact"],
  ["Gallery", "/gallery"],
  ["Sponsor", "/sponsor"],
  ["Contact", "/contact"],
  ["{t("footer.founder")}", "/founder"],
  ["Co-{t("footer.founder")}", "/cofounder"],
  ["Stories", "/success-stories"],
];

const IMAGES = [
  {
    src: "https://gardenofmercy.org/images/gallery/community-01.png",
    alt: "Community members working together",
  },
  {
    src: "https://gardenofmercy.org/images/gallery/children-01.png",
    alt: "Children in the community",
  },
  {
    src: "https://gardenofmercy.org/images/gallery/volunteers-01.jpg",
    alt: "Foundation volunteers serving together",
  },
  {
    src: "https://gardenofmercy.org/images/gallery/outreach-01.jpg",
    alt: "Community outreach activity",
  },
  {
    src: "https://gardenofmercy.org/images/gallery/community-03.png",
    alt: "Community members building hope together",
  },
  {
    src: "https://gardenofmercy.org/images/gallery/event-01.jpg",
    alt: "Foundation community event",
  },
];

// Normalize paths to support trailing slashes.
function normalizePath(path = "/") {
  if (!path || path === "/") return "/";
  return path.replace(/\/+$/, "") || "/";
}

// Reusable navigation link with client-side navigation support.
function AppLink({
  to,
  navigate,
  className = "",
  children,
  onClick,
  ...props
}) {
  const handleClick = (event) => {
    onClick?.(event);

    // Preserve browser behavior for prevented, modified,
    // non-primary, external, and non-local link clicks.
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.currentTarget.target === "_blank" ||
      event.currentTarget.hasAttribute("download") ||
      typeof navigate !== "function" ||
      typeof to !== "string" ||
      !to.startsWith("/") ||
      to.startsWith("//")
    ) {
      return;
    }

    event.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}

// Main site header.
function Header({ path = "/", navigate }) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation("common");
  const { mode, resolvedTheme, setMode } = useTheme();
  const currentPath = normalizePath(path);

  const closeMenu = () => setOpen(false);

  return (
    <header id="site-header" className="shadow-lg">
      <div className="header-inner">
        <AppLink
          to="/"
          navigate={navigate}
          className="brand"
          aria-label={t("brand.home")}
          onClick={closeMenu}
        >
          <img
            className="brand-logo"
            src={resolvedTheme === "dark"
              ? "https://gardenofmercy.org/images/garden_of_mercy_white_logo_logo.png"
              : "https://gardenofmercy.org/images/logo.png"}
            alt="Garden of Mercy Foundation — Sowing seeds of mercy and compassion"
          />
        </AppLink>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="main-navigation"
          aria-label={open ? t("navigation.close") : t("navigation.open")}
          onClick={() => setOpen((previous) => !previous)}
        >
          {open ? t("navigation.close") : t("navigation.menu")}
          <span aria-hidden="true">{open ? "✕" : "☰"}</span>
        </button>

        <nav
          id="main-navigation"
          className={open ? "main-nav is-open" : "main-nav"}
          aria-label={t("navigation.main")}
        >
          {NAV.slice(0, 7).map(([label, href]) => {
            const isActive = currentPath === normalizePath(href);

            return (
              <AppLink
                key={href}
                to={href}
                navigate={navigate}
                className={isActive ? "nav-link active" : "nav-link"}
                aria-current={isActive ? "page" : undefined}
                onClick={closeMenu}
              >
                {t(`navigation.${href.slice(1) || "home"}`, label)}
              </AppLink>
            );
          })}

          <AppLink
            to="/donate"
            navigate={navigate}
            className={
              currentPath === "/donate" ? "nav-donate active" : "nav-donate"
            }
            aria-current={currentPath === "/donate" ? "page" : undefined}
            onClick={closeMenu}
          >
            {t("navigation.donate")} <span aria-hidden="true">↗</span>
          </AppLink>

          <LanguageSelector />

          <label className="theme-control">
            <i className="bi bi-circle-half" aria-hidden="true" />
            <span className="visually-hidden">{t("theme.label")}</span>
            <select
              className="theme-select"
              value={mode}
              onChange={(event) => setMode(event.target.value)}
              aria-label={t("theme.choose")}
              title={t("theme.choose")}
            >
              <option value="system">{t("theme.system")}</option>
              <option value="light">{t("theme.light")}</option>
              <option value="dark">{t("theme.dark")}</option>
            </select>
          </label>
          <GoogleSignIn />
        </nav>
      </div>
    </header>
  );
}

// Main site footer.
function Footer({ navigate }) {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation("common");
  const exploreLinks = [
    ["about", "/about"], ["programs", "/programs"], ["impact", "/impact"],
    ["stories", "/success-stories"], ["gallery", "/gallery"],
    ["founder", "/founder"], ["cofounder", "/cofounder"],
    ["ministries", "/power-of-revelation-ministries"]
  ];
  return (
    <footer id="site-footer" className="shadow-lg" aria-label={t("footer.label")}>
      <div className="container py-5">
        <div className="row g-4 g-lg-5">
          <div className="col-12 col-md-6 col-lg-4">
            <AppLink to="/" navigate={navigate} className="d-inline-block mb-3" aria-label={t("brand.home")}>
              <img src="https://gardenofmercy.org/images/garden_of_mercy_horizontal.png" alt="Garden of Mercy Foundation" className="img-fluid" width="260" height="auto" loading="lazy" style={{ maxWidth: "260px" }} />
            </AppLink>
            <h2 className="h5 fw-bold mb-3">{t("brand.tagline")}</h2>
            <p className="lh-lg mb-3">{t("footer.mission")}</p>
            <AppLink to="/about" navigate={navigate} className="link-underline-opacity-0 link-underline-opacity-75-hover fw-semibold">
              {t("footer.discoverMission")} <i className="bi bi-arrow-right ms-2" aria-hidden="true" />
            </AppLink>
          </div>
          <div className="col-6 col-md-6 col-lg-2">
            <h2 className="h6 text-uppercase fw-bold mb-4">{t("footer.explore")}</h2>
            <nav aria-label={t("footer.explore")}>
              <ul className="list-unstyled d-grid gap-3 mb-0">
                {exploreLinks.map(([key, href]) => (
                  <li key={href}><AppLink to={href} navigate={navigate} className="link-underline-opacity-0 link-underline-opacity-75-hover">{t(`footer.links.${key}`)}</AppLink></li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="col-6 col-md-6 col-lg-2">
            <h2 className="h6 text-uppercase fw-bold mb-4">{t("footer.getInvolved")}</h2>
            <nav aria-label={t("footer.getInvolved")}>
              <ul className="list-unstyled d-grid gap-3 mb-0">
                {[["sponsor", "/sponsor"], ["volunteer", "/volunteer"], ["donate", "/donate"], ["contact", "/contact"]].map(([key, href]) => (
                  <li key={href}><AppLink to={href} navigate={navigate} className="link-underline-opacity-0 link-underline-opacity-75-hover">{t(`footer.links.${key}`)}</AppLink></li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <h2 className="h6 text-uppercase fw-bold mb-4">{t("footer.commitment")}</h2>
            <p className="lh-lg mb-4">{t("footer.commitmentText")}</p>
            <div className="d-flex flex-wrap gap-3 mb-4">
              <AppLink to="/privacy" navigate={navigate} className="link-underline-opacity-0 link-underline-opacity-75-hover small">{t("footer.privacy")}</AppLink>
              <AppLink to="/terms" navigate={navigate} className="link-underline-opacity-0 link-underline-opacity-75-hover small">{t("footer.terms")}</AppLink>
            </div>
            <AppLink to="/donate" navigate={navigate} className="btn btn-warning fw-bold px-4 py-3 rounded-pill">
              {t("footer.seed")} <i className="bi bi-heart-fill ms-2" aria-hidden="true" />
            </AppLink>
          </div>
        </div>
      </div>
      <div className="border-top border-secondary">
        <div className="container py-4">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-center gap-2 gap-md-3 text-center">
            <i className="bi bi-heart-fill text-warning" aria-hidden="true" />
            <p className="mb-0 fst-italic">{t("footer.scripture")}</p>
            <span className="small fw-bold text-warning">{t("footer.scriptureReference")}</span>
          </div>
        </div>
      </div>
      <div className="border-top border-secondary">
        <div className="container py-4">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-2 text-center text-md-start">
            <p className="small mb-0">{t("footer.copyright", { year: currentYear })}</p>
            <p className="small mb-0">{t("footer.closing")}</p>
          </div>
        </div>
      </div>
      <div className="bg-warning py-2 px-3" role="status" aria-live="polite">
        <div className="container d-flex flex-wrap align-items-center justify-content-center gap-2 text-center">
          <span className="rounded-circle bg-success border border-dark" style={{ width: "8px", height: "8px" }} aria-hidden="true" />
          <i className="bi bi-heart-fill" aria-hidden="true" />
          <span className="small"><strong>{t("footer.noticeTitle")}</strong><span> {t("footer.noticeText")}</span></span>
        </div>
      </div>
    </footer>
  );
}

// Reusable eyebrow label.
function Eyebrow({ children }) {
  return <p className="eyebrow">{children}</p>;
}

// Reusable page introduction.
function PageIntro({ eyebrow, title, text }) {
  return (
    <section className="page-intro">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1>{title}</h1>
      <p>{text}</p>
    </section>
  );
}

// Reusable focus card.
function FocusCard({ number, title, text, symbol }) {
  return (
    <article className="focus-card">
      <div className="focus-card-top">
        <span>{number}</span>
        <b aria-hidden="true">{symbol}</b>
      </div>

      <h3>{title}</h3>
      <p>{text}</p>
      <span className="card-rule" aria-hidden="true" />
    </article>
  );
}

// Reusable call-to-action banner.
function CallToAction({ navigate }) {
  return (
    <section className="donate-banner">
      <div>
        <Eyebrow>JOIN THE MISSION</Eyebrow>

        <h2>
          Let’s help compassion <em>take root.</em>
        </h2>

        <p>Every act of care can help build a stronger community.</p>
      </div>

      <AppLink to="/donate" navigate={navigate} className="button button-gold">
        Support our work <span aria-hidden="true">↗</span>
      </AppLink>
    </section>
  );
}

export {
  NAV,
  IMAGES,
  AppLink,
  Header,
  Footer,
  Eyebrow,
  PageIntro,
  FocusCard,
  CallToAction,
};
