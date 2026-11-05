/**
 * Foundation website content registry.
 *
 * Public copy and media should be promoted from "draft" or "illustrative"
 * to "verified" only after the Foundation has approved the source material.
 * Keep beneficiary-identifying information private unless documented consent
 * and safeguarding approval are in place.
 */
export const foundationContent = {
  organisation: {
    name: "Garden of Mercy Foundation",
    tagline: "Sowing Seeds of Mercy and Compassion",
    location: "Uganda",
    status: "verified",
  },
  programs: [
    {
      id: "child-welfare",
      title: "Child welfare and support",
      summary: "Child-centred support that upholds dignity, safety and wellbeing.",
      status: "proposed",
    },
    {
      id: "education",
      title: "Education support",
      summary: "Support that helps children access learning opportunities and essential school needs.",
      status: "proposed",
    },
    {
      id: "wellbeing",
      title: "Nutrition and wellbeing",
      summary: "Practical initiatives that respond to assessed wellbeing needs.",
      status: "proposed",
    },
    {
      id: "family-community",
      title: "Family and community strengthening",
      summary: "Working alongside families and communities to identify appropriate support.",
      status: "proposed",
    },
  ],
  impactMeasures: [
    "Children supported, reported only from verified beneficiary records",
    "Education support provided, supported by receipts or school confirmations",
    "Projects delivered against approved plans and budgets",
    "Volunteer participation and completed service activities",
    "Quarterly child sponsorship progress updates",
  ],
  reporting: {
    sponsorshipUpdates: "Quarterly",
    impactFigures: "Do not publish until verified",
    financialFigures: "Do not publish until reconciled and approved",
  },
  editorialRules: {
    sampleStoriesMustBeLabelled: true,
    sampleImagesMustNotBePresentedAsFoundationEvidence: true,
    beneficiaryConsentRequired: true,
    unpublishedProjectsMustNotBeDescribedAsCompleted: true,
  },
};

export const contentStatusLabels = {
  verified: "Verified foundation information",
  proposed: "Program area — implementation details to be confirmed",
  illustrative: "Illustrative example — not a verified foundation case study",
  awaiting: "Foundation information or approved media to be added",
};
