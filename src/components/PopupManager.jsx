import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import WelcomePopup from "./WelcomePopup";
import EducationGiftPopup from "./EducationGiftPopup";

const WELCOME_KEY = "gom_welcome_shown";
const EDUCATION_KEY = "gom_education_popup_shown";

function wasShown(key) {
  try {
    return window.sessionStorage.getItem(key) === "true";
  } catch {
    return false;
  }
}

function markShown(key) {
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

  // Welcome first-time visitors on the homepage.
  useEffect(() => {
    if (
      path !== "/" ||
      isDonationFlow ||
      wasShown(WELCOME_KEY)
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      markShown(WELCOME_KEY);
      setWelcomeOpen(true);
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [path, isDonationFlow]);

  // Offer education support after engagement, never on the donation flow.
  useEffect(() => {
    if (
      isDonationFlow ||
      welcomeOpen ||
      educationOpen ||
      wasShown(EDUCATION_KEY)
    ) {
      return;
    }

    let opened = false;

    const tryOpen = () => {
      if (opened || wasShown(EDUCATION_KEY)) return;

      opened = true;
      markShown(EDUCATION_KEY);
      setEducationOpen(true);
    };

    const handleScroll = () => {
      const scrollable =
        document.documentElement.scrollHeight -
        window.innerHeight;

      if (scrollable <= 0) return;

      const progress = window.scrollY / scrollable;

      if (progress >= 0.65) {
        tryOpen();
      }
    };

    // Explicit support buttons can request the education popup.
    const handleEducationRequest = () => {
      tryOpen();
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener(
      "gom:open-education-popup",
      handleEducationRequest
    );

    // Also allow the prompt after 45 seconds of browsing.
    const timer = window.setTimeout(tryOpen, 45000);

    return () => {
      window.clearTimeout(timer);

      window.removeEventListener("scroll", handleScroll);

      window.removeEventListener(
        "gom:open-education-popup",
        handleEducationRequest
      );
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