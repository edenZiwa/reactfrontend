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
import usePath from "./components/usePath.js";
import SEO from "./components/SEO.jsx";
import { Header, Footer } from "./components/SiteChrome.jsx";
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

function App() {
  const [path, navigate] = usePath();
 /* useEffect(() => {
    const title =
      {
        "/": "Garden of Mercy Foundation",
        "/about": "About Us",
        "/programs": "Our Programs",
        "/impact": "Our Impact",
        "/gallery": "Gallery",
        "/founder": "Founder",
        "/donate": "Donate",
        "/donation-result": "Donation Status",
        "/contact": "Contact",
        "/sponsor": "Sponsor a Cause",
        "/account": "Account",
        "/privacy": "Privacy",
        "/terms": "Terms",
        "/success-stories": "Success Stories",
        "/volunteer": "Volunteer",
      }[path] || "Garden of Mercy Foundation";
    document.title = `${title} | Garden of Mercy Foundation`;
  }, [path]); */
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
      page = <Gallery />;
      break;
    case "/founder":
      page = <Founder navigate={navigate} />;
      break;
    case "/donate":
      page = <Donate />;
      break;
    case "/donation-result":
      page = <DonationResult navigate={navigate} />;
      break;
    case "/contact":
      page = <Contact />;
      break;
    case "/sponsor":
      page = <Sponsor navigate={navigate} />;
      break;
    case "/volunteer":
    case "/account":
      page = <Account navigate={navigate} />;
      break;
    case "/privacy":
      page = <Privacy kind="privacy" />;
      break;
    case "/terms":
      page = <Terms kind="terms" />;
      break;
    default:
      page = <NotFound navigate={navigate} />;
  }
  return (
    <div className="app-shell">
       <SEO path={path} />
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header path={path} navigate={navigate} />
      <main id="main-content" key={path}>
        {page}
      </main>
      <Footer navigate={navigate} />
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
