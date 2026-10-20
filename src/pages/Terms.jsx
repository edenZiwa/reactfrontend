import React from "react";

const termsSections = [{
    id: "acceptance",
    label: "Acceptance"
},
    {
        id: "about",
        label: "About the Website"
    },
    {
        id: "eligibility",
        label: "Eligibility"
    },
    {
        id: "responsible-use",
        label: "Responsible Use"
    },
    {
        id: "content",
        label: "Website Content"
    },
    {
        id: "accuracy",
        label: "Accuracy"
    },
    {
        id: "programs",
        label: "Programs"
    },
    {
        id: "donations",
        label: "Donations"
    },
    {
        id: "payments",
        label: "Payments"
    },
    {
        id: "refunds",
        label: "Refunds"
    },
    {
        id: "fundraising",
        label: "Fundraising"
    },
    {
        id: "intellectual-property",
        label: "Intellectual Property"
    },
    {
        id: "user-content",
        label: "User Content"
    },
    {
        id: "communications",
        label: "Communications"
    },
    {
        id: "safeguarding",
        label: "Safeguarding"
    },
    {
        id: "privacy",
        label: "Privacy"
    },
    {
        id: "third-party",
        label: "Third-Party Services"
    },
    {
        id: "security",
        label: "Security"
    },
    {
        id: "availability",
        label: "Availability"
    },
    {
        id: "disclaimer",
        label: "Disclaimers"
    },
    {
        id: "liability",
        label: "Liability"
    },
    {
        id: "indemnity",
        label: "Indemnity"
    },
    {
        id: "termination",
        label: "Termination"
    },
    {
        id: "changes",
        label: "Changes"
    },
    {
        id: "law",
        label: "Governing Law"
    },
    {
        id: "contact",
        label: "Contact"
    },
];

const Terms = () => {
    return (
        <main id="main-content">
            {/* Page Header */}
            <section className="page-header" aria-labelledby="terms-title">
                <div className="container py-5">
                    <span className="section-label">LEGAL</span>

                    <h1
                        id="terms-title"
                        className="display-5 fw-bold mt-2"
                        >
                        Terms of Use
                    </h1>

                    <p className="lead text-secondary col-lg-9">
                        These terms explain the rules and conditions governing
                        access to and use of the Garden of Mercy Foundation website
                        and its online services.
                    </p>

                    <div className="d-flex flex-wrap gap-3 text-secondary small mt-4">
                        <span>
                            <strong>Last updated:</strong> September 2026
                        </span>

                        <span>
                            <strong>Version:</strong> 1.0
                        </span>
                    </div>
                </div>
            </section>

            {/* Terms Content */}
            <section className="py-5">
                <div className="container">
                    <div className="row g-5">
                        {/* Table of Contents */}
                        <aside className="col-lg-3">
                            <div
                                className="card border-0 shadow-sm rounded-4 sticky-lg-top"
                                style={ { top: "90px" }}
                                >
                                <div className="card-body">
                                    <h2 className="h5 fw-bold mb-3">
                                        On this page
                                    </h2>

                                    <nav aria-label="Terms sections">
                                        <div className="list-group list-group-flush">
                                            {termsSections.map((section) => (
                                                <a
                                                    key={section.id}
                                                    href={`#${section.id}`}
                                                    className="list-group-item list-group-item-action"
                                                    >
                                                    {section.label}
                                                </a>
                                            ))}
                                        </div>
                                    </nav>
                                </div>
                            </div>
                        </aside>

                        {/* Terms and Conditions */}
                        <div className="col-lg-9">
                            <article className="legal-content">
                                <section id="acceptance" className="my-5">
                                    <h2>1. Acceptance of These Terms</h2>

                                    <p>
                                        By accessing, browsing or using the Garden of Mercy
                                        Foundation website, you acknowledge that you have
                                        read and understood these Terms of Use.
                                    </p>

                                    <p>
                                        If you do not agree with these terms, you should
                                        discontinue use of the website.
                                    </p>

                                    <p>
                                        These Terms of Use should be read together with the
                                        Foundation's Privacy Policy and other policies that
                                        may apply to particular services or activities.
                                    </p>
                                </section>

                                <section id="about" className="mb-5">
                                    <h2>2. About the Website</h2>

                                    <p>
                                        The Garden of Mercy Foundation website provides
                                        public information about the Foundation, its mission,
                                        programs, activities, initiatives and approved
                                        communications.
                                    </p>

                                    <p>
                                        Certain services may become available through the
                                        website over time, including donation services,
                                        contact forms, volunteer applications, newsletters,
                                        program information and other digital services.
                                    </p>
                                </section>

                                <section id="eligibility" className="mb-5">
                                    <h2>3. Eligibility and Responsible Access</h2>

                                    <p>
                                        Users are responsible for ensuring that their use
                                        of the website is lawful and consistent with
                                        applicable laws and regulations.
                                    </p>

                                    <p>
                                        Certain services may have additional eligibility
                                        requirements. Where such requirements apply, they
                                        will be communicated separately.
                                    </p>
                                </section>

                                <section id="responsible-use" className="mb-5">
                                    <h2>4. Responsible Use</h2>

                                    <p>
                                        You agree not to misuse the website or attempt to
                                        interfere with its operation.
                                    </p>

                                    <p>
                                        Prohibited activities include, where applicable:
                                    </p>

                                    <ul>
                                        <li>Unauthorized access to systems or accounts.</li>
                                        <li>Attempting to bypass security controls.</li>
                                        <li>Introducing malicious software.</li>
                                        <li>Conducting denial-of-service attacks.</li>
                                        <li>
                                            Scraping information in a manner that violates
                                            applicable law or restrictions.
                                        </li>
                                        <li>Impersonating the Foundation or its representatives.</li>
                                        <li>Submitting fraudulent information.</li>
                                        <li>Using the website for unlawful purposes.</li>
                                        <li>
                                            Harassing staff, volunteers, beneficiaries or
                                            other users.
                                        </li>
                                        <li>
                                            Using the website to exploit, abuse or endanger
                                            children or vulnerable persons.
                                        </li>
                                    </ul>
                                </section>

                                <section id="content" className="mb-5">
                                    <h2>5. Website Content</h2>

                                    <p>
                                        Website content is provided for general informational
                                        and organizational purposes.
                                    </p>

                                    <p>
                                        Content may include descriptions of programs,
                                        photographs, stories, reports, announcements,
                                        educational material and other Foundation-approved
                                        communications.
                                    </p>

                                    <p>
                                        Content should not be interpreted as a guarantee that
                                        a particular program, service, activity or initiative
                                        will always be available.
                                    </p>
                                </section>

                                <section id="accuracy" className="mb-5">
                                    <h2>6. Accuracy of Information</h2>

                                    <p>
                                        Garden of Mercy Foundation seeks to provide accurate
                                        and current information.
                                    </p>

                                    <p>
                                        However, programs, contact information, schedules,
                                        funding priorities and organizational activities
                                        may change.
                                    </p>

                                    <p>
                                        The Foundation may correct, update or remove content
                                        when necessary.
                                    </p>
                                </section>

                                <section id="programs" className="mb-5">
                                    <h2>7. Programs and Beneficiary Information</h2>

                                    <p>
                                        Information about Foundation programs is provided
                                        to explain their objectives and activities.
                                    </p>

                                    <p>
                                        Publication of a program on this website does not
                                        necessarily constitute a guarantee of eligibility,
                                        admission, financial assistance or provision of a
                                        particular service.
                                    </p>

                                    <p>
                                        Program participation may be subject to separate
                                        eligibility criteria, available resources,
                                        safeguarding requirements and applicable procedures.
                                    </p>
                                </section>

                                <section id="donations" className="mb-5">
                                    <h2>8. Donations</h2>

                                    <p>
                                        Donations may be accepted through payment methods
                                        officially designated by Garden of Mercy Foundation.
                                    </p>

                                    <p>
                                        Donors should verify that they are using an official
                                        Foundation payment channel before transferring funds.
                                    </p>

                                    <div className="alert alert-success border-0 rounded-4">
                                        <strong>Donation safety</strong>

                                        <p className="mb-0 mt-2">
                                            Do not send money, passwords, PINs, verification
                                            codes or payment credentials to individuals claiming
                                            to represent the Foundation unless the payment
                                            channel has been officially verified.
                                        </p>
                                    </div>
                                </section>

                                <section id="payments" className="mb-5">
                                    <h2>9. Payment Processing</h2>

                                    <p>
                                        Where online payment services are provided, payments
                                        may be processed through authorized third-party
                                        payment providers.
                                    </p>

                                    <p>
                                        Payment providers may apply their own terms, fees,
                                        security controls and privacy policies.
                                    </p>

                                    <p>
                                        The Foundation may retain information reasonably
                                        necessary to confirm, reconcile, acknowledge and
                                        account for donations.
                                    </p>
                                </section>

                                <section id="refunds" className="mb-5">
                                    <h2>10. Donations, Refunds and Corrections</h2>

                                    <p>
                                        Donation refunds, reversals or corrections will be
                                        handled according to the Foundation's applicable
                                        donation procedures and the rules of the relevant
                                        payment provider.
                                    </p>

                                    <p>
                                        Donors should contact the Foundation as soon as
                                        possible if they believe a donation was made
                                        incorrectly, duplicated or without authorization.
                                    </p>

                                    <p>
                                        The Foundation reserves the right to investigate
                                        suspected fraudulent, unauthorized or otherwise
                                        irregular transactions.
                                    </p>
                                </section>

                                <section id="fundraising" className="mb-5">
                                    <h2>11. Fundraising and Public Appeals</h2>

                                    <p>
                                        Official fundraising campaigns should be conducted
                                        only through authorized Foundation channels.
                                    </p>

                                    <p>
                                        No individual may represent themselves as an
                                        authorized fundraiser, employee, volunteer or agent
                                        of the Foundation without appropriate authorization.
                                    </p>

                                    <p>
                                        The Foundation may investigate and report suspected
                                        fraudulent fundraising activities.
                                    </p>
                                </section>

                                <section id="intellectual-property" className="mb-5">
                                    <h2>12. Intellectual Property</h2>

                                    <p>
                                        Unless otherwise indicated, content published by
                                        Garden of Mercy Foundation, including text, graphics,
                                        logos, photographs, designs and other original
                                        materials, is protected by applicable intellectual
                                        property laws.
                                    </p>

                                    <p>
                                        You may view and use website content for legitimate
                                        personal and informational purposes.
                                    </p>

                                    <p>
                                        Reproduction, modification, commercial exploitation
                                        or redistribution of protected content generally
                                        requires appropriate authorization.
                                    </p>
                                </section>

                                <section id="user-content" className="mb-5">
                                    <h2>13. User-Submitted Content</h2>

                                    <p>
                                        If the website allows users to submit comments,
                                        applications, testimonials, photographs, stories or
                                        other material, users should only submit content
                                        that they have the right to provide.
                                    </p>

                                    <p>
                                        Users should not submit confidential, sensitive or
                                        personal information belonging to another person
                                        without appropriate authorization.
                                    </p>

                                    <p>
                                        The Foundation may moderate or remove submitted
                                        content that violates applicable policies, law or
                                        safeguarding requirements.
                                    </p>
                                </section>

                                <section id="communications" className="mb-5">
                                    <h2>14. Communications</h2>

                                    <p>
                                        Communications sent through the website should contain
                                        accurate information and should not be used to submit
                                        fraudulent, abusive, threatening or unlawful material.
                                    </p>

                                    <p>
                                        The Foundation may retain correspondence where
                                        reasonably necessary for administration, safeguarding,
                                        accountability, dispute resolution or legal compliance.
                                    </p>
                                </section>

                                <section id="safeguarding" className="mb-5">
                                    <h2>15. Child Protection and Safeguarding</h2>

                                    <p>
                                        Garden of Mercy Foundation is committed to protecting
                                        children and vulnerable persons from abuse,
                                        exploitation, harassment and other forms of harm.
                                    </p>

                                    <p>
                                        Website users must not use Foundation platforms to
                                        contact, exploit, manipulate, harass or otherwise
                                        endanger children.
                                    </p>

                                    <p>
                                        Any suspected safeguarding concern should be reported
                                        through the Foundation's approved reporting channels.
                                    </p>

                                    <div className="alert alert-danger border-0 rounded-4">
                                        <strong>Zero tolerance principle</strong>

                                        <p className="mb-0 mt-2">
                                            The Foundation should not knowingly permit its
                                            website, communication channels or programs to be
                                            used for child exploitation, abuse or trafficking.
                                        </p>
                                    </div>
                                </section>

                                <section id="privacy" className="mb-5">
                                    <h2>16. Privacy and Personal Information</h2>

                                    <p>
                                        Use of this website may involve the processing of
                                        personal information.
                                    </p>

                                    <p>
                                        Such processing is governed by the Foundation's{" "}
                                        <a href="/privacy">Privacy Policy</a>, together with
                                        applicable laws and regulations.
                                    </p>
                                </section>

                                <section id="third-party" className="mb-5">
                                    <h2>17. Third-Party Websites and Services</h2>

                                    <p>
                                        The website may contain links to third-party websites,
                                        payment providers, social-media platforms,
                                        communication services or other external resources.
                                    </p>

                                    <p>
                                        Third-party services operate independently and may
                                        have their own terms and privacy policies.
                                    </p>

                                    <p>
                                        The Foundation does not control every aspect of
                                        third-party services and cannot guarantee their
                                        availability, security or content.
                                    </p>
                                </section>

                                <section id="security" className="mb-5">
                                    <h2>18. Website Security</h2>

                                    <p>
                                        Users must not attempt to compromise or circumvent
                                        the security of the website, servers, databases,
                                        accounts or other connected systems.
                                    </p>

                                    <p>
                                        Suspected vulnerabilities or security incidents
                                        should be reported responsibly through an authorized
                                        Foundation communication channel.
                                    </p>
                                </section>

                                <section id="availability" className="mb-5">
                                    <h2>19. Website Availability</h2>

                                    <p>
                                        The Foundation aims to maintain reliable access to
                                        the website but does not guarantee uninterrupted
                                        or error-free availability.
                                    </p>

                                    <p>
                                        Website services may occasionally be unavailable
                                        due to maintenance, upgrades, security incidents,
                                        network failures, hosting problems or circumstances
                                        beyond reasonable control.
                                    </p>
                                </section>

                                <section id="disclaimer" className="mb-5">
                                    <h2>20. Disclaimers</h2>

                                    <p>
                                        Website information is provided on an informational
                                        basis unless a specific service expressly states
                                        otherwise.
                                    </p>

                                    <p>
                                        Nothing on this website should be interpreted as
                                        professional legal, medical, financial or other
                                        specialist advice unless expressly identified as
                                        such and provided by an appropriately qualified person.
                                    </p>

                                    <p>
                                        Where users require specialist advice, they should
                                        consult an appropriately qualified professional.
                                    </p>
                                </section>

                                <section id="liability" className="mb-5">
                                    <h2>21. Limitation of Liability</h2>

                                    <p>
                                        To the extent permitted by applicable law, the
                                        Foundation will not be responsible for losses arising
                                        solely from circumstances beyond its reasonable
                                        control or from unauthorized use of the website by
                                        third parties.
                                    </p>

                                    <p>
                                        Nothing in these terms is intended to exclude or
                                        restrict liability where such exclusion or restriction
                                        would be unlawful.
                                    </p>
                                </section>

                                <section id="indemnity" className="mb-5">
                                    <h2>22. Indemnity</h2>

                                    <p>
                                        To the extent permitted by applicable law, users may
                                        be responsible for losses or claims resulting from
                                        their unlawful misuse of the website, violation of
                                        these terms or infringement of another person's rights.
                                    </p>
                                </section>

                                <section id="termination" className="mb-5">
                                    <h2>23. Suspension and Termination</h2>

                                    <p>
                                        The Foundation may restrict or suspend access to
                                        particular website services where reasonably
                                        necessary to protect users, systems, organizational
                                        resources or the integrity of the platform.
                                    </p>

                                    <p>
                                        This may include circumstances involving suspected
                                        fraud, abuse, security threats, unlawful activity
                                        or violations of these terms.
                                    </p>
                                </section>

                                <section id="changes" className="mb-5">
                                    <h2>24. Changes to These Terms</h2>

                                    <p>
                                        The Foundation may update these Terms of Use when
                                        its website, services, organizational practices or
                                        legal requirements change.
                                    </p>

                                    <p>
                                        Updated terms will be published on this page with
                                        a revised date or version where appropriate.
                                    </p>

                                    <p>
                                        Continued use of the website after an update may
                                        be subject to the revised terms, to the extent
                                        permitted by applicable law.
                                    </p>
                                </section>

                                <section id="law" className="mb-5">
                                    <h2>25. Governing Law and Jurisdiction</h2>

                                    <p>
                                        These terms should be interpreted and applied in
                                        accordance with the laws applicable to Garden of
                                        Mercy Foundation and its activities.
                                    </p>

                                    <p>
                                        The final version of these terms should identify
                                        the appropriate governing law and jurisdiction
                                        after review by the Foundation's authorized legal
                                        advisers.
                                    </p>
                                </section>

                                <section id="contact" className="mb-5">
                                    <h2>26. Contact</h2>

                                    <p>
                                        Questions, concerns or requests concerning these
                                        Terms of Use may be submitted through our contact
                                        page.
                                    </p>

                                    <a href="/contact" className="btn btn-success">
                                        Contact Garden of Mercy Foundation
                                    </a>
                                </section>
                            </article>
                        </div>
                    </div>
                </div>
            </section>
        </main>

    );
};

export default Terms;