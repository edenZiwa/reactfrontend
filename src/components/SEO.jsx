import { useEffect } from "react";

const SITE_NAME = "Garden of Mercy Foundation";
const SITE_URL = "https://gardenofmercy.org";

export default function SEO({
    title,
    description,
    path = "/",
    image = "/images/garden_of_mercy_logo.png",
}) {
    useEffect(() => {
        const fullTitle = `${title} | ${SITE_NAME}`;
        const canonicalUrl = `${SITE_URL}${path}`;
        const imageUrl = `${SITE_URL}${image}`;

        document.title = fullTitle;

        const setMeta = (attribute, key, content) => {
            let element = document.head.querySelector(
                `meta[${attribute}="${key}"]`
            );

            if (!element) {
                element = document.createElement("meta");
                element.setAttribute(attribute, key);
                document.head.appendChild(element);
            }

            element.setAttribute("content", content);
        };

        setMeta("name", "description", description);
        setMeta("property", "og:title", fullTitle);
        setMeta("property", "og:description", description);
        setMeta("property", "og:type", "website");
        setMeta("property", "og:url", canonicalUrl);
        setMeta("property", "og:image", imageUrl);

        setMeta("name", "twitter:card", "summary_large_image");
        setMeta("name", "twitter:title", fullTitle);
        setMeta("name", "twitter:description", description);
        setMeta("name", "twitter:image", imageUrl);

        let canonical = document.head.querySelector(
            'link[rel="canonical"]'
        );

        if (!canonical) {
            canonical = document.createElement("link");
            canonical.rel = "canonical";
            document.head.appendChild(canonical);
        }

        canonical.href = canonicalUrl;
    }, [title, description, path, image]);

    return null;
          }
