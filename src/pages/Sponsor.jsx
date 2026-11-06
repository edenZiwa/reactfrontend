import React, { useCallback, useEffect, useMemo, useState } from "react";
import "../css/sponsor.css";
import { AppLink } from "../components/SiteChrome.jsx";

const sponsorshipPaths = [
  {
    icon: "bi-person-heart",
    label: "01 · INDIVIDUAL SPONSORSHIP",
    title: "Stand alongside a child",
    text: "Choose an available child profile and support their education and wellbeing through an agreed sponsorship plan.",
    points: ["A child-centred support plan", "Guidance from our foundation team"],
  },
  {
    icon: "bi-people",
    label: "02 · SHARED SPONSORSHIP",
    title: "Strengthen support together",
    text: "Contribute towards shared needs and initiatives that benefit children and vulnerable communities.",
    points: ["Contributions towards shared priorities", "Support guided by assessed needs"],
  },
];

const sponsorshipPrinciples = [
  {
    icon: "bi-shield-check",
    title: "Safeguarding comes first",
    text: "We treat children's safety, privacy and dignity as essential in every sponsorship relationship.",
  },
  {
    icon: "bi-calendar2-check",
    title: "Consistent support",
    text: "Choose a one-time contribution or discuss recurring support that fits your circumstances.",
  },
  {
    icon: "bi-file-earmark-text",
    title: "Quarterly progress updates",
    text: "Sponsors receive progress reporting on a quarterly basis through the foundation's appropriate communication channels.",
  },
];

const sponsorshipSteps = [
  {
    number: "01",
    title: "Explore the options",
    text: "Review available child profiles or learn about shared sponsorship priorities.",
  },
  {
    number: "02",
    title: "Talk through your support",
    text: "Choose a one-time or recurring contribution and ask our team about the sponsorship arrangement.",
  },
  {
    number: "03",
    title: "Stay informed",
    text: "Our team coordinates appropriate communication and quarterly progress updates while protecting children's privacy.",
  },
];

function formatMoney(amount, currency) {
  const code = currency === "USD" ? "USD" : "UGX";
  const numericAmount = Number(amount);

  if (amount === null || amount === undefined || amount === "" || !Number.isFinite(numericAmount)) {
    return "Contact us";
  }

  try {
    return new Intl.NumberFormat(code === "UGX" ? "en-UG" : "en-US", {
      style: "currency",
      currency: code,
      maximumFractionDigits: code === "UGX" ? 0 : 2,
    }).format(numericAmount);
  } catch {
    return `${numericAmount.toLocaleString()} ${code}`;
  }
}

function ChildCard({ child }) {
  const photoUrl =
    typeof child.photo_url === "string" &&
    (/^https:\/\//i.test(child.photo_url) || /^\/(?!\/)/.test(child.photo_url))
      ? child.photo_url
      : "";

  const initial = (child.display_name || "Child").trim().charAt(0).toUpperCase();
  const donationParams = new URLSearchParams({
    purpose: "children",
    child: String(child.id),
  });

  return (
    <div className="col-md-6 col-xl-4">
      <article className="sponsor-child-card h-100">
        <div className="sponsor-child-image">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt=""
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="sponsor-child-avatar" aria-hidden="true">
              {initial}
            </div>
          )}
          <span className="sponsor-child-image-label">
            <i className="bi bi-heart-fill" aria-hidden="true" />
            A future full of possibility
          </span>
        </div>

        <div className="sponsor-child-content">
          <div className="d-flex flex-wrap gap-2 mb-3">
            <span className="sponsor-profile-tag">{child.age_band || "School age"}</span>
            <span className="sponsor-profile-tag">{child.region_label || "Uganda"}</span>
          </div>

          <h3 className="sponsor-child-name">{child.display_name || "Child profile"}</h3>
          <p className="sponsor-child-level">
            {child.education_level || "Education and wellbeing support"}
          </p>
          <p className="sponsor-child-story">
            {child.story || "Contact our team to learn more about this sponsorship opportunity."}
          </p>

          <div className="sponsor-child-footer">
            <div className="sponsor-child-amount">
              {formatMoney(child.sponsorship_amount, child.currency)}
              <small>Suggested support amount</small>
            </div>
            <a
              className="btn sponsor-button sponsor-button-green"
              href={`/donate?${donationParams.toString()}`}
              aria-label={`Sponsor ${child.display_name || "this child"}`}
            >
              Sponsor <i className="bi bi-arrow-up-right ms-1" aria-hidden="true" />
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
  const [loadError, setLoadError] = useState("");

  const loadProfiles = useCallback(async (signal) => {
    setStatus("loading");
    try {
      let response;
      try {
        response = await fetch("/api/sponsorship/children", {
          headers: { Accept: "application/json" },
          cache: "no-store",
          signal,
        });
      } catch (networkError) {
        if (networkError.name === "AbortError") throw networkError;
        throw new Error("We could not connect to the sponsorship service. Check your internet connection and try again.");
      }
      const contentType = response.headers.get("content-type") || "";
      if (!response.ok) {
        const payload = contentType.includes("application/json") ? await response.json().catch(() => ({})) : {};
        const fallback = response.status >= 500
          ? "The sponsorship service is temporarily unavailable. Please try again shortly."
          : "We could not load sponsorship profiles. Please refresh and try again.";
        throw new Error(payload.message || payload.error || fallback);
      }
      if (!contentType.includes("application/json")) {
        throw new Error("The sponsorship service returned an unexpected response. Please try again later.");
      }
      const data = await response.json();
      const children = Array.isArray(data.children) ? data.children : [];
      setProfiles(children.filter((child) =>
        child && typeof child === "object" && child.id !== null && child.id !== undefined
      ));
      setStatus("success");
    } catch (error) {
      if (error.name !== "AbortError") {
        setStatus("error");
        setLoadError(error.message || "We could not load sponsorship profiles. Please try again.");
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadProfiles(controller.signal);
    return () => controller.abort();
  }, [loadProfiles]);

  const visibleProfiles = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return profiles.filter((child) => {
      const matchesCurrency = currency === "all" || child.currency === currency;
      const fields = [
        child.display_name,
        child.age_band,
        child.region_label,
        child.education_level,
        child.story,
      ];
      return matchesCurrency && fields.some((value) =>
        String(value || "").toLowerCase().includes(term)
      );
    });
  }, [profiles, searchTerm, currency]);

  const clearFilters = () => {
    setSearchTerm("");
    setCurrency("all");
  };

  return (
    <section data-scroll-reveal="up" className="sponsor-profiles-section" id="children" aria-labelledby="children-heading">
      <div className="container">
        <div className="sponsor-section-heading sponsor-profile-heading">
          <div>
            <span className="sponsor-kicker">CHILD SPONSORSHIP</span>
            <h2 id="children-heading">Meet the children you can support.</h2>
            <p>
              Explore available profiles and the support requested. Each
              suggested amount is provided as guidance; our team can explain
              the needs and how contributions are coordinated.
            </p>
          </div>
          <div className="sponsor-result-count" aria-live="polite">
            {status === "loading"
              ? "Loading profiles…"
              : status === "error"
                ? "Profiles unavailable"
                : `${visibleProfiles.length} ${visibleProfiles.length === 1 ? "profile" : "profiles"}`}
          </div>
        </div>

        <div className="sponsor-filter-panel">
          <div className="row align-items-end g-3">
            <div className="col-md-7">
              <label className="form-label" htmlFor="child-search">Search profiles</label>
              <div className="sponsor-input-wrap">
                <i className="bi bi-search" aria-hidden="true" />
                <input
                  className="form-control"
                  id="child-search"
                  type="search"
                  placeholder="Search by name, goal or education level"
                  autoComplete="off"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
            </div>
            <div className="col-md-5">
              <label className="form-label" htmlFor="currency-filter">Sponsorship currency</label>
              <select
                className="form-select"
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

        <div className="row g-4" aria-live="polite" aria-busy={status === "loading"}>
          {status === "loading" && [1, 2, 3].map((item) => (
            <div className="col-md-6 col-xl-4" key={item}>
              <div className="sponsor-profile-skeleton" aria-label="Loading child sponsorship profile" />
            </div>
          ))}

          {status === "error" && (
            <div className="col-12">
              <div className="sponsor-empty-state">
                <span className="sponsor-empty-icon"><i className="bi bi-cloud-exclamation" aria-hidden="true" /></span>
                <h3>We could not load the profiles</h3>
                <p>{loadError || "Please check your connection and try again."}</p>
                <button type="button" className="btn btn-outline-success" onClick={() => loadProfiles()}>
                  <i className="bi bi-arrow-clockwise me-2" aria-hidden="true" />Try again
                </button>
                <p>Please try again, or contact our team for help exploring sponsorship opportunities.</p>
                <div className="d-flex justify-content-center flex-wrap gap-2">
                  <button type="button" className="btn sponsor-button sponsor-button-green" onClick={loadProfiles}>
                    Try again <i className="bi bi-arrow-clockwise ms-1" aria-hidden="true" />
                  </button>
                  <AppLink to="/contact" className="btn sponsor-button sponsor-button-outline">
                    Contact our team
                  </AppLink>
                </div>
              </div>
            </div>
          )}

          {status === "success" && visibleProfiles.map((child) => (
            <ChildCard key={child.id} child={child} />
          ))}

          {status === "success" && visibleProfiles.length === 0 && (
            <div className="col-12">
              <div className="sponsor-empty-state">
                <span className="sponsor-empty-icon"><i className="bi bi-flower1" aria-hidden="true" /></span>
                <h3>{profiles.length ? "No profiles match your filters" : "New sponsorship profiles are being prepared"}</h3>
                <p>
                  {profiles.length
                    ? "Try another search term or select a different currency."
                    : "Profiles are published only after appropriate consent and safeguarding checks. Contact our team to discuss current sponsorship opportunities."}
                </p>
                {profiles.length ? (
                  <button type="button" className="btn sponsor-button sponsor-button-outline" onClick={clearFilters}>
                    Clear filters
                  </button>
                ) : (
                  <AppLink to="/contact" className="btn sponsor-button sponsor-button-green">Talk to our team</AppLink>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="sponsor-safeguarding-note">
          <i className="bi bi-shield-lock-fill" aria-hidden="true" />
          <p className="mb-0">
            <strong>Children's safety and dignity come first.</strong> We limit
            public profile information and do not publish exact birth dates,
            home addresses, caregiver contacts or private case records.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function Sponsor({ navigate }) {
  return (
    <div className="sponsor-page">
      <section data-scroll-reveal="up" className="sponsor-hero" aria-labelledby="sponsor-title">
        <div className="container sponsor-hero-container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div className="sponsor-hero-copy" data-scroll-reveal="left">
                <span className="sponsor-hero-eyebrow">
                  <span className="sponsor-hero-dot" aria-hidden="true" />
                  CHILD SPONSORSHIP · SHARED SUPPORT
                </span>
                <h1 id="sponsor-title">
                  Help a child take the next step towards a <em>brighter future.</em>
                </h1>
                <p>
                  Your support can help create access to education, strengthen
                  wellbeing and bring practical care within reach. Choose a
                  child sponsorship or contribute towards shared community
                  priorities, with dignity and safeguarding at the heart of our work.
                </p>
                <div className="sponsor-hero-actions">
                  <a href="#children" className="btn sponsor-button sponsor-button-gold">
                    Explore child profiles <i className="bi bi-arrow-down ms-1" aria-hidden="true" />
                  </a>
                  <AppLink to="/contact" navigate={navigate} className="btn sponsor-button sponsor-button-glass">
                    Discuss sponsorship
                  </AppLink>
                </div>
                <div className="sponsor-hero-points">
                  <span><i className="bi bi-shield-check" aria-hidden="true" /> Safeguarding-led</span>
                  <span><i className="bi bi-heart" aria-hidden="true" /> Child-centred</span>
                  <span><i className="bi bi-clipboard2-check" aria-hidden="true" /> Accountable support</span>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <aside className="sponsor-hero-card" data-scroll-reveal="right">
                <span className="sponsor-hero-card-icon"><i className="bi bi-flower1" aria-hidden="true" /></span>
                <span className="sponsor-kicker">A COMMITMENT THAT MATTERS</span>
                <h2>Every child deserves the chance to learn, grow and thrive.</h2>
                <p>
                  Sponsorship is a partnership. We work to connect generosity
                  with assessed needs while protecting the dignity and privacy
                  of every child.
                </p>
                <div className="sponsor-hero-card-foot">
                  <span>Garden of Mercy Foundation</span>
                  <i className="bi bi-heart-fill" aria-hidden="true" />
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <section data-scroll-reveal="up" className="sponsor-trust-strip" aria-label="Our sponsorship commitments">
        <div className="container">
          <div className="row g-3">
            <div className="col-md-4"><div><i className="bi bi-shield-check" /><span>Child dignity and safeguarding</span></div></div>
            <div className="col-md-4"><div><i className="bi bi-journal-check" /><span>Responsible contribution management</span></div></div>
            <div className="col-md-4"><div><i className="bi bi-calendar2-check" /><span>Quarterly progress updates</span></div></div>
          </div>
        </div>
      </section>

      <section data-scroll-reveal="up" className="sponsor-pathways-section" aria-labelledby="pathways-heading">
        <div className="container">
          <div className="sponsor-section-heading text-center mx-auto">
            <span className="sponsor-kicker">WAYS TO MAKE A DIFFERENCE</span>
            <h2 id="pathways-heading">Choose how you would like to support.</h2>
            <p>
              There is more than one way to take part. Our team can help you
              understand the available options and choose an approach that is right for you.
            </p>
          </div>
          <div className="row g-4 mt-2">
            {sponsorshipPaths.map((path) => (
              <div className="col-lg-6" key={path.title}>
                <article className="sponsor-path-card h-100" data-scroll-reveal="up">
                  <div className="sponsor-path-icon"><i className={`bi ${path.icon}`} aria-hidden="true" /></div>
                  <span className="sponsor-path-label">{path.label}</span>
                  <h3>{path.title}</h3>
                  <p>{path.text}</p>
                  <ul>
                    {path.points.map((point) => (
                      <li key={point}><i className="bi bi-check2-circle" aria-hidden="true" />{point}</li>
                    ))}
                  </ul>
                  {path.title === "Stand alongside a child" ? (
                    <a href="#children" className="sponsor-text-link">
                      View child profiles
                      <i className="bi bi-arrow-down" aria-hidden="true" />
                    </a>
                  ) : (
                    <AppLink to="/contact" navigate={navigate} className="sponsor-text-link">
                      Discuss shared support
                      <i className="bi bi-arrow-up-right" aria-hidden="true" />
                    </AppLink>
                  )}
                </article>
              </div>
            ))}
          </div>
          <p className="sponsor-contribution-note">
            <i className="bi bi-info-circle" aria-hidden="true" />
            Contributions may be made as a one-time gift or through recurring support arrangements.
            Please contact our team to confirm the available sponsorship plan and payment details.
          </p>
        </div>
      </section>

      <ChildProfiles />

      <section data-scroll-reveal="up" className="sponsor-principles-section" aria-labelledby="principles-heading">
        <div className="container">
          <div className="sponsor-section-heading">
            <span className="sponsor-kicker">OUR RESPONSIBILITY TO YOU AND THE CHILDREN</span>
            <h2 id="principles-heading">Support built on care, responsibility and trust.</h2>
            <p>We aim to make every sponsorship relationship thoughtful, safe and accountable.</p>
          </div>
          <div className="row g-4 mt-2">
            {sponsorshipPrinciples.map((item) => (
              <div className="col-md-4" key={item.title}>
                <article className="sponsor-principle-card h-100" data-scroll-reveal="up">
                  <span className="sponsor-principle-icon"><i className={`bi ${item.icon}`} aria-hidden="true" /></span>
                  <h3>{item.title}</h3>
                  <p className="mb-0">{item.text}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-scroll-reveal="up" className="sponsor-process-section" aria-labelledby="process-heading">
        <div className="container">
          <div className="sponsor-section-heading text-center mx-auto">
            <span className="sponsor-kicker">A CLEAR, SUPPORTED PROCESS</span>
            <h2 id="process-heading">How sponsorship works.</h2>
            <p>Our team will guide you through the process and help you understand each step.</p>
          </div>
          <div className="row g-4 mt-2">
            {sponsorshipSteps.map((step) => (
              <div className="col-md-4" key={step.number}>
                <article className="sponsor-process-card h-100" data-scroll-reveal="up">
                  <span className="sponsor-process-number">{step.number}</span>
                  <h3>{step.title}</h3>
                  <p className="mb-0">{step.text}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-scroll-reveal="up" className="sponsor-final-cta" aria-labelledby="sponsor-cta-heading">
        <div className="container">
          <div className="sponsor-final-cta-panel">
            <div className="sponsor-final-cta-copy">
              <span className="sponsor-kicker">SOW A SEED OF MERCY</span>
              <h2 id="sponsor-cta-heading">Your support can help create room for hope.</h2>
              <p>
                Whether you want to sponsor a child, contribute towards shared
                needs or simply learn more, our team is ready to help you take
                the next step.
              </p>
            </div>
            <div className="sponsor-final-cta-actions">
              <AppLink to="/contact" navigate={navigate} className="btn sponsor-button sponsor-button-gold">
                Talk to our team <i className="bi bi-arrow-up-right ms-1" aria-hidden="true" />
              </AppLink>
              <AppLink to="/donate" navigate={navigate} className="sponsor-final-donate-link">
                Make a general donation
              </AppLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
