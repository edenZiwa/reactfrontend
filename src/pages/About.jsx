import React from "react";
import { AppLink } from "../components/SiteChrome.jsx";

const foundationValues = [
  {
    icon: "bi-heart-pulse",
    number: "01",
    title: "Compassion",
    description:
      "We respond to human needs with empathy and seek practical ways to extend care to children and communities.",
  },
  {
    icon: "bi-person-check",
    number: "02",
    title: "Dignity",
    description:
      "We believe every child and every person deserves respect, protection and the opportunity to thrive.",
  },
  {
    icon: "bi-people",
    number: "03",
    title: "Community",
    description:
      "Lasting progress grows when people, families and communities work together with shared purpose.",
  },
];

function About({ navigate }) {
  return (
    <main id="main-content" className="about-page">
      <section className="about-hero" aria-labelledby="about-title">
        <div className="about-hero-inner container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div className="about-hero-copy">
                <span className="about-hero-eyebrow">
                  <span className="about-hero-eyebrow-dot" aria-hidden="true" />
                  WHO WE ARE · WHY WE SERVE
                </span>

                <h1 id="about-title" className="about-hero-title">
                  A foundation built on <em>mercy.</em>
                  <span>Rooted in compassion. Committed to human dignity. Focused on a better future for children.</span>
                </h1>

                <p className="about-hero-description">
                  Garden of Mercy Foundation exists to turn compassion into
                  practical action. We seek meaningful ways to support children
                  and vulnerable communities through service, partnership and
                  responsible care.
                </p>

                <div className="about-hero-actions">
                  <AppLink to="/programs" navigate={navigate} className="btn about-hero-primary">
                    Discover our programs
                    <i className="bi bi-arrow-up-right ms-2" aria-hidden="true" />
                  </AppLink>
                  <AppLink to="/donate" navigate={navigate} className="btn about-hero-secondary">
                    Be part of the mission
                  </AppLink>
                </div>

                <div className="about-hero-principles" aria-label="Our guiding principles">
                  <span><i className="bi bi-heart" aria-hidden="true" /> Compassion</span>
                  <span><i className="bi bi-shield-check" aria-hidden="true" /> Dignity</span>
                  <span><i className="bi bi-people" aria-hidden="true" /> Community</span>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <aside className="about-hero-card" aria-label="Our foundation's purpose">
                <span className="about-hero-card-mark" aria-hidden="true">
                  <i className="bi bi-flower1" />
                </span>
                <span className="about-hero-card-kicker">OUR FOUNDING BELIEF</span>
                <h2>Mercy is more than a feeling. It is a reason to act.</h2>
                <p>
                  We believe compassion becomes meaningful when it is expressed
                  through thoughtful service, shared responsibility and care
                  that protects human dignity.
                </p>
                <div className="about-hero-card-rule" />
                <p className="about-hero-card-signature">
                  Sowing Seeds of Mercy and Compassion
                </p>
              </aside>
              <p className="about-hero-caption">
                <i className="bi bi-heart-fill me-2" aria-hidden="true" />
                Every act of kindness can help plant a seed of hope.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-story-section py-5" aria-labelledby="foundation-heading">
        <div className="container py-lg-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="about-section-kicker">OUR FOUNDATION</span>
              <h2 id="foundation-heading" className="about-section-title">
                Compassion with purpose. Service with dignity.
              </h2>
              <p>
                Garden of Mercy Foundation is a child-focused foundation
                established around the principles of mercy, compassion,
                dignity and service.
              </p>
              <p>
                We seek to identify meaningful ways of supporting children
                and communities while encouraging people to participate in
                acts of compassion. Our approach places people at the centre
                and recognises the importance of listening, partnership and
                responsible action.
              </p>
              <p className="mb-0">
                Our work is inspired by the teaching of Jesus in{" "}
                <strong>Matthew 25:35–45</strong> — a call to recognise the
                needs of others and respond with practical love.
              </p>
            </div>
            <div className="col-lg-6">
              <div className="about-story-panel">
                <span className="about-story-panel-icon" aria-hidden="true">
                  <i className="bi bi-hand-heart" />
                </span>
                <span className="about-story-panel-label">OUR PURPOSE</span>
                <h3>To make compassion visible through meaningful action.</h3>
                <p>
                  We are committed to building a culture where care is
                  intentional, dignity is protected and communities are
                  encouraged to take part in positive change.
                </p>
                <div className="about-story-panel-footer">
                  <span>Garden of Mercy Foundation</span>
                  <i className="bi bi-flower1" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-values-section py-5" aria-labelledby="values-heading">
        <div className="container py-lg-4">
          <div className="about-section-heading text-center mx-auto">
            <span className="about-section-kicker">WHAT GUIDES US</span>
            <h2 id="values-heading" className="about-section-title">
              The values behind every act of service.
            </h2>
            <p>
              These principles shape how we understand our responsibility
              to children, families and the communities we serve.
            </p>
          </div>

          <div className="row g-4 mt-2">
            {foundationValues.map((value) => (
              <div className="col-md-4" key={value.number}>
                <article className="about-value-card h-100">
                  <div className="about-value-card-top">
                    <span className="about-value-icon" aria-hidden="true">
                      <i className={`bi ${value.icon}`} />
                    </span>
                    <span className="about-value-number">{value.number}</span>
                  </div>
                  <h3>{value.title}</h3>
                  <p className="mb-0">{value.description}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-scripture-section py-5" aria-labelledby="scripture-heading">
        <div className="container">
          <div className="about-scripture-card mx-auto text-center">
            <span className="about-scripture-icon" aria-hidden="true">
              <i className="bi bi-book-half" />
            </span>
            <span className="about-section-kicker">OUR INSPIRATION</span>
            <h2 id="scripture-heading">Matthew 25:35–45</h2>
            <p>
              Our foundation is inspired by the call to see the needs of
              others and respond with mercy, compassion and practical service.
            </p>
            <span className="about-scripture-note">
              Faith expressed through love and service.
            </span>
          </div>
        </div>
      </section>

      <section className="about-cta-section py-5" aria-labelledby="support-heading">
        <div className="container">
          <div className="about-cta-panel">
            <div className="about-cta-copy">
              <span className="about-section-kicker">BE PART OF THE STORY</span>
              <h2 id="support-heading">Help sow seeds of mercy.</h2>
              <p>
                Whether through giving, volunteering or sharing our mission,
                you can help create opportunities for children and communities.
              </p>
            </div>
            <div className="about-cta-actions">
              <AppLink to="/programs" navigate={navigate} className="btn about-hero-primary">
                Explore programs
              </AppLink>
              <AppLink to="/contact" navigate={navigate} className="btn about-hero-secondary">
                Get involved
              </AppLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;
