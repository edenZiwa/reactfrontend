
import React, { useEffect, useRef, useState } from "react";
import "./css/scroll-navigator.css";

const TOP_THRESHOLD = 10;
const DIRECTION_THRESHOLD = 3;
const BOTTOM_THRESHOLD = 60;

export default function ScrollNavigator() {
  const [direction, setDirection] = useState("down");
  const [atBottom, setAtBottom] = useState(false);

  const previousY = useRef(0);
  const directionRef = useRef("down");
  const ticking = useRef(false);

  useEffect(() => {
    previousY.current = window.scrollY;

    let frameId;

    const updateScroll = () => {
      const currentY = window.scrollY;

      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight -
          window.innerHeight
      );

      const bottom =
        currentY >= maxScroll - BOTTOM_THRESHOLD;

      let nextDirection = directionRef.current;

      if (currentY <= TOP_THRESHOLD) {
        nextDirection = "down";
      } else if (bottom) {
        nextDirection = "up";
      } else if (
        currentY > previousY.current + DIRECTION_THRESHOLD
      ) {
        nextDirection = "down";
      } else if (
        currentY < previousY.current - DIRECTION_THRESHOLD
      ) {
        nextDirection = "up";
      }

      directionRef.current = nextDirection;

      setDirection((previous) =>
        previous === nextDirection ? previous : nextDirection
      );

      setAtBottom((previous) =>
        previous === bottom ? previous : bottom
      );

      previousY.current = currentY;
      ticking.current = false;
    };

    const handleScroll = () => {
      if (ticking.current) return;

      ticking.current = true;
      frameId = window.requestAnimationFrame(updateScroll);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", handleScroll);

    // Initialize the chevron when the page loads.
    updateScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  const scrollToDestination = () => {
    const shouldScrollUp = direction === "up" || atBottom;

    const target = shouldScrollUp
      ? 0
      : document.getElementById("site-footer");

    const targetPosition = shouldScrollUp
      ? 0
      : target
        ? target.getBoundingClientRect().top + window.scrollY
        : document.documentElement.scrollHeight;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({
      top: targetPosition,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  const isPointingUp = direction === "up" || atBottom;

  return (
    <div className="scroll-navigator">
      <button
        type="button"
        className="scroll-navigator__button"
        onClick={scrollToDestination}
        aria-label={
          isPointingUp
            ? "Scroll to the top of the page"
            : "Scroll to the footer"
        }
        title={isPointingUp ? "Back to top" : "Go to footer"}
      >
        <i
          className={`bi ${
            isPointingUp
              ? "bi-chevron-up"
              : "bi-chevron-down"
          }`}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
