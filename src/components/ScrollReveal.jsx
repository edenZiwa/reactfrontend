import { useEffect } from "react";

/**
 * Observes opt-in page elements and reveals them as they enter the viewport.
 * Content remains visible when IntersectionObserver is unavailable or motion
 * is reduced, so this enhancement never becomes a content dependency.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!("IntersectionObserver" in window) || reducedMotion.matches) {
      root.classList.remove("has-scroll-reveal");
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.12,
      },
    );

    const observeWithin = (node) => {
      if (!(node instanceof Element)) return;
      if (node.matches("[data-scroll-reveal]")) observer.observe(node);
      node.querySelectorAll("[data-scroll-reveal]").forEach((element) => {
        observer.observe(element);
      });
    };

    root.classList.add("has-scroll-reveal");
    const content = document.getElementById("main-content");
    if (content) observeWithin(content);

    const mutations = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach(observeWithin);
      });
    });

    if (content) {
      mutations.observe(content, { childList: true, subtree: true });
    }

    const handleMotionChange = (event) => {
      if (!event.matches) return;
      root.classList.remove("has-scroll-reveal");
      mutations.disconnect();
      observer.disconnect();
    };

    reducedMotion.addEventListener?.("change", handleMotionChange);

    return () => {
      mutations.disconnect();
      observer.disconnect();
      reducedMotion.removeEventListener?.("change", handleMotionChange);
      root.classList.remove("has-scroll-reveal");
    };
  }, []);

  return null;
}
