import React from "react";
import { AppLink } from "../components/SiteChrome.jsx";

const programAreas = [
  {
    icon: "bi-person-hearts",
    title: "Child Welfare & Support",
    description:
      "Initiatives intended to promote the welfare, dignity, safety and positive development of children.",
    points: [
      "Basic support initiatives",
      "Child-centered assistance",
      "Family and community support",
      "Referral to appropriate services",
    ],
  },
  {
    icon: "bi-book-half",
    title: "Education Support",
    description:
      "Initiatives designed to help children access and participate in appropriate educational opportunities.",
    points: [
      "School-related support",
      "Learning materials",
      "Educational opportunities",
      "Learning and development initiatives",
    ],
  },
  {
    icon: "bi-egg-fried",
    title: "Nutrition & Wellbeing",
    description:
      "Potential initiatives addressing children's basic wellbeing and nutrition needs in appropriate settings.",
    points: [
      "Nutrition support",
      "Wellbeing initiatives",
      "Health-awareness activities",
      "Appropriate service referrals",
    ],
  },
  {
    icon: "bi-shield-check",
    title: "Child Protection",
    description:
      "A child-centered approach to promoting safety, dignity and protection from abuse, exploitation and other forms of harm.",
    points: [
      "Safeguarding awareness",
      "Protection-focused practices",
      "Safe referral pathways",
      "Responsible beneficiary information handling",
    ],
  },
  {
    icon: "bi-house-heart",
    title: "Family Strengthening",
    description:
      "Supporting approaches that strengthen families and communities around the wellbeing of children.",
    points: [
      "Family support initiatives",
      "Parent and caregiver engagement",
      "Community awareness",
      "Referral and partnership support",
    ],
  },
  {
    icon: "bi-people-fill",
    title: "Community Support",
    description:
      "Community-oriented initiatives that encourage people to participate in practical acts of mercy and service.",
    points: [
      "Community outreach",
      "Mercy initiatives",
      "Community partnerships",
      "Volunteer engagement",
    ],
  },
  {
    icon: "bi-life-preserver",
    title: "Emergency Assistance",
    description:
      "Where resources and approvals permit, targeted assistance may respond to urgent needs affecting children and families.",
    points: [
      "Urgent needs assessment",
      "Emergency support",
      "Referral to specialist services",
      "Community response partnerships",
    ],
  },
  {
    icon: "bi-lightbulb",
    title: "Skills & Empowerment",
    description:
      "Initiatives that encourage learning, confidence, life skills and positive opportunities for young people.",
    points: [
      "Life-skills activities",
      "Mentorship opportunities",
      "Leadership development",
      "Positive youth engagement",
    ],
  },
  {
    icon: "bi-plus-circle",
    title: "Future Initiatives",
    description:
      "Additional programs may be introduced as community needs, organizational capacity, partnerships and resources develop.",
    points: [
      "Needs-based initiatives",
      "New partnerships",
      "Community innovation",
      "Future approved programs",
    ],
  },
];

const principles = [
  {
    icon: "bi-person-check",
    title: "Child-centered",
    description:
      "Children's safety, dignity, rights and wellbeing should remain central to program decisions.",
  },
  {
    icon: "bi-shield-lock",
    title: "Safeguarding",
    description:
      "Programs should operate with appropriate protection and safeguarding procedures.",
  },
  {
    icon: "bi-bar-chart-line",
    title: "Accountability",
    description:
      "Activities and resources should be managed responsibly and monitored against appropriate objectives.",
  },
  {
    icon: "bi-people",
    title: "Partnership",
    description:
      "Sustainable community impact can be strengthened through responsible collaboration.",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Identify",
    description: "Understand community and beneficiary needs.",
  },
  {
    number: "02",
    title: "Plan",
    description:
      "Develop appropriate objectives, resources and safeguards.",
  },
  {
    number: "03",
    title: "Act",
    description: "Deliver approved activities responsibly.",
  },
  {
    number: "04",
    title: "Learn",
    description:
      "Monitor results, learn and improve future programs.",
  },
];

function Programs() {
  return (
    <main id="main-content">
      {/* PAGE HEADER */}
      <section
        className="page-header hero"
        aria-labelledby="programs-title"
      >
        <div className="overlay" aria-hidden="true" />

        <div className="container text-white p-4">
          <span className="section-label eyebrow eyebrow-light">
            <span className="eyebrow-dot" />
            OUR PROGRAMS
          </span>

          <h1
            id="programs-title"
            className="display-5 fw-bold mt-2"
          >
            Practical expressions of compassion.
          </h1>

          <p className="lead text-white col-lg-9 mb-0">
            Garden of Mercy Foundation seeks to develop child-focused
            initiatives that respond to identified needs and create
            meaningful opportunities for children, families and
            communities.
          </p>
        </div>
      </section>

      {/* PROGRAM PHILOSOPHY */}
      <section className="p-4" aria-labelledby="approach-title">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <span className="section-label">OUR APPROACH</span>

              <h2
                id="approach-title"
                className="fw-bold mt-2 mb-4"
              >
                From compassion to practical action.
              </h2>

              <p>
                Our program approach is centered on the belief that
                compassion should respond to real needs while protecting
                the dignity, safety and rights of the people we serve.
              </p>

              <p>
                Programs should be developed around identified needs,
                available resources, appropriate partnerships and
                responsible organizational planning.
              </p>

              <p className="mb-0">
                Where programs are still being developed, this page
                describes intended areas of focus rather than claiming
                services that have not yet been formally established.
              </p>
            </div>

            <div className="col-lg-6">
              <div className="quote-card background shadow-lg rounded-4 p-4 p-md-5">
                <i
                  className="bi bi-heart-fill display-5 text-success"
                  aria-hidden="true"
                />

                <h3 className="fw-bold mt-4">
                  Sowing Seeds of Mercy and Compassion
                </h3>

                <p className="text-secondary mb-0">
                  Every initiative should seek to turn compassion into
                  responsible, practical and sustainable action.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAM AREAS */}
      <section className="py-5" aria-labelledby="program-areas-title">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-label">PROGRAM AREAS</span>

            <h2
              id="program-areas-title"
              className="fw-bold mt-2"
            >
              Areas where we seek to make a difference
            </h2>

            <p
              className="text-secondary mx-auto mb-0"
              style={{ maxWidth: "760px" }}
            >
              Our program framework can grow as community needs,
              organizational capacity and partnerships develop.
            </p>
          </div>

          <div className="row g-4">
            {programAreas.map((program) => (
              <div
                className="col-md-6 col-xl-4"
                key={program.title}
              >
                <article className="program-card rounded-4 background shadow-lg h-100">
                  <div className="program-icon" aria-hidden="true">
                    <i className={`bi ${program.icon}`} />
                  </div>

                  <h3 className="h4">{program.title}</h3>

                  <p className="text-secondary">
                    {program.description}
                  </p>

                  <ul className="text-secondary small ps-3 mb-0">
                    {program.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAM PRINCIPLES */}
      <section className="py-5" aria-labelledby="principles-title">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-label">OUR PRINCIPLES</span>

            <h2
              id="principles-title"
              className="fw-bold mt-2"
            >
              How programs should be delivered
            </h2>
          </div>

          <div className="row g-4">
            {principles.map((principle) => (
              <div
                className="col-md-6 col-lg-3"
                key={principle.title}
              >
                <div className="feature-card rounded-4 background shadow-lg h-100">
                  <i
                    className={`bi ${principle.icon} display-6 text-success`}
                    aria-hidden="true"
                  />

                  <h3 className="h5 mt-4">
                    {principle.title}
                  </h3>

                  <p className="text-secondary mb-0">
                    {principle.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="py-5" aria-labelledby="process-title">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9 text-center">
              <span className="section-label">HOW WE WORK</span>

              <h2
                id="process-title"
                className="fw-bold mt-2 mb-4"
              >
                From identified need to responsible action
              </h2>

              <p className="text-secondary">
                A mature program should begin with understanding a need,
                continue through planning and implementation, and include
                monitoring, accountability and learning.
              </p>
            </div>
          </div>

          <div className="row m-2 rounded-4 g-4 mt-4 background shadow-lg">
            {processSteps.map((step) => (
              <div
                className="col-md-6 col-lg-3"
                key={step.number}
              >
                <div className="text-center">
                  <div className="display-6 fw-bold text-success">
                    {step.number}
                  </div>

                  <h3 className="h5 mt-3">{step.title}</h3>

                  <p className="text-secondary small">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRANSPARENCY */}
      <section
        className="py-5"
        aria-labelledby="transparency-title"
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <div className="quote-card rounded-4 p-4 p-md-5 text-center">
                <i
                  className="bi bi-eye display-5 text-success"
                  aria-hidden="true"
                />

                <h2
                  id="transparency-title"
                  className="fw-bold mt-4"
                >
                  Responsible impact reporting
                </h2>

                <p className="text-secondary mb-0">
                  As programs develop, verified information about
                  activities, beneficiaries, outputs and outcomes can
                  be published through the Foundation&apos;s impact and
                  reporting channels. We will avoid presenting
                  unverified figures as confirmed impact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section
        className="py-5"
        aria-labelledby="program-cta-title"
      >
        <div className="container">
          <div className="cta-section rounded-4 p-4 p-md-5 text-center">
            <h2
              id="program-cta-title"
              className="fw-bold"
            >
              Help sow seeds of mercy.
            </h2>

            <p className="text-secondary mb-4">
              Support initiatives that seek to bring practical
              compassion to children and communities.
            </p>

            <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
              <AppLink
                to="/donate"
                className="btn btn-success px-4"
              >
                Support Our Work
              </AppLink>

              <AppLink
                to="/contact"
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

export default Programs;
