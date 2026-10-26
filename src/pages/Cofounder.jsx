
import React from "react";
import "../css/founder.css";
import { AppLink } from "../components/SiteChrome.jsx";

function Cofounder({ navigate }) {
  return (
    <main id="main-content">
      {/* HERO */}
      <section
        id="cofounder"
        className="founder-hero"
        aria-labelledby="cofounder-hero-title"
      >
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="eyebrow eyebrow-light">
                <span className="eyebrow-dot" />
                Co-Founder &amp; Servant Leader
              </span>

              <h1
                id="cofounder-hero-title"
                className="founder-hero-title"
              >
                Pastor Albert <span>Yiga</span>
              </h1>

              <p className="founder-hero-copy text-white">
                Co-Founder of Garden of Mercy Foundation, sharing in
                the vision of sowing seeds of mercy and compassion
                through practical care, community outreach and support
                for children, vulnerable people and families in need.
              </p>

              <div className="d-flex flex-wrap gap-3 hero-actions">
                <a
                  className="btn btn-gold btn-lg"
                  href="#cofounder-profile"
                >
                  Discover His Story
                  <i
                    className="bi bi-arrow-down-right ms-2"
                    aria-hidden="true"
                  />
                </a>

                <a
                  className="btn btn-outline-light btn-lg"
                  href="#foundation-mission"
                >
                  Our Humanitarian Mission
                </a>
              </div>

              <div className="hero-signature">
                <span
                  className="hero-signature-icon"
                  aria-hidden="true"
                >
                  <i className="bi bi-heart-fill" />
                </span>

                <span>
                  <strong className="text-white">
                    Compassion That Makes a Difference
                  </strong>
                  <small>
                    Restoring hope. Serving humanity. Transforming lives.
                  </small>
                </span>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="founder-hero-visual">
                <div className="portrait-frame">
                  <img
                    src="/images/founder/pastor-albert-yiga.png"
                    alt="Pastor Albert Yiga, co-founder of Garden of Mercy Foundation"
                    width="720"
                    height="900"
                    loading="lazy"
                  />

                  <div className="portrait-placeholder" hidden>
                    <i
                      className="bi bi-person-bounding-box"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <div className="portrait-caption">
                  <span className="caption-line" />
                  <span>
                    A heart for service.
                    <br />
                    A vision for lasting impact.
                  </span>
                </div>

                <span
                  className="hero-orbit hero-orbit-one"
                  aria-hidden="true"
                />
                <span
                  className="hero-orbit hero-orbit-two"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="hero-bottom-glow" aria-hidden="true" />
      </section>

      {/* CO-FOUNDER PROFILE */}
      <section
        id="cofounder-profile"
        className="section-pad"
        aria-labelledby="profile-title"
      >
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-5">
              <div className="profile-visual">
                <div className="profile-image-shell">
                  <img
                    src="/images/founder/pastor_albert_yiga.png"
                    alt="Official portrait of Pastor Albert Yiga"
                    width="720"
                    height="900"
                    loading="lazy"
                  />

                  <div className="profile-placeholder" hidden>
                    <i
                      className="bi bi-person-circle"
                      aria-hidden="true"
                    />
                    <span>Co-founder portrait placeholder</span>
                  </div>
                </div>

                <div className="profile-stamp">
                  Pastor Albert Yiga, co-founder of Garden of Mercy Foundation
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <span className="eyebrow">
                <span className="eyebrow-dot" />
                Meet the Co-Founder
              </span>

              <h2 id="profile-title" className="section-title">
                A shared vision for{" "}
                <em>compassion and service.</em>
              </h2>

              <p className="section-lead">
                Pastor Albert Yiga serves as Co-Founder of Garden
                of Mercy Foundation.
              </p>

              <p className="body-copy">
                The Foundation exists to translate compassion into
                practical action. Its work focuses on caring for
                children, supporting vulnerable individuals and
                families, and helping communities facing difficult
                circumstances find renewed hope.
              </p>

              <p className="body-copy">
                As a co-founder, Pastor Albert Yiga is part of the
                leadership identity associated with this shared
                humanitarian vision. The Foundation seeks to bring
                people together around a common purpose: recognizing
                human dignity, responding to genuine needs and
                building a culture of generosity and service.
              </p>

              <p className="body-copy">
                His personal biography, ministry journey and specific
                responsibilities within the Foundation can be added
                here once verified details are available.
              </p>

              <div className="profile-principle shadow-lg">
                <span className="principle-icon">
                  <i
                    className="bi bi-check2-circle"
                    aria-hidden="true"
                  />
                </span>

                <p className="mb-0">
                  <strong>A shared commitment</strong>
                  <br />
                  To serve with compassion, uphold dignity and help
                  restore hope where it is needed most.
                </p>
              </div>

              <a href="#foundation-mission" className="text-link">
                Discover our humanitarian mission
                <i
                  className="bi bi-arrow-right ms-2"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* LEADERSHIP VALUES */}
      <section
        id="leadership-values"
        className="section-pad values-section shadow-lg"
        aria-labelledby="values-title"
      >
        <div className="container">
          <div className="section-heading text-center">
            <span className="eyebrow">
              <span className="eyebrow-dot" />
              Our Leadership Values
            </span>

            <h2 id="values-title" className="section-title">
              Guided by faith. Driven by{" "}
              <em>compassion.</em>
            </h2>

            <p className="section-lead mx-auto">
              These principles shape the Foundation's approach to
              humanitarian service and community transformation.
            </p>
          </div>

          <div className="row g-4 mt-2">
            <div className="col-sm-6 col-xl-3">
              <article className="value-card h-100">
                <span className="value-icon">
                  <i
                    className="bi bi-brightness-high"
                    aria-hidden="true"
                  />
                </span>

                <span className="value-number">01</span>

                <h3>Faith</h3>

                <p>
                  Finding inspiration in biblical principles and
                  the call to love our neighbours through meaningful
                  acts of service.
                </p>
              </article>
            </div>

            <div className="col-sm-6 col-xl-3">
              <article className="value-card h-100">
                <span className="value-icon">
                  <i className="bi bi-heart" aria-hidden="true" />
                </span>

                <span className="value-number">02</span>

                <h3>Compassion</h3>

                <p>
                  Recognizing the needs of others and responding
                  with kindness, empathy and respect for every
                  person's dignity.
                </p>
              </article>
            </div>

            <div className="col-sm-6 col-xl-3">
              <article className="value-card h-100">
                <span className="value-icon">
                  <i className="bi bi-hands" aria-hidden="true" />
                </span>

                <span className="value-number">03</span>

                <h3>Service</h3>

                <p>
                  Turning good intentions into practical support
                  that addresses real needs and strengthens
                  communities.
                </p>
              </article>
            </div>

            <div className="col-sm-6 col-xl-3">
              <article className="value-card h-100">
                <span className="value-icon">
                  <i className="bi bi-sunrise" aria-hidden="true" />
                </span>

                <span className="value-number">04</span>

                <h3>Hope</h3>

                <p>
                  Encouraging people to look toward a better future
                  through solidarity, opportunity and consistent
                  acts of care.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* ROLE OF THE CO-FOUNDER */}
      <section
        id="leadership"
        className="section-pad"
        aria-labelledby="leadership-title"
      >
        <div className="container">
          <div className="row align-items-end g-4 section-heading-row">
            <div className="col-lg-7">
              <span className="eyebrow">
                <span className="eyebrow-dot" />
                Shared Leadership
              </span>

              <h2 id="leadership-title" className="section-title">
                A common vision. A{" "}
                <em>lasting impact.</em>
              </h2>
            </div>

            <div className="col-lg-5">
              <p className="body-copy mb-0">
                Garden of Mercy Foundation brings people together
                around the belief that compassion should be visible
                in the way we care for others.
              </p>
            </div>
          </div>

          <div className="row g-4 mt-3">
            <div className="col-lg-4">
              <article className="ministry-card h-100">
                <div className="ministry-card-top">
                  <span className="ministry-icon">
                    <i
                      className="bi bi-bullseye"
                      aria-hidden="true"
                    />
                  </span>

                  <span className="card-index">
                    01 / VISION
                  </span>
                </div>

                <h3>A Shared Purpose</h3>

                <p>
                  Advancing a humanitarian vision that recognizes
                  the dignity of every person and seeks to respond
                  to the needs of vulnerable people with care.
                </p>
              </article>
            </div>

            <div className="col-lg-4">
              <article className="ministry-card h-100">
                <div className="ministry-card-top">
                  <span className="ministry-icon">
                    <i
                      className="bi bi-people"
                      aria-hidden="true"
                    />
                  </span>

                  <span className="card-index">
                    02 / COMMUNITY
                  </span>
                </div>

                <h3>People at the Centre</h3>

                <p>
                  Encouraging a culture of service that places
                  children, families and communities at the centre
                  of humanitarian efforts.
                </p>
              </article>
            </div>

            <div className="col-lg-4">
              <article className="ministry-card h-100">
                <div className="ministry-card-top">
                  <span className="ministry-icon">
                    <i
                      className="bi bi-flower1"
                      aria-hidden="true"
                    />
                  </span>

                  <span className="card-index">
                    03 / IMPACT
                  </span>
                </div>

                <h3>Hope for the Future</h3>

                <p>
                  Supporting practical initiatives that can help
                  restore hope, strengthen communities and create
                  opportunities for lasting positive change.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDATION MISSION */}
      <section
        id="foundation-mission"
        className="mission-section section-pad"
        aria-labelledby="mission-title"
      >
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="eyebrow eyebrow-light">
                <span className="eyebrow-dot" />
                Our Humanitarian Mission
              </span>

              <h2
                id="mission-title"
                className="section-title section-title-light"
              >
                Mercy that moves beyond words{" "}
                <em>into action.</em>
              </h2>

              <p className="mission-copy">
                Garden of Mercy Foundation is committed to practical
                expressions of compassion for children, vulnerable
                individuals, families and communities experiencing
                hardship.
              </p>

              <p className="mission-copy">
                Through community outreach, generosity, partnerships
                and service, the Foundation seeks to address needs
                with dignity and help create a future shaped by
                hope, opportunity and care.
              </p>

              <AppLink
                to="/programs"
                navigate={navigate}
                className="btn btn-gold btn-lg mt-2"
              >
                Explore Our Programs
                <i
                  className="bi bi-arrow-up-right ms-2"
                  aria-hidden="true"
                />
              </AppLink>
            </div>

            <div className="col-lg-6">
              <div className="scripture-panel">
                <span
                  className="scripture-ornament"
                  aria-hidden="true"
                >
                  “
                </span>

                <span className="scripture-label">
                  OUR BIBLICAL INSPIRATION
                </span>

                <blockquote className="text-white">
                  “for I was hungry and you gave Me food; I was thirsty and you gave Me drink;  I was a stranger and you took Me in;”
                </blockquote>

                <p className="scripture-reference">
                  Matthew 25:35 (NKJV)
                </p>

                <div className="scripture-rule" />

                <p className="scripture-note">
                  Genuine love is demonstrated through practical
                  compassion, generosity and service to others.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LEADERSHIP COMMITMENT */}
      <section
        id="cofounder-message"
        className="section-pad message-section"
        aria-labelledby="message-title"
      >
        <div className="container">
          <div className="message-panel">
            <div className="row g-4 g-lg-5 align-items-start">
              <div className="col-lg-3">
                <div className="message-mark" aria-hidden="true">
                  <i className="bi bi-quote" />
                </div>

                <span className="eyebrow">
                  <span className="eyebrow-dot" />
                  Our Commitment
                </span>

                <h2
                  id="message-title"
                  className="message-heading"
                >
                  Serving with purpose.
                  <br />
                  <em>Giving with compassion.</em>
                </h2>
              </div>

              <div className="col-lg-9">
                <p className="message-intro">
                  A compassionate community can make a meaningful
                  difference in the lives of others.
                </p>

                <p>
                  At Garden of Mercy Foundation, we believe that
                  every person deserves dignity, kindness and the
                  opportunity to live with hope. Our commitment is
                  to recognize needs, encourage generosity and
                  support practical responses to hardship.
                </p>

                <p>
                  We invite individuals, families, volunteers,
                  organizations and partners to join us in creating
                  a culture where compassion is more than a promise:
                  it becomes a way of life.
                </p>

                <p className="message-closing">
                  Together, we can sow seeds of mercy today and
                  help build a more hopeful tomorrow.
                </p>

                <div className="message-signoff">
                  <span />
                  <strong className="text-dark">Garden of Mercy Foundation</strong>
                </div>

                <p className="small text-dark mt-3 mb-0">
                  This is a Foundation commitment statement, not a
                  direct quotation attributed to Pastor Albert Yiga.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMUNITY OUTREACH */}
      <section
        id="community-action"
        className="section-pad gallery-preview"
        aria-labelledby="gallery-title"
      >
        <div className="container">
          <div className="row align-items-end g-3">
            <div className="col-md-8">
              <span className="eyebrow">
                <span className="eyebrow-dot" />
                Compassion in Action
              </span>

              <h2 id="gallery-title" className="section-title">
                Small acts of kindness.{" "}
                <em>Lasting change.</em>
              </h2>

              <p className="section-lead mb-0">
                Discover the people, outreach activities and
                community initiatives behind the Foundation's work.
              </p>
            </div>

            <div className="col-md-4 text-md-end">
              <AppLink
                to="/gallery"
                navigate={navigate}
                className="btn btn-outline-green"
              >
                Explore the Gallery
                <i
                  className="bi bi-arrow-up-right ms-2"
                  aria-hidden="true"
                />
              </AppLink>
            </div>
          </div>

          <div className="gallery-placeholder-grid mt-4">
            <AppLink
              to="/gallery"
              navigate={navigate}
              className="gallery-placeholder gallery-placeholder-large"
              aria-label="View community outreach activities"
            >
              <span className="gallery-placeholder-icon">
                <i className="bi bi-people" aria-hidden="true" />
              </span>

              <span>
                <strong>Community Outreach</strong>
                <img
                  src="/images/gallery/children-01.png"
                  alt="Children participating in a community activity"
                  loading="lazy"
                />
              </span>
            </AppLink>

            <AppLink
              to="/gallery"
              navigate={navigate}
              className="gallery-placeholder"
              aria-label="View community care activities"
            >
              <span className="gallery-placeholder-icon">
                <i className="bi bi-heart" aria-hidden="true" />
              </span>

              <span>
                <strong>Care in Action</strong>
                <img
                  src="/images/gallery/community-01.png"
                  alt="Community members participating in an outreach activity"
                  loading="lazy"
                />
              </span>
            </AppLink>

            <AppLink
              to="/gallery"
              navigate={navigate}
              className="gallery-placeholder"
              aria-label="View foundation events"
            >
              <span className="gallery-placeholder-icon">
                <i className="bi bi-camera" aria-hidden="true" />
              </span>

              <span>
                <strong>Hope &amp; Dignity</strong>
                <img
                  src="/images/gallery/event-02.png"
                  alt="Community event supporting the Foundation's mission"
                  loading="lazy"
                />
              </span>
            </AppLink>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section
        className="section-pad cta-section"
        aria-labelledby="cta-title"
      >
        <div className="container">
          <div className="cta-panel">
            <div className="cta-decoration" aria-hidden="true">
              <i className="bi bi-heart-fill" />
            </div>

            <div className="row align-items-center g-4 position-relative">
              <div className="col-lg-7">
                <span className="eyebrow eyebrow-light">
                  Garden of Mercy Foundation
                </span>

                <h2 id="cta-title">
                  Be part of a mission that{" "}
                  <em>restores hope.</em>
                </h2>

                <p className="mb-0">
                  Join us in serving children, supporting vulnerable
                  families and extending compassion to communities
                  that need it most.
                </p>
              </div>

              <div className="col-lg-5">
                <div className="cta-buttons">
                  <AppLink
                    to="/programs"
                    navigate={navigate}
                    className="btn btn-light btn-lg"
                  >
                    Our Programs
                  </AppLink>

                  <AppLink
                    to="/impact"
                    navigate={navigate}
                    className="btn btn-outline-light btn-lg"
                  >
                    Our Impact
                  </AppLink>

                  <AppLink
                    to="/donate"
                    navigate={navigate}
                    className="btn btn-gold btn-lg"
                  >
                    Support Our Mission
                    <i
                      className="bi bi-arrow-up-right ms-1"
                      aria-hidden="true"
                    />
                  </AppLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Cofounder;
