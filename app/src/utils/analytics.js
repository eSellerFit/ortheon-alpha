const GA_DEBUG = import.meta.env.DEV;

function isGtagAvailable() {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

function cleanParams(params = {}) {
  const cleaned = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    cleaned[key] = value;
  });

  return cleaned;
}

export function trackEvent(eventName, params = {}) {
  if (!eventName) return;

  const safeParams = cleanParams({
    app_name: "ortheon",
    ...params,
  });

  if (GA_DEBUG) {
    console.log("[analytics:event]", eventName, safeParams);
  }

  if (!isGtagAvailable()) {
    return;
  }

  window.gtag("event", eventName, safeParams);
}

export function trackPageView(path, title) {
  if (!path) return;

  const safeParams = cleanParams({
    page_path: path,
    page_title: title || document.title,
    app_name: "ortheon",
  });

  if (GA_DEBUG) {
    console.log("[analytics:page_view]", safeParams);
  }

  if (!isGtagAvailable()) {
    return;
  }

  window.gtag("event", "page_view", safeParams);
}