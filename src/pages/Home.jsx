import React from "react";
import {
    AppLink,
    Eyebrow,
    FocusCard
} from "../components/SiteChrome.jsx";

function Home( {
    navigate
}) {
    return (
        <>
            {/* HERO */}
            <section
                id="home"
                className="hero-section position-relative overflow-hidden"
                >
                <div className="hero-overlay"></div>

                <div className="container position-relative py-0">
                    <div className="row align-items-center min-vh-75 py-0">
                        <div className="col-lg-8 col-xl-7">
                            <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill bg-success bg-opacity-90 text-white fw-semibold mb-2">
                                <img
                                className="logo"
                                src="/images/garden_of_mercy_logo.png"
                                alt="Garden of Mercy Foundation logo"
                                />
                            <span>Sowing Seeds of Mercy and Compassion</span>
                        </div>

                        <h1 className="display-3 fw-bold lh-sm text-white">
                            Serving children with{" "}
                            <span className="text-warning">mercy, dignity</span>{" "}
                            and compassion.
                        </h1>

                        <p className="lead mt-4 mb-4 text-white">
                            Garden of Mercy Foundation exists to turn compassion into
                            practical action — creating opportunities for children and
                            communities to experience dignity, hope and a better future.
                        </p>

                        <div className="d-flex flex-column flex-sm-row gap-3">
                            <a
                                href="#donate"
                                className="btn btn-warning btn-lg px-4 fw-semibold"
                                >
                                <i className="bi bi-heart-fill me-2"></i>
                                Support the Mission
                            </a>

                            <a
                                href="#about"
                                className="btn btn-outline-light btn-lg px-4"
                                >
                                Discover Our Story
                                <i className="bi bi-arrow-down ms-2"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* MISSION STRIP */}
        <section className="py-4 bg-success text-white">
            <div className="container">
                <div className="row align-items-center g-3">
                    <div className="col-lg-8">
                        <div className="d-flex gap-3 align-items-center">
                            <div className="display-6">
                                <i className="bi bi-heart-fill"></i>
                            </div>

                            <div>
                                <h2 className="h5 mb-1">
                                    Every act of mercy can plant a seed of hope.
                                </h2>
                                <p className="mb-0 opacity-75">
                                    Together, we can nurture those seeds into lasting impact.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 text-lg-end">
                        <a
                            href="#donate"
                            className="btn btn-light text-success fw-semibold"
                            >
                            Be Part of the Journey
                            <i className="bi bi-arrow-right ms-2"></i>
                        </a>
                    </div>
                </div>
            </div>
        </section>

        {/* FOUNDATION VALUES STRIP */}
        <section className="other-section overflow-hidden">
            <div className="container">
                <div className="row g-3 mt-2 text-center">
                    <div className="col-sm-4">
                        <div>
                            <div className="fs-3 fw-bold">
                                <i className="bi bi-people me-2"></i>
                            </div>
                            <small>Children focused</small>
                        </div>
                    </div>

                    <div className="col-sm-4">
                        <div>
                            <div className="fs-3 fw-bold">
                                <i className="bi bi-heart me-2"></i>
                            </div>
                            <small>Compassion driven</small>
                        </div>
                    </div>

                    <div className="col-sm-4">
                        <div>
                            <div className="fs-3 fw-bold">
                                <i className="bi bi-shield-check me-2"></i>
                            </div>
                            <small>Accountability focused</small>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* ABOUT */}
        <section
            id="about"
            className="py-4 py-lg-5 shadow-lg"
            >
            <div className="container py-4 px-4">
                <div className="row align-items-center g-5">
                    {/* ABOUT CONTENT */}
                    <div className="col-lg-6">
                        <span className="text-success fw-bold text-uppercase small">
                            Who we are
                        </span>

                        <h2 className="display-6 fw-bold mt-2">
                            A foundation built around mercy.
                        </h2>

                        <p className="lead text-secondary mt-3">
                            Garden of Mercy Foundation is a child-focused foundation
                            committed to transforming compassion into practical support.
                        </p>

                        <p className="text-secondary">
                            We believe that children deserve dignity, care, opportunity
                            and an environment where they can grow with hope for the
                            future. Our work is centered on identifying meaningful needs
                            and responding through responsible, compassionate action.
                        </p>

                        <div className="row g-3 mt-4">
                            <div className="col-sm-6">
                                <div className="p-4 rounded-4 shadow-lg h-100">
                                    <i className="bi bi-heart-fill text-danger fs-3"></i>

                                    <h3 className="h5 mt-3">Mercy</h3>

                                    <p className="small text-secondary mb-0">
                                        Responding to genuine needs with compassion and care.
                                    </p>
                                </div>
                            </div>

                            <div className="col-sm-6">
                                <div className="p-4 rounded-4 shadow-lg h-100">
                                    <i className="bi bi-stars text-warning fs-3"></i>

                                    <h3 className="h5 mt-3">Hope</h3>

                                    <p className="small text-secondary mb-0">
                                        Creating opportunities that encourage a brighter future.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* GUIDING SCRIPTURE */}
                    <div className="col-lg-6">
                        <div className="p-4 p-lg-5 rounded-4 shadow-lg">
                            <span className="badge text-bg-success mb-4">
                                Our guiding scripture
                            </span>

                            <i className="bi bi-quote display-4 text-warning"></i>

                            <blockquote className="blockquote mb-4">
                                <p className="fs-4 lh-base">
                                    “For I was hungry and you gave me something to eat,
                                    I was thirsty and you gave me something to drink,
                                    I was a stranger and you invited me in.”
                                </p>
                            </blockquote>

                            <div className="border-top border-secondary pt-3">
                                <strong>Matthew 25:35–45</strong>

                                <div className="small mt-1">
                                    Our work is inspired by the call to serve others
                                    with compassion and practical love.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ABOUT PAGE LINK */}
                    <div className="col-12 text-center">
                        <AppLink
                  to="/about"
                  navigate={navigate}
                  className="btn btn-sm btn-success"
                >
                  Expolore More <i className="bi bi-arrow-right ms-2"></i>
                </AppLink>
                    </div>
                </div>
            </div>
        </section>
        
        
      {/* PROGRAMS */}
      <section id="programs" className="py-4 shadow-lg">
        <div className="container py-4 px-3">
          <div
            className="text-center mx-auto mb-5"
            style={{ maxWidth: "760px" }}
          >
            <span className="text-success fw-bold text-uppercase small">
              What we do
            </span>

            <h2 className="display-6 fw-bold mt-2">
              Programs centered on people.
            </h2>

            <p className="text-secondary lead">
              Our programs are designed to respond to practical needs
              while protecting dignity and building hope.
            </p>
          </div>

          <div className="row g-4">
            {/* Program 1 */}
            <div className="col-md-6 col-lg-4">
              <article className="card border-0 rounded-4 shadow-lg h-100">
                <div className="card-body p-4">
                  <div className="program-icon bg-success-subtle text-success">
                    <i className="bi bi-people-fill"></i>
                  </div>

                  <h3 className="h4 mt-4">
                    Children &amp; Family Support
                  </h3>

                  <p className="text-secondary">
                    Supporting children and families facing difficult
                    circumstances through carefully planned interventions.
                  </p>

                  <a
                    href="#contact"
                    className="link-success fw-semibold text-decoration-none"
                  >
                    Learn more
                    <i className="bi bi-arrow-right ms-1"></i>
                  </a>
                </div>
              </article>
            </div>

            {/* Program 2 */}
            <div className="col-md-6 col-lg-4">
              <article className="card border-0 rounded-4 shadow-lg h-100">
                <div className="card-body p-4">
                  <div className="program-icon bg-warning-subtle text-warning-emphasis">
                    <i className="bi bi-book-half"></i>
                  </div>

                  <h3 className="h4 mt-4">
                    Education &amp; Opportunity
                  </h3>

                  <p className="text-secondary">
                    Helping create pathways for children to learn,
                    develop their abilities and pursue meaningful opportunities.
                  </p>

                  <a
                    href="#contact"
                    className="link-success fw-semibold text-decoration-none"
                  >
                    Learn more
                    <i className="bi bi-arrow-right ms-1"></i>
                  </a>
                </div>
              </article>
            </div>

            {/* Program 3 */}
            <div className="col-md-6 col-lg-4">
              <article className="card border-0 rounded-4 shadow-lg h-100">
                <div className="card-body p-4">
                  <div className="program-icon bg-danger-subtle text-danger">
                    <i className="bi bi-bandaid-fill"></i>
                  </div>

                  <h3 className="h4 mt-4">
                    Care &amp; Compassion
                  </h3>

                  <p className="text-secondary">
                    Responding to urgent needs with practical assistance
                    and compassionate community support.
                  </p>

                  <a
                    href="#contact"
                    className="link-success fw-semibold text-decoration-none"
                  >
                    Learn more
                    <i className="bi bi-arrow-right ms-1"></i>
                  </a>
                </div>
              </article>
            </div>

            {/* Program 4 */}
            <div className="col-md-6 col-lg-4">
              <article className="card border-0 rounded-4 shadow-lg h-100">
                <div className="card-body p-4">
                  <div className="program-icon bg-primary-subtle text-primary">
                    <i className="bi bi-house-heart-fill"></i>
                  </div>

                  <h3 className="h4 mt-4">
                    Community Outreach
                  </h3>

                  <p className="text-secondary">
                    Working alongside communities to identify needs
                    and encourage sustainable local solutions.
                  </p>

                  <a
                    href="#contact"
                    className="link-success fw-semibold text-decoration-none"
                  >
                    Learn more
                    <i className="bi bi-arrow-right ms-1"></i>
                  </a>
                </div>
              </article>
            </div>

            {/* Program 5 */}
            <div className="col-md-6 col-lg-4">
              <article className="card border-0 rounded-4 shadow-lg h-100">
                <div className="card-body p-4">
                  <div className="program-icon bg-info-subtle text-info-emphasis">
                    <i className="bi bi-hand-thumbs-up-fill"></i>
                  </div>

                  <h3 className="h4 mt-4">
                    Volunteer Service
                  </h3>

                  <p className="text-secondary">
                    Creating meaningful opportunities for people who want
                    to contribute their time, skills and compassion.
                  </p>

                  <a
                    href="#contact"
                    className="link-success fw-semibold text-decoration-none"
                  >
                    Get involved
                    <i className="bi bi-arrow-right ms-1"></i>
                  </a>
                </div>
              </article>
            </div>

            {/* Program 6 */}
            <div className="col-md-6 col-lg-4">
              <article className="card border-0 rounded-4 shadow-lg h-100">
                <div className="card-body p-4">
                  <div className="program-icon bg-secondary-subtle text-secondary">
                    <i className="bi bi-flower1"></i>
                  </div>

                  <h3 className="h4 mt-4">
                    Mercy Initiatives
                  </h3>

                  <p className="text-secondary">
                    Developing practical initiatives that turn acts of
                    kindness into lasting community impact.
                  </p>

                  <a
                    href="#contact"
                    className="link-success fw-semibold text-decoration-none"
                  >
                    Explore our mission
                    <i className="bi bi-arrow-right ms-1"></i>
                  </a>
                </div>
              </article>
            </div>

            <div className="col-12 text-center mt-4">
              <AppLink
                  to="/programs"
                  navigate={navigate}
                  className="btn btn-sm btn-success"
                >
                  Expolore More <i className="bi bi-arrow-right ms-2"></i>
                </AppLink>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section id="impact" className="py-4 shadow-lg">
        <div className="container py-4 px-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-5">
              <span className="text-success fw-bold text-uppercase small">
                Accountability
              </span>

              <h2 className="display-6 fw-bold mt-2">
                Impact that can be seen, measured and trusted.
              </h2>

              <p className="text-secondary">
                As the foundation grows, verified organizational data
                will be published here to show supporters how resources
                are being used and what outcomes are being achieved.
              </p>
            </div>

            <div className="col-lg-7">
              <div className="row g-3">
                {/* Children reached */}
                <div className="col-sm-6">
                  <div className="impact-card p-4 rounded-4 border h-100 shadow-sm">
                    <i className="bi bi-people-fill text-success fs-2"></i>

                    <div className="display-6 fw-bold mt-3">—</div>

                    <p className="mb-0 text-secondary">
                      Children reached
                    </p>

                    <small className="text-muted">
                      Verified data pending
                    </small>
                  </div>
                </div>

                {/* Families supported */}
                <div className="col-sm-6">
                  <div className="impact-card p-4 rounded-4 border h-100 shadow-sm">
                    <i className="bi bi-heart-fill text-danger fs-2"></i>

                    <div className="display-6 fw-bold mt-3">—</div>

                    <p className="mb-0 text-secondary">
                      Families supported
                    </p>

                    <small className="text-muted">
                      Verified data pending
                    </small>
                  </div>
                </div>

                {/* Opportunities created */}
                <div className="col-sm-6">
                  <div className="impact-card p-4 rounded-4 border h-100 shadow-sm">
                    <i className="bi bi-mortarboard-fill text-primary fs-2"></i>

                    <div className="display-6 fw-bold mt-3">—</div>

                    <p className="mb-0 text-secondary">
                      Opportunities created
                    </p>

                    <small className="text-muted">
                      Verified data pending
                    </small>
                  </div>
                </div>

                {/* Community initiatives */}
                <div className="col-sm-6">
                  <div className="impact-card p-4 rounded-4 border h-100 shadow-sm">
                    <i className="bi bi-globe-africa text-success fs-2"></i>

                    <div className="display-6 fw-bold mt-3">—</div>

                    <p className="mb-0 text-secondary">
                      Community initiatives
                    </p>

                    <small className="text-muted">
                      Verified data pending
                    </small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 text-center">
              <AppLink
                  to="/impact"
                  navigate={navigate}
                  className="btn btn-sm btn-success"
                >
                  Expolore More <i className="bi bi-arrow-right ms-2"></i>
                </AppLink>
            </div>
          </div>
        </div>
      </section>
      
      
      {/* FOUNDER */}
      <section id="founder" className="py-4 shadow-lg">
        <div className="container py-4 px-4">
          <div className="row align-items-center g-5">
            {/* Founder image */}
            <div className="col-lg-5">
              <div className="founder-placeholder rounded-4 d-flex align-items-center justify-content-center">
                <div className="text-center p-4">
                  <img
                    className="img-fluid rounded-4"
                    src="/images/founder/apostle_derrick_musinguzi.png"
                    alt="Apostle Derrick Musinguzi with his wife Silvia Musinguzi"
                    loading="lazy"
                  />

                  <p className="mb-0 mt-3">
                    Apostle Derrick Musinguzi with his wife Silvia Musinguzi
                  </p>
                </div>
              </div>
            </div>

            {/* Founder information */}
            <div className="col-lg-7">
              <span className="text-warning fw-bold text-uppercase small">
                Our founder
              </span>

              <h2 className="display-6 fw-bold mt-2">
                Apostle Derrick Musinguzi
              </h2>

              <p className="lead">
                Founder of Garden of Mercy Foundation
              </p>

              <p>
                Garden of Mercy Foundation was founded by Apostle Derrick
                Musinguzi of Power of Revelation Ministries, with a vision
                centered on expressing mercy and compassion through practical
                service to people in need.
              </p>

              <div className="border-start border-warning border-4 ps-4 mt-4">
                <p className="fs-5 mb-2">
                  “Sowing Seeds of Mercy and Compassion.”
                </p>

                <small>Garden of Mercy Foundation</small>
              </div>
            </div>

            <div className="col-12 text-center">
              <AppLink
                  to="/founder"
                  navigate={navigate}
                  className="btn btn-sm btn-success"
                >
                  Expolore More <i className="bi bi-arrow-right ms-2"></i>
                </AppLink>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section
        id="gallery"
        className="py-5"
        aria-labelledby="gallery-title"
      >
        <div className="container">
          {/* Section heading */}
          <div className="row align-items-end g-4 mb-4">
            <div className="col-lg-8">
              <span className="text-success fw-bold text-uppercase small">
                Moments of Mercy
              </span>

              <h2
                id="gallery-title"
                className="display-6 fw-bold mt-2 mb-3"
              >
                See Compassion in Action
              </h2>

              <p className="lead text-body-secondary mb-0">
                A glimpse into the people, communities and moments
                that inspire the work of Garden of Mercy Foundation.
              </p>
            </div>

            <div className="col-lg-4 text-lg-end">
              
              <AppLink
                  to="/gallery"
                  navigate={navigate}
                  className="btn btn-outline-success rounded-pill px-4"
                >
                  View Full Gallery
                <i className="bi bi-arrow-right ms-2"></i>
                </AppLink>
            </div>
          </div>

          {/* Gallery preview */}
          <div className="row g-3">
            {/* Featured image */}
            <div className="col-lg-6">
                <AppLink
                  to="/gallery"
                  navigate={navigate}
                  className="home-gallery-card home-gallery-feature d-block" aria-label="View our full gallery"
                >
                  
                  <img
                  src="/images/gallery/featured.jpg"
                  alt="Garden of Mercy Foundation community outreach"
                  loading="lazy"
                />

                <div className="home-gallery-overlay">
                  <div>
                    <span className="badge bg-warning text-dark rounded-pill mb-2">
                      Featured
                    </span>

                    <h3 className="h3 fw-bold text-white mb-1">
                      Compassion in Action
                    </h3>

                    <p className="text-white-50 mb-0">
                      Stories of hope, dignity and community.
                    </p>
                  </div>
                </div>
                </AppLink>
                
            </div>

            {/* Smaller gallery images */}
            <div className="col-lg-6">
              <div className="row g-3">
                {/* Children */}
                <div className="col-6">
                  <a
                    href="/gallery"
                    className="home-gallery-card d-block"
                    aria-label="View children gallery"
                  >
                    <img
                      src="/images/gallery/children-01.png"
                      alt="Children supported by Garden of Mercy Foundation"
                      loading="lazy"
                    />

                    <div className="home-gallery-overlay">
                      <span className="text-white fw-semibold">
                        Children
                      </span>
                    </div>
                  </a>
                </div>

                {/* Community */}
                <div className="col-6">
                 
                  <AppLink
                  to="/gallery"
                  navigate={navigate}
                  className="home-gallery-card d-block" aria-label="View community gallery"
                >
                  <img
                      src="/images/gallery/community-01.png"
                      alt="Garden of Mercy Foundation community"
                      loading="lazy"
                    />

                    <div className="home-gallery-overlay">
                      <span className="text-white fw-semibold">
                        Community
                      </span>
                    </div>
                </AppLink>
                </div>

                {/* Outreach */}
                <div className="col-6">
                  
                  <AppLink
                  to="/gallery"
                  navigate={navigate}
                  className="home-gallery-card d-block"
                    aria-label="View outreach gallery"
                >
                  <img
                      src="/images/gallery/outreach-01.jpg"
                      alt="Garden of Mercy Foundation outreach"
                      loading="lazy"
                    />

                    <div className="home-gallery-overlay">
                      <span className="text-white fw-semibold">
                        Outreach
                      </span>
                    </div>
                </AppLink>
                </div>

                {/* Volunteers */}
                <div className="col-6">
                  
                  <AppLink
                  to="/gallery"
                  navigate={navigate}
                  className="home-gallery-card d-block"
                    aria-label="View volunteers gallery"
                >
                  <img
                      src="/images/gallery/volunteers-01.jpg"
                      alt="Garden of Mercy Foundation volunteers"
                      loading="lazy"
                    />

                    <div className="home-gallery-overlay">
                      <span className="text-white fw-semibold">
                        Volunteers
                      </span>
                    </div>
                </AppLink>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-4">
           
            <AppLink
                  to="/gallery"
                  navigate={navigate}
                  className="link-success fw-semibold text-decoration-none"
                >
                  Explore more moments
              <i className="bi bi-arrow-up-right ms-1"></i>
                </AppLink>
          </div>
        </div>
      </section>
      
      
      {/* DONATION */}
      <section id="donate" className="py-4 shadow-lg">
        <div className="container py-4 px-3">
          <div className="donation-card rounded-4 shadow-lg overflow-hidden">
            <div className="row g-0 align-items-center">
              {/* Donation message */}
              <div className="col-lg-7 p-4 p-lg-5">
                <span className="badge text-bg-warning mb-3">
                  Make a difference
                </span>

                <h2 className="display-6 fw-bold">
                  Sow a seed of mercy today.
                </h2>

                <p className="lead text-secondary">
                  Your support can help transform compassion into practical
                  action for children and communities.
                </p>

                <div className="d-flex flex-wrap gap-2 mt-4">
                  <a
                    href="/donate"
                    className="btn btn-success btn-lg px-4"
                  >
                    <i className="bi bi-heart-fill me-2"></i>
                    I Want to Give
                  </a>

                  <a
                    href="/donate"
                    className="btn btn-outline-success btn-lg px-4"
                  >
                    Ask About Giving
                  </a>
                </div>
              </div>

              {/* Get involved */}
              <div className="col-lg-5 bg-success text-white p-4 p-lg-5">
                <i className="bi bi-flower1 display-3 text-warning"></i>

                <h3 className="h3 mt-4">
                  Every seed matters.
                </h3>

                <p>
                  Whether through financial support, volunteering,
                  partnership or prayer, every contribution can help
                  strengthen the mission.
                </p>

                <a
                  href="#contact"
                  className="btn btn-light text-success fw-semibold"
                >
                  Get involved
                  <i className="bi bi-arrow-right ms-2"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-4 shadow-lg">
        <div className="container py-4 px-3">
          <div className="row g-5">
            {/* Contact information */}
            <div className="col-lg-5">
              <span className="text-success fw-bold text-uppercase small">
                Connect with us
              </span>

              <h2 className="display-6 fw-bold mt-2">
                Be part of the mission.
              </h2>

              <p className="text-secondary">
                Interested in volunteering, partnering, supporting the
                foundation or learning more about our work?
                We would love to hear from you.
              </p>

              <div className="d-flex gap-3 mt-4">
                <div className="contact-icon">
                  <i className="bi bi-envelope"></i>
                </div>

                <div>
                  <strong>Email</strong>
                  <p className="text-muted mb-0">
                    <a
                      href="mailto:merc ygarden@gmail.com"
                      className="text-decoration-none text-muted"
                    >
                      mercygarden@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="d-flex gap-3 mt-4">
                <div className="contact-icon">
                  <i className="bi bi-geo-alt"></i>
                </div>

                <div>
                  <strong>Location</strong>
                  <p className="text-muted mb-0">Uganda</p>
                </div>
              </div>
            </div>

            {/* Contact call to action */}
            <div className="col-lg-7">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4 p-lg-5">
                  <h3 className="h4 mb-3">
                    Send us a message
                  </h3>

                  <p className="text-secondary mb-4">
                    Have a question, partnership idea or want to volunteer?
                    Get in touch with our team.
                  </p>

                  <a
                    href="/contact"
                    className="btn btn-lg btn-success"
                  >
                    <i className="bi bi-envelope me-2"></i>
                    Send message
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </>
);
}



export default Home;
