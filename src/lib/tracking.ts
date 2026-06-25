/**
 * Security & Consent Compliant Client-side Analytics Wrapper
 * 
 * Handles dynamic, hot-swappable injection and destruction of third-party tracker scripts
 * (e.g. Google Analytics 4 or PostHog) based on the user's active Performance & Metrics choices.
 */

// Custom extension of the global Window object for GA and PostHog variables
declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    posthog?: {
      init: (key: string, config?: any) => void;
      opt_out_capturing: () => void;
      opt_in_capturing: () => void;
      [key: string]: any;
    };
  }
}

// Track references to dynamically injected DOM scripts for thorough teardown
const INJECTED_SCRIPT_IDS = {
  GA_SCRIPT_LIB: "fusion-ga-library",
  GA_SCRIPT_INLINE: "fusion-ga-inline-init",
  POSTHOG_SCRIPT: "fusion-posthog",
};

/**
 * Safely dynamic-injects a tracking library script into the page head.
 */
function injectScript(id: string, src: string, isAsync = true): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === "undefined") return resolve();
    if (document.getElementById(id)) return resolve(); // Already injected

    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = isAsync;
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);

    document.head.appendChild(script);
  });
}

/**
 * Safely executes inline script logic.
 */
function injectInlineScript(id: string, codeString: string) {
  if (typeof document === "undefined" || document.getElementById(id)) return;

  const script = document.createElement("script");
  script.id = id;
  script.text = codeString;
  document.head.appendChild(script);
}

/**
 * Completely purges injected DOM track scripts and resets associated memory/window pointers.
 */
function removeScriptAndGlobals(id: string, globalName?: string) {
  if (typeof document !== "undefined") {
    const script = document.getElementById(id);
    if (script) {
      script.remove();
    }
  }

  if (globalName && typeof window !== "undefined") {
    try {
      // @ts-ignore
      delete window[globalName];
    } catch {
      // @ts-ignore
      window[globalName] = undefined;
    }
  }
}

/**
 * Hard reset of analytics instances to maintain strict privacy after opt-out.
 */
function terminateAnalyticsServices() {
  if (typeof window === "undefined") return;

  console.log("[Analytics Engine] Opt-out detected. Disabling and tearing down performance scripts.");

  // 1. Teardown Google Analytics
  removeScriptAndGlobals(INJECTED_SCRIPT_IDS.GA_SCRIPT_LIB, "gtag");
  removeScriptAndGlobals(INJECTED_SCRIPT_IDS.GA_SCRIPT_INLINE, "dataLayer");

  // 2. Teardown & Opt Out PostHog
  if (window.posthog) {
    try {
      window.posthog.opt_out_capturing();
    } catch (e) {
      console.warn("PostHog opt-out command failed gracefully:", e);
    }
  }
  removeScriptAndGlobals(INJECTED_SCRIPT_IDS.POSTHOG_SCRIPT, "posthog");

  // Disable cookies explicitly for standard services on current domain matching
  const domainParts = window.location.hostname.split(".");
  const cookieDomains = [
    window.location.hostname,
    domainParts.length > 1 ? `.${domainParts.slice(-2).join(".")}` : "",
  ].filter(Boolean);

  // Clear analytics trackers cookies (_ga, _git, _ph etc)
  const gaCookies = ["_ga", "_gid", "_gat", "ph_"];
  gaCookies.forEach((prefix) => {
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.trim().split("=")[0];
      if (name.startsWith(prefix) || name.includes(prefix)) {
        cookieDomains.forEach((domain) => {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;${domain ? ` domain=${domain};` : ""}`;
        });
      }
    });
  });
}

/**
 * Initializes and spins up compliant analytics trackers.
 * In a real deployment, replace mock strings with actual Measurement/API keys.
 */
async function initializeAnalyticsServices(gaMeasurementId = "G-DUMMY12345", posthogApiKey = "ph_dummy_key") {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  console.log("[Analytics Engine] Opt-in confirmed. Initializing authorized analytics systems.");

  try {
    // ---- Initialize Google Analytics 4 Compliantly ----
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };

    window.gtag("js", new Date());
    // Use cookieless/anonymized modes if applicable
    window.gtag("config", gaMeasurementId, {
      anonymize_ip: true,
      allow_google_signals: false,
      cookie_domain: "auto",
    });

    // Inject external GA assets
    await injectScript(
      INJECTED_SCRIPT_IDS.GA_SCRIPT_LIB,
      `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`
    );

    // ---- Initialize PostHog tracker ----
    // PostHog requires an initial script injection followed by load setup
    await injectScript(
      INJECTED_SCRIPT_IDS.POSTHOG_SCRIPT,
      "https://us-assets.i.posthog.com/static/array.js"
    );

    if (window.posthog) {
      window.posthog.init(posthogApiKey, {
        api_host: "https://us.i.posthog.com",
        persistence: "localStorage",
        bootstrap: {
          activeFeatureFlags: [],
        },
      });
      window.posthog.opt_in_capturing();
    }
  } catch (error) {
    console.error("[Analytics Engine] Execution error during script injection:", error);
  }
}

/**
 * Orchestrator function taking an active preference profile and keeping third-party states coordinated.
 * 
 * @param allowed Whether Performance & Metrics is allowed by the user.
 * @param config Optional customization parameters.
 */
export function syncTrackingConsent(
  allowed: boolean,
  config?: { gaId?: string; posthogKey?: string }
) {
  if (allowed) {
    initializeAnalyticsServices(config?.gaId, config?.posthogKey);
  } else {
    terminateAnalyticsServices();
  }
}
