import React from "react";
import { AppLink, PageIntro, Eyebrow, CallToAction } from "../components/SiteChrome.jsx";


function About({ navigate }) {
  const goToPage = (page, fallback) => {
    if (navigate) {
      navigate(page);
    } else {
      window.location.href = fallback;
    }
  };

  return (
    <main id="main-content">
      {/* Page header */}
      <section
        className="page-header hero py-5"
        aria-labelledby="page-title"
      >
        <div className="overlay"></div>

        <div className="container text-white py-lg-4">
          <span className="section-label eyebrow eyebrow-light">
            <span className="eyebrow-dot"></span> ABOUT US
          </span>

          <h1
            id="page-title"
            className="display-5 fw-bold mt-2"
          >
            A foundation built around mercy.
          </h1>

          <p className="lead col-lg-8 mb-0">
            Garden of Mercy Foundation exists to turn compassion
            into practical action, with a particular focus on children.
          </p>
        </div>
      </section>

      {/* Foundation */}
      <section aria-labelledby="foundation-heading">
        <div className="container p-4 background shadow-lg">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <h2
                id="foundation-heading"
                className="fw-bold mb-4"
              >
                Our foundation
              </h2>

              <p>
                Garden of Mercy Foundation is a child-focused foundation
                established around the principles of mercy, compassion,
                dignity and service.
              </p>

              <p>
                We seek to identify meaningful ways of supporting children
                and communities while encouraging people to participate
                in acts of compassion.
              </p>

              <p className="mb-0">
                Our work is inspired by the teaching of Jesus in{" "}
                <strong>Matthew 25:35–45</strong>.
              </p>
            </div>

            <div className="col-lg-6">
              <aside
                className="quote-card background shadow-lg p-4 p-md-5 rounded-4"
                aria-label="Foundation message"
              >
                <i
                  className="bi bi-heart-fill display-5 text-success"
                  aria-hidden="true"
                ></i>

                <h3 className="fw-bold mt-4">
                  Sowing Seeds of Mercy and Compassion
                </h3>

                <p className="text-secondary mb-0">
                  Compassion becomes meaningful when it is translated
                  into action.
                </p>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section
        className="py-5 background shadow-lg"
        aria-labelledby="values-heading"
      >
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-label">OUR VALUES</span>

            <h2
              id="values-heading"
              className="fw-bold mt-2"
            >
              What guides our work
            </h2>

            <p
              className="text-secondary mx-auto mb-0"
              style={{ maxWidth: "700px" }}
            >
              Our approach is centered on compassion, dignity and
              meaningful community participation.
            </p>
          </div>

          <div className="row g-4">
            {/* Compassion */}
            <div className="col-md-4">
              <article className="feature-card background shadow-lg h-100">
                <i
                  className="bi bi-heart display-5 text-success"
                  aria-hidden="true"
                ></i>

                <h3 className="h4 mt-4">Compassion</h3>

                <p className="text-secondary mb-0">
                  We value compassionate responses to human needs
                  and seek practical ways to extend care to children
                  and communities.
                </p>
              </article>
            </div>

            {/* Dignity */}
            <div className="col-md-4">
              <article className="feature-card background shadow-lg h-100">
                <i
                  className="bi bi-shield-check display-5 text-success"
                  aria-hidden="true"
                ></i>

                <h3 className="h4 mt-4">Dignity</h3>

                <p className="text-secondary mb-0">
                  Every child deserves to be treated with dignity,
                  respect and care.
                </p>
              </article>
            </div>

            {/* Community */}
            <div className="col-md-4">
              <article className="feature-card background shadow-lg h-100">
                <i
                  className="bi bi-people display-5 text-success"
                  aria-hidden="true"
                ></i>

                <h3 className="h4 mt-4">Community</h3>

                <p className="text-secondary mb-0">
                  Meaningful change requires people and communities
                  working together toward a more compassionate future.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Scripture */}
      <section
        className="py-5 background shadow-lg"
        aria-labelledby="scripture-heading"
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <div className="text-center">
                <span className="section-label">
                  OUR INSPIRATION
                </span>

                <h2
                  id="scripture-heading"
                  className="fw-bold mt-2"
                >
                  Matthew 25:35–45
                </h2>

                <p className="lead text-secondary mb-0">
                  Our foundation is inspired by the call to respond
                  to people in need with mercy, compassion and practical service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section
        className="py-5 background shadow-lg"
        aria-labelledby="support-heading"
      >
        <div className="container">
          <div className="cta-section rounded-4 p-4 p-md-5 text-center">
            <h2
              id="support-heading"
              className="fw-bold"
            >
              Help sow seeds of mercy.
            </h2>

            <p className="text-secondary mb-4">
              Learn more about our programs or find out how you can
              support the mission of Garden of Mercy Foundation.
            </p>

            <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
              <button
                type="button"
                className="btn btn-success px-4"
                onClick={() => goToPage("/programs", "/programs")}
              >
                Explore Programs
              </button>

              <button
                type="button"
                className="btn btn-outline-success px-4"
                onClick={() => goToPage("/donate", "/donate")}
              >
                Support Our Work
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;
