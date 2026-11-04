import React from "react";
import { AppLink } from "../components/SiteChrome.jsx";

const values = [
  {
    number: "01",
    icon: "bi-heart-pulse",
    title: "Compassion",
    text: "We meet human needs with empathy and seek practical ways to extend care to children and communities.",
  },
  {
    number: "02",
    icon: "bi-person-check",
    title: "Dignity",
    text: "We believe every person deserves respect, protection and the opportunity to live with hope.",
  },
  {
    number: "03",
    icon: "bi-people",
    title: "Community",
    text: "We value listening, participation and working alongside others towards a more caring future.",
  },
];

const commitments = [
  {
    icon: "bi-ear",
    title: "Listen with care",
    text: "Understand people, their circumstances and the needs they identify.",
  },
  {
    icon: "bi-hands",
    title: "Act with purpose",
    text: "Encourage practical, thoughtful responses rooted in compassion and dignity.",
  },
  {
    icon: "bi-shield-check",
    title: "Serve responsibly",
    text: "Value stewardship, safeguarding, partnership and honest communication.",
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
                  ABOUT GARDEN OF MERCY FOUNDATION
                </span>
                <h1 id="about-title" className="about-hero-title">
                  A foundation built on <em>mercy.</em>
                  <span>Rooted in compassion. Committed to dignity. Focused on a brighter future for children.</span>
                </h1>
                <p className="about-hero-description">
                  We exist to turn compassion into practical action. Our focus
                  is on children and vulnerable communities, and on encouraging
                  people to take part in meaningful acts of care and service.
                </p>
                <div className="about-hero-actions">
                  <AppLink to="/programs" navigate={navigate} className="btn about-hero-primary">
                    Explore our programs
                    <i className="bi bi-arrow-up-right ms-2" aria-hidden="true" />
                  </AppLink>
                  <AppLink to="/contact" navigate={navigate} className="btn about-hero-secondary">
                    Connect with us
                  </AppLink>
                </div>
                <div className="about-hero-principles" aria-label="Our guiding values">
                  <span><i className="bi bi-heart" aria-hidden="true" /> Compassion</span>
                  <span><i className="bi bi-shield-check" aria-hidden="true" /> Dignity</span>
                  <span><i className="bi bi-people" aria-hidden="true" /> Community</span>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <aside className="about-hero-card" aria-label="Our founding belief">
                <span className="about-hero-card-mark" aria-hidden="true">
                  <i className="bi bi-flower1" />
                </span>
                <span className="about-hero-card-kicker">OUR FOUNDING BELIEF</span>
                <h2>Mercy is more than a feeling. It is a reason to act.</h2>
                <p>
                  Compassion becomes meaningful when it is expressed through
                  thoughtful service, shared responsibility and care that
                  protects human dignity.
                </p>
                <div className="about-hero-card-rule" />
                <p className="about-hero-card-signature">
                  Sowing Seeds of Mercy and Compassion
                </p>
              </aside>
              <p className="about-hero-caption">
                <i className="bi bi-heart-fill me-2" aria-hidden="true" />
                Every act of kindness can plant a seed of hope.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-overview-section" aria-labelledby="overview-title">
        <div className="container">
          <div className="about-overview-grid">
            <div className="about-overview-heading">
              <span className="about-section-kicker">WHO WE ARE</span>
              <h2 id="overview-title">
                Compassion that recognises people, not just their needs.
              </h2>
            </div>
            <div className="about-overview-copy">
              <p>
                Garden of Mercy Foundation is a child-focused foundation
                established around the principles of mercy, compassion,
                dignity and service. We seek meaningful ways to support
                children and communities while encouraging people to
                participate in acts of compassion.
              </p>
              <p className="mb-0">
                We believe that meaningful service begins by seeing the
                individual, respecting their dignity and responding with
                care. Our approach recognises the importance of listening,
                partnership and responsible action.
              </p>
            </div>
          </div>
          <div className="about-overview-note">
            <i className="bi bi-quote" aria-hidden="true" />
            <p className="mb-0">
              Our purpose is to make compassion visible through meaningful
              acts of service.
            </p>
          </div>
        </div>
      </section>

      <section className="about-approach-section" aria-labelledby="approach-title">
        <div className="container">
          <div className="about-section-heading">
            <span className="about-section-kicker">HOW WE APPROACH OUR WORK</span>
            <h2 id="approach-title" className="about-section-title">
              Care should be thoughtful at every step.
            </h2>
            <p>
              The principles that shape our approach to supporting children
              and vulnerable communities.
            </p>
          </div>
          <div className="row g-4 mt-2">
            {commitments.map((item, index) => (
              <div className="col-md-4" key={item.title}>
                <article className="about-approach-card h-100">
                  <div className="about-approach-top">
                    <span className="about-approach-icon" aria-hidden="true">
                      <i className={`bi ${item.icon}`} />
                    </span>
                    <span className="about-approach-number">
                      STEP 0{index + 1}
                    </span>
                  </div>
                  <h3>{item.title}</h3>
                  <p className="mb-0">{item.text}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-values-section" aria-labelledby="values-heading">
        <div className="container">
          <div className="about-values-intro">
            <div>
              <span className="about-section-kicker">WHAT GUIDES US</span>
              <h2 id="values-heading" className="about-section-title">
                Values that shape the way we serve.
              </h2>
            </div>
            <p>
              These are more than words. They are principles we seek to
              reflect in our decisions, relationships and service.
            </p>
          </div>
          <div className="row g-4">
            {values.map((value) => (
              <div className="col-md-4" key={value.number}>
                <article className="about-value-card h-100">
                  <div className="about-value-card-top">
                    <span className="about-value-icon" aria-hidden="true">
                      <i className={`bi ${value.icon}`} />
                    </span>
                    <span className="about-value-number">{value.number}</span>
                  </div>
                  <h3>{value.title}</h3>
                  <p className="mb-0">{value.text}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-faith-section" aria-labelledby="faith-title">
        <div className="container">
          <div className="about-faith-panel">
            <div className="about-faith-mark" aria-hidden="true">
              <i className="bi bi-book-half" />
            </div>
            <div className="about-faith-copy">
              <span className="about-section-kicker">THE INSPIRATION BEHIND OUR SERVICE</span>
              <h2 id="faith-title">Matthew 25:35–45</h2>
              <p>
                The teaching of Jesus inspires our commitment to recognise
                people in need and respond with mercy, compassion and practical
                service.
              </p>
            </div>
            <span className="about-faith-reference">
              Faith expressed through love and service.
            </span>
          </div>
        </div>
      </section>

      <section className="about-cta-section" aria-labelledby="support-heading">
        <div className="container">
          <div className="about-cta-panel">
            <div className="about-cta-copy">
              <span className="about-section-kicker">JOIN THE MISSION</span>
              <h2 id="support-heading">Help sow seeds of mercy.</h2>
              <p>
                Be part of a community that believes compassion should lead
                to action. Explore our programs or get in touch to learn how
                you can contribute.
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
