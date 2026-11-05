import React, { useEffect, useRef, useState } from "react";
import "../css/scroll-navigator.css";

const SHOW_THRESHOLD = 240;
const DIRECTION_THRESHOLD = 5;
const BOTTOM_THRESHOLD = 72;

export default function ScrollNavigator() {
  const [visible, setVisible] = useState(false);
  const [direction, setDirection] = useState("down");
  const [atBottom, setAtBottom] = useState(false);
  const previousY = useRef(0);
  const directionRef = useRef("down");
  const ticking = useRef(false);

  useEffect(() => {
    previousY.current = window.scrollY;
    let frameId = 0;

    const updateScroll = () => {
      const currentY = window.scrollY;
      const root = document.documentElement;
      const maxScroll = Math.max(0, root.scrollHeight - window.innerHeight);
      const bottom = maxScroll > SHOW_THRESHOLD && currentY >= maxScroll - BOTTOM_THRESHOLD;
      let nextDirection = directionRef.current;

      if (currentY <= SHOW_THRESHOLD) nextDirection = "down";
      else if (bottom) nextDirection = "up";
      else if (currentY > previousY.current + DIRECTION_THRESHOLD) nextDirection = "down";
      else if (currentY < previousY.current - DIRECTION_THRESHOLD) nextDirection = "up";

      directionRef.current = nextDirection;
      setVisible(currentY > SHOW_THRESHOLD);
      setDirection(nextDirection);
      setAtBottom(bottom);
      previousY.current = currentY;
      ticking.current = false;
    };

    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      frameId = window.requestAnimationFrame(updateScroll);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    updateScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  const scrollToDestination = () => {
    const shouldScrollUp = direction === "up" || atBottom;
    const footer = document.getElementById("site-footer");
    const targetTop = shouldScrollUp
      ? 0
      : footer
        ? footer.getBoundingClientRect().top + window.scrollY
        : document.documentElement.scrollHeight;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({ top: targetTop, behavior: reducedMotion ? "auto" : "smooth" });
  };

  const pointsUp = direction === "up" || atBottom;

  return (
    <div className={`scroll-navigator${visible ? " is-visible" : ""}`}>
      <button
        type="button"
        className="scroll-navigator__button"
        onClick={scrollToDestination}
        aria-label={pointsUp ? "Scroll to the top of the page" : "Scroll to the footer"}
        title={pointsUp ? "Back to top" : "Go to footer"}
        tabIndex={visible ? 0 : -1}
        aria-hidden={!visible}
      >
        <i className={`bi ${pointsUp ? "bi-chevron-up" : "bi-chevron-down"}`} aria-hidden="true" />
      </button>
    </div>
  );
}
