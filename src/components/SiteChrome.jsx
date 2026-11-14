import React, { useEffect, useRef, useState } from "react";
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
  ["Founder", "/founder"],
  ["Co-Founder", "/cofounder"],
  ["Stories", "/success-stories"],
];

const IMAGES = [
  { src: "https://gardenofmercy.org/images/gallery/community-01.png", alt: "Community members working together" },
  { src: "https://gardenofmercy.org/images/gallery/children-01.png", alt: "Children in the community" },
  { src: "https://gardenofmercy.org/images/gallery/volunteers-01.jpg", alt: "Foundation volunteers serving together" },
  { src: "https://gardenofmercy.org/images/gallery/outreach-01.jpg", alt: "Community outreach activity" },
  { src: "https://gardenofmercy.org/images/gallery/community-03.png", alt: "Community members building hope together" },
  { src: "https://gardenofmercy.org/images/gallery/event-01.jpg", alt: "Foundation community event" },
];

function normalizePath(path = "/") {
  if (!path || path === "/") return "/";
  return path.replace(/\/+$/, "") || "/";
}

function AppLink({ to, navigate, className = "", children, onClick, ...props }) {
  const handleClick = (event) => {
    onClick?.(event);
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
    ) return;
    event.preventDefault();
    navigate(to);
  };
  return <a href={to} className={className} onClick={handleClick} {...props}>{children}</a>;
}

function Header({ path = "/", navigate }) {
  const [open, setOpen] = useState(false);
  const scrollPositionRef = useRef(0);
  const menuToggleRef = useRef(null);
  const navRef = useRef(null);
  const { t } = useTranslation("common");
  const { mode, resolvedTheme, setMode } = useTheme();
  const currentPath = normalizePath(path);
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    if (!open) return undefined;

    const body = document.body;
    const previousStyles = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };

    scrollPositionRef.current = window.scrollY;
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollPositionRef.current}px`;
    body.style.width = "100%";

    return () => {
      body.style.overflow = previousStyles.overflow;
      body.style.position = previousStyles.position;
      body.style.top = previousStyles.top;
      body.style.width = previousStyles.width;
      window.scrollTo(0, scrollPositionRef.current);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const focusableSelector = 'a[href], button:not([disabled]), select:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const firstFocusable = navRef.current?.querySelector(focusableSelector);
    firstFocusable?.focus();

    const handleKeyboard = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        menuToggleRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !navRef.current) return;
      const focusable = [...navRef.current.querySelectorAll(focusableSelector)];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const closeOnDesktop = () => {
      if (window.matchMedia("(min-width: 1001px)").matches) setOpen(false);
    };

    document.addEventListener("keydown", handleKeyboard);
    window.addEventListener("resize", closeOnDesktop);
    return () => {
      document.removeEventListener("keydown", handleKeyboard);
      window.removeEventListener("resize", closeOnDesktop);
    };
  }, [open]);

  return (
    <header id="site-header" className={open ? "shadow-lg is-menu-open" : "shadow-lg"}>
      <div className="header-inner">
        <AppLink to="/" navigate={navigate} className="brand" aria-label={t("brand.home")} onClick={closeMenu}>
          <img
            className="brand-logo"
            src={resolvedTheme === "dark"
              ? "https://gardenofmercy.org/images/garden_of_mercy_white_logo_logo.png"
              : "https://gardenofmercy.org/images/logo.png"}
            alt="Garden of Mercy Foundation — Sowing seeds of mercy and compassion"
          />
        </AppLink>
        <button ref={menuToggleRef} className="menu-toggle" type="button" aria-expanded={open} aria-controls="main-navigation"
          aria-label={open ? "Close navigation menu" : t("navigation.open")}
          onClick={() => setOpen((previous) => !previous)}>
          <span>{open ? "Close navigation menu" : t("navigation.menu")}</span>
          <span className="menu-toggle-icon" aria-hidden="true">{open ? "✕" : "☰"}</span>
        </button>
        <nav ref={navRef} id="main-navigation" className={open ? "main-nav is-open" : "main-nav"} aria-label={t("navigation.main")}>
          <div className="mobile-nav-section mobile-nav-explore">
            <p className="mobile-nav-heading">Explore</p>
            <div className="mobile-nav-links">
              {NAV.slice(0, 7).map(([label, href]) => {
                const isActive = currentPath === normalizePath(href);
                const key = href === "/" ? "home" : href.slice(1);
                return (
                  <AppLink key={href} to={href} navigate={navigate}
                    className={isActive ? "nav-link active" : "nav-link"}
                    aria-current={isActive ? "page" : undefined} onClick={closeMenu}>
                    {t(`navigation.${key}`, label)}
                    {isActive && <i className="bi bi-arrow-left-short mobile-nav-current" aria-hidden="true" />}
                  </AppLink>
                );
              })}
            </div>
          </div>
          <div className="mobile-nav-section mobile-nav-action">
            <p className="mobile-nav-heading">Get involved</p>
            <AppLink to="/donate" navigate={navigate}
              className={currentPath === "/donate" ? "nav-donate active" : "nav-donate"}
              aria-current={currentPath === "/donate" ? "page" : undefined} onClick={closeMenu}>
              {t("navigation.donate")} <span aria-hidden="true">↗</span>
            </AppLink>
            <GoogleSignIn navigate={navigate} />
          </div>
          <div className="mobile-nav-section mobile-nav-preferences">
            <p className="mobile-nav-heading">Preferences</p>
            <LanguageSelector />
            <label className="theme-control">
              <i className="bi bi-circle-half" aria-hidden="true" />
              <span>{t("theme.label")}</span>
              <select className="theme-select" value={mode} onChange={(event) => setMode(event.target.value)}
                aria-label={t("theme.choose")} title={t("theme.choose")}>
                <option value="system">{t("theme.system")}</option>
                <option value="light">{t("theme.light")}</option>
                <option value="dark">{t("theme.dark")}</option>
              </select>
            </label>
          </div>
        </nav>
      </div>
    </header>
  );
}

function Footer({ navigate }) {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation("common");
  const exploreLinks = [
    ["about", "/about"], ["programs", "/programs"], ["impact", "/impact"],
    ["stories", "/success-stories"], ["gallery", "/gallery"],
    ["founder", "/founder"], ["cofounder", "/cofounder"],
    ["ministries", "/power-of-revelation-ministries"]
  ];
  const involvedLinks = [
    ["sponsor", "/sponsor"], ["volunteer", "/volunteer"],
    ["donate", "/donate"], ["contact", "/contact"]
  ];

  return (
    <footer id="site-footer" className="shadow-lg" aria-label={t("footer.label")}>
      <div className="container py-5">
        <div className="row g-4 g-lg-5">
          <div className="col-12 col-md-6 col-lg-4">
            <AppLink to="/" navigate={navigate} className="d-inline-block mb-3" aria-label={t("brand.home")}>
              <img src="https://gardenofmercy.org/images/garden_of_mercy_horizontal.png"
                alt="Garden of Mercy Foundation" className="img-fluid" width="260" height="auto"
                loading="lazy" style={{ maxWidth: "260px" }} />
            </AppLink>
            <h2 className="h5 fw-bold mb-3">{t("brand.tagline")}</h2>
            <p className="lh-lg mb-3">{t("footer.mission")}</p>
            <AppLink to="/about" navigate={navigate}
              className="link-underline-opacity-0 link-underline-opacity-75-hover fw-semibold">
              {t("footer.discoverMission")} <i className="bi bi-arrow-right ms-2" aria-hidden="true" />
            </AppLink>
          </div>
          <div className="col-6 col-md-6 col-lg-2">
            <h2 className="h6 text-uppercase fw-bold mb-4">{t("footer.explore")}</h2>
            <nav aria-label={t("footer.explore")}>
              <ul className="list-unstyled d-grid gap-3 mb-0">
                {exploreLinks.map(([key, href]) => (
                  <li key={href}>
                    <AppLink to={href} navigate={navigate}
                      className="link-underline-opacity-0 link-underline-opacity-75-hover">
                      {t(`footer.links.${key}`)}
                    </AppLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="col-6 col-md-6 col-lg-2">
            <h2 className="h6 text-uppercase fw-bold mb-4">{t("footer.getInvolved")}</h2>
            <nav aria-label={t("footer.getInvolved")}>
              <ul className="list-unstyled d-grid gap-3 mb-0">
                {involvedLinks.map(([key, href]) => (
                  <li key={href}>
                    <AppLink to={href} navigate={navigate}
                      className="link-underline-opacity-0 link-underline-opacity-75-hover">
                      {t(`footer.links.${key}`)}
                    </AppLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <h2 className="h6 text-uppercase fw-bold mb-4">{t("footer.commitment")}</h2>
            <p className="lh-lg mb-4">{t("footer.commitmentText")}</p>
            <div className="d-flex flex-wrap gap-3 mb-4">
              <AppLink to="/privacy" navigate={navigate}
                className="link-underline-opacity-0 link-underline-opacity-75-hover small">{t("footer.privacy")}</AppLink>
              <AppLink to="/terms" navigate={navigate}
                className="link-underline-opacity-0 link-underline-opacity-75-hover small">{t("footer.terms")}</AppLink>
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

function Eyebrow({ children }) {
  return <p className="eyebrow">{children}</p>;
}

function PageIntro({ eyebrow, title, text }) {
  return (
    <section className="page-intro">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1>{title}</h1>
      <p>{text}</p>
    </section>
  );
}

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

function CallToAction({ navigate }) {
  return (
    <section className="donate-banner">
      <div>
        <Eyebrow>JOIN THE MISSION</Eyebrow>
        <h2>Let’s help compassion <em>take root.</em></h2>
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
