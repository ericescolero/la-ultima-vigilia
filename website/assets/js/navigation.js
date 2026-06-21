(function () {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  function closeMenu(header, toggle) {
    header.classList.remove("is-mobile-menu-open");
    toggle.setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("nav-open");
    header.querySelectorAll(".nav-parent[aria-expanded]").forEach((parent) => {
      parent.setAttribute("aria-expanded", "false");
    });
  }

  function enhanceNavigation() {
    const header = document.querySelector(".site-header");
    const nav = header ? header.querySelector(".nav") : null;
    const links = nav ? nav.querySelector(".nav-links") : null;
    const menus = nav ? Array.from(nav.querySelectorAll(".nav-menu")) : [];

    if (!header || !nav || !links || nav.querySelector(".mobile-nav-toggle")) {
      return;
    }

    const toggle = document.createElement("button");
    toggle.className = "mobile-nav-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Abrir menu de navegacion");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "mobile-navigation");
    toggle.innerHTML = "<span></span><span></span><span></span>";

    links.id = links.id || "mobile-navigation";
    nav.insertBefore(toggle, links);

    menus.forEach((menu) => {
      const parent = menu.querySelector(".nav-parent");
      if (!(parent instanceof HTMLButtonElement)) return;

      parent.setAttribute("aria-expanded", "false");

      menu.addEventListener("mouseenter", () => {
        parent.setAttribute("aria-expanded", "true");
      });

      menu.addEventListener("mouseleave", () => {
        parent.setAttribute("aria-expanded", "false");
      });

      menu.addEventListener("focusin", () => {
        parent.setAttribute("aria-expanded", "true");
      });

      menu.addEventListener("focusout", (event) => {
        if (event.relatedTarget instanceof Node && menu.contains(event.relatedTarget)) return;
        parent.setAttribute("aria-expanded", "false");
      });
    });

    toggle.addEventListener("click", () => {
      const isOpen = header.classList.toggle("is-mobile-menu-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Cerrar menu de navegacion" : "Abrir menu de navegacion");
      document.documentElement.classList.toggle("nav-open", isOpen);
      menus.forEach((menu) => {
        const parent = menu.querySelector(".nav-parent");
        if (parent) parent.setAttribute("aria-expanded", String(isOpen));
      });
    });

    links.addEventListener("click", (event) => {
      const target = event.target;
      if (target instanceof HTMLAnchorElement) {
        closeMenu(header, toggle);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu(header, toggle);
      }
    });

    document.addEventListener("click", (event) => {
      if (!header.classList.contains("is-mobile-menu-open")) return;
      if (event.target instanceof Node && header.contains(event.target)) return;
      closeMenu(header, toggle);
    });
  }

  document.addEventListener("DOMContentLoaded", enhanceNavigation);
})();
