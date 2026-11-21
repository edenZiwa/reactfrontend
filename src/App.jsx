
import React, { lazy, Suspense, useEffect } from "react";
import { createRoot } from "react-dom/client";

import "./i18n/index.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./css/shared-ux.css";
import "./css/language-selector.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./css/styles.css";
import "./css/app.css";
import "./css/scroll-reveal.css";
import usePath from "./components/usePath.js";
import SEO from "./components/SEO.jsx";
import {
  Header,
  Footer,
} from "./components/SiteChrome.jsx";
import PopupManager from "./components/PopupManager.jsx";
import AppErrorBoundary from "./components/AppErrorBoundary.jsx";

import { PWAProvider } from "./components/PWAProvider.jsx";
import PWAInstallPrompt from "./components/PWAInstallPrompt.jsx";
import PWAUpdatePrompt from "./components/PWAUpdatePrompt.jsx";
import NetworkStatus from "./components/NetworkStatus.jsx";
import PushNotificationPrompt from "./components/PushNotificationPrompt.jsx";

import ScrollNavigator from "./components/ScrollNavigator.jsx";
import ScrollReveal from "./components/ScrollReveal.jsx";
import { ToastProvider } from "./components/ux/ToastProvider.jsx";
const Home = React.lazy(() => import("./pages/Home.jsx"));
const About = React.lazy(() => import("./pages/About.jsx"));
const Programs = React.lazy(() => import("./pages/Programs.jsx"));
const Impact = React.lazy(() => import("./pages/Impact.jsx"));
const Gallery = React.lazy(() => import("./pages/Gallery.jsx"));
const Founder = React.lazy(() => import("./pages/Founder.jsx"));
const Donate = React.lazy(() => import("./pages/Donate.jsx"));
const DonationResult = React.lazy(() => import("./pages/DonationResult.jsx"));
const Contact = React.lazy(() => import("./pages/Contact.jsx"));
const Terms = React.lazy(() => import("./pages/Terms.jsx"));
const Volunteer = React.lazy(() => import("./pages/Volunteer.jsx"));
const Privacy = React.lazy(() => import("./pages/Privacy.jsx"));
const NotFound = React.lazy(() => import("./pages/NotFound.jsx"));
const Sponsor = React.lazy(() => import("./pages/Sponsor.jsx"));
const Account = React.lazy(() => import("./pages/Account.jsx"));
const AccountAccess = React.lazy(() => import("./pages/AccountAccess.jsx"));
const PasswordRecovery = React.lazy(() => import("./pages/PasswordRecovery.jsx"));
const SuccessStories = React.lazy(() => import("./pages/SuccessStories.jsx"));
const Cofounder = React.lazy(() => import("./pages/Cofounder.jsx"));
const PowerOfRevelation = React.lazy(() => import("./pages/PowerOfRevelation.jsx"));
const Admin = React.lazy(() => import("./pages/Admin.jsx"));
const NotificationSettings = React.lazy(() => import("./pages/NotificationSettings.jsx"));

function RouteLoading() {
  return (
    <div className="container py-5 text-center" role="status" aria-live="polite">
      <div className="spinner-border text-success" aria-hidden="true" />
      <span className="visually-hidden">Loading page...</span>
    </div>
  );
}
import ThemeProvider from "./components/ThemeProvider.jsx";
import { AuthProvider } from "./auth/AuthProvider.jsx";
import "./css/theme.css";
import "./css/scroll-experience.css";

function App() {
  const [path, navigate, navigation] = usePath();

  // Dismiss the static launch screen only after React has mounted.
  useEffect(() => {
    const launchScreen = document.getElementById("gom-launch-screen");
    if (!launchScreen) return undefined;
    const frame = window.requestAnimationFrame(() => {
      launchScreen.classList.add("is-leaving");
      window.setTimeout(() => launchScreen.remove(), 500);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);


  // The hero eyebrow itself becomes the sticky breadcrumb; it is never cloned.
  useEffect(() => {
    const stickyPaths = new Set([
      "/about", "/programs", "/donate", "/volunteer",
      "/success-stories", "/contact", "/impact", "/gallery",
      "/sponsor", "/founder", "/cofounder",
    ]);
    if (!stickyPaths.has(path)) return undefined;

    const eyebrow = document.querySelector("#main-content .hero-eyebrow");
    if (!eyebrow) return undefined;

    // Raise only the hero section that owns the original eyebrow. This
    // lifts its local stacking context above page content without allowing
    // it to cover the header or system-level overlays.
    const stickyOwner = eyebrow.closest("section");
    if (!stickyOwner) return undefined;

    let frameId = 0;
    const updateStickyState = () => {
      frameId = 0;
      const isSticky = window.scrollY > 150;
      eyebrow.classList.toggle("is-sticky", isSticky);
      stickyOwner.classList.toggle("has-sticky-eyebrow", isSticky);
    };
    const onScroll = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updateStickyState);
    };

    updateStickyState();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameId) window.cancelAnimationFrame(frameId);
      eyebrow.classList.remove("is-sticky");
      stickyOwner.classList.remove("has-sticky-eyebrow");
    };
  }, [path]);

  // Route transitions, fragment navigation and browser history restoration.
  useEffect(() => {
    let frame = 0;
    let secondFrame = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior = reducedMotion ? "auto" : "smooth";

    const scrollToHash = () => {
      if (!navigation.hash) return false;
      let id;
      try {
        id = decodeURIComponent(navigation.hash.slice(1));
      } catch {
        id = navigation.hash.slice(1);
      }
      const target = document.getElementById(id) ||
        document.querySelector(`[name="${CSS.escape(id)}"]`);
      if (!target) return false;

      const header = document.getElementById("site-header");
      const offline = document.querySelector(".gom-offline-status");
      const headerHeight = header?.getBoundingClientRect().height || 0;
      const offlineHeight = offline?.getBoundingClientRect().height || 0;
      const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerHeight - offlineHeight - 12);
      window.scrollTo({ top, behavior });
      return true;
    };

    frame = window.requestAnimationFrame(() => {
      if (navigation.type === "POP") {
        if (navigation.hash) {
          if (!scrollToHash()) {
            secondFrame = window.requestAnimationFrame(scrollToHash);
          }
        } else {
          window.scrollTo({ top: navigation.scrollY || 0, behavior: "auto" });
        }
        return;
      }

      if (navigation.hash) {
        if (!scrollToHash()) secondFrame = window.requestAnimationFrame(scrollToHash);
      } else {
        window.scrollTo({ top: 0, behavior: "auto" });
        document.getElementById("main-content")?.focus({ preventScroll: true });
      }
    });

    return () => {
      window.cancelAnimationFrame(frame);
      if (secondFrame) window.cancelAnimationFrame(secondFrame);
    };
  }, [path, navigation.id]);

  if (path.startsWith("/admin")) {
    return <><SEO path={path} /><Suspense fallback={<RouteLoading />}><Admin path={path} navigate={navigate} /></Suspense></>;
  }

  let page;

  switch (path) {
    case "/":
      page = <Home navigate={navigate} />;
      break;

    case "/about":
      page = <About navigate={navigate} />;
      break;

    case "/programs":
      page = <Programs navigate={navigate} />;
      break;

    case "/impact":
      page = <Impact navigate={navigate} />;
      break;

    case "/success-stories":
      page = <SuccessStories navigate={navigate} />;
      break;

    case "/gallery":
      page = <Gallery navigate={navigate} />;
      break;

    case "/founder":
      page = <Founder navigate={navigate} />;
      break;

    case "/cofounder":
      page = <Cofounder navigate={navigate} />;
      break;

    case "/donate":
      page = <Donate navigate={navigate} />;
      break;

    case "/donation-result":
      page = <DonationResult navigate={navigate} />;
      break;

    case "/contact":
      page = <Contact navigate={navigate} />;
      break;

    case "/sponsor":
      page = <Sponsor navigate={navigate} />;
      break;

    case "/volunteer":
      page = <Volunteer navigate={navigate} />;
      break;

    case "/notifications":
      page = <NotificationSettings navigate={navigate} />;
      break;

    case "/account":
      page = <Account navigate={navigate} />;
      break;

    case "/login":
      page = <AccountAccess navigate={navigate} />;
      break;

    case "/forgot-password":
      page = <PasswordRecovery navigate={navigate} mode="forgot" />;
      break;

    case "/reset-password":
      page = <PasswordRecovery navigate={navigate} mode="reset" />;
      break;

    case "/privacy":
      page = <Privacy kind="privacy" navigate={navigate} />;
      break;

    case "/terms":
      page = <Terms kind="terms" navigate={navigate} />;
      break;

    case "/power-of-revelation-ministries":
      page = <PowerOfRevelation navigate={navigate} />;
      break;

    default:
      page = <NotFound navigate={navigate} />;
      break;
  }

  return (
    <div className="app-shell">
      <SEO path={path} />
      <ScrollReveal path={path} />

      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <Header
        path={path}
        navigate={navigate}
      />
      <PushNotificationPrompt />
      <NetworkStatus />

      <PopupManager
        path={path}
        navigate={navigate}
      />

      <main
        id="main-content"
        key={path}
        tabIndex={-1}
className="pt-5"
      >
        <Suspense fallback={<RouteLoading />}>{page}</Suspense>
      </main>

      {/* Floating scroll control: mounted on every route */}
      <ScrollNavigator />

      <Footer navigate={navigate} />
    </div>
  );
}

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <AppErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <PWAProvider>
            <PWAUpdatePrompt />
            <AuthProvider>
              <App />
            </AuthProvider>
            <PWAInstallPrompt />
          </PWAProvider>
        </ToastProvider>
      </ThemeProvider>
      </AppErrorBoundary>
    </React.StrictMode>
  );
}
