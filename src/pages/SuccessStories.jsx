import React from "react";

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

const stories = [{
    category: "EDUCATION",
    title: "Opening doors through education",
    description:
    "Education can give a child more than knowledge. It can create confidence, opportunity, and a brighter vision for the future. Discover how access to learning can help children pursue their dreams.",
    image:
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1000&q=85",
    alt: "Children learning together in a classroom",
    icon: "bi-book",
    featured: true,
    link: "/contact",
},
    {
        category: "CHILD WELFARE",
        title: "A safe place to grow",
        description:
        "Every child deserves safety, care, encouragement, and the freedom to develop their potential. Community support can help create environments where children feel valued.",
        image:
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=85",
        alt: "Children sharing a joyful moment",
        icon: "bi-shield-heart",
        featured: false,
        link: "/contact",
    },
    {
        category: "COMMUNITY CARE",
        title: "Small acts, lasting change",
        description:
        "When people come together to support vulnerable families, practical kindness can become a source of renewed strength, belonging, and hope.",
        image:
        "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=85",
        alt: "Volunteers working together to support others",
        icon: "bi-heart",
        featured: false,
        link: "/contact",
    },
    {
        category: "FAMILY EMPOWERMENT",
        title: "Building a stronger tomorrow",
        description:
        "Supporting families means investing in stability, resilience, and opportunity. Empowered communities are better positioned to create lasting change for future generations.",
        image:
        "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=85",
        alt: "A family spending meaningful time together",
        icon: "bi-house-heart",
        featured: false,
        link: "/contact",
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
    return (
        <main className="success-stories-page">

            {/* HERO SECTION */}
            <section className="mercy-hero">
                <div className="container">
                    <div className="mercy-hero-content">
                        <span className="mercy-eyebrow text-uppercase">
                            OUR SUCCESS STORIES
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
            <section className="mercy-intro">
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
            <section className="mercy-stories" id="our-stories">
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

                    <div className="row g-4">
                        {stories.map((story) => (
                            <div className="col-md-6 col-xl-3" key={story.category}>
                                <article className="mercy-story-card">
                                    <img
                                    src={story.image}
                                    alt={story.alt}
                                    className="mercy-story-image"
                                    loading="lazy"
                                    />

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
                </div>

                <p className="text-center small text-secondary mt-4 mb-0">
                    These are thematic story introductions. Add verified beneficiary
                    accounts and documented outcomes before presenting them as
                    completed foundation projects.
                </p>
            </div>
        </section>

        {/* FEATURED IMPACT SECTION */}
        <section className="mercy-feature">
            <div className="container">
                <div className="row align-items-center g-5">
                    <div className="col-lg-6">
                        <div className="mercy-feature-image-wrap">
                            <img
                            src="https://images.unsplash.com/photo-1494386346843-e12284507169?auto=format&fit=crop&w=1200&q=85"
                            alt="Community members coming together in a spirit of care"
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
    <section className="mercy-journey">
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
    <section className="mercy-quote">
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
                </div>

                <p className="small text-secondary mt-3 mb-0">
                    Foundation values statement — not a beneficiary testimonial.
                </p>
            </div>
        </div>
    </section>

    {/* CALL TO ACTION */}
    <section className="mercy-cta">
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
</main>

);
};

export default SuccessStories;