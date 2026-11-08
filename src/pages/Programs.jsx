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

function Programs({ navigate }) {
  return (
    <main id="main-content" className="programs-page">
{/* PROGRAMS HERO */}
      <section data-scroll-reveal="up" className="programs-hero" aria-labelledby="programs-title">
        <div className="programs-hero-overlay" aria-hidden="true" />
        <div className="container programs-hero-inner">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div className="programs-hero-copy">
                <span className="programs-hero-eyebrow about-hero-eyebrow">
                  <span className="programs-hero-eyebrow-dot about-hero-eyebrow-dot" aria-hidden="true" />
                  ABOUT GARDEN OF MERCY FOUNDATION
                </span>
                <h1 id="programs-title" className="programs-hero-title">
                  Practical expressions of <em>compassion.</em>
                  <span>Turning care into meaningful action.</span>
                </h1>
                <p className="programs-hero-description">
                  We seek to advance the dignity and wellbeing of children,
                  families and communities through thoughtful, child-centered
                  initiatives shaped by real needs, responsible partnerships
                  and the resources available.
                </p>
                <div className="programs-hero-actions">
                  <a href="#program-areas" className="btn programs-hero-primary">
                    Explore our program areas
                    <i className="bi bi-arrow-down-right ms-2" aria-hidden="true" />
                  </a>
                  <AppLink to="/donate" navigate={navigate} className="btn programs-hero-secondary">
                    Support our work
                  </AppLink>
                </div>
                <div className="programs-hero-values" aria-label="Our program priorities">
                  <span><i className="bi bi-person-hearts" aria-hidden="true" /> Children first</span>
                  <span><i className="bi bi-shield-check" aria-hidden="true" /> Dignity and safety</span>
                  <span><i className="bi bi-people" aria-hidden="true" /> Stronger communities</span>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <aside className="programs-hero-card" aria-label="Our commitment to responsible programs">
                <div className="programs-hero-card-heading">
                  <span className="programs-hero-card-icon" aria-hidden="true">
                    <i className="bi bi-heart-pulse" />
                  </span>
                  <span className="programs-hero-card-kicker">OUR GUIDING COMMITMENT</span>
                </div>
                <h2>Every child deserves the opportunity to thrive.</h2>
                <p>
                  Our work begins by listening, understanding needs and
                  protecting the dignity, rights and wellbeing of the people
                  and communities we serve.
                </p>
                <div className="programs-hero-card-divider" />
                <div className="programs-hero-card-foot">
                  <i className="bi bi-flower1" aria-hidden="true" />
                  <span>Sowing seeds of mercy and compassion.</span>
                </div>
                <span className="programs-hero-card-watermark" aria-hidden="true">
                  <i className="bi bi-flower1" />
                </span>
              </aside>
              <p className="programs-hero-caption">
                <i className="bi bi-check-circle-fill me-2" aria-hidden="true" />
                Thoughtful action. Responsible impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAM PHILOSOPHY */}
      <section data-scroll-reveal="up" className="programs-approach py-5" aria-labelledby="approach-title">
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
                Programs are developed around identified needs,
                available resources, appropriate partnerships and
                responsible organizational planning.
              </p>

            </div>

            <div className="col-lg-6">
              <div className="programs-approach-card rounded-4 p-4 p-md-5 h-100">
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
      <section data-scroll-reveal="up" id="program-areas" className="programs-areas py-5" aria-labelledby="program-areas-title">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-label">PROGRAM AREAS</span>
            <span className="programs-section-kicker">A FRAMEWORK FOR PRACTICAL COMPASSION</span>

            <h2
              id="program-areas-title"
              className="fw-bold mt-2"
            >
              Areas where we seek to make a difference
            </h2>

            <p className="programs-section-intro text-secondary mx-auto mb-0">
              These are the key areas that guide our work. Specific activities
              are shaped by assessed needs, available resources, safeguarding
              requirements and responsible partnerships.
            </p></div>

          <div className="row g-4">
            {programAreas.map((program) => (
              <div
                className="col-md-6 col-xl-4"
                key={program.title}
              >
                <article className="program-area-card h-100">
                  <div className="program-area-icon" aria-hidden="true">
                    <i className={`bi ${program.icon}`} />
                  </div>

                  <div className="program-area-heading"><span className="program-area-label">AREA OF FOCUS</span><h3>{program.title}</h3></div>

                  <p className="program-area-description">
                    {program.description}
                  </p>

                  <ul className="program-area-list">
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
      <section data-scroll-reveal="up" className="programs-principles py-5" aria-labelledby="principles-title">
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
                <article className="program-principle-card h-100">
                  <i
                    className={`bi ${principle.icon} program-principle-icon`}
                    aria-hidden="true"
                  />

                  <h3 className="h5 mt-4">
                    {principle.title}
                  </h3>

                  <p className="text-secondary mb-0">
                    {principle.description}
                  </p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section data-scroll-reveal="up" className="programs-process py-5" aria-labelledby="process-title">
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
                We begin by listening to communities and understanding
                their needs. We then plan and deliver practical support,
                monitor progress, and learn from each programme to strengthen
                our accountability and service.
              </p>
            </div>
          </div>

          <div className="row g-4 mt-3">
            {processSteps.map((step) => (
              <div
                className="col-md-6 col-lg-3"
                key={step.number}
              >
                <article className="program-process-card h-100"><span className="program-process-number">{step.number}</span>

                  <h3 className="h5 mt-3">{step.title}</h3>

                  <p className="text-secondary small mb-0">
                    {step.description}
                  </p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section data-scroll-reveal="up"
        className="py-5"
        aria-labelledby="program-cta-title"
      >
        <div className="container">
          <div className="programs-cta rounded-4 p-4 p-md-5 text-center">
            <h2
              id="program-cta-title"
              className="fw-bold"
            >
              Help sow seeds of mercy.
            </h2>

            <p className="programs-cta-copy mb-4 mx-auto">
              Your support, skills and ideas can help turn shared compassion
              into thoughtful action for children and communities.
            </p>

            <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
              <AppLink
                to="/donate"
                navigate={navigate}
                className="btn programs-cta-primary px-4"
              >
                Support Our Work
              </AppLink>

              <AppLink
                to="/contact"
                navigate={navigate}
                className="btn programs-cta-secondary px-4"
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
