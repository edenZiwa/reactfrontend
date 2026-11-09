
import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./css/shared-ux.css";
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

import ScrollNavigator from "./components/ScrollNavigator.jsx";
import ScrollReveal from "./components/ScrollReveal.jsx";
import { ToastProvider } from "./components/ux/ToastProvider.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Programs from "./pages/Programs.jsx";

import Impact from "./pages/Impact.jsx";
import Gallery from "./pages/Gallery.jsx";
import Founder from "./pages/Founder.jsx";
import Donate from "./pages/Donate.jsx";

import DonationResult from "./pages/DonationResult.jsx";
import Contact from "./pages/Contact.jsx";
import Terms from "./pages/Terms.jsx";
import Volunteer from "./pages/Volunteer.jsx";

import Privacy from "./pages/Privacy.jsx";
import NotFound from "./pages/NotFound.jsx";
import Sponsor from "./pages/Sponsor.jsx";
import Account from "./pages/Account.jsx";
import AccountAccess from "./pages/AccountAccess.jsx";
import PasswordRecovery from "./pages/PasswordRecovery.jsx";

import SuccessStories from "./pages/SuccessStories.jsx";
import Cofounder from "./pages/Cofounder.jsx";
import PowerOfRevelation from "./pages/PowerOfRevelation.jsx";
import Admin from "./pages/Admin.jsx";
import ThemeProvider from "./components/ThemeProvider.jsx";
import { AuthProvider } from "./auth/AuthProvider.jsx";
import "./css/theme.css";
import "./css/scroll-experience.css";

function App() {
  const [path, navigate] = usePath();

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

  // Start each newly selected route at the top without forcing motion.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    document.getElementById("main-content")?.focus({ preventScroll: true });
  }, [path]);

  if (path.startsWith("/admin")) {
    return <><SEO path={path} /><Admin path={path} navigate={navigate} /></>;
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
        {page}
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
