import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import WelcomePopup from "./WelcomePopup";
import EducationGiftPopup from "./EducationGiftPopup";

const WELCOME_KEY = "gom_welcome_shown";
const EDUCATION_KEY = "gom_education_popup_shown";
const WELCOME_DELAY = 7000;
const memoryShown = new Set();

function wasShown(key) {
  try {
    return window.sessionStorage.getItem(key) === "true" || memoryShown.has(key);
  } catch {
    return memoryShown.has(key);
  }
}

function markShown(key) {
  memoryShown.add(key);
  try {
    window.sessionStorage.setItem(key, "true");
  } catch {
    // Popups still work if browser storage is unavailable.
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
      wasShown(EDUCATION_KEY)
    ) {
      return;
    }

    markShown(EDUCATION_KEY);
    setEducationOpen(true);
  }, [isDonationFlow, welcomeOpen]);

  // A welcome prompt should never follow a visitor onto another page.
  useEffect(() => {
    setWelcomeOpen(false);
    setEducationOpen(false);
  }, [path]);

  // Welcome visitors who remain on the homepage with the tab visible.
  // The delay restarts if they switch away before the prompt appears.
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

  // Offer education support only after genuine engagement, and only once per tab session.
  useEffect(() => {
    if (
      isDonationFlow ||
      welcomeOpen ||
      educationOpen ||
      wasShown(EDUCATION_KEY)
    ) return;

    let opened = false;
    let timer;

    const tryOpen = () => {
      if (
        opened ||
        wasShown(EDUCATION_KEY) ||
        document.visibilityState !== "visible"
      ) return;

      opened = true;
      markShown(EDUCATION_KEY);
      setEducationOpen(true);
    };

    const handleScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      if (window.scrollY / scrollable >= 0.7) tryOpen();
    };

    const handleEducationRequest = () => tryOpen();

    timer = window.setTimeout(tryOpen, 60000);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("gom:open-education-popup", handleEducationRequest);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("gom:open-education-popup", handleEducationRequest);
    };
  }, [path, isDonationFlow, welcomeOpen, educationOpen]);

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