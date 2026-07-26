/* =========================================================
   AtEase Family Medical Clinic — interactions
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Icons (24x24, line style, currentColor) ---------- */
  const I = {
    pill: '<path d="M4.8 12.5l7.7-7.7a4.6 4.6 0 016.5 6.5l-7.7 7.7a4.6 4.6 0 01-6.5-6.5z" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M8.6 8.6l6.5 6.5" stroke="currentColor" stroke-width="1.7"/>',
    chronic: '<path d="M3 13h3l2 5 4-12 2 7h2l1.5-2H22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    infection: '<circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 3v3m0 12v3M3 12h3m12 0h3M6 6l2 2m8 8l2 2M18 6l-2 2M8 16l-2 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    asthma: '<path d="M12 4v7M9 11c0 4-1.5 7-4 7-1.2 0-2-.8-2-2 0-3 1.5-6 3-8m6 3c0 4 1.5 7 4 7 1.2 0 2-.8 2-2 0-3-1.5-6-3-8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
    ear: '<path d="M8.5 9a3.5 3.5 0 117 0c0 2-2 2.6-2 4.5a2.5 2.5 0 01-5 .2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M10.6 9.2a1.5 1.5 0 012.8.6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    droplet: '<path d="M12 3.6s6 6.4 6 10.4a6 6 0 01-12 0c0-4 6-10.4 6-10.4z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
    eye: '<path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="12" r="2.6" fill="none" stroke="currentColor" stroke-width="1.7"/>',
    skin: '<path d="M5 5h11l3 3v11a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 11c1.3 1.3 3.7 1.3 5 0M9 9h.01M14 9h.01" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    head: '<path d="M16 20v-2.2a6 6 0 10-8 0V20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M12 8.4l-1.7 2.7h2.5L11.1 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
    ibs: '<path d="M7 4a2.5 2.5 0 012.5 2.5v1a2.5 2.5 0 005 0 2.5 2.5 0 015 0v6a4.5 4.5 0 01-4.5 4.5h-1a3.5 3.5 0 01-3.5-3.5v-1a2.5 2.5 0 00-5 0 2.5 2.5 0 01-2.5-2.5v-4A2.5 2.5 0 017 4z" fill="none" stroke="currentColor" stroke-width="1.6"/>',
    weight: '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 12l3-3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/>',
    women: '<circle cx="12" cy="8" r="5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 13v8M9 18h6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    heart: '<path d="M12 20s-7-4.5-9.2-9C1.4 8.2 3 5 6.2 5c1.9 0 3.3 1.1 4.3 2.5C11.5 6.1 12.9 5 14.8 5 18 5 19.6 8.2 18.2 11c-2.2 4.5-9.2 9-9.2 9z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
    lab: '<path d="M9.5 3h5M11 3v6L6.2 16.6A2 2 0 008 19.6h8a2 2 0 001.8-3L13 9V3" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M8.5 14h7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    mind: '<path d="M12 3a6.5 6.5 0 00-6.5 6.5c0 1.8 1 3.2 1 4.5v3a1.8 1.8 0 001.8 1.8h7.4a1.8 1.8 0 001.8-1.8v-3c0-1.3 1-2.7 1-4.5A6.5 6.5 0 0012 3z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M9.5 9.5c.6-.6 1.6-.6 2.2 0M12.3 9.5c.6-.6 1.6-.6 2.2 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
  };

  /* ---------- What we treat online (virtual visits) ---------- */
  const services = [
    { t: "Medication Refills & Management", d: "Ongoing meds · no controlled substances", i: "pill" },
    { t: "Chronic Condition Follow-ups", d: "Stable blood pressure, diabetes, thyroid & more", i: "chronic" },
    { t: "Cold, Flu & COVID-19", d: "Upper-respiratory & viral symptoms", i: "infection" },
    { t: "Allergies & Sinus", d: "Seasonal allergies & sinus infections", i: "asthma" },
    { t: "Cough, Sore Throat & Ear Pain", d: "Throat & ear discomfort", i: "ear" },
    { t: "UTI Symptoms", d: "Urinary tract infections", i: "droplet" },
    { t: "Pink Eye", d: "Conjunctivitis & eye irritation", i: "eye" },
    { t: "Minor Skin Conditions", d: "Rashes, eczema, acne & insect bites", i: "skin" },
    { t: "Headaches & Migraines", d: "Relief & ongoing management", i: "head" },
    { t: "Mild GI Symptoms", d: "Heartburn, nausea, diarrhea, constipation", i: "ibs" },
    { t: "Weight Management", d: "Guided consultations", i: "weight" },
    { t: "Women's Health", d: "Menopause & hormone-therapy follow-ups", i: "women" },
    { t: "Birth Control", d: "Counseling & refills", i: "heart" },
    { t: "Lab Review & Results", d: "Understand your test results", i: "lab" },
    { t: "Mental Health", d: "Anxiety, depression, stress & insomnia", i: "mind" },
  ];

  const insurers = [
    { n: "BCBS of Texas", a: "BC" },
    { n: "United Healthcare", a: "UH" },
    { n: "Humana", a: "Hu" },
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
          '<span class="scard__icon"><svg viewBox="0 0 24 24" width="28" height="28">' + (I[s.i] || I.pill) + '</svg></span>' +
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
    note.textContent = "Online scheduling is being connected. Call 682-297-3822 to book a virtual visit in the meantime.";
  }

  function smoothTo(sel) {
    const t = document.querySelector(sel);
    if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
  }
})();
