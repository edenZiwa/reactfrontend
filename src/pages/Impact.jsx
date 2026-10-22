import React from "react";
import {
    AppLink
} from "../components/SiteChrome.jsx";

const impactAreas = [{
    icon: "bi-people",
    title: "Children",
    description:
    "Program beneficiaries will be reported using verified organizational records.",
},
    {
        icon: "bi-heart",
        title: "Support",
        description:
        "Support delivered through approved programs will be documented and reported transparently.",
    },
    {
        icon: "bi-bar-chart",
        title: "Transparency",
        description:
        "Public impact reporting will be based on verified organizational data.",
    },
];

export default function Impact() {
    return (
        <main id="main-content">
            {/* PAGE HEADER */}
            <section
                className="page-header hero"
                aria-labelledby="impact-title"
                >
                <div className="overlay" aria-hidden="true" />

                <div className="container text-white py-5">
                    <span className="section-label eyebrow eyebrow-light">
                        <span className="eyebrow-dot" />
                        {" "}OUR IMPACT
                    </span>

                    <h1
                        id="impact-title"
                        className="display-5 fw-bold mt-2"
                        >
                        Compassion measured by meaningful action.
                    </h1>

                    <p className="lead text-white col-lg-8">
                        Verified organizational impact information will be published
                        as programs are implemented and data becomes available.
                    </p>
                </div>
            </section>

            {/* IMPACT AREAS */}
            <section className="py-5" aria-label="Our impact areas">
                <div className="container">
                    <div className="row g-4">
                        {impactAreas.map((area) => (
                            <div className="col-md-4" key={area.title}>
                                <article className="impact-card rounded-4 background shadow-lg text-center h-100">
                                    <i
                                        className={`bi ${area.icon} display-5 text-success`}
                                        aria-hidden="true"
                                        />

                                    <h2 className="h3 mt-4">{area.title}</h2>

                                    <p className="text-secondary mb-0">
                                        {area.description}
                                    </p>
                                </article>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ACCOUNTABILITY */}
            <section
                className="py-5"
                aria-labelledby="accountability-title"
                >
                <div className="container text-center">
                    <h2
                        id="accountability-title"
                        className="fw-bold"
                        >
                        Building a culture of accountability
                    </h2>

                    <p className="lead text-secondary col-lg-8 mx-auto">
                        As the foundation grows, this section can publish approved
                        program results, beneficiary information, financial reporting
                        and stories of change.
                    </p>
                </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="py-5" aria-labelledby="impact-cta-title">
                <div className="container">
                    <div className="cta-section rounded-4 p-4 p-md-5 text-center">
                        <h2 id="impact-cta-title" className="fw-bold">
                            Be part of meaningful change.
                        </h2>

                        <p className="text-secondary mb-4">
                            Join Garden of Mercy Foundation in supporting practical
                            compassion, accountability and community wellbeing.
                        </p>

                        <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                            <AppLink
                                to="/programs"
                                className="btn btn-success px-4"
                                >
                                Explore Our Programs
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