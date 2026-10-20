import React from "react";
import { PageIntro } from "../components/SiteChrome.jsx";

const privacySections = [
  ["1. Introduction", "Garden of Mercy Foundation respects the privacy, dignity and rights of individuals whose information may be entrusted to us. This policy explains the principles intended to guide collection, use, storage, protection and sharing of personal information through the website, programs, communications and fundraising activities."],
  ["2. Information We May Collect", "Depending on the services available, information may include your name, contact details, organization information, donation and transaction details, volunteer or application information, correspondence, form submissions, authorized photographs or video, technical information and records needed to administer programs or meet legal obligations. We aim to collect only information relevant to a stated purpose."],
  ["3. Children, Beneficiaries and Vulnerable Persons", "Protecting children and vulnerable people is central to our information practices. Information about children, families and beneficiaries should be handled with additional care, limited to legitimate purposes and accessed only by people who need it for their work."],
  ["4. How We Use Information", "Information may be used to respond to enquiries, administer donations and programs, coordinate volunteers and partnerships, provide requested updates, protect people and services, improve the website, maintain records and meet applicable legal requirements."],
  ["5. Legal Basis for Processing", "Where applicable, information is processed on the basis of consent, steps requested by an individual, legitimate organizational purposes, legal obligations or another lawful basis relevant to the specific activity."],
  ["6. Information Sharing and Disclosure", "Information may be shared with authorized team members, service providers, payment processors, professional advisers or public authorities where necessary and lawful. We do not intend to sell personal information."],
  ["7. Donations and Payment Information", "Online donations may be handled by a third-party payment provider. Payment details should be entered only on the provider's secure checkout page. The Foundation may receive transaction references and status information needed for reconciliation and records."],
  ["8. Photography, Video and Communications", "Images, stories and media involving children or beneficiaries should be collected and used only with appropriate authorization, consent and safeguarding review. Requests about media use can be directed to the Foundation through its official contact channels."],
  ["9. Safeguarding and Protection from Harm", "Personal information must not be used to expose a beneficiary to harm, stigma, exploitation or unnecessary public attention. Access and publication should follow appropriate safeguarding practices."],
  ["10. Cookies and Similar Technologies", "The website may use essential or analytical technologies depending on the services enabled. Browser settings may allow you to manage cookies; disabling some technologies may affect site functionality."],
  ["11. Information Security", "Reasonable organizational and technical safeguards should be used to protect information from unauthorized access, loss, misuse or disclosure. No internet transmission or storage system can be guaranteed to be completely secure."],
  ["12. Data Retention", "Information should be retained only for as long as needed for the purpose collected, legitimate organizational recordkeeping, safeguarding, dispute resolution or legal requirements, and then securely deleted or anonymized where appropriate."],
  ["13. Your Privacy Rights", "Depending on applicable law, you may be able to request access to, correction of or deletion of personal information, object to certain processing, withdraw consent or raise a concern about how information is handled."],
  ["14. Personal Data Incidents and Breaches", "Suspected information incidents should be assessed promptly, contained where possible and handled in line with applicable obligations and the risk to affected individuals."],
  ["15. International Data Transfers", "If information is handled or stored in another country through service providers, appropriate safeguards should be considered where required by applicable law."],
  ["16. Third-Party Websites and Services", "External websites and services have their own privacy practices. Review their policies before submitting information through them."],
  ["17. Volunteers, Staff and Partners", "Information collected for volunteer, staff or partner relationships should be limited to legitimate administrative, operational, safeguarding and legal purposes."],
  ["18. Donor and Supporter Communications", "Supporters may receive communications related to their enquiries, donations or stated preferences. Where applicable, promotional communications should provide an appropriate way to opt out."],
  ["19. Transparency and Accountability", "The Foundation aims to handle personal information responsibly and review its practices as programs, services and legal requirements develop."],
  ["20. Changes to This Policy", "This policy may be updated as website features, organizational practices or legal requirements change. The current version should be reviewed periodically."],
  ["21. Privacy Questions and Complaints", "For privacy questions or concerns, contact the Foundation using its verified official contact details. Those details should be confirmed before this website is published."],
];

const termsSections = [
  ["1. Acceptance of These Terms", "By accessing or using this website, you acknowledge that you have read and understood these Terms of Use. If you do not agree, discontinue use of the website. These terms should be read with the Privacy Policy and other policies that apply to specific services."],
  ["2. About the Website", "The website provides public information about Garden of Mercy Foundation, its mission, programs, activities, initiatives and approved communications. Additional services may become available over time."],
  ["3. Eligibility and Responsible Access", "Users are responsible for ensuring that their use of the website is lawful and consistent with applicable laws and any additional eligibility requirements communicated for particular services."],
  ["4. Responsible Use", "Do not misuse the website, interfere with its operation, attempt unauthorized access, bypass security controls, introduce malicious software, impersonate the Foundation, submit fraudulent information or use the website for unlawful purposes."],
  ["5. Website Content", "Text, images, logos, documents and other website materials are provided for informational and organizational purposes and may be protected by intellectual property rights."],
  ["6. Accuracy of Information", "We aim to keep information accurate and current, but some content may change as programs and services develop. Contact the Foundation to verify important details before relying on them."],
  ["7. Programs and Beneficiary Information", "Program descriptions may explain areas of focus or intended initiatives and do not guarantee that a particular service is currently available. Beneficiary information must be treated respectfully and not copied or misused."],
  ["8. Donations", "Donations support the Foundation's mission and are subject to the instructions and terms displayed during the donation process. Please verify official payment details before sending funds."],
  ["9. Payment Processing", "Online payments may be processed by third-party providers under their own terms and privacy practices. The Foundation does not ask donors to disclose mobile-money PINs or account passwords."],
  ["10. Donations, Refunds and Corrections", "If you believe a transaction was made in error or requires correction, contact the Foundation with the relevant reference details. Any refund or correction request will be reviewed under applicable law, provider rules and the circumstances of the transaction."],
  ["11. Fundraising and Public Appeals", "Public appeals should accurately describe the purpose of a campaign. The Foundation may update campaign information when circumstances, needs or available resources change."],
  ["12. Intellectual Property", "Unless otherwise stated, website content belongs to or is used with permission by the Foundation. Do not reproduce, modify or commercially exploit protected material without authorization, except where permitted by law."],
  ["13. User-Submitted Content", "You are responsible for information you submit and should not submit unlawful, misleading, confidential or harmful material. Do not provide personal information about another person unless you are authorized to do so."],
  ["14. Communications", "Messages submitted through the website may be used to respond to your enquiry and manage the relevant relationship. Do not use contact channels to send spam, threats or unlawful material."],
  ["15. Child Protection and Safeguarding", "The safety and dignity of children and vulnerable people are important. Do not attempt to identify, contact or publish information about beneficiaries in ways that may expose them to harm."],
  ["16. Privacy and Personal Information", "Personal information is handled in accordance with the Foundation's Privacy Policy and applicable requirements."],
  ["17. Third-Party Websites and Services", "Links to third-party websites are provided for convenience. The Foundation does not control their content, availability or practices."],
  ["18. Website Security", "Do not attempt to disrupt, probe or compromise website security. Report suspected security issues through an official contact channel."],
  ["19. Website Availability", "The website or individual services may occasionally be unavailable for maintenance, updates, technical problems or reasons beyond the Foundation's control."],
  ["20. Disclaimers", "Website content is provided for general information. It is not a guarantee that a particular program, service or outcome will be available."],
  ["21. Limitation of Liability", "To the extent permitted by applicable law, the Foundation is not responsible for losses arising from temporary website unavailability, reliance on outdated information or third-party services outside its control."],
  ["22. Indemnity", "You are responsible for unlawful or unauthorized use of the website and for claims arising from content or actions you submit or undertake in breach of these terms, to the extent permitted by law."],
  ["23. Suspension and Termination", "Access may be restricted where reasonably necessary to protect the website, users, beneficiaries, the Foundation or compliance with law."],
  ["24. Changes to These Terms", "These terms may be updated as the website and its services evolve. The current version should be reviewed periodically."],
  ["25. Governing Law and Jurisdiction", "Applicable law and jurisdiction should be confirmed by the Foundation for its place of registration and operations before publication."],
  ["26. Contact", "For questions about these terms, contact the Foundation using verified official contact details. Those details should be confirmed before publication."],
];

export default function Legal({ kind }) {
  const privacy = kind === "privacy";
  const sections = privacy ? privacySections : termsSections;
  return <>
    <PageIntro eyebrow="INFORMATION & TRUST" title={privacy ? <>Privacy and <em>respect.</em></> : <>Clear terms. <em>Shared trust.</em></>} text={privacy ? "How Garden of Mercy Foundation approaches the responsible collection, use, protection and retention of personal information." : "The terms and conditions that guide access to and use of the Garden of Mercy Foundation website and online services."} />
    <section className="legal-copy">
      <p className="legal-notice">This page is provided as a working website policy and should be reviewed and approved by the Foundation before publication. Confirm official contact details and applicable legal requirements.</p>
      {sections.map(([heading, content]) => <article className="legal-section" key={heading}><h2>{heading}</h2><p>{content}</p></article>)}
    </section>
  </>;
}
