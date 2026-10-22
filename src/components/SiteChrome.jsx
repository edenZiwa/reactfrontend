import React, { useState } from "react";
import GoogleSignIn from "./GoogleSignIn.jsx";

const NAV = [
  ["Home", "/"],
  ["About", "/about"],
  ["Programs", "/programs"],
  ["Impact", "/impact"],
  ["Gallery", "/gallery"],
  ["Founder", "/founder"],
  ["Co-Founder", "/cofounder"],
  ["Contact", "/contact"],
  ["Sponsor", "/sponsor"],
  ["Stories", "/success-stories"],
  
];

const IMAGES = [
  {
    src: "/images/gallery/community-01.png",
    alt: "Community members working together",
  },
  {
    src: "/images/gallery/children-01.png",
    alt: "Children in the community",
  },
  {
    src: "/images/gallery/volunteers-01.jpg",
    alt: "Foundation volunteers serving together",
  },
  {
    src: "/images/gallery/outreach-01.jpg",
    alt: "Community outreach activity",
  },
  {
    src: "/images/gallery/community-03.png",
    alt: "Community members building hope together",
  },
  {
    src: "/images/gallery/event-01.jpg",
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
  const currentPath = normalizePath(path);

  const closeMenu = () => setOpen(false);

  return (
    <header id="site-header" className="shadow-lg">
      <div className="header-inner">
        <AppLink
          to="/"
          navigate={navigate}
          className="brand"
          aria-label="Garden of Mercy Foundation home"
          onClick={closeMenu}
        >
          <img
            src="/images/logo.png"
            alt="Garden of Mercy Foundation — Sowing seeds of mercy and compassion"
          />
        </AppLink>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="main-navigation"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setOpen((previous) => !previous)}
        >
          {open ? "Close" : "Menu"}
          <span aria-hidden="true">{open ? "✕" : "☰"}</span>
        </button>

        <nav
          id="main-navigation"
          className={open ? "main-nav is-open" : "main-nav"}
          aria-label="Main navigation"
        >
          {NAV.map(([label, href]) => {
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
                {label}
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
            Donate <span aria-hidden="true">↗</span>
          </AppLink>

          <GoogleSignIn />
        </nav>
      </div>
    </header>
  );
}

// Main site footer.
function Footer({ navigate }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="site-footer" className="shadow-lg" aria-label="Website footer">
      {/* Main footer */}
      <div className="container py-5">
        <div className="row g-4 g-lg-5">
          {/* Brand and mission */}
          <div className="col-12 col-md-6 col-lg-4">
            <AppLink
              to="/"
              navigate={navigate}
              className="d-inline-block mb-3"
              aria-label="Garden of Mercy Foundation home"
            >
              <img
                src="/images/garden_of_mercy_horizontal.png"
                alt="Garden of Mercy Foundation"
                className="img-fluid"
                width="260"
                height="auto"
                loading="lazy"
                style={{ maxWidth: "260px" }}
              />
            </AppLink>

            <h2 className="h5 fw-bold  mb-3">
              Sowing Seeds of Mercy
            </h2>

            <p className=" lh-lg mb-3">
              We are committed to restoring dignity, nurturing children,
              supporting vulnerable people, and building compassionate
              communities where everyone has an opportunity to thrive.
            </p>

            <AppLink
              to="/about"
              navigate={navigate}
              className="link-underline-opacity-0 link-underline-opacity-75-hover fw-semibold"
            >
              Discover our mission
              <i className="bi bi-arrow-right ms-2" aria-hidden="true" />
            </AppLink>
          </div>

          {/* Explore */}
          <div className="col-6 col-md-6 col-lg-2">
            <h2 className="h6 text-uppercase fw-bold mb-4">
              Explore
            </h2>

            <nav aria-label="Footer navigation">
              <ul className="list-unstyled d-grid gap-3 mb-0">
                {NAV.slice(1, 7).map(([label, href]) => (
                  <li key={href}>
                    <AppLink
                      to={href}
                      navigate={navigate}
                      className="link-underline-opacity-0 link-underline-opacity-75-hover"
                    >
                      {label}
                    </AppLink>
                  </li>
                  
                ))}
              </ul>
            </nav>
          </div>

          {/* Get involved */}
          <div className="col-6 col-md-6 col-lg-2">
            <h2 className="h6 text-uppercase fw-bold mb-4">
              Get involved
            </h2>

            <ul className="list-unstyled d-grid gap-3 mb-0">
              <li>
                <AppLink
                  to="/donate"
                  navigate={navigate}
                  className="link-underline-opacity-0 link-underline-opacity-75-hover"
                >
                  Make a donation
                </AppLink>
              </li>
              <li>
                <AppLink
                  to="/contact"
                  navigate={navigate}
                  className="link-underline-opacity-0 link-underline-opacity-75-hover"
                >
                  Contact us
                </AppLink>
              </li>
              <li>
                <AppLink
                  to="/success-stories"
                  navigate={navigate}
                  className="link-underline-opacity-0 link-underline-opacity-75-hover"
                >
                  Success stories
                </AppLink>
              </li>
              <li>
                <AppLink
                  to="/impact"
                  navigate={navigate}
                  className="link-underline-opacity-0 link-underline-opacity-75-hover"
                >
                  Our impact
                </AppLink>
              </li>
            </ul>
          </div>

          {/* Commitment and donation */}
          <div className="col-12 col-md-6 col-lg-4">
            <h2 className="h6 text-uppercase fw-bold mb-4">
              Our commitment
            </h2>

            <p className="lh-lg mb-4">
              Every act of kindness matters. We believe in compassion,
              accountability, and making a meaningful difference in the lives of
              the people and communities we serve.
            </p>

            <div className="d-flex flex-wrap gap-3 mb-4">
              <AppLink
                to="/privacy"
                navigate={navigate}
                className="link-underline-opacity-0 link-underline-opacity-75-hover small"
              >
                Privacy policy
              </AppLink>

              <AppLink
                to="/terms"
                navigate={navigate}
                className="link-underline-opacity-0 link-underline-opacity-75-hover small"
              >
                Terms of use
              </AppLink>
            </div>

            <AppLink
              to="/donate"
              navigate={navigate}
              className="btn btn-warning fw-bold px-4 py-3 rounded-pill"
            >
              Sow a seed of mercy
              <i className="bi bi-heart-fill ms-2" aria-hidden="true" />
            </AppLink>
          </div>
        </div>
      </div>

      {/* Scripture */}
      <div className="border-top border-secondary">
        <div className="container py-4">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-center gap-2 gap-md-3 text-center">
            <i className="bi bi-heart-fill text-warning" aria-hidden="true" />

            <p className="mb-0 fst-italic">
              “I was hungry and you gave me something to eat.”
            </p>

            <span className="small fw-bold text-warning">Matthew 25:35–45</span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-top border-secondary bg-black bg-opacity-25">
        <div className="container py-4">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-2 text-center text-md-start">
            <p className="small mb-0">
              © {currentYear} Garden of Mercy Foundation. All rights reserved.
            </p>

            <p className="small mb-0">
              Sowing hope. Restoring dignity. Transforming lives.
            </p>
          </div>
        </div>
      </div>

      {/* Development notice */}
      <div
        className="bg-warning py-2 px-3"
        role="status"
        aria-live="polite"
      >
        <div className="container d-flex flex-wrap align-items-center justify-content-center gap-2 text-center">
          <span
            className="rounded-circle bg-success border border-dark"
            style={{ width: "8px", height: "8px" }}
            aria-hidden="true"
          />

          <i className="bi bi-tools" aria-hidden="true" />

          <span className="small">
            <strong>Website in Development</strong>
            <span> — We’re working to improve your experience.</span>
          </span>
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
