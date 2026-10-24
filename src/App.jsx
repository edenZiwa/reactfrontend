
import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";

import "./css/bootstrap.min.css";
import "./css/account.css";
import "./css/donate.css";
import "./css/gallary.css";
import "./css/founder.css";
import "./css/sponsor.css";
import "./css/styles.css";
import "./css/app.css";

// Uncomment if Bootstrap Icons are installed through npm.
// import "bootstrap-icons/font/bootstrap-icons.css";

import usePath from "./components/usePath.js";
import SEO from "./components/SEO.jsx";
import {
  Header,
  Footer,
} from "./components/SiteChrome.jsx";

import PopupManager from "./components/PopupManager.jsx";
import ScrollNavigator from "./components/ScrollNavigator.jsx";

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
import SuccessStories from "./pages/SuccessStories.jsx";
import Cofounder from "./pages/Cofounder.jsx";
import PowerOfRevelation from "./pages/PowerOfRevelation.jsx";

function App() {
  const [path, navigate] = usePath();

  // Return to the top when navigating between pages.
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }, [path]);

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

      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <Header
        path={path}
        navigate={navigate}
      />

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
      <App />
    </React.StrictMode>
  );
}
