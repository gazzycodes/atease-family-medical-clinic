/* =========================================================
   AtEase Family Medical Clinic — interactions
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Data ---------- */
  // Custom inline SVG icons (24x24, currentColor, line style)
  const I = {
    chronic: '<path d="M3 13h3l2 5 4-12 2 7h2l1.5-2H22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    diabetes: '<path d="M12 3s6.5 7 6.5 11.5A6.5 6.5 0 015.5 14.5C5.5 10 12 3 12 3z" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M9.5 13.5l4.5-2.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    women: '<circle cx="12" cy="8" r="5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 13v8M9 18h6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    ibs: '<path d="M7 4a2.5 2.5 0 012.5 2.5v1a2.5 2.5 0 005 0 2.5 2.5 0 015 0v6a4.5 4.5 0 01-4.5 4.5h-1a3.5 3.5 0 01-3.5-3.5v-1a2.5 2.5 0 00-5 0 2.5 2.5 0 01-2.5-2.5v-4A2.5 2.5 0 017 4z" fill="none" stroke="currentColor" stroke-width="1.6"/>',
    thyroid: '<path d="M8 4c0 2-2 3-2 6 0 3 2.7 5 6 5s6-2 6-5c0-3-2-4-2-6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M12 9v6M9 18h6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    asthma: '<path d="M7 11a4 4 0 014-4h0a3 3 0 003-3" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M11 13v7M8 16l-1.5 4M15 14l1.5 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    arthritis: '<path d="M7 3v6l2.5 2.5L12 9V6M7 9a2 2 0 00-4 0v3a6 6 0 006 6 6 6 0 006-6V6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
    weight: '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 12l3-3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/>',
    infection: '<circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 3v3m0 12v3M3 12h3m12 0h3M6 6l2 2m8 8l2 2M18 6l-2 2M8 16l-2 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    skin: '<path d="M5 5h11l3 3v11a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 11c1.3 1.3 3.7 1.3 5 0M9 9h.01M14 9h.01" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    std: '<path d="M12 3l8 3.5v5C20 17 16.4 21 12 22 7.6 21 4 17 4 11.5v-5z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 9v4m0 3v.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    hypertension: '<path d="M12 20s-7-4.3-9-8.5C1.8 8.4 3.2 5.5 6 5.5c1.8 0 3.1 1 4 2.3 .9-1.3 2.2-2.3 4-2.3 2.8 0 4.2 2.9 3 6C19 15.7 12 20 12 20z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M5 12h2.5l1.5-2.5 2 4 1.5-2.5H19" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>',
    depression: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8.5 15c1-1.6 5-1.6 6 0" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M9 10h.01M15 10h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    anxiety: '<path d="M12 3a6.5 6.5 0 00-6.5 6.5c0 1.8 1 3.2 1 4.5v3a1.8 1.8 0 001.8 1.8h7.4a1.8 1.8 0 001.8-1.8v-3c0-1.3 1-2.7 1-4.5A6.5 6.5 0 0012 3z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M9.5 9.5c.6-.6 1.6-.6 2.2 0M12.3 9.5c.6-.6 1.6-.6 2.2 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
    acute: '<path d="M4 12h4l2-5 3 10 2-5h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  };

  const services = [
    { t: "Acute Medical Conditions", d: "Fast care for sudden illness & injury", i: "acute" },
    { t: "Chronic Conditions", d: "Ongoing management & support", i: "chronic" },
    { t: "Diabetes Mellitus", d: "Blood-sugar & lifestyle care", i: "diabetes" },
    { t: "Women's Health", d: "Wellness across every stage", i: "women" },
    { t: "Irritable Bowel Syndrome", d: "Digestive symptom relief", i: "ibs" },
    { t: "Thyroid Disorders", d: "Hormone testing & treatment", i: "thyroid" },
    { t: "Asthma", d: "Breathing & airway management", i: "asthma" },
    { t: "Arthritis", d: "Joint pain & mobility care", i: "arthritis" },
    { t: "Weight Management", d: "Sustainable, guided plans", i: "weight" },
    { t: "Infections", d: "Respiratory, ear & eye care", i: "infection" },
    { t: "Minor Skin Disorders", d: "Rashes, irritation & more", i: "skin" },
    { t: "STD Testing & Care", d: "Confidential & judgment-free", i: "std" },
    { t: "Hypertension", d: "Blood-pressure monitoring", i: "hypertension" },
    { t: "Depression", d: "Compassionate mental-health care", i: "depression" },
    { t: "Anxiety", d: "Support, screening & treatment", i: "anxiety" },
  ];

  const insurers = [
    { n: "Medicare", a: "Mc" },
    { n: "BCBS of Texas", a: "BC" },
    { n: "United Healthcare", a: "UH" },
    { n: "Medicaid", a: "Md" },
    { n: "Humana", a: "Hu" },
    { n: "Ambetter / Superior", a: "AS" },
    { n: "Multiplan", a: "MP" },
    { n: "Oscar", a: "Os" },
    { n: "Aetna", a: "Ae" },
    { n: "Amerigroup", a: "Ag" },
  ];

  /* ---------- Render services ---------- */
  const grid = document.getElementById("servicesGrid");
  if (grid) {
    grid.innerHTML = services.map(function (s, n) {
      const num = String(n + 1).padStart(2, "0");
      return (
        '<article class="scard reveal" style="transition-delay:' + (n % 5) * 45 + 'ms">' +
          '<span class="scard__num">' + num + '</span>' +
          '<span class="scard__icon"><svg viewBox="0 0 24 24" width="28" height="28">' + (I[s.i] || I.acute) + '</svg></span>' +
          '<h3 class="scard__title">' + s.t + '</h3>' +
          '<p class="scard__desc">' + s.d + '</p>' +
        '</article>'
      );
    }).join("");
  }

  /* ---------- Render insurers ---------- */
  const list = document.getElementById("insuranceList");
  if (list) {
    const check = '<span class="ins-check"><svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M9 16.2l-3.5-3.5L4 14.2 9 19l11-11-1.5-1.5z"/></svg></span>';
    list.innerHTML = insurers.map(function (o, n) {
      return (
        '<div class="ins-chip" style="transition-delay:' + (n % 5) * 45 + 'ms">' +
          '<span class="ins-mono">' + o.a + '</span>' +
          '<span class="ins-name">' + o.n + '</span>' +
          check +
        '</div>'
      );
    }).join("");
  }

  /* ---------- Nav scroll state ---------- */
  const nav = document.getElementById("nav");
  const onScroll = function () {
    if (window.scrollY > 24) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const toggle = document.getElementById("navToggle");
  const mobile = document.getElementById("navMobile");
  const closeMenu = function () {
    toggle.classList.remove("open");
    mobile.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };
  if (toggle && mobile) {
    toggle.addEventListener("click", function () {
      const open = mobile.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    mobile.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = function () { return document.querySelectorAll(".reveal"); };
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls().forEach(function (el) { io.observe(el); });
  } else {
    revealEls().forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Footer year ---------- */
  const yEl = document.getElementById("year");
  if (yEl) yEl.textContent = new Date().getFullYear();

  /* =========================================================
     ATHENAONE BOOKING INTEGRATION HOOK
     ---------------------------------------------------------
     Every booking button carries  data-athena-book.
     When AthenaOne provides the online-scheduling URL, set
     ATHENA_BOOKING_URL below and every button points to it.
     ========================================================= */
  const ATHENA_BOOKING_URL = ""; // e.g. "https://schedule.athenahealth.com/..."

  document.querySelectorAll("[data-athena-book]").forEach(function (el) {
    if (ATHENA_BOOKING_URL) {
      el.setAttribute("href", ATHENA_BOOKING_URL);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    } else {
      el.addEventListener("click", function (ev) {
        const href = el.getAttribute("href");
        if (!href || href === "#") {
          ev.preventDefault();
          smoothTo("#book");
        }
      });
    }
  });

  const note = document.getElementById("bookNote");
  if (note && !ATHENA_BOOKING_URL) {
    note.textContent = "Online scheduling is being connected. Call 214-513-0839 to book in the meantime.";
  }

  function smoothTo(sel) {
    const t = document.querySelector(sel);
    if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
  }
})();
