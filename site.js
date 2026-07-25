/* Site chrome: consent, the scripts consent gates, and the hero demo.
   The editor itself is app.js and runs regardless of any of this. */
(function () {
  "use strict";

  const CONFIG = window.__TMS__ || {};
  const STORE_KEY = "tms-consent";

  /* ---------- consent ---------------------------------------------------
     Nothing that sets a cookie loads until there is a stored "accept".
     Declining is one click, same as accepting — a reject button hidden
     behind a settings pane is dark-pattern territory and, in the EEA, a
     compliance problem. */

  function stored() {
    try {
      return localStorage.getItem(STORE_KEY);
    } catch (e) {
      return null;
    }
  }

  function remember(value) {
    try {
      localStorage.setItem(STORE_KEY, value);
    } catch (e) {
      /* Private mode: the choice holds for this page view only. */
    }
  }

  function loadAnalytics() {
    if (!CONFIG.analyticsId) return;
    const tag = document.createElement("script");
    tag.async = true;
    tag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(CONFIG.analyticsId)}`;
    document.head.appendChild(tag);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", CONFIG.analyticsId, { anonymize_ip: true });
  }

  function loadAds() {
    if (!CONFIG.adsClient) return;
    if (!document.querySelector("ins.adsbygoogle")) return;

    const tag = document.createElement("script");
    tag.async = true;
    tag.crossOrigin = "anonymous";
    tag.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
      CONFIG.adsClient
    )}`;
    document.head.appendChild(tag);

    tag.addEventListener("load", () => {
      document.querySelectorAll("ins.adsbygoogle").forEach(() => {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      });
    });
  }

  function applyConsent(value) {
    if (value !== "accept") return;
    loadAnalytics();
    loadAds();
  }

  function setupConsent() {
    const banner = document.getElementById("consent");
    if (!banner) return;

    const nothingToConsentTo = !CONFIG.analyticsId && !CONFIG.adsClient;
    const choice = stored();

    if (choice) applyConsent(choice);
    // Don't ask for permission we have no use for yet.
    else if (!nothingToConsentTo) banner.hidden = false;

    banner.querySelectorAll("[data-consent]").forEach((button) => {
      button.addEventListener("click", () => {
        const value = button.getAttribute("data-consent");
        remember(value);
        banner.hidden = true;
        applyConsent(value);
      });
    });

    document.querySelectorAll("[data-consent-reopen]").forEach((link) => {
      link.addEventListener("click", () => {
        banner.hidden = false;
        banner.scrollIntoView({ block: "nearest" });
      });
    });
  }

  /* ---------- hero demo -------------------------------------------------
     Press and hold to develop the plate. Pointer events cover mouse, pen and
     touch; keyboard gets space/enter held down, which is the same gesture. */

  function setupDemo() {
    const demo = document.getElementById("demo");
    const plate = document.getElementById("demoPlate");
    const state = document.getElementById("demoState");
    if (!demo || !plate) return;

    const labels = {
      hidden: plate.getAttribute("data-hidden-label") || "",
      held: plate.getAttribute("data-held-label") || ""
    };

    function set(held) {
      plate.classList.toggle("is-held", held);
      demo.classList.toggle("is-held", held);
      plate.setAttribute("aria-pressed", String(held));
      if (state) state.textContent = held ? labels.held : labels.hidden;
    }

    set(false);

    plate.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      plate.setPointerCapture?.(event.pointerId);
      set(true);
    });

    ["pointerup", "pointercancel", "pointerleave", "lostpointercapture"].forEach((type) => {
      plate.addEventListener(type, () => set(false));
    });

    plate.addEventListener("keydown", (event) => {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        set(true);
      }
    });

    plate.addEventListener("keyup", (event) => {
      if (event.key === " " || event.key === "Enter") set(false);
    });

    plate.addEventListener("blur", () => set(false));

    // Long-press on a touch screen otherwise opens the image context menu.
    plate.addEventListener("contextmenu", (event) => event.preventDefault());
  }

  function start() {
    setupConsent();
    setupDemo();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
