import React, { useEffect, useState } from "react";
import { apiRequest } from "../services/api.js";

const impactStats = [{
    number: "01",
    label: "Every life matters",
    icon: "bi-heart-fill"
},
    {
        number: "02",
        label: "Hope through education",
        icon: "bi-book-half"
    },
    {
        number: "03",
        label: "Stronger communities",
        icon: "bi-people-fill"
    },
    {
        number: "04",
        label: "Compassion in action",
        icon: "bi-hands"
    },
];

const storySteps = [{
    number: "01",
    title: "A challenge is recognized",
    description:
    "We listen to individuals and communities to understand their needs and the barriers they face.",
    icon: "bi-chat-heart",
},
    {
        number: "02",
        title: "Compassion becomes action",
        description:
        "Through care, collaboration, and community support, practical steps are taken toward change.",
        icon: "bi-people",
    },
    {
        number: "03",
        title: "Hope moves forward",
        description:
        "The goal is lasting progress that strengthens dignity, independence, and opportunity.",
        icon: "bi-sun",
    },
];

const SuccessStories = () => {
    const [publishedStories, setPublishedStories] = useState([]);
    const [storiesStatus, setStoriesStatus] = useState("loading");

    useEffect(() => {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 8000);
        apiRequest("/content/stories", { signal: controller.signal })
            .then((payload) => {
                const records = Array.isArray(payload?.stories) ? payload.stories : [];
                const normalized = records
                    .filter((story) => story && typeof story.title === "string" &&
                        typeof story.excerpt === "string" && typeof story.body === "string")
                    .map((story) => ({
                        id: story.id,
                        category: String(story.category || "COMMUNITY").toUpperCase(),
                        title: story.title,
                        description: story.excerpt,
                        image: typeof story.image_url === "string" ? story.image_url : "",
                        alt: typeof story.image_alt === "string" ? story.image_alt : "",
                        link: "/contact",
                    }));
                setPublishedStories(normalized);
                setStoriesStatus("success");
            })
            .catch(() => setStoriesStatus("unavailable"))
            .finally(() => window.clearTimeout(timeout));
        return () => {
            window.clearTimeout(timeout);
            controller.abort();
        };
    }, []);

    return (
        <div className="success-stories-page">
{/* HERO SECTION */}
            <section data-scroll-reveal="up" className="mercy-hero">
                <div className="container">
                    <div className="mercy-hero-content">
                        <span className="mercy-eyebrow text-uppercase hero-eyebrow">
                            <span className="stories-hero-eyebrow-dot hero-eyebrow-dot" aria-hidden="true" />
                            STORIES OF HOPE
                        </span>

                        <h1>
                            Every act of kindness creates{" "}
                            <span className="mercy-gold-text">a story of hope.</span>
                        </h1>

                        <p>
                            Behind every meaningful change is a life worth celebrating.
                            Explore the power of compassion, community, and practical
                            action as we work toward a brighter future for those in need.
                        </p>

                        <div className="d-flex flex-wrap gap-3 mt-4">
                            <a href="#our-stories" className="mercy-btn mercy-btn-primary">
                                Explore Our Stories <i className="bi bi-arrow-down-right" />
                            </a>

                            <a href="/donate" className="mercy-btn mercy-btn-outline">
                                Be Part of the Change <i className="bi bi-heart" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* INTRODUCTION AND IMPACT PILLARS */}
            <section data-scroll-reveal="up" className="mercy-intro">
                <div className="container">
                    <div className="row align-items-center g-4 mb-5">
                        <div className="col-lg-7">
                            <span className="mercy-eyebrow text-success">
                                THE HEART OF OUR WORK
                            </span>

                            <h2 className="mercy-section-title mt-3 mb-3">
                                Real change begins when compassion meets action.
                            </h2>
                        </div>

                        <div className="col-lg-5">
                            <p className="mercy-section-copy mb-0">
                                Success is about more than numbers. It is about dignity
                                restored, opportunities created, families encouraged, and
                                communities equipped to move forward with confidence.
                            </p>
                        </div>
                    </div>

                    <div className="row g-3">
                        {impactStats.map((item) => (
                            <div className="col-6 col-lg-3" key={item.number}>
                                <div className="mercy-stat">
                                    <div className="mercy-stat-icon">
                                        <i className={`bi ${item.icon}`} aria-hidden="true" />
                                    </div>
                                    <span className="mercy-stat-number">{item.number}</span>
                                    <div className="mercy-stat-label">
                                        {item.label}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SUCCESS STORIES GRID */}
            <section data-scroll-reveal="up" className="mercy-stories" id="our-stories">
                <div className="container">
                    <div className="text-center mx-auto mb-5" style={ { maxWidth: 760 }}>
                        <span className="mercy-eyebrow text-success">
                            STORIES THAT INSPIRE
                        </span>

                        <h2 className="mercy-section-title mt-3">
                            Hope has many faces.
                        </h2>

                        <p className="mercy-section-copy mt-3">
                            From education and child welfare to stronger families and
                            communities, every area of care presents an opportunity to
                            make a difference.
                        </p>
                    </div>

                    {storiesStatus === "loading" && (
                        <p className="text-secondary text-center" role="status">Loading approved stories…</p>
                    )}
                    {storiesStatus === "unavailable" && (
                        <p className="text-secondary text-center" role="status">Published stories are temporarily unavailable. Please try again later.</p>
                    )}
                    {storiesStatus === "success" && publishedStories.length === 0 && (
                        <div className="text-center py-4">
                            <i className="bi bi-journal-heart display-4 text-success" aria-hidden="true" />
                            <h3 className="h5 mt-3">Our stories are being prepared.</h3>
                            <p className="text-secondary mb-0">We will share approved stories here once they have been reviewed and consent has been confirmed.</p>
                        </div>
                    )}
                    <div className="row g-4">
                        {publishedStories.map((story) => (
                            <div className="col-md-6 col-xl-3" key={story.id || story.title}>
                                <article className="mercy-story-card">
                                    {story.image ? (
                                        <img src={story.image} alt={story.alt} className="mercy-story-image" loading="lazy" />
                                    ) : (
                                        <div className="mercy-story-image d-flex align-items-center justify-content-center" aria-hidden="true">
                                            <i className="bi bi-heart-pulse display-3 text-success" />
                                        </div>
                                    )}

                                <div className="mercy-story-body">
                                    <span className="mercy-category">
                                        {story.category}
                                    </span>

                                    <h3>{story.title}</h3>

                                    <p>
                                        {story.description}
                                    </p>

                                    <a
                                        href={story.link}
                                        className="mercy-read-link"
                                        aria-label={`Learn more about ${story.title}`}
                                        >
                                        Learn More <i className="bi bi-arrow-right" />
                                    </a>
                                </div>
                            </article>
                        </div>
                        ))}
                </div></div>
        </section>

        {/* FEATURED IMPACT SECTION */}
        <section data-scroll-reveal="up" className="mercy-feature">
            <div className="container">
                <div className="row align-items-center g-5">
                    <div className="col-lg-6">
                        <div className="mercy-feature-image-wrap">
                            <img
                            src="https://images.unsplash.com/photo-1620340217121-cc0d4be371fa?auto=format&fit=crop&w=1200&q=85"
                            alt="African schoolchildren sharing a moment in their classroom"
                            className="mercy-feature-image"
                            loading="lazy"
                            />
                    </div>
                </div>

                <div className="col-lg-6">
                    <span className="mercy-eyebrow mercy-gold-text">
                        BEHIND EVERY STORY
                    </span>

                    <h2 className="display-5 fw-bold mt-3 mb-4">
                        More than assistance. A future filled with possibility.
                    </h2>

                    <p className="mercy-feature-copy">
                        Meaningful support begins by seeing people for who they are,
                        recognizing their potential, and standing beside them as they
                        work toward a better future.
                    </p>

                    <div className="mercy-feature-point">
                        <i className="bi bi-check-circle-fill" aria-hidden="true" />
                        <div>
                            <h3 className="h6 fw-bold">Dignity and compassion</h3>
                            <p className="mercy-feature-copy mb-0">
                                Treating every person with respect, care, and understanding.
                            </p>
                        </div>
                    </div>

                    <div className="mercy-feature-point">
                        <i className="bi bi-check-circle-fill" aria-hidden="true" />
                        <div>
                            <h3 className="h6 fw-bold">Opportunity and empowerment</h3>
                            <p className="mercy-feature-copy mb-0">
                                Helping individuals and families access opportunities
                                that support long-term progress.
                            </p>
                        </div>
                    </div>

                    <div className="mercy-feature-point">
                        <i className="bi bi-check-circle-fill" aria-hidden="true" />
                        <div>
                            <h3 className="h6 fw-bold">Community-led progress</h3>
                            <p className="mercy-feature-copy mb-0">
                                Encouraging people to work together to create lasting,
                                locally meaningful change.
                            </p>
                        </div>
                    </div>

                    <a href="/about" className="mercy-btn mercy-btn-primary mt-4">
                        Discover Our Mission <i className="bi bi-arrow-up-right" />
                    </a>
                </div>
            </div>
        </div>
    </section>

    {/* HOW CHANGE HAPPENS */}
    <section data-scroll-reveal="up" className="mercy-journey">
        <div className="container">
            <div className="text-center mx-auto mb-5" style={ { maxWidth: 720 }}>
                <span className="mercy-eyebrow text-success">
                    THE JOURNEY OF CHANGE
                </span>

                <h2 className="mercy-section-title mt-3">
                    Every success starts with someone who cares.
                </h2>

                <p className="mercy-section-copy mt-3">
                    Lasting impact is built through listening, meaningful action,
                    and a commitment to helping people move forward.
                </p>
            </div>

            <div className="row g-4">
                {storySteps.map((step) => (
                    <div className="col-md-4" key={step.number}>
                        <article className="mercy-journey-card">
                            <div className="mercy-journey-number">
                                {step.number}
                            </div>

                            <div className="text-success fs-3 mb-3">
                                <i className={`bi ${step.icon}`} aria-hidden="true" />
                            </div>

                            <h3>{step.title}</h3>
                            <p>
                                {step.description}
                            </p>
                        </article>
                    </div>
                ))}
            </div>
        </div>
    </section>

    {/* VALUES AND TESTIMONIAL-STYLE QUOTE */}
    <section data-scroll-reveal="up" className="mercy-quote">
        <div className="container">
            <div className="mercy-quote-inner">
                <div className="mercy-quote-mark" aria-hidden="true">
                    “
                </div>

                <p className="mercy-quote-text">
                    The true measure of our impact is not only what we give today,
                    but the hope, dignity, and opportunities that continue to grow
                    tomorrow.
                </p>

                <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
                    <span
                        style={ {
                            width: 35,
                            height: 2,
                            background: "var(--mercy-gold)",
                        }}
                        />
                    <span className="small fw-bold text-success text-uppercase">
                        The Spirit of Garden of Mercy
                    </span>
                    <span
                        style={ {
                            width: 35,
                            height: 2,
                            background: "var(--mercy-gold)",
                        }}
                        />
                </div></div>
        </div>
    </section>

    {/* CALL TO ACTION */}
    <section data-scroll-reveal="up" className="mercy-cta">
        <div className="container text-center">
            <span className="mercy-eyebrow mercy-gold-text">
                YOUR KINDNESS MATTERS
            </span>

            <h2 className="mt-4">
                The next success story
                <br />
            could begin with you.
        </h2>

        <p>
            Your generosity, time, and support can help turn compassion into
            meaningful action. Join Garden of Mercy Foundation in building
            a future where more people have the opportunity to thrive.
        </p>

        <div className="d-flex justify-content-center flex-wrap gap-3">
            <a href="/donate" className="mercy-btn mercy-btn-primary">
                Donate Today <i className="bi bi-heart-fill" />
            </a>

            <a href="/volunteer" className="mercy-btn mercy-btn-outline">
                Become a Volunteer <i className="bi bi-people-fill" />
            </a>

            <a href="/contact" className="mercy-btn mercy-btn-outline">
                Contact Us <i className="bi bi-envelope" />
            </a>
        </div>
    </div>
</section>
</div>

);
};

export default SuccessStories;