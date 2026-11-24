/* ==========================================================================
   PORTFOLIO — SCRIPT.JS
   Vanilla JavaScript — no frameworks, no dependencies.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ------------------------------------------------------------------
     1. SCROLL PROGRESS BAR
     ------------------------------------------------------------------ */
  const progressBar = document.getElementById("scroll-progress");

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + "%";
  }

  /* ------------------------------------------------------------------
     2. NAV — scroll shadow + active link highlighting
     ------------------------------------------------------------------ */
  const nav = document.querySelector(".nav");
  const navLinks = document.querySelectorAll(".nav__link");
  const sections = document.querySelectorAll("section[id]");

  function updateNav() {
    // Add shadow when scrolled
    nav.classList.toggle("scrolled", window.scrollY > 20);
  }

  // Active section highlighting via Intersection Observer
  const navObserverOptions = {
    root: null,
    rootMargin: "-20% 0px -75% 0px", // Triggers when section is ~20% from top
    threshold: 0,
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${id}`;
          link.classList.toggle("active", isActive);
          if (isActive) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      }
    });
  }, navObserverOptions);

  sections.forEach((section) => navObserver.observe(section));

  /* ------------------------------------------------------------------
     3. MOBILE MENU TOGGLE
     ------------------------------------------------------------------ */
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (navToggle && navMenu) {
    const setMenu = (open, returnFocus) => {
      navMenu.classList.toggle("open", open);
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("menu-open", open);
      if (!open && returnFocus) navToggle.focus();
    };

    navToggle.addEventListener("click", () => {
      setMenu(!navMenu.classList.contains("open"), false);
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll(".nav__link").forEach((link) => {
      link.addEventListener("click", () => setMenu(false, false));
    });

    // Close menu on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navMenu.classList.contains("open")) {
        setMenu(false, true);
      }
    });

    // Reset when resizing to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) setMenu(false, false);
    });
  }

  /* ------------------------------------------------------------------
     4. REVEAL-ON-SCROLL ANIMATIONS
     ------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target); // Only animate once
        }
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -60px 0px", // Trigger slightly before fully in view
      threshold: 0.15,
    },
  );

  revealElements.forEach((el, index) => {
    // Set stagger index for grouped reveals
    if (el.closest(".reveal-group")) {
      const siblings = Array.from(
        el.closest(".reveal-group").querySelectorAll(".reveal"),
      );
      el.style.setProperty("--reveal-index", siblings.indexOf(el));
    }
    revealObserver.observe(el);
  });

  /* ------------------------------------------------------------------
     5. SCROLL EVENT LISTENER (throttled)
     ------------------------------------------------------------------ */
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateProgress();
        updateNav();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  // Initial state
  updateProgress();
  updateNav();

  /* ------------------------------------------------------------------
     6. SMOOTH SCROLL for anchor links (fallback for older browsers)
     ------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });

        // Update URL without jumping
        history.pushState(null, null, targetId);
      }
    });
  });

  /* ------------------------------------------------------------------
     7. CURRENT YEAR in footer
     ------------------------------------------------------------------ */
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
