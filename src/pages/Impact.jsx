import React from "react";
import { AppLink } from "../components/SiteChrome.jsx";

const impactAreas = [
  {
    icon: "bi-people",
    title: "Children",
    description:
      "Program beneficiaries will be reported using verified organizational records.",
  },
  {
    icon: "bi-heart",
    title: "Support",
    description:
      "Support delivered through approved programs will be documented and reported transparently.",
  },
  {
    icon: "bi-bar-chart",
    title: "Transparency",
    description:
      "Public impact reporting will be based on verified organizational data.",
  },
];

export default function Impact({ navigate }) {
  return (
    <main id="main-content" className="impact-page">
      {/* IMPACT HERO */}
      <section className="impact-hero" aria-labelledby="impact-title">
        <div className="impact-hero-inner container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div className="impact-hero-copy">
                <span className="impact-hero-eyebrow">
                  <span className="impact-hero-eyebrow-dot" aria-hidden="true" />
                  OUR IMPACT · OUR ACCOUNTABILITY
                </span>

                <h1 id="impact-title" className="impact-hero-title">
                  Compassion that creates <em>lasting change.</em>
                  <span>Every act of mercy should make a meaningful difference.</span>
                </h1>

                <p className="impact-hero-description">
                  We are committed to making a positive difference in the lives
                  of children and vulnerable communities. We believe that impact
                  should be grounded in real action, responsible stewardship
                  and transparent reporting.
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
                  <span className="impact-hero-card-kicker">OUR COMMITMENT</span>
                </div>

                <h2>Impact should be seen, understood and trusted.</h2>
                <p>
                  We aim to share clear, verified information about our
                  activities, the support delivered and the progress made
                  alongside the communities we serve.
                </p>

                <div className="impact-hero-card-divider" />

                <ul className="impact-hero-card-list">
                  <li><i className="bi bi-check-circle-fill" aria-hidden="true" /> Honest, evidence-based reporting</li>
                  <li><i className="bi bi-check-circle-fill" aria-hidden="true" /> Responsible use of resources</li>
                  <li><i className="bi bi-check-circle-fill" aria-hidden="true" /> Learning and continuous improvement</li>
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
            As the foundation grows, this section can publish approved
            program results, beneficiary information, financial reporting
            and stories of change.
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
