(function () {
  "use strict";

  document.documentElement.classList.add("js");
  const revealFallback = window.setTimeout(() => {
    document.documentElement.classList.remove("js");
  }, 2500);

  const body = document.body;
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  const modal = document.getElementById("prototype-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalDescription = document.getElementById("modal-description");
  const year = document.getElementById("year");
  let lastFocusedElement = null;

  const modalMessages = {
    tickets: {
      title: "The ticket journey is designed. The final seller is not yet confirmed.",
      description: "Once leadership selects the authoritative ticket destination, every Get Tickets button will follow that one trusted path and the live schedule can be connected."
    },
    trailer: {
      title: "The trailer has a high-impact home.",
      description: "This interaction is waiting for an approved 60–90 second performance video. The design is ready; the media source is the remaining decision."
    },
    "sound-demo": {
      title: "This becomes an interactive ‘how they do it’ moment.",
      description: "A future version can isolate rhythm, bass, lead and harmony with approved audio. The prototype protects the idea without pretending sample audio is real."
    },
    groups: {
      title: "Group sales gets its own confident path.",
      description: "The finished version will connect to the agreed group-sales contact, planning details and request process—without mixing it into general ticket support."
    },
    booking: {
      title: "Outside bookings stay distinct from Branson group sales.",
      description: "This path is reserved for presenters, corporate events and special engagements, with Greg Ericson’s management role represented accurately."
    },
    directions: {
      title: "Maps, parking and arrival guidance belong here.",
      description: "The venue address is confirmed. Current parking, accessibility and arrival details will be verified before the public site connects guests to directions."
    },
    media: {
      title: "A professional media room is planned.",
      description: "Approved photography, video, biography, logos and press contacts can live behind this destination once rights and current files are confirmed."
    },
    contact: {
      title: "Contact should route people correctly the first time.",
      description: "Ticket help, group sales, outside bookings, press and general questions will each reach the right destination instead of disappearing into one generic inbox."
    }
  };

  function setHeaderState() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 20);
    }
  }

  function closeMenu() {
    if (!menuToggle || !nav) return;
    menuToggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    body.classList.remove("nav-open");
  }

  function toggleMenu() {
    if (!menuToggle || !nav) return;
    const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(willOpen));
    nav.classList.toggle("is-open", willOpen);
    body.classList.toggle("nav-open", willOpen);
  }

  function openModal(type, trigger) {
    if (!modal) return;
    const message = modalMessages[type] || modalMessages.contact;
    lastFocusedElement = trigger || document.activeElement;
    modalTitle.textContent = message.title;
    modalDescription.textContent = message.description;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");
    window.setTimeout(() => {
      const closeButton = modal.querySelector(".modal__close");
      if (closeButton) closeButton.focus();
    }, 30);
  }

  function closeModal() {
    if (!modal || !modal.classList.contains("is-open")) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    body.classList.remove("modal-open");
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  function keepFocusInModal(event) {
    if (event.key !== "Tab" || !modal || !modal.classList.contains("is-open")) return;
    const focusable = Array.from(modal.querySelectorAll("button, a[href], [tabindex]:not([tabindex='-1'])"))
      .filter((element) => !element.disabled && element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function revealSections() {
    const revealItems = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries, revealObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealItems.forEach((item) => observer.observe(item));
  }

  function setActiveNavigation() {
    if (!("IntersectionObserver" in window)) return;
    const links = Array.from(document.querySelectorAll(".primary-nav a[href^='#']"));
    const sectionMap = new Map();
    links.forEach((link) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target) sectionMap.set(target, link);
    });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => link.classList.remove("is-active"));
        const activeLink = sectionMap.get(entry.target);
        if (activeLink) activeLink.classList.add("is-active");
      });
    }, { rootMargin: "-28% 0px -62% 0px", threshold: 0 });
    sectionMap.forEach((link, section) => observer.observe(section));
  }

  if (menuToggle) menuToggle.addEventListener("click", toggleMenu);

  if (nav) {
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });
  }

  document.querySelectorAll("[data-prototype]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      closeMenu();
      openModal(trigger.dataset.prototype, trigger);
    });
  });

  document.querySelectorAll("[data-modal-close]").forEach((trigger) => {
    trigger.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
      closeMenu();
    }
    keepFocusInModal(event);
  });

  window.addEventListener("scroll", setHeaderState, { passive: true });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });

  if (year) year.textContent = String(new Date().getFullYear());

  setHeaderState();
  revealSections();
  window.clearTimeout(revealFallback);
  setActiveNavigation();
})();
