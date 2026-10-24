
import React, { useEffect, useState } from "react";
import "./css/scroll-navigator.css";

const SCROLL_THRESHOLD = 180;
const BOTTOM_THRESHOLD = 80;
const DIRECTION_THRESHOLD = 4;

export default function ScrollNavigator() {
  const [scrollState, setScrollState] = useState({
    direction: "down",
    visible: false,
    atBottom: false,
  });

  useEffect(() => {
    let previousY = window.scrollY;
    let ticking = false;

    const updateScrollState = () => {
      const currentY = Math.max(0, window.scrollY);
      const documentHeight =
        document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;

      const atBottom =
        currentY + viewportHeight >=
        documentHeight - BOTTOM_THRESHOLD;

      let direction = scrollState.direction;

      if (currentY - previousY > DIRECTION_THRESHOLD) {
        direction = "down";
      } else if (
        previousY - currentY > DIRECTION_THRESHOLD
      ) {
        direction = "up";
      }

      // At the bottom, always offer a way back to the top.
      if (atBottom) {
        direction = "up";
      } else if (currentY <= 10) {
        direction = "down";
      }

      const visible =
        currentY > SCROLL_THRESHOLD || atBottom;

      setScrollState((previous) => {
        if (
          previous.direction === direction &&
          previous.visible === visible &&
          previous.atBottom === atBottom
        ) {
          return previous;
        }

        return { direction, visible, atBottom };
      });

      previousY = currentY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateScrollState);
      }
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    // Set the correct initial state.
    updateScrollState();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    // The listener reads direction from state through its closure.
  }, [scrollState.direction]);

  const scrollToDestination = () => {
    const target =
      scrollState.direction === "up" || scrollState.atBottom
        ? 0
        : document.getElementById("site-footer")
            ?.getBoundingClientRect().top + window.scrollY;

    if (target === undefined || target === null) {
      return;
    }

    window.scrollTo({
      top: target,
      behavior: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
        ? "auto"
        : "smooth",
    });
  };

  const isScrollingUp =
    scrollState.direction === "up" || scrollState.atBottom;

  return (
    <div
      className={`scroll-navigator ${
        scrollState.visible ? "is-visible" : ""
      }`}
    >
      <button
        type="button"
        className="scroll-navigator__button"
        onClick={scrollToDestination}
        aria-label={
          isScrollingUp
            ? "Scroll to the top of the page"
            : "Scroll to the bottom of the page"
        }
        title={
          isScrollingUp ? "Back to top" : "Go to footer"
        }
        aria-hidden={!scrollState.visible}
        tabIndex={scrollState.visible ? 0 : -1}
      >
        <i
          className={`bi ${
            isScrollingUp
              ? "bi-chevron-up"
              : "bi-chevron-down"
          }`}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
