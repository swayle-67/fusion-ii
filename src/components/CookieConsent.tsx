import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Info, X, Check, Settings, ChevronRight } from "lucide-react";
import { syncTrackingConsent } from "../lib/tracking";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  personalization: boolean;
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: true,
    personalization: true,
  });

  // Load cookie status upon mounting
  useEffect(() => {
    try {
      const consentCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("fusion2_cookie_consent="));

      if (!consentCookie) {
        // Show after a minor delay for smoother page entrance
        const timer = setTimeout(() => {
          setVisible(true);
        }, 1200);
        return () => clearTimeout(timer);
      } else {
        const value = consentCookie.split("=")[1];
        if (value) {
          const parsed = JSON.parse(decodeURIComponent(value)) as CookiePreferences;
          setPreferences((prev) => ({ ...prev, ...parsed }));
          // Align tracking scripts with loaded state
          syncTrackingConsent(parsed.analytics);
        }
      }
    } catch (e) {
      console.warn("Failed to check consent cookie, showing banner:", e);
      setVisible(true);
    }
  }, []);

  // Listen to open banner on demand
  useEffect(() => {
    const handleOpenBanner = () => {
      setVisible(true);
      setShowPreferences(true); // Open settings straight away for convenience
    };
    window.addEventListener("fusion_open_cookie_banner", handleOpenBanner);
    return () => {
      window.removeEventListener("fusion_open_cookie_banner", handleOpenBanner);
    };
  }, []);

  // Helper to save browser cookies safely with expiration of 365 days
  const saveConsentCookie = (prefs: CookiePreferences) => {
    try {
      const serialized = encodeURIComponent(JSON.stringify(prefs));
      const expiry = new Date();
      expiry.setTime(expiry.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 Year
      
      // Document cookie setup with secure attributes
      let cookieString = `fusion2_cookie_consent=${serialized}; expires=${expiry.toUTCString()}; path=/; SameSite=Lax`;
      if (window.location.protocol === "https:") {
        cookieString += "; Secure";
      }
      document.cookie = cookieString;

      // Trigger custom window event for real-time hook update
      window.dispatchEvent(new CustomEvent("fusion_cookie_consent_change", { detail: prefs }));

      // Align global script nodes dynamically
      syncTrackingConsent(prefs.analytics);
    } catch (e) {
      console.error("Error setting cookie:", e);
    }
    setVisible(false);
  };

  const handleAcceptAll = () => {
    const allOn = { essential: true, analytics: true, personalization: true };
    setPreferences(allOn);
    saveConsentCookie(allOn);
  };

  const handleDeclineAll = () => {
    const essentialOnly = { essential: true, analytics: false, personalization: false };
    setPreferences(essentialOnly);
    saveConsentCookie(essentialOnly);
  };

  const handleSavePreferences = () => {
    saveConsentCookie(preferences);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === "essential") return; // Essential cannot be disabled
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <div 
        id="cookie-consent-container"
        className="fixed bottom-6 right-6 left-6 md:left-auto md:max-w-md z-[9999]"
        role="region"
        aria-label="Cookie consent banner"
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-[#09090b]/95 backdrop-blur-xl border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.8)] rounded-xl overflow-hidden text-left"
        >
          {/* Header Banner Accent Line */}
          <div className="h-[2px] w-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500" />

          <div className="p-5 sm:p-6 space-y-4">
            {/* Top Row: Icon & Primary Prompt */}
            <div className="flex items-start gap-3.5">
              <div className="p-2 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 rounded-lg border border-white/[0.04] text-cyan-400 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="text-sm font-sans font-semibold text-white tracking-tight flex items-center gap-1.5">
                  Cookie Authorization Check
                </h3>
                <p className="text-xs text-[#8e8e89] leading-relaxed">
                  We leverage persistent cookies to improve your blueprint processing speed, remember admin session states, and securely manage custom AI architecture layouts.
                </p>
              </div>
              <button
                onClick={handleDeclineAll}
                className="text-[#8e8e89] hover:text-white transition-colors p-1 hover:bg-white/[0.03] rounded-md cursor-pointer"
                title="Decline Non-Essential Cookies"
                aria-label="Close and decline optional cookies"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Configurable preference sliders drawer */}
            {showPreferences && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 pt-2 pb-1 border-t border-white/[0.05]"
              >
                <h4 className="text-[11px] font-mono tracking-wider text-white/40 uppercase">Adjust cookie preferences</h4>
                
                {/* 1. Essential cookies */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-white text-[12px]">Strictly Essential</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 bg-indigo-500/15 text-indigo-400 rounded-full uppercase border border-indigo-500/10">Required</span>
                    </div>
                    <p className="text-[10px] text-[#8e8e89]">Enables core admin session tokens and navigation persistence.</p>
                  </div>
                  <div className="h-6 w-10 rounded-full bg-white/10 flex items-center p-0.5 opacity-60 cursor-not-allowed">
                    <div className="h-5 w-5 rounded-full bg-white flex items-center justify-center">
                      <Check className="w-3 h-3 text-black" />
                    </div>
                  </div>
                </div>

                {/* 2. Analytics */}
                <button
                  type="button"
                  onClick={() => togglePreference("analytics")}
                  className="w-full text-left flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.03] bg-white/[0.01] border border-white/[0.04] transition-all cursor-pointer"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-white text-[12px] block">Performance & Metrics</span>
                    <p className="text-[10px] text-[#8e8e89]">Helps us analyze anonymous traffic streams and layout loads.</p>
                  </div>
                  <div className={`h-6 w-11 rounded-full flex items-center p-0.5 transition-colors ${preferences.analytics ? "bg-cyan-500" : "bg-neutral-800"}`}>
                    <div className={`h-5 w-5 rounded-full bg-white shadow-md transform transition-transform ${preferences.analytics ? "translate-x-5" : "translate-x-0"}`} />
                  </div>
                </button>

                {/* 3. Personalization */}
                <button
                  type="button"
                  onClick={() => togglePreference("personalization")}
                  className="w-full text-left flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.03] bg-white/[0.01] border border-white/[0.04] transition-all cursor-pointer"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-white text-[12px] block">AI & Personalization</span>
                    <p className="text-[10px] text-[#8e8e89]">Caches your architectural chats, inputs, and suggested setups.</p>
                  </div>
                  <div className={`h-6 w-11 rounded-full flex items-center p-0.5 transition-colors ${preferences.personalization ? "bg-emerald-500" : "bg-neutral-800"}`}>
                    <div className={`h-5 w-5 rounded-full bg-white shadow-md transform transition-transform ${preferences.personalization ? "translate-x-5" : "translate-x-0"}`} />
                  </div>
                </button>
              </motion.div>
            )}

            {/* Footer Buttons Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
              {/* Option to manage preferences */}
              <button
                onClick={() => setShowPreferences(!showPreferences)}
                className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-[#8e8e89] hover:text-white transition-all py-1.5 px-2.5 rounded hover:bg-white/[0.03] border border-transparent hover:border-white/[0.04] cursor-pointer"
              >
                <Settings className={`w-3.5 h-3.5 ${showPreferences ? "rotate-95" : ""} transition-transform duration-300`} />
                <span>{showPreferences ? "CONCEAL PREFERENCES" : "CUSTOMIZE CONFIG"}</span>
              </button>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {showPreferences ? (
                  <button
                    onClick={handleSavePreferences}
                    className="flex-1 sm:flex-none py-1.5 px-3.5 bg-white text-black font-mono font-bold text-[11px] rounded transition-all hover:bg-white/90 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>INITIALIZE SELECTION</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleDeclineAll}
                      className="flex-1 sm:flex-none py-1.5 px-3 border border-white/[0.08] hover:bg-white/[0.02] text-[#ededea] font-mono font-bold text-[11px] rounded transition-all active:scale-[0.98] cursor-pointer"
                    >
                      ESSENTIALS ONLY
                    </button>
                    <button
                      onClick={handleAcceptAll}
                      className="flex-1 sm:flex-none py-1.5 px-3.5 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-mono font-bold text-[11px] rounded transition-all active:scale-[0.98] cursor-pointer shadow-[0_4px_12px_rgba(6,182,212,0.15)] flex items-center justify-center gap-1"
                    >
                      <span>ACCEPT ALL</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
