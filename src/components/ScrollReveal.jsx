import { useEffect } from "react";

/**
 * Progressive scroll enhancement for explicitly marked content.
 * The observer is recreated for each route because the keyed main landmark
 * is replaced during client-side navigation.
 */
export default function ScrollReveal({ path }) {
  useEffect(() => {
    const root = document.documentElement;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (motionPreference.matches || !("IntersectionObserver" in window)) {
      root.classList.remove("has-scroll-reveal");
      return undefined;
    }

    const content = document.querySelector(".app-shell > #main-content");
    if (!content) return undefined;

    let active = true;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, {
      root: null,
      rootMargin: "0px 0px -6% 0px",
      threshold: 0.08,
    });

    const observeElement = (element) => {
      // Never conceal a section that contains a form or dialog workflow.
      if (element.querySelector("form, [role='dialog']")) {
        element.classList.add("is-visible");
        return;
      }
      observer.observe(element);
    };

    const observeWithin = (node) => {
      if (!active || !(node instanceof Element)) return;
      if (node.matches("[data-scroll-reveal]")) observeElement(node);
      node.querySelectorAll("[data-scroll-reveal]").forEach(observeElement);
    };

    root.classList.add("has-scroll-reveal");
    observeWithin(content);

    const mutations = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach(observeWithin);
      });
    });
    mutations.observe(content, { childList: true, subtree: true });

    const handleMotionChange = (event) => {
      if (!event.matches) return;
      active = false;
      root.classList.remove("has-scroll-reveal");
      mutations.disconnect();
      observer.disconnect();
    };

    motionPreference.addEventListener?.("change", handleMotionChange);

    return () => {
      active = false;
      mutations.disconnect();
      observer.disconnect();
      motionPreference.removeEventListener?.("change", handleMotionChange);
      root.classList.remove("has-scroll-reveal");
    };
  }, [path]);

  return null;
}
