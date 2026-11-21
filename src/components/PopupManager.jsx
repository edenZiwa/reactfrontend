import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import WelcomePopup from "./WelcomePopup";
import EducationGiftPopup from "./EducationGiftPopup";

const WELCOME_KEY = "gom_welcome_shown";
const EDUCATION_KEY = "gom_education_popup_shown";
const WELCOME_DELAY = 30000;
const EDUCATION_MIN_ENGAGEMENT_MS = 30000;
const EDUCATION_SCROLL_THRESHOLD = 0.4;
const memoryShown = new Set();

function wasShown(key) {
  try {
    if (window.localStorage.getItem(key) === "true") return true;
    if (window.sessionStorage.getItem(key) === "true") return true;
    return memoryShown.has(key);
  } catch {
    return memoryShown.has(key);
  }
}

function markShown(key) {
  memoryShown.add(key);
  try {
    if (key === WELCOME_KEY) {
      window.localStorage.setItem(key, "true");
    } else {
      window.sessionStorage.setItem(key, "true");
    }
  } catch {
    // Popup behavior remains functional when browser storage is unavailable.
  }
}

export default function PopupManager({ path, navigate }) {
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [educationOpen, setEducationOpen] = useState(false);

  const isDonationFlow =
    path === "/donate" ||
    path === "/donation-result" ||
    path?.startsWith("/donate/");

  const closeWelcome = useCallback(() => {
    markShown(WELCOME_KEY);
    setWelcomeOpen(false);
  }, []);

  const closeEducation = useCallback(() => {
    setEducationOpen(false);
  }, []);

  const openEducation = useCallback(() => {
    if (
      isDonationFlow ||
      welcomeOpen ||
      educationOpen ||
      wasShown(EDUCATION_KEY)
    ) {
      return false;
    }

    markShown(EDUCATION_KEY);
    setEducationOpen(true);
    return true;
  }, [isDonationFlow, welcomeOpen, educationOpen]);

  // Route changes always close overlays; no popup follows visitors between pages.
  useEffect(() => {
    setWelcomeOpen(false);
    setEducationOpen(false);
  }, [path]);

  // Welcome visitors only on the visible homepage and only once per browser.
  useEffect(() => {
    if (path !== "/" || isDonationFlow || wasShown(WELCOME_KEY)) return;

    let timer;

    const clearTimer = () => {
      if (timer) window.clearTimeout(timer);
      timer = undefined;
    };

    const scheduleWelcome = () => {
      clearTimer();
      if (document.visibilityState !== "visible" || wasShown(WELCOME_KEY)) return;

      timer = window.setTimeout(() => {
        if (document.visibilityState !== "visible" || wasShown(WELCOME_KEY)) return;
        markShown(WELCOME_KEY);
        setWelcomeOpen(true);
      }, WELCOME_DELAY);
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") scheduleWelcome();
      else clearTimer();
    };

    scheduleWelcome();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearTimer();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [path, isDonationFlow]);

  // Education popup requires engagement: time plus scroll, or an intentional
  // event from education/sponsorship content. Time alone never opens it.
  useEffect(() => {
    if (
      isDonationFlow ||
      welcomeOpen ||
      educationOpen ||
      wasShown(EDUCATION_KEY)
    ) return;

    const startedAt = Date.now();
    let engagementTimer;
    let engaged = false;

    const getScrollDepth = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return 0;
      return Math.max(0, Math.min(1, window.scrollY / scrollableHeight));
    };

    const tryOpenFromEngagement = () => {
      if (
        engaged &&
        Date.now() - startedAt >= EDUCATION_MIN_ENGAGEMENT_MS &&
        getScrollDepth() >= EDUCATION_SCROLL_THRESHOLD &&
        document.visibilityState === "visible"
      ) {
        openEducation();
      }
    };

    const handleScroll = () => {
      if (getScrollDepth() >= EDUCATION_SCROLL_THRESHOLD) {
        engaged = true;
        tryOpenFromEngagement();
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") tryOpenFromEngagement();
    };

    engagementTimer = window.setTimeout(tryOpenFromEngagement, EDUCATION_MIN_ENGAGEMENT_MS);

    const handleEducationRequest = () => {
      if (document.visibilityState === "visible") openEducation();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("gom:open-education-popup", handleEducationRequest);

    return () => {
      window.clearTimeout(engagementTimer);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("gom:open-education-popup", handleEducationRequest);
    };
  }, [path, isDonationFlow, welcomeOpen, educationOpen, openEducation]);

  if (isDonationFlow) return null;

  return (
    <>
      {welcomeOpen && (
        <WelcomePopup
          onClose={closeWelcome}
          navigate={navigate}
        />
      )}

      {educationOpen && !welcomeOpen && (
        <EducationGiftPopup
          onClose={closeEducation}
          navigate={navigate}
        />
      )}
    </>
  );
}
