/**
 * Ortheon — First-touch UTM/referrer attribution capture.
 *
 * Rules:
 * - Stores attribution in localStorage on first visit only (first-touch model).
 * - Subsequent calls return the stored value unchanged.
 * - Never stores PII.
 * - All failures are non-blocking.
 */

const ATTRIBUTION_KEY = "ortheon_attribution";

function getDeviceType() {
  try {
    const ua = navigator.userAgent;
    if (/Mobi|Android/i.test(ua)) return "mobile";
    if (/Tablet|iPad/i.test(ua)) return "tablet";
    return "desktop";
  } catch {
    return "unknown";
  }
}

function getBrowser() {
  try {
    const ua = navigator.userAgent;
    if (/Edg\//i.test(ua)) return "Edge";
    if (/Firefox\/\d/i.test(ua)) return "Firefox";
    if (/Chrome\/\d/i.test(ua)) return "Chrome";
    if (/Safari\/\d/i.test(ua)) return "Safari";
    return "Other";
  } catch {
    return "unknown";
  }
}

function inferSource(referrer, utmSource) {
  if (utmSource) return utmSource;
  if (!referrer) return "direct";
  const r = referrer.toLowerCase();
  if (r.includes("tiktok.com")) return "tiktok";
  if (r.includes("instagram.com")) return "instagram";
  if (r.includes("facebook.com") || r.includes("fb.com")) return "facebook";
  if (r.includes("linkedin.com")) return "linkedin";
  return "referral";
}

/**
 * Capture UTM/referrer attribution and persist to localStorage.
 * First-touch for organic visits; always refreshes when explicit UTM params are
 * present in the URL so that a returning tester clicking a UTM link is correctly
 * attributed to that campaign rather than their prior direct session.
 *
 * @returns {Object} attribution object
 */
export function captureAttribution() {
  try {
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get("utm_source") || "";
    const referrer = document.referrer || "";

    const stored = localStorage.getItem(ATTRIBUTION_KEY);
    let existingData = null;
    try { existingData = stored ? JSON.parse(stored) : null; } catch {}

    // Return stored attribution if no UTM params in current URL (first-touch for organic)
    if (existingData && !utmSource) return existingData;

    const attribution = {
      source: inferSource(referrer, utmSource),
      medium: params.get("utm_medium") || "",
      campaign: params.get("utm_campaign") || "",
      content: params.get("utm_content") || "",
      term: params.get("utm_term") || "",
      referrer,
      landingPage: window.location.pathname + window.location.search,
      device: getDeviceType(),
      browser: getBrowser(),
      firstSeenAt: existingData?.firstSeenAt ?? new Date().toISOString(),
      lastCapturedAt: new Date().toISOString(),
    };

    localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
    return attribution;
  } catch {
    return {};
  }
}

/**
 * Return stored first-touch attribution, or empty object if not yet captured.
 *
 * @returns {Object}
 */
export function getAttribution() {
  try {
    const stored = localStorage.getItem(ATTRIBUTION_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}
