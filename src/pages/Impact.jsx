import React from "react";
import { AppLink } from "../components/SiteChrome.jsx";
import ContentStatus from "../components/ContentStatus.jsx";

const impactAreas = [
  {
    icon: "bi-people",
    title: "Children",
    description:
      "We focus on children's wellbeing, dignity, education and opportunities to thrive.",
  },
  {
    icon: "bi-heart",
    title: "Support",
    description:
      "We work to connect vulnerable people and families with practical, compassionate support.",
  },
  {
    icon: "bi-bar-chart",
    title: "Transparency",
    description:
      "We value honest reporting, responsible stewardship and clear communication about our work.",
  },
];

export default function Impact({ navigate }) {
  return (
    <main id="main-content" className="impact-page">
      <ContentStatus tone="info">We will publish measured results only when they are supported by reviewed project and beneficiary records. The measures shown on this page describe our reporting approach, not achieved totals.</ContentStatus>
      {/* IMPACT HERO */}
      <section className="impact-hero" aria-labelledby="impact-title">
        <div className="impact-hero-inner container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div className="impact-hero-copy">
                <span className="impact-hero-eyebrow">
                  <span className="impact-hero-eyebrow-dot" aria-hidden="true" />
                  FROM COMPASSION TO MEASURABLE PROGRESS
                </span>

                <h1 id="impact-title" className="impact-hero-title">
                  A future shaped by <em>compassion.</em>
                  <span>Turning meaningful support into lasting opportunity.</span>
                </h1>

                <p className="impact-hero-description">
                  Real impact begins with people. Our commitment is to stand
                  alongside children, families and vulnerable communities through
                  thoughtful action, responsible stewardship and a clear account
                  of the progress we make together.
                </p>

                <div className="impact-hero-actions">
                  <AppLink
                    to="/programs"
                    navigate={navigate}
                    className="btn impact-hero-primary"
                  >
                    Explore our programs
                    <i className="bi bi-arrow-up-right ms-2" aria-hidden="true" />
                  </AppLink>
                  <AppLink
                    to="/donate"
                    navigate={navigate}
                    className="btn impact-hero-secondary"
                  >
                    Support our work
                  </AppLink>
                </div>

                <div className="impact-hero-values" aria-label="Our impact commitments">
                  <span><i className="bi bi-person-hearts" aria-hidden="true" /> People first</span>
                  <span><i className="bi bi-clipboard-check" aria-hidden="true" /> Evidence-led</span>
                  <span><i className="bi bi-shield-check" aria-hidden="true" /> Accountable</span>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <aside className="impact-hero-card" aria-label="Our commitment to transparent impact">
                <div className="impact-hero-card-top">
                  <span className="impact-hero-card-icon" aria-hidden="true">
                    <i className="bi bi-graph-up-arrow" />
                  </span>
                  <span className="impact-hero-card-kicker">THE WAY WE MEASURE OUR WORK</span>
                </div>

                <h2>Progress should be meaningful, responsible and transparent.</h2>
                <p>
                  We put people first, use resources responsibly and learn
                  from every initiative. We share programme updates and outcomes
                  when they have been documented and verified.
                </p>

                <div className="impact-hero-card-divider" />

                <ul className="impact-hero-card-list">
                  <li><span className="impact-hero-card-step">01</span><span><strong>People at the centre</strong><small>Respecting dignity, needs and wellbeing</small></span></li>
                  <li><span className="impact-hero-card-step">02</span><span><strong>Responsible action</strong><small>Stewardship, safeguarding and partnership</small></span></li>
                  <li><span className="impact-hero-card-step">03</span><span><strong>Transparent progress</strong><small>Verified reporting and continuous learning</small></span></li>
                </ul>

                <span className="impact-hero-card-watermark" aria-hidden="true">
                  <i className="bi bi-flower1" />
                </span>
              </aside>
              <p className="impact-hero-caption">
                <i className="bi bi-heart-fill me-2" aria-hidden="true" />
                Sowing seeds of mercy and compassion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT AREAS */}
      <section className="py-5" aria-label="Our impact areas">
        <div className="container">
          <div className="row g-4">
            {impactAreas.map((area) => (
              <div className="col-md-4" key={area.title}>
                <article className="impact-card rounded-4 background shadow-lg text-center h-100">
                  <i
                    className={`bi ${area.icon} display-5 text-success`}
                    aria-hidden="true"
                  />
                  <h2 className="h3 mt-4">{area.title}</h2>
                  <p className="text-secondary mb-0">{area.description}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACCOUNTABILITY */}
      <section className="py-5" aria-labelledby="accountability-title">
        <div className="container text-center">
          <h2 id="accountability-title" className="fw-bold">
            Building a culture of accountability
          </h2>
          <p className="lead text-secondary col-lg-8 mx-auto">
            We are committed to sharing clear, verified updates about
            our programmes, the support delivered, and the difference our
            work makes. We protect the privacy and dignity of the people
            and families represented in every report.
          </p>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-5" aria-labelledby="impact-cta-title">
        <div className="container">
          <div className="cta-section rounded-4 p-4 p-md-5 text-center">
            <h2 id="impact-cta-title" className="fw-bold">
              Be part of meaningful change.
            </h2>
            <p className="text-secondary mb-4">
              Join Garden of Mercy Foundation in supporting practical
              compassion, accountability and community wellbeing.
            </p>
            <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
              <AppLink
                to="/programs"
                navigate={navigate}
                className="btn btn-success px-4"
              >
                Explore Our Programs
              </AppLink>
              <AppLink
                to="/contact"
                navigate={navigate}
                className="btn btn-outline-success px-4"
              >
                Get Involved
              </AppLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
