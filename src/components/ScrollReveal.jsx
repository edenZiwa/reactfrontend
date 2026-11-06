import { useEffect } from "react";

const REVEAL_SELECTOR = "[data-scroll-reveal], [data-scroll-image]";

/**
 * Progressive scroll entrances for explicitly opted-in content.
 * Content already in view is revealed before enhancement styles are enabled,
 * preventing an initial blank frame. Keyboard focus always reveals its section.
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
      if (element.matches("[data-scroll-reveal]") &&
          element.querySelector("form, [role='dialog']")) {
        element.classList.add("is-visible");
        return;
      }

      // Reveal above-the-fold content synchronously to avoid first-paint flicker.
      const bounds = element.getBoundingClientRect();
      if (bounds.top < window.innerHeight && bounds.bottom > 0) {
        element.classList.add("is-visible");
        return;
      }

      observer.observe(element);
    };

    const observeWithin = (node) => {
      if (!active || !(node instanceof Element)) return;
      if (node.matches(REVEAL_SELECTOR)) observeElement(node);
      node.querySelectorAll(REVEAL_SELECTOR).forEach(observeElement);
    };

    observeWithin(content);
    root.classList.add("has-scroll-reveal");

    // A keyboard user must never tab into visually concealed content.
    const revealFocusedSection = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const revealTarget = target.closest(REVEAL_SELECTOR);
      if (!revealTarget || !content.contains(revealTarget)) return;
      revealTarget.classList.add("is-visible");
      observer.unobserve(revealTarget);
    };
    content.addEventListener("focusin", revealFocusedSection);

    const mutations = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach(observeWithin));
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
      content.removeEventListener("focusin", revealFocusedSection);
      motionPreference.removeEventListener?.("change", handleMotionChange);
      root.classList.remove("has-scroll-reveal");
    };
  }, [path]);

  return null;
}
