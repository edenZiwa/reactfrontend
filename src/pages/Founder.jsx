import React from "react";
import "../css/founder.css";
import { AppLink } from "../components/SiteChrome.jsx";

function Founder({ navigate }) {
  return (
    <main id="main-content">
      {/* HERO */}
      <section
        id="founder"
        className="founder-hero"
        aria-labelledby="founder-hero-title"
      >
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="eyebrow eyebrow-light">
                <span className="eyebrow-dot" />
                Founder &amp; Visionary Leader
              </span>

              <h1 id="founder-hero-title" className="founder-hero-title">
                Apostle Derrick <span>Musinguzi</span>
              </h1>

              <p className="founder-hero-copy">
                Founder of Garden of Mercy Foundation, an organization
                committed to sowing seeds of mercy and compassion through
                practical care for children, vulnerable people and communities.
              </p>

              <div className="d-flex flex-wrap gap-3 hero-actions">
                <a className="btn btn-gold btn-lg" href="#founder-profile">
                  Discover His Story
                  <i
                    className="bi bi-arrow-down-right ms-2"
                    aria-hidden="true"
                  />
                </a>

                <a
                  className="btn btn-outline-light btn-lg"
                  href="#foundation-vision"
                >
                  Our Humanitarian Mission
                </a>
              </div>

              <div className="hero-signature">
                <span className="hero-signature-icon" aria-hidden="true">
                  <i className="bi bi-heart-fill" />
                </span>

                <span>
                  <strong>Sowing Seeds of Mercy and Compassion</strong>
                  <small>Restoring hope. Transforming lives.</small>
                </span>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="founder-hero-visual">
                <div className="portrait-frame">
                  <img
                    src="/images/founder/derrick-musinguzi.png"
                    alt="Official portrait of Apostle Derrick Musinguzi"
                    width="720"
                    height="900"
                    fetchPriority="high"
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
                    Leadership rooted in faith.
                    <br />
                    Service shaped by compassion.
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

      {/* FOUNDER PROFILE */}
      <section
        id="founder-profile"
        className="section-pad"
        aria-labelledby="profile-title"
      >
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-5">
              <div className="profile-visual">
                <div className="profile-image-shell">
                  <img
                    src="/images/founder/apostle_derrick_musinguzi.png"
                    alt="Apostle Derrick Musinguzi, founder of Garden of Mercy Foundation"
                    width="720"
                    height="900"
                    loading="lazy"
                  />

                  <div className="profile-placeholder" hidden>
                    <i
                      className="bi bi-person-circle"
                      aria-hidden="true"
                    />
                    <span>Founder portrait placeholder</span>
                  </div>
                </div>

                <div className="profile-stamp">
                  Apostle Derrick Musinguzi founder of garden of mercy foundation 
                    
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <span className="eyebrow">
                <span className="eyebrow-dot" />
                About the Founder
              </span>

              <h2 id="profile-title" className="section-title">
                A vision that puts <em>compassion into action.</em>
              </h2>

              <p className="section-lead">
                Apostle Derrick Musinguzi is the founder of Garden of Mercy
                Foundation.
              </p>

              <p className="body-copy">
                The Foundation’s work is guided by a commitment to serve
                children, vulnerable people and communities facing hardship.
                Its message is simple: mercy is more than a feeling; it is a
                willingness to recognize a need and respond with care.
              </p>

              <p className="body-copy">
                Public ministry materials also associate Apostle Derrick
                Musinguzi with Power of Revelation Ministries and Revelation
                Church Kampala. These associations form part of his ministry
                background, while Garden of Mercy Foundation maintains its own
                humanitarian purpose and organizational responsibilities.
              </p>

              <div className="profile-principle">
                <span className="principle-icon">
                  <i className="bi bi-check2-circle" aria-hidden="true" />
                </span>

                <p className="mb-0">
                  <strong>Our guiding principle</strong>
                  <br />
                  To see a need, respond with compassion and help restore hope.
                </p>
              </div>

              <a href="#foundation-vision" className="text-link">
                Discover the Foundation’s mission
                <i className="bi bi-arrow-right ms-2" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section
        id="values"
        className="section-pad values-section"
        aria-labelledby="values-title"
      >
        <div className="container">
          <div className="section-heading text-center">
            <span className="eyebrow">
              <span className="eyebrow-dot" />
              What Guides Us
            </span>

            <h2 id="values-title" className="section-title">
              Leadership shaped by <em>purpose.</em>
            </h2>

            <p className="section-lead mx-auto">
              These values express the spirit of service that Garden of Mercy
              Foundation seeks to put into practice.
            </p>
          </div>

          <div className="row g-4 mt-2">
            <div className="col-sm-6 col-xl-3">
              <article className="value-card h-100">
                <span className="value-icon">
                  <i className="bi bi-brightness-high" aria-hidden="true" />
                </span>
                <span className="value-number">01</span>
                <h3>Faith</h3>
                <p>
                  Drawing inspiration from faith and the call to care for
                  people in need.
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
                  Recognizing the dignity of every person and responding with
                  kindness.
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
                  Turning concern into thoughtful, practical support for people
                  and communities.
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
                  Helping create opportunities for a safer, healthier and more
                  hopeful future.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* MINISTRY BACKGROUND */}
      <section
        id="ministry"
        className="section-pad"
        aria-labelledby="ministry-title"
      >
        <div className="container">
          <div className="row align-items-end g-4 section-heading-row">
            <div className="col-lg-7">
              <span className="eyebrow">
                <span className="eyebrow-dot" />
                Ministry Background
              </span>

              <h2 id="ministry-title" className="section-title">
                Faith, teaching and <em>ministry.</em>
              </h2>
            </div>

            <div className="col-lg-5">
              <p className="body-copy mb-0">
                The following public resources provide context for the ministry
                associations and teaching materials referenced on this page.
              </p>
            </div>
          </div>

          <div className="row g-4 mt-3">
            <div className="col-lg-4">
              <article className="ministry-card h-100">
                <div className="ministry-card-top">
                  <span className="ministry-icon">
                    <i className="bi bi-book-half" aria-hidden="true" />
                  </span>
                  <span className="card-index">01 / MINISTRY</span>
                </div>

                <h3>Power of Revelation Ministries</h3>

                <p>
                  Public ministry materials describe Christian teaching,
                  spiritual growth and sharing the message of God’s love.
                  Details should be understood in the context of the ministry’s
                  own published information.
                </p>

                <a
                  className="text-link"
                  href="https://awmuganda.net/discipleship-evangelism/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View related public listing
                  <i
                    className="bi bi-box-arrow-up-right ms-2"
                    aria-hidden="true"
                  />
                </a>
              </article>
            </div>

            <div className="col-lg-4">
              <article className="ministry-card h-100">
                <div className="ministry-card-top">
                  <span className="ministry-icon">
                    <i className="bi bi-geo-alt" aria-hidden="true" />
                  </span>
                  <span className="card-index">02 / CHURCH</span>
                </div>

                <h3>Revelation Church Kampala</h3>

                <p>
                  A church and teaching ministry associated in public materials
                  with Apostle Derrick Musinguzi. Confirm current service times
                  and location directly with the ministry before visiting.
                </p>

                <a
                  className="text-link"
                  href="https://podcasts.apple.com/us/podcast/revelation-church-kampala/id1551432049"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Explore public archive
                  <i
                    className="bi bi-box-arrow-up-right ms-2"
                    aria-hidden="true"
                  />
                </a>
              </article>
            </div>

            <div className="col-lg-4">
              <article className="ministry-card h-100">
                <div className="ministry-card-top">
                  <span className="ministry-icon">
                    <i className="bi bi-mic" aria-hidden="true" />
                  </span>
                  <span className="card-index">03 / TEACHING</span>
                </div>

                <h3>Public Teaching Resources</h3>

                <p>
                  The indexed podcast archive includes teachings on purpose,
                  Christian life, relationships, God’s love, grace and favour.
                  The archive is a resource for interested visitors.
                </p>

                <a
                  className="text-link"
                  href="https://podcasts.apple.com/us/podcast/revelation-church-kampala/id1551432049"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit the podcast archive
                  <i
                    className="bi bi-box-arrow-up-right ms-2"
                    aria-hidden="true"
                  />
                </a>
              </article>
            </div>
          </div>

          <p className="small muted-note mt-4 mb-0">
            <i
              className="bi bi-info-circle me-2"
              aria-hidden="true"
            />
            External references describe information published by third
            parties. Please confirm current details with the relevant
            organization.
          </p>
        </div>
      </section>

      {/* FOUNDATION MISSION */}
      <section
        id="foundation-vision"
        className="mission-section section-pad"
        aria-labelledby="mission-title"
      >
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="eyebrow eyebrow-light">
                <span className="eyebrow-dot" />
                From Faith to Service
              </span>

              <h2
                id="mission-title"
                className="section-title section-title-light"
              >
                A foundation built around <em>mercy in action.</em>
              </h2>

              <p className="mission-copy">
                Garden of Mercy Foundation is committed to practical
                expressions of care for children, vulnerable people, families
                and communities facing hardship.
              </p>

              <p className="mission-copy">
                Inspired by the call to care for our neighbours, the Foundation
                seeks to turn compassion into meaningful action—supporting
                dignity, restoring hope and encouraging people to stand
                together when help is needed.
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
                <span className="scripture-ornament" aria-hidden="true">
                  “
                </span>

                <span className="scripture-label">
                  OUR BIBLICAL INSPIRATION
                </span>

                <blockquote>
                  “For I was hungry and you gave me food, I was thirsty and you
                  gave me drink, I was a stranger and you welcomed me.”
                </blockquote>

                <p className="scripture-reference">Matthew 25:35–45</p>

                <div className="scripture-rule" />

                <p className="scripture-note">
                  Faith expressed through kindness, care and practical service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MESSAGE */}
      <section
        id="founder-message"
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

                <h2 id="message-title" className="message-heading">
                  Sowing mercy.
                  <br />
                  <em>Restoring hope.</em>
                </h2>
              </div>

              <div className="col-lg-9">
                <p className="message-intro">
                  Compassion becomes meaningful when it moves us to act.
                </p>

                <p>
                  We believe mercy is more than a feeling—it is compassion put
                  into action. We seek to support vulnerable individuals,
                  children, families and communities facing hunger, poverty,
                  sickness and hardship through practical help that respects
                  dignity and nurtures hope.
                </p>

                <p>
                  Our mission is to see a need, respond with compassion and
                  help transform lives. Through giving, volunteering,
                  partnerships and community outreach, people can join in
                  making a difference.
                </p>

                <p className="message-closing">
                  One act of kindness can restore hope. One helping hand can
                  change a life.
                </p>

                <div className="message-signoff">
                  <span />
                  <strong className="text-dark">Garden of Mercy Foundation</strong>
                </div>

                <p className="small text-dark mt-3 mb-0">
                  This is presented as the Foundation’s commitment statement,
                  not as a direct quotation from the founder.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section
        id="action"
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
                Every act of care <em>matters.</em>
              </h2>

              <p className="section-lead mb-0">
                Explore moments from the Foundation’s work and community
                activities.
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
              aria-label="Visit the gallery to view foundation activities"
            >
              <span className="gallery-placeholder-icon">
                <i className="bi bi-images" aria-hidden="true" />
              </span>

              <span>
                <strong>Community &amp; Outreach</strong>
                <img
                  src="/images/gallery/children-01.png"
                  alt="Children participating in community outreach"
                  loading="lazy"
                />
              </span>
            </AppLink>

            <AppLink
              to="/gallery"
              navigate={navigate}
              className="gallery-placeholder"
              aria-label="View foundation photographs in the gallery"
            >
              <span className="gallery-placeholder-icon">
                <i className="bi bi-camera" aria-hidden="true" />
              </span>

              <span>
                <strong>Care in Action</strong>
                <img
                  src="/images/gallery/community-01.png"
                  alt="Community members taking part in foundation activities"
                  loading="lazy"
                />
              </span>
            </AppLink>

            <AppLink
              to="/gallery"
              navigate={navigate}
              className="gallery-placeholder"
              aria-label="View more foundation photographs in the gallery"
            >
              <span className="gallery-placeholder-icon">
                <i className="bi bi-heart" aria-hidden="true" />
              </span>

              <span>
                <strong>Hope &amp; Dignity</strong>
                <img
                  src="/images/gallery/event-02.png"
                  alt="Foundation event supporting hope and dignity"
                  loading="lazy"
                />
              </span>
            </AppLink>
          </div>
        </div>
      </section>

      {/* SOURCES */}
      <section
        id="resources"
        className="section-pad sources-section"
        aria-labelledby="sources-title"
      >
        <div className="container">
          <div className="row align-items-end g-3 mb-4">
            <div className="col-lg-8">
              <span className="eyebrow">
                <span className="eyebrow-dot" />
                Further Reading
              </span>

              <h2 id="sources-title" className="section-title">
                Ministry resources &amp; <em>references.</em>
              </h2>

              <p className="section-lead mb-0">
                Visit these external resources for their published ministry
                information and teaching materials.
              </p>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <a
                className="source-link-card"
                href="https://podcasts.apple.com/us/podcast/revelation-church-kampala/id1551432049"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="source-icon">
                  <i className="bi bi-apple" aria-hidden="true" />
                </span>

                <span className="source-content">
                  <strong className="text-black">Revelation Church Kampala Podcast</strong>
                  <small className="text-black">Publicly indexed teaching archive</small>
                </span>

                <i
                  className="bi bi-arrow-up-right source-arrow"
                  aria-hidden="true"
                />
              </a>
            </div>

            <div className="col-md-6">
              <a
                className="source-link-card"
                href="https://awmuganda.net/discipleship-evangelism/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="source-icon">
                  <i className="bi bi-globe2" aria-hidden="true" />
                </span>

                <span className="source-content">
                  <strong className="text-black">Andrew Wommack Ministries Uganda</strong>
                  <small className="text-black">
                    Public discipleship and evangelism information
                  </small>
                </span>

                <i
                  className="bi bi-arrow-up-right source-arrow"
                  aria-hidden="true"
                />
              </a>
            </div>
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
                  Let compassion become <em>action.</em>
                </h2>

                <p className="mb-0">
                  Join us in sowing seeds of mercy and compassion for children,
                  families and communities.
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

export default Founder;
