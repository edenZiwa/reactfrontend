import React, { useEffect, useMemo, useState } from "react";
import "../css/sponsor.css";
import { AppLink, PageIntro, CallToAction } from "../components/SiteChrome.jsx";

const sponsorshipOptions = [
  {
    title: "Children & families",
    text: "Help strengthen child wellbeing and support families with practical care.",
    image: "https://gardenofmercy.org/images/gallery/children-03.png",
  },
  {
    title: "Education & opportunity",
    text: "Support access to learning resources and opportunities for young people.",
    image: "https://gardenofmercy.org/images/gallery/event-02.png",
  },
  {
    title: "Community outreach",
    text: "Stand alongside local communities as they respond to shared needs.",
    image: "https://gardenofmercy.org/images/gallery/outreach-01.jpg",
  },
];

function formatMoney(amount, currency) {
  const code = currency === "UGX" ? "UGX" : currency;

  try {
    return new Intl.NumberFormat(
      code === "UGX" ? "en-UG" : "en-US",
      {
        style: "currency",
        currency: code,
        maximumFractionDigits: code === "UGX" ? 0 : 2,
      }
    ).format(Number(amount));
  } catch {
    return `${amount} ${currency || ""}`.trim();
  }
}

function ChildCard({ child }) {
  const photoUrl =
    typeof child.photo_url === "string" &&
    /^https:\/\//i.test(child.photo_url)
      ? child.photo_url
      : "";

  const initial = (child.display_name || "Child")
    .trim()
    .charAt(0)
    .toUpperCase();

  const donationParams = new URLSearchParams({
    purpose: "children",
    child: String(child.id),
  });

  return (
    <div className="col-md-6 col-lg-4">
      <article className="child-card">
        <div className="child-art">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt=""
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="child-avatar" aria-hidden="true">
              {initial}
            </div>
          )}
        </div>

        <div className="child-body">
          <div className="d-flex flex-wrap gap-2 mb-3">
            <span className="badge rounded-pill text-bg-light border">
              {child.age_band || "School age"}
            </span>

            <span className="badge rounded-pill text-bg-light border">
              {child.region_label || "Uganda"}
            </span>
          </div>

          <h3 className="child-name">{child.display_name}</h3>

          <div className="meta mb-3">
            {child.education_level ||
              "Education and wellbeing support"}
          </div>

          <p className="story">{child.story}</p>

          <div className="support-line">
            <div className="amount">
              {formatMoney(child.sponsorship_amount, child.currency)}
              <small>Suggested support amount</small>
            </div>

            <a
              className="btn btn-gom"
              href={`/donate?${donationParams.toString()}`}
              aria-label={`Sponsor ${child.display_name || "this child"}`}
            >
              Sponsor <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}

function ChildProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currency, setCurrency] = useState("all");
  const [status, setStatus] = useState("loading");

  async function loadProfiles() {
    setStatus("loading");

    try {
      const response = await fetch("/api/sponsorship/children", {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load sponsorship profiles");
      }

      const data = await response.json();

      setProfiles(Array.isArray(data.children) ? data.children : []);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  useEffect(() => {
    loadProfiles();
  }, []);

  const visibleProfiles = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return profiles.filter((child) => {
      const matchesCurrency =
        currency === "all" || child.currency === currency;

      const searchableFields = [
        child.display_name,
        child.age_band,
        child.region_label,
        child.education_level,
        child.story,
      ];

      const matchesSearch = searchableFields.some((value) =>
        String(value || "").toLowerCase().includes(term)
      );

      return matchesCurrency && matchesSearch;
    });
  }, [profiles, searchTerm, currency]);

  const clearFilters = () => {
    setSearchTerm("");
    setCurrency("all");
  };

  return (
    <section className="py-5 py-lg-6" id="children">
      <div className="container py-lg-4">
        <div className="row align-items-end g-3 mb-4">
          <div className="col-lg-8">
            <div className="section-kicker mb-2">
              Find your sponsorship match
            </div>

            <h2 className="section-title display-6 mb-2">
              Children you can support
            </h2>

            <p className="intro-copy mb-0">
              Read each profile to understand the child&apos;s goals and
              the support requested. Sponsorship amounts are guidance
              for the listed needs; our team can explain how contributions
              are used.
            </p>
          </div>

          <div className="col-lg-4 text-lg-end">
            <span
              className="badge rounded-pill text-bg-light border px-3 py-2"
              id="results-count"
              aria-live="polite"
            >
              {status === "loading"
                ? "Loading profiles…"
                : status === "error"
                  ? "Profiles unavailable"
                  : `${visibleProfiles.length} ${
                      visibleProfiles.length === 1 ? "profile" : "profiles"
                    }`}
            </span>
          </div>
        </div>

        <div className="filter-bar mb-4 shadow-lg">
          <div className="row align-items-center g-3">
            <div className="col-md-7">
              <label
                className="form-label fw-semibold"
                htmlFor="child-search"
              >
                Search profiles
              </label>

              <input
                className="form-control form-control-lg"
                id="child-search"
                type="search"
                placeholder="Search by name, goal or education level"
                autoComplete="off"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <div className="col-md-5">
              <label
                className="form-label fw-semibold"
                htmlFor="currency-filter"
              >
                Sponsorship currency
              </label>

              <select
                className="form-select form-select-lg"
                id="currency-filter"
                value={currency}
                onChange={(event) => setCurrency(event.target.value)}
              >
                <option value="all">All currencies</option>
                <option value="UGX">Uganda shillings (UGX)</option>
                <option value="USD">US dollars (USD)</option>
              </select>
            </div>
          </div>
        </div>

        <div
          id="children-grid"
          className="row g-4"
          aria-live="polite"
          aria-busy={status === "loading"}
        >
          {status === "loading" && (
            <>
              {[1, 2, 3].map((item) => (
                <div
                  className={`col-md-6 col-lg-4 ${
                    item === 2 ? "d-none d-md-block" : ""
                  } ${item === 3 ? "d-none d-lg-block" : ""}`}
                  key={item}
                >
                  <div
                    className="loading-shimmer"
                    aria-label="Loading child sponsorship profiles"
                  />
                </div>
              ))}
            </>
          )}

          {status === "error" && (
            <div className="col-12">
              <div className="empty-state">
                <h3 className="h4 fw-bold">
                  We could not load sponsorship profiles
                </h3>

                <p
                  className="intro-copy mx-auto"
                  style={{ maxWidth: "560px" }}
                >
                  Please try again in a moment, or contact our team and
                  we will help you explore sponsorship opportunities.
                </p>

                <AppLink to="/contact" className="btn btn-gom">
                  Contact our team
                </AppLink>

                <button
                  type="button"
                  className="btn btn-outline-success rounded-pill px-4 ms-2"
                  onClick={loadProfiles}
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {status === "success" &&
            visibleProfiles.map((child) => (
              <ChildCard key={child.id} child={child} />
            ))}

          {status === "success" && visibleProfiles.length === 0 && (
            <div className="col-12">
              <div className="empty-state">
                <div className="display-5 mb-3" aria-hidden="true">
                  🌱
                </div>

                <h3 className="h4 fw-bold">
                  {profiles.length
                    ? "No profiles match those filters"
                    : "New sponsorship profiles are being prepared"}
                </h3>

                <p
                  className="intro-copy mx-auto"
                  style={{ maxWidth: "580px" }}
                >
                  {profiles.length
                    ? "Try another search term or currency."
                    : "We only publish profiles after the appropriate consent and safeguarding checks. Please check back soon, or contact our team to discuss current sponsorship opportunities."}
                </p>

                <div className="d-flex justify-content-center flex-wrap gap-2">
                  {profiles.length > 0 ? (
                    <button
                      type="button"
                      className="btn btn-outline-success rounded-pill px-4"
                      onClick={clearFilters}
                    >
                      Clear filters
                    </button>
                  ) : (
                    <AppLink to="/contact" className="btn btn-gom">
                      Contact our team
                    </AppLink>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="safety-note mt-4">
          <strong className="text-dark">Protecting children comes first.</strong> We use first
          names or chosen display names and broad age ranges. We do not
          publish exact birth dates, home addresses, caregiver contacts,
          case notes or other private records.
        </div>
      </div>
    </section>
  );
}

export default function Sponsor({ navigate }) {
  return (
    <>
      
      {/* SPONSORSHIP HERO */}
      <header className="sponsor-hero">
        <div className="container">
          <div className="row align-items-center text-white">
            <div className="overlay" />

            <div className="col-lg-7">
              <span className="section-label eyebrow eyebrow-light">
                <span className="eyebrow-dot" />
                Give a child room to grow
              </span>

              <h1 className="mt-3 mb-1">
                One caring sponsor can help change a child’s future.
              </h1>

              <p className="text-white">
                Discover children whose education and wellbeing could
                benefit from steady support. Your sponsorship can help
                provide school essentials, learning opportunities and
                care—with dignity, safety and transparency at the heart
                of every connection.
              </p>

              <div className="d-flex flex-wrap gap-3 mt-4">
                <a className="btn btn-gom" href="#children">
                  Explore children <span aria-hidden="true">↓</span>
                </a>

                <AppLink
                  to="/contact"
                  navigate={navigate}
                  className="btn btn-success fw-bold"
                >
                  Ask us how it works
                </AppLink>
              </div>
            </div>
          </div>
        </div>
      </header>

      <PageIntro
        eyebrow="PARTNER WITH PURPOSE"
        title={
          <>
            Help compassion <em>grow.</em>
          </>
        }
        text="Choose an area of interest and connect with Garden of Mercy Foundation to explore responsible ways to support our work."
      />

      <div className="container p-4">
        <div className="hero-art" aria-hidden="true">
          <div className="hero-emblem">
            <span className="hero-heart">💚</span>
          </div>
        </div>
      </div>

      {/* TRUST STRIP */}
      <section className="trust-strip">
        <div className="container">
          <div className="row g-2 justify-content-center">
            <div className="col-12 col-md-4">
              <div className="trust-item">
                <span className="trust-icon">🛡️</span>
                <span>Child dignity and safeguarding</span>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="trust-item">
                <span className="trust-icon">📚</span>
                <span>Support focused on opportunity</span>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="trust-item">
                <span className="trust-icon">🤝</span>
                <span>Guidance from our team</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main>
        <ChildProfiles />

        {/* HOW SPONSORSHIP WORKS */}
        <section
          className="py-5 shadow-lg"
          aria-labelledby="how-sponsorship-works"
        >
          <div className="container py-lg-4">
            <div
              className="text-center mx-auto mb-5"
              style={{ maxWidth: "700px" }}
            >
              <div className="section-kicker mb-2">
                A simple, supported process
              </div>

              <h2 className="section-title display-6">
                How child sponsorship works
              </h2>

              <p className="intro-copy">
                You don’t have to navigate the process alone. Our team
                will help you understand the needs and the next steps.
              </p>
            </div>

            <div className="row g-4">
              <div className="col-md-4">
                <div className="how-card shadow-lg">
                  <div className="step-num">01</div>
                  <h3 className="h5 fw-bold">Explore profiles</h3>
                  <p className="intro-copy mb-0">
                    Learn about a child’s interests, education goals and
                    the type of support being sought.
                  </p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="how-card shadow-lg">
                  <div className="step-num">02</div>
                  <h3 className="h5 fw-bold">Choose how to help</h3>
                  <p className="intro-copy mb-0">
                    Select a profile and start a secure donation, or
                    contact our team if you want to discuss a sponsorship
                    plan first.
                  </p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="how-card shadow-lg">
                  <div className="step-num">03</div>
                  <h3 className="h5 fw-bold">
                    Stay connected through us
                  </h3>
                  <p className="intro-copy mb-0">
                    Our team coordinates appropriate updates and handles
                    communication in line with safeguarding and privacy
                    rules.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SPONSORSHIP CTA */}
        <section className="py-5">
          <div className="container py-lg-3">
            <div className="cta">
              <div className="row align-items-center g-4">
                <div className="col-lg-8">
                  <div
                    className="section-kicker mb-2"
                    style={{ color: "#f0ce78" }}
                  >
                    Every act of care matters
                  </div>

                  <h2 className="section-title display-6 mb-3">
                    Not sure which child to sponsor?
                  </h2>

                  <p className="mb-0">
                    Tell us what kind of support you would like to provide.
                    We can help you understand current needs and find a
                    suitable way to contribute.
                  </p>
                </div>

                <div className="col-lg-4 text-lg-end">
                  <AppLink
                    to="/contact"
                    navigate={navigate}
                    className="btn btn-light rounded-pill px-4 py-3 fw-bold"
                  >
                    Talk to our team{" "}
                    <span aria-hidden="true">→</span>
                  </AppLink>

                  <div
                    className="small mt-3"
                    style={{ color: "#c9dfd0" }}
                  >
                    You can also{" "}
                    <AppLink
                      to="/donate"
                      navigate={navigate}
                      className="fw-bold"
                    >
                      make a general donation
                    </AppLink>
                    .
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
