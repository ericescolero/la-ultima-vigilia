(function () {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add(reducedMotion ? "motion-reduced" : "motion-ready");

  if (reducedMotion) {
    return;
  }

  const revealSelectors = [
    ".section",
    ".section-tight",
    ".page-hero",
    ".article",
    ".archive-item",
    ".oath-item",
    ".briefing-tile",
    ".recruitment-card"
  ];

  const staggerGroups = [".archetype-grid", ".enemy-grid", ".briefing-strip", ".recruitment-grid", ".archive-grid", ".oath-grid"];

  function markReveal(element, delay) {
    if (!element || element.classList.contains("reveal")) return;
    element.classList.add("reveal");
    if (delay) {
      element.style.setProperty("--reveal-delay", `${delay}ms`);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(revealSelectors.join(",")).forEach((element) => markReveal(element, 0));

    staggerGroups.forEach((selector) => {
      document.querySelectorAll(selector).forEach((group) => {
        Array.from(group.children).forEach((child, index) => {
          markReveal(child, Math.min(index * 90, 540));
        });
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.14
      }
    );

    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

    if (window.matchMedia("(max-width: 719px)").matches) {
      window.setTimeout(() => {
        document.querySelectorAll(".archetype-grid.reveal, .archetype-grid .reveal").forEach((element) => {
          element.classList.add("is-visible");
        });
      }, 1200);
    }
  });

  let ticking = false;

  function updateParallax() {
    ticking = false;
    const hero = document.querySelector(".hero-cinematic, .page-cinematic");
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    const progress = Math.min(Math.max(-rect.top / Math.max(rect.height, 1), 0), 1);
    hero.style.setProperty("--hero-parallax", `${progress * 12}px`);
  }

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateParallax);
    },
    { passive: true }
  );

  window.addEventListener("resize", updateParallax, { passive: true });
  updateParallax();
})();
