import React from "react";

const policySections = [
{ id: "introduction", label: "Introduction" },
{ id: "information", label: "Information We Collect" },
{ id: "children", label: "Children & Beneficiaries" },
{ id: "purposes", label: "How We Use Information" },
{ id: "lawful-basis", label: "Legal Basis" },
{ id: "sharing", label: "Information Sharing" },
{ id: "donations", label: "Donations & Payments" },
{ id: "photography", label: "Photography & Media" },
{ id: "safeguarding", label: "Safeguarding" },
{ id: "cookies", label: "Cookies" },
{ id: "security", label: "Security" },
{ id: "retention", label: "Data Retention" },
{ id: "rights", label: "Your Rights" },
{ id: "breach", label: "Data Breaches" },
{ id: "international", label: "International Transfers" },
{ id: "third-party", label: "Third-Party Services" },
{ id: "volunteers", label: "Volunteers, Staff & Partners" },
{ id: "communications", label: "Donor Communications" },
{ id: "transparency", label: "Transparency & Accountability" },
{ id: "changes", label: "Policy Changes" },
{ id: "contact", label: "Contact" },
];

const Privacy = () => {
return (
<main id="main-content">
{/* Page Header */}
<section className="page-header" aria-labelledby="privacy-title">
<div className="container py-5">
<span className="section-label">
LEGAL & DATA PROTECTION
</span>

      <h1
        id="privacy-title"
        className="display-5 fw-bold mt-2"
      >
        Privacy Policy
      </h1>

      <p className="lead text-secondary col-lg-9">
        This policy explains how Garden of Mercy Foundation
        approaches the responsible collection, use, protection
        and retention of personal information.
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

  {/* Policy Content */}
  <section className="py-5">
    <div className="container">
      <div className="row g-5">
        {/* Table of Contents */}
        <aside className="col-lg-3">
          <div
            className="card border-0 shadow-sm rounded-4 sticky-lg-top"
            style={{ top: "90px" }}
          >
            <div className="card-body">
              <h2 className="h5 fw-bold mb-3">
                On this page
              </h2>

              <nav aria-label="Privacy policy sections">
                <div className="list-group list-group-flush">
                  {policySections.map((section) => (
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

        {/* Policy Content */}
        <div className="col-lg-9">
          <article className="legal-content">
            <section id="introduction" className="my-5">
              <h2>1. Introduction</h2>

              <p>
                Garden of Mercy Foundation respects the privacy,
                dignity and rights of individuals whose information
                may be entrusted to us.
              </p>

              <p>
                This Privacy Policy explains the principles we intend
                to apply when collecting, using, storing, protecting
                and sharing personal information through our website,
                programs, communications, fundraising activities and
                other authorized organizational activities.
              </p>

              <p>
                The Foundation's work is particularly focused on
                children and communities. We therefore recognize that
                information relating to children, families,
                beneficiaries and vulnerable persons requires
                additional care and protection.
              </p>
            </section>

            <section id="information" className="mb-5">
              <h2>2. Information We May Collect</h2>

              <p>
                Depending on the services and activities available,
                we may collect information such as:
              </p>

              <ul>
                <li>Name and preferred form of address.</li>
                <li>Email address.</li>
                <li>Telephone or mobile number.</li>
                <li>Postal or physical address where necessary.</li>
                <li>Organization or professional information.</li>
                <li>Donation and transaction information.</li>
                <li>Volunteer or application information.</li>
                <li>Messages and correspondence.</li>
                <li>Information submitted through forms.</li>
                <li>
                  Photographs, videos or other media where
                  appropriately authorized.
                </li>
                <li>Website usage and technical information.</li>
                <li>Information required to administer programs.</li>
                <li>
                  Information required to meet legal or regulatory
                  obligations.
                </li>
              </ul>

              <p>
                We seek to collect only information that is relevant
                and reasonably necessary for the particular purpose
                for which it is obtained.
              </p>
            </section>

            <section id="children" className="mb-5">
              <h2>
                3. Children, Beneficiaries and Vulnerable Persons
              </h2>

              <p>
                Because Garden of Mercy Foundation is child-focused,
                protecting children and vulnerable people is a central
                consideration in our information practices.
              </p>

              <p>
                Information relating to children should only be
                collected, accessed, used or disclosed for legitimate
                organizational purposes and with appropriate
                authorization and safeguards.
              </p>

              <div className="alert alert-success border-0 rounded-4">
                <strong>Child protection principle</strong>
                <p className="mb-0 mt-2">
                  The interests, dignity, safety and privacy of
                  children should take priority over publicity,
                  fundraising or organizational convenience.
                </p>
              </div>

              <p>
                Where consent is required for processing a child's
                personal information, the Foundation should obtain
                appropriate consent from a parent, guardian or other
                legally authorized person, subject to applicable law
                and safeguarding requirements.
              </p>

              <p>
                Sensitive information about children should not be
                publicly displayed unless there is a lawful,
                documented and appropriately authorized reason to do so.
              </p>
            </section>

            <section id="purposes" className="mb-5">
              <h2>4. How We Use Information</h2>

              <p>
                Personal information may be used for legitimate
                organizational purposes, including:
              </p>

              <ul>
                <li>Responding to enquiries.</li>
                <li>Communicating with donors and supporters.</li>
                <li>Administering donations.</li>
                <li>Managing volunteers and partners.</li>
                <li>Delivering and monitoring programs.</li>
                <li>Supporting beneficiaries.</li>
                <li>Maintaining organizational records.</li>
                <li>Improving website functionality.</li>
                <li>Preventing fraud and abuse.</li>
                <li>Maintaining information security.</li>
                <li>Meeting legal and regulatory obligations.</li>
                <li>Producing appropriately aggregated impact reports.</li>
                <li>
                  Communicating approved organizational news and updates.
                </li>
              </ul>

              <p>
                We should not use personal information for purposes
                that are materially incompatible with the purpose for
                which it was originally collected unless permitted or
                required by applicable law.
              </p>
            </section>

            <section id="lawful-basis" className="mb-5">
              <h2>5. Legal Basis for Processing</h2>

              <p>
                Where applicable, the Foundation will seek an
                appropriate legal basis for processing personal
                information.
              </p>

              <p>
                Depending on the circumstances, this may include:
              </p>

              <ul>
                <li>Consent.</li>
                <li>Performance of a requested service or agreement.</li>
                <li>Compliance with a legal obligation.</li>
                <li>Protection of vital interests.</li>
                <li>
                  Legitimate organizational interests where permitted
                  by law.
                </li>
              </ul>

              <p>
                Where processing is based on consent, individuals may
                generally withdraw that consent subject to applicable
                legal limitations and circumstances where another
                lawful basis applies.
              </p>
            </section>

            <section id="sharing" className="mb-5">
              <h2>6. Information Sharing and Disclosure</h2>

              <p>
                Garden of Mercy Foundation does not intend to sell
                personal information.
              </p>

              <p>
                Information may be shared where reasonably necessary
                with:
              </p>

              <ul>
                <li>Authorized Foundation personnel.</li>
                <li>Service providers supporting Foundation operations.</li>
                <li>Payment and financial service providers.</li>
                <li>Technology, hosting and security providers.</li>
                <li>Professional advisers where appropriate.</li>
                <li>Authorized program partners.</li>
                <li>
                  Government or regulatory authorities where legally
                  required.
                </li>
                <li>
                  Law-enforcement authorities where legally required
                  or permitted.
                </li>
              </ul>

              <p>
                Access should be limited according to the person's
                role and the principle of least privilege.
              </p>
            </section>

            <section id="donations" className="mb-5">
              <h2>7. Donations and Payment Information</h2>

              <p>
                When donation functionality is enabled, payment
                transactions may be processed through authorized
                payment providers.
              </p>

              <p>
                Where possible, sensitive payment credentials should
                be handled directly by the authorized payment provider
                rather than unnecessarily stored by the Foundation.
              </p>

              <p>
                Donation records may include information necessary to
                verify, reconcile, acknowledge and account for a
                donation.
              </p>

              <div className="alert alert-info border-0 rounded-4">
                <strong>Payment security</strong>
                <p className="mb-0 mt-2">
                  The Foundation should never request passwords,
                  PINs, one-time authentication codes or full payment
                  credentials through ordinary email, social media
                  messages or unofficial communication channels.
                </p>
              </div>
            </section>

            <section id="photography" className="mb-5">
              <h2>8. Photography, Video and Communications</h2>

              <p>
                As an NGO, the Foundation may document activities,
                events and programs through photographs, video,
                written stories or other media.
              </p>

              <p>
                Particular care should be taken when media involves
                children, beneficiaries or vulnerable individuals.
              </p>

              <p>
                Where consent or authorization is required,
                appropriate authorization should be obtained before
                publication.
              </p>

              <p>
                Public communications should avoid unnecessary
                disclosure of identifying, sensitive or potentially
                harmful information.
              </p>

              <p>
                Stories should preserve the dignity of beneficiaries
                and should not intentionally portray people in a
                degrading, exploitative or misleading manner.
              </p>
            </section>

            <section id="safeguarding" className="mb-5">
              <h2>9. Safeguarding and Protection from Harm</h2>

              <p>
                Garden of Mercy Foundation is committed to maintaining
                an environment in which children and vulnerable people
                are treated with dignity and protected from abuse,
                exploitation, harassment and other forms of harm.
              </p>

              <p>
                Information relating to safeguarding concerns may be
                handled with heightened confidentiality and restricted
                access.
              </p>

              <p>
                Confidentiality does not prevent the Foundation from
                reporting or sharing information where disclosure is
                necessary to protect a person from harm or comply with
                applicable law.
              </p>
            </section>

            <section id="cookies" className="mb-5">
              <h2>10. Cookies and Similar Technologies</h2>

              <p>
                The website may use cookies or similar technologies
                for purposes such as:
              </p>

              <ul>
                <li>Essential website functionality.</li>
                <li>Security.</li>
                <li>Session management.</li>
                <li>Preferences.</li>
                <li>Analytics where enabled.</li>
                <li>Performance monitoring.</li>
              </ul>

              <p>
                Where legally required, appropriate consent or
                controls should be provided for non-essential cookies.
              </p>
            </section>

            <section id="security" className="mb-5">
              <h2>11. Information Security</h2>

              <p>
                We seek to apply reasonable technical, organizational
                and administrative safeguards to protect personal
                information.
              </p>

              <p>Security measures may include:</p>

              <ul>
                <li>Role-based access controls.</li>
                <li>Strong authentication requirements.</li>
                <li>Secure password storage.</li>
                <li>Encryption where appropriate.</li>
                <li>Secure communications.</li>
                <li>Security monitoring.</li>
                <li>Backups and recovery procedures.</li>
                <li>Audit logging.</li>
                <li>Staff and administrator access controls.</li>
                <li>Security updates and vulnerability management.</li>
              </ul>

              <p>
                No internet-based system can be guaranteed to be
                completely secure. We therefore encourage users to
                protect their own accounts and devices appropriately.
              </p>
            </section>

            <section id="retention" className="mb-5">
              <h2>12. Data Retention</h2>

              <p>
                Personal information should only be retained for as
                long as reasonably necessary for the purpose for which
                it was collected, legitimate organizational
                requirements, safeguarding, accounting, legal,
                regulatory or dispute-resolution purposes.
              </p>

              <p>
                When information is no longer required, it should be
                securely deleted, anonymized or otherwise disposed of
                according to applicable retention procedures.
              </p>
            </section>

            <section id="rights" className="mb-5">
              <h2>13. Your Privacy Rights</h2>

              <p>
                Subject to applicable law, individuals may have rights
                relating to their personal information, including:
              </p>

              <ul>
                <li>
                  The right to request access to personal information.
                </li>
                <li>
                  The right to request correction of inaccurate
                  information.
                </li>
                <li>
                  The right to request deletion where legally
                  applicable.
                </li>
                <li>The right to object to certain processing.</li>
                <li>
                  The right to withdraw consent where processing relies
                  on consent.
                </li>
                <li>The right to raise a privacy complaint.</li>
              </ul>

              <p>
                Requests may be subject to identity verification and
                applicable legal exceptions.
              </p>
            </section>

            <section id="breach" className="mb-5">
              <h2>14. Personal Data Incidents and Breaches</h2>

              <p>
                If the Foundation becomes aware of a suspected
                unauthorized access, loss, disclosure, alteration or
                destruction of personal information, it should
                investigate and take reasonable steps to contain and
                address the incident.
              </p>

              <p>
                Where notification is required by applicable law,
                relevant authorities and affected individuals should
                be notified in accordance with the applicable
                requirements.
              </p>
            </section>

            <section id="international" className="mb-5">
              <h2>15. International Data Transfers</h2>

              <p>
                Some technology, hosting, communication, payment or
                other service providers may process information outside
                Uganda.
              </p>

              <p>
                Where personal information is transferred across
                borders, the Foundation should take appropriate steps
                to ensure that the transfer and subsequent processing
                comply with applicable privacy and data-protection
                requirements.
              </p>
            </section>

            <section id="third-party" className="mb-5">
              <h2>16. Third-Party Websites and Services</h2>

              <p>
                Our website may contain links to third-party websites,
                payment platforms, social-media services or other
                external systems.
              </p>

              <p>
                Those services operate under their own privacy
                policies and terms. Garden of Mercy Foundation is not
                responsible for privacy practices outside our
                reasonable control.
              </p>
            </section>

            <section id="volunteers" className="mb-5">
              <h2>17. Volunteers, Staff and Partners</h2>

              <p>
                Information relating to employees, volunteers,
                consultants and partners may be collected when
                necessary to administer their relationship with the
                Foundation.
              </p>

              <p>
                Access to such information should be restricted to
                authorized personnel and used only for legitimate
                organizational purposes.
              </p>
            </section>

            <section id="communications" className="mb-5">
              <h2>18. Donor and Supporter Communications</h2>

              <p>
                Supporters may receive communications relating to
                donations, organizational activities, campaigns,
                events or other legitimate Foundation activities.
              </p>

              <p>
                Where applicable, recipients should be provided with
                an appropriate mechanism to opt out of non-essential
                promotional communications.
              </p>
            </section>

            <section id="transparency" className="mb-5">
              <h2>19. Transparency and Accountability</h2>

              <p>
                Garden of Mercy Foundation seeks to promote
                responsible stewardship of information and resources.
              </p>

              <p>
                Access to sensitive information should be based on
                legitimate responsibilities, documented procedures
                and appropriate authorization.
              </p>

              <p>
                Where appropriate, organizational activities should
                maintain records that support accountability,
                transparency and responsible governance.
              </p>
            </section>

            <section id="changes" className="mb-5">
              <h2>20. Changes to This Policy</h2>

              <p>
                This Privacy Policy may be updated when our services,
                technology, organizational practices or applicable
                legal requirements change.
              </p>

              <p>
                The latest version should be published on this page
                together with an updated effective or revision date.
              </p>
            </section>

            <section id="contact" className="mb-5">
              <h2>21. Privacy Questions and Complaints</h2>

              <p>
                Questions, requests or complaints relating to privacy
                and personal information may be submitted through our
                contact page.
              </p>

              <a
                href="/contact"
                className="btn btn-success mt-2"
              >
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

export default Privacy;