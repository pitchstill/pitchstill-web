(function () {
  const config = window.PITCHSTILL_SITE_CONFIG || {};

  function loadAnalytics(measurementId) {
    if (!measurementId) return;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };

    window.gtag("js", new Date());
    window.gtag("config", measurementId);
  }

  function trackLinkClicks() {
    if (typeof window.gtag !== "function") return;

    document.querySelectorAll(".tracked-link").forEach(function (link) {
      link.addEventListener("click", function () {
        const eventName = link.dataset.event || "outbound_click";
        window.gtag("event", eventName, {
          link_url: link.href,
          page_path: window.location.pathname
        });
      });
    });
  }

  loadAnalytics(config.gaMeasurementId);
  window.addEventListener("load", trackLinkClicks);
})();
