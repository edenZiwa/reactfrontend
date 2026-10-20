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
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <img
            src="/images/garden_of_mercy_horizontal.png"
            alt="Garden of Mercy Foundation"
          />
          <p>Sowing seeds of mercy and compassion.</p>
        </div>
        <div>
          <h3>Explore</h3>
          {NAV.slice(1, 6).map(([label, href]) => (
            <AppLink key={href} to={href} navigate={navigate}>
              {label}
            </AppLink>
          ))}
        </div>
        <div>
          <h3>Get involved</h3>
          <AppLink to="/donate" navigate={navigate}>
            Make a donation
          </AppLink>
          <AppLink to="/contact" navigate={navigate}>
            Contact us
          </AppLink>
          <AppLink to="/privacy" navigate={navigate}>
            Privacy
          </AppLink>
          <AppLink to="/terms" navigate={navigate}>
            Terms
          </AppLink>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Garden of Mercy Foundation</span>
        <span>Matthew 25:35–45 · Compassion in action</span>
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
