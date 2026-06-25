import { useState, useEffect } from "react";

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  personalization: boolean;
}

const COOKIE_NAME = "fusion2_cookie_consent=";

/**
 * Reads and decodes cookie consent parameters from the document cookie string directly.
 */
export function getCookieConsent(): CookiePreferences | null {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return null;
  }
  try {
    const consentCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(COOKIE_NAME));

    if (!consentCookie) {
      return null;
    }

    const value = consentCookie.split("=")[1];
    if (value) {
      return JSON.parse(decodeURIComponent(value)) as CookiePreferences;
    }
  } catch (e) {
    console.error("Error reading consent cookie:", e);
  }
  return null;
}

/**
 * Custom React hook to retrieve modern cookie configuration dynamically.
 * Updates in real-time upon consent event dispatch or window focus synchronizations.
 */
export function useCookieConsent() {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(() => {
    return getCookieConsent();
  });

  useEffect(() => {
    // Real-time listener for save actions from CookieConsent banner component
    const handleConsentChange = (e: Event) => {
      const customEvent = e as CustomEvent<CookiePreferences>;
      if (customEvent.detail) {
        setPreferences(customEvent.detail);
      } else {
        setPreferences(getCookieConsent());
      }
    };

    // Keep state synchronous across window focus intervals
    const checkCookieDirectly = () => {
      setPreferences(getCookieConsent());
    };

    window.addEventListener("fusion_cookie_consent_change", handleConsentChange);
    window.addEventListener("focus", checkCookieDirectly);

    return () => {
      window.removeEventListener("fusion_cookie_consent_change", handleConsentChange);
      window.removeEventListener("focus", checkCookieDirectly);
    };
  }, []);

  const hasConsented = preferences !== null;
  const isEssentialAllowed = true; // Essential cookies are always required and active
  const isPerformanceAllowed = preferences ? preferences.analytics : false;
  const isAiAllowed = preferences ? preferences.personalization : false;

  return {
    preferences,
    hasConsented,
    isEssentialAllowed,
    isPerformanceAllowed, // Performance & Metrics
    isAiAllowed,         // AI & Personalization
  };
}
