import { useEffect } from "react";

const SITE_NAME = "Garden of Mercy Foundation";
const SITE_URL = "https://gardenofmercy.org";

const DEFAULT_IMAGE = `${SITE_URL}/images/garden-of-mercy-social.jpg`;

const pages = {
    "/": {
        title: "Garden of Mercy Foundation | Sowing Seeds of Mercy",
        description:
            "Garden of Mercy Foundation sows seeds of mercy and compassion by supporting vulnerable children, restoring dignity, and strengthening communities.",
        type: "website",
        structuredData: true,
    },
    "/about": {
        title: "About Us | Garden of Mercy Foundation",
        description:
            "Discover the mission, vision, and values of Garden of Mercy Foundation and our commitment to vulnerable children and communities.",
    },
    "/programs": {
        title: "Our Programs | Garden of Mercy Foundation",
        description:
            "Explore Garden of Mercy Foundation programs supporting children, vulnerable families, and communities through practical acts of compassion.",
    },
    "/impact": {
        title: "Our Impact | Garden of Mercy Foundation",
        description:
            "Learn how Garden of Mercy Foundation works to create meaningful change and bring hope to vulnerable people and communities.",
    },
    "/success-stories": {
        title: "Success Stories | Garden of Mercy Foundation",
        description:
            "Discover stories of hope, resilience, and positive change connected to the work of Garden of Mercy Foundation.",
    },
    "/gallery": {
        title: "Gallery | Garden of Mercy Foundation",
        description:
            "Explore photos from Garden of Mercy Foundation activities, community initiatives, and acts of compassion.",
    },
    "/founder": {
        title: "Our Founder | Garden of Mercy Foundation",
        description:
            "Learn about Apostle Derrick Musinguzi and the vision behind Garden of Mercy Foundation's mission of mercy and compassion.",
    },
    "/cofounder": {
        title: "Our Co-Founder | Garden of Mercy Foundation",
        description:
            "Learn about Pastor Albert Yiga and the vision behind Garden of Mercy Foundation's mission of mercy and compassion.",
    },
    "/donate": {
        title: "Donate | Support Garden of Mercy Foundation",
        description:
            "Support Garden of Mercy Foundation in bringing hope, dignity, and practical assistance to vulnerable children and communities.",
    },
    "/contact": {
        title: "Contact Us | Garden of Mercy Foundation",
        description:
            "Contact Garden of Mercy Foundation to learn about our work, community programs, partnerships, and opportunities to get involved.",
    },
    "/sponsor": {
        title: "Sponsor a Cause | Garden of Mercy Foundation",
        description:
            "Explore ways to support Garden of Mercy Foundation initiatives and help bring meaningful assistance to vulnerable communities.",
    },
    "/privacy": {
        title: "Privacy Policy | Garden of Mercy Foundation",
        description:
            "Read how Garden of Mercy Foundation handles personal information and protects website visitors' privacy.",
    },
    "/terms": {
        title: "Terms of Use | Garden of Mercy Foundation",
        description:
            "Read the terms governing the use of the Garden of Mercy Foundation website and its services.",
    },
    "/power-of-revelation-ministries": {
        title: "Power of Revelation Ministries | Garden of Mercy Foundation",
        description:
            "Learn about the Power of Revelation Ministries and how they are making a difference in the lives of vulnerable individuals.",
    },
    "/account": {
        title: "Community Account | Garden of Mercy Foundation",
        description:
            "Access your Garden of Mercy Foundation community account.",
        noindex: true,
    },
    "/donation-result": {
        title: "Donation Status | Garden of Mercy Foundation",
        description:
            "View the status of your Garden of Mercy Foundation donation.",
        noindex: true,
    },
};

function upsertMeta(attribute, key, content) {
    let element = document.head.querySelector(
        `meta[${attribute}="${key}"]`
    );

    if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
    }

    element.setAttribute("content", content);
}

function removeMeta(attribute, key) {
    document.head
        .querySelector(`meta[${attribute}="${key}"]`)
        ?.remove();
}

function upsertCanonical(url) {
    let element = document.head.querySelector(
        'link[rel="canonical"]'
    );

    if (!element) {
        element = document.createElement("link");
        element.rel = "canonical";
        document.head.appendChild(element);
    }

    element.href = url;
}

export default function SEO({ path = "/" }) {
    useEffect(() => {
        const page = pages[path];

        // Unknown routes must not be indexed as the homepage.
        const isNotFound = !page;
        const metadata = page || {
            title: "Page Not Found | Garden of Mercy Foundation",
            description:
                "The requested page could not be found.",
            noindex: true,
        };

        const canonicalUrl = `${SITE_URL}${path}`;

        document.title = metadata.title;

        upsertMeta(
            "name",
            "description",
            metadata.description
        );

        upsertMeta(
            "name",
            "robots",
            metadata.noindex
                ? "noindex, nofollow"
                : "index, follow"
        );

        upsertCanonical(canonicalUrl);

        upsertMeta("property", "og:site_name", SITE_NAME);
        upsertMeta("property", "og:title", metadata.title);
        upsertMeta(
            "property",
            "og:description",
            metadata.description
        );
        upsertMeta("property", "og:type", "website");
        upsertMeta("property", "og:url", canonicalUrl);
        upsertMeta("property", "og:image", DEFAULT_IMAGE);
        upsertMeta(
            "property",
            "og:image:alt",
            "Garden of Mercy Foundation"
        );

        upsertMeta(
            "name",
            "twitter:card",
            "summary_large_image"
        );
        upsertMeta("name", "twitter:title", metadata.title);
        upsertMeta(
            "name",
            "twitter:description",
            metadata.description
        );
        upsertMeta("name", "twitter:image", DEFAULT_IMAGE);

        // Organization schema is included on the homepage only.
        let schema = document.getElementById(
            "organization-schema"
        );

        if (metadata.structuredData) {
            if (!schema) {
                schema = document.createElement("script");
                schema.id = "organization-schema";
                schema.type = "application/ld+json";
                document.head.appendChild(schema);
            }

            schema.textContent = JSON.stringify({
                "@context": "https://schema.org",
                "@type": "NGO",
                name: SITE_NAME,
                url: SITE_URL,
                logo: `${SITE_URL}/images/garden_of_mercy_logo.png`,
                description: metadata.description,
            });
        } else {
            schema?.remove();
        }

        // Explicitly remove an old alternate schema if the route changes.
        removeMeta("name", "googlebot");

        // Keep the route-specific canonical URL synchronized.
        // `path` should be a normalized pathname, not a full URL.
    }, [path]);

    return null;
            }
        
