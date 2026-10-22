import React, { useState } from "react";
import GoogleSignIn from "./GoogleSignIn.jsx";

const NAV = [
  ["Home", "/"],
  ["About", "/about"],
  ["Programs", "/programs"],
  ["Impact", "/impact"],
  ["Gallery", "/gallery"],
  ["Founder", "/founder"],
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

function AppLink({
  to,
  navigate,
  className = "",
  children,
  onClick,
  ...props
}) {
  return (
    <a
      href={to}
      className={className}
      onClick={(event) => {
        onClick?.(event);
        if (
          !event.defaultPrevented &&
          event.button === 0 &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.shiftKey &&
          !event.altKey
        ) {
          event.preventDefault();
          navigate(to);
        }
      }}
      {...props}
    >
      {children}
    </a>
  );
}

function Header({ path, navigate }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="header-inner">
        <AppLink
          to="/"
          navigate={navigate}
          className="brand"
          aria-label="Garden of Mercy Foundation home"
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
          aria-label="Toggle navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Menu"} <span aria-hidden="true">☰</span>
        </button>
        <nav
          className={open ? "main-nav is-open" : "main-nav"}
          aria-label="Main navigation"
        >
          {NAV.map(([label, href]) => (
            <AppLink
              key={href}
              to={href}
              navigate={navigate}
              className={path === href ? "nav-link active" : "nav-link"}
              onClick={() => setOpen(false)}
            >
              {label}
            </AppLink>
          ))}
          <AppLink
            to="/donate"
            navigate={navigate}
            className="nav-donate"
            onClick={() => setOpen(false)}
          >
            Donate <span aria-hidden="true">↗</span>
          </AppLink>
          <GoogleSignIn />
        </nav>
      </div>
    </header>
  );
}

function Footer({ navigate }) {
const currentYear = new Date().getFullYear();

return (
<footer className="site-footer" aria-label="Website footer">
{/* Main footer /}
<div className="footer-main">
<div className="container py-5">
<div className="row g-5">
{/ Brand and mission */}
<div className="col-lg-4 col-md-6">
<AppLink
to="/"
navigate={navigate}
className="footer-logo-link"
>
<img
src="/images/garden_of_mercy_horizontal.png"
alt="Garden of Mercy Foundation"
className="footer-logo"
width="260"
height="auto"
loading="lazy"
/>
</AppLink>

          <p className="footer-tagline mt-3">
            Sowing Seeds of Mercy and Compassion.
          </p>

          <p className="footer-description">
            We are committed to restoring dignity, nurturing children,
            supporting vulnerable people, and building compassionate
            communities where everyone has an opportunity to thrive.
          </p>

          <AppLink
            to="/about"
            navigate={navigate}
            className="footer-text-link"
          >
            Discover our mission
            <i className="bi bi-arrow-right ms-2" aria-hidden="true" />
          </AppLink>
        </div>

        {/* Explore */}
        <div className="col-6 col-lg-2 col-md-6">
          <h2 className="footer-heading">Explore</h2>

          <nav aria-label="Footer navigation">
            <ul className="footer-links list-unstyled">
              {NAV.slice(1, 6).map(([label, href]) => (
                <li key={href}>
                  <AppLink to={href} navigate={navigate}>
                    {label}
                  </AppLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Get involved */}
        <div className="col-6 col-lg-2 col-md-6">
          <h2 className="footer-heading">Get involved</h2>

          <ul className="footer-links list-unstyled">
            <li>
              <AppLink to="/donate" navigate={navigate}>
                Make a donation
              </AppLink>
            </li>
            <li>
              <AppLink to="/contact" navigate={navigate}>
                Contact us
              </AppLink>
            </li>
            <li>
              <AppLink to="/success-stories" navigate={navigate}>
                Success stories
              </AppLink>
            </li>
            <li>
              <AppLink to="/impact" navigate={navigate}>
                Our impact
              </AppLink>
            </li>
          </ul>
        </div>

        {/* Trust and legal */}
        <div className="col-lg-4 col-md-6">
          <h2 className="footer-heading">Our commitment</h2>

          <p className="footer-description">
            Every act of kindness matters. We believe in compassion,
            accountability, and making a meaningful difference in the
            lives of the people and communities we serve.
          </p>

          <ul className="footer-links list-unstyled">
            <li>
              <AppLink to="/privacy" navigate={navigate}>
                Privacy policy
              </AppLink>
            </li>
            <li>
              <AppLink to="/terms" navigate={navigate}>
                Terms of use
              </AppLink>
            </li>
          </ul>

          <AppLink
            to="/donate"
            navigate={navigate}
            className="btn footer-donate-btn mt-3"
          >
            Sow a seed of mercy
            <i className="bi bi-heart-fill ms-2" aria-hidden="true" />
          </AppLink>
        </div>
      </div>
    </div>
  </div>

  {/* Scripture and values */}
  <div className="footer-scripture">
    <div className="container py-3">
      <p className="mb-0">
        <i className="bi bi-heart-fill me-2" aria-hidden="true" />
        “I was hungry and you gave me something to eat.”
        <span className="footer-scripture-reference">
          Matthew 25:35–45
        </span>
      </p>
    </div>
  </div>

  {/* Copyright */}
  <div className="footer-bottom">
    <div className="container py-3">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
        <p className="mb-0">
          © {currentYear} Garden of Mercy Foundation.
          All rights reserved.
        </p>

        <p className="mb-0 footer-bottom-tagline">
          Sowing hope. Restoring dignity. Transforming lives.
        </p>
      </div>
    </div>
  </div>
{/* Development notice */}
  <div
    className="development-notice"
    role="status"
    aria-live="polite"
  >
    <span className="development-indicator" aria-hidden="true"></span>

    <i className="bi bi-tools" aria-hidden="true"></i>

    <span>
      <strong>Website in Development</strong>
      <span className="development-message">
        {" "} — We’re working to improve your experience.
      </span>
    </span>
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
      <span className="card-rule" />
    </article>
  );
}

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
        Support our work <span>↗</span>
      </AppLink>
    </section>
  );
}

export { NAV, IMAGES, AppLink, Header, Footer, Eyebrow, PageIntro, FocusCard, CallToAction };
