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

  function setupMobileCarousels() {
    const carousels = Array.from(document.querySelectorAll(".mobile-carousel"));
    if (!carousels.length) return;

    const mobileQuery = window.matchMedia("(max-width: 720px)");
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const intervalMs = 4200;

    carousels.forEach(function (carousel) {
      const controls = carousel.nextElementSibling && carousel.nextElementSibling.matches("[data-carousel-controls]")
        ? carousel.nextElementSibling
        : null;
      if (!controls) return;

      const items = Array.from(carousel.children);
      const dotsWrap = controls.querySelector("[data-carousel-dots]");
      const prevButton = controls.querySelector("[data-carousel-prev]");
      const nextButton = controls.querySelector("[data-carousel-next]");
      if (!items.length || !dotsWrap || !prevButton || !nextButton) return;

      let activeIndex = 0;
      let autoRotateId = null;
      let scrollFrame = null;

      function getItemLeft(index) {
        const item = items[index];
        return item.offsetLeft - carousel.offsetLeft;
      }

      function scrollToIndex(index) {
        const nextIndex = (index + items.length) % items.length;
        carousel.scrollTo({
          left: getItemLeft(nextIndex),
          behavior: mobileQuery.matches ? "smooth" : "auto"
        });
        setActiveIndex(nextIndex);
      }

      function setActiveIndex(index) {
        activeIndex = index;
        Array.from(dotsWrap.children).forEach(function (dot, dotIndex) {
          const isActive = dotIndex === activeIndex;
          dot.classList.toggle("is-active", isActive);
          dot.setAttribute("aria-current", isActive ? "true" : "false");
        });
      }

      function syncActiveIndex() {
        const scrollLeft = carousel.scrollLeft;
        const nearest = items.reduce(function (best, item, index) {
          const distance = Math.abs(scrollLeft - getItemLeft(index));
          return distance < best.distance ? { index: index, distance: distance } : best;
        }, { index: activeIndex, distance: Infinity });
        setActiveIndex(nearest.index);
      }

      function stopAutoRotate() {
        if (autoRotateId) {
          window.clearInterval(autoRotateId);
          autoRotateId = null;
        }
      }

      function startAutoRotate() {
        stopAutoRotate();
        if (!mobileQuery.matches || reduceMotionQuery.matches || items.length < 2) return;

        autoRotateId = window.setInterval(function () {
          if (document.hidden) return;
          scrollToIndex(activeIndex + 1);
        }, intervalMs);
      }

      dotsWrap.innerHTML = "";
      items.forEach(function (_, index) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel-dot";
        dot.setAttribute("aria-label", "Go to slide " + (index + 1));
        dot.addEventListener("click", function () {
          scrollToIndex(index);
          startAutoRotate();
        });
        dotsWrap.appendChild(dot);
      });

      prevButton.addEventListener("click", function () {
        scrollToIndex(activeIndex - 1);
        startAutoRotate();
      });

      nextButton.addEventListener("click", function () {
        scrollToIndex(activeIndex + 1);
        startAutoRotate();
      });

      carousel.addEventListener("scroll", function () {
        if (scrollFrame) return;
        scrollFrame = window.requestAnimationFrame(function () {
          syncActiveIndex();
          scrollFrame = null;
        });
      }, { passive: true });

      carousel.addEventListener("pointerdown", stopAutoRotate);
      carousel.addEventListener("pointerup", startAutoRotate);
      carousel.addEventListener("focusin", stopAutoRotate);
      carousel.addEventListener("focusout", startAutoRotate);

      mobileQuery.addEventListener("change", startAutoRotate);
      reduceMotionQuery.addEventListener("change", startAutoRotate);
      document.addEventListener("visibilitychange", startAutoRotate);
      window.addEventListener("resize", syncActiveIndex);

      setActiveIndex(0);
      startAutoRotate();
    });
  }

  loadAnalytics(config.gaMeasurementId);
  window.addEventListener("load", setupMobileCarousels);
  window.addEventListener("load", trackLinkClicks);
})();
