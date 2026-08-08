/* =========================================================
   AtEase Family Medical Clinic — external service config
   ---------------------------------------------------------
   This is the ONLY file you need to touch when a URL from
   CharmHealth EHR changes. Nothing else in the site hard-codes
   these values.

   HOW TO FILL CHARM_EMBED_URL
   ---------------------------
   1. Log in to CharmHealth EHR as the practice admin.
   2. Settings -> Calendar -> Web Embed.
   3. Copy the "Embed code snippet" for "Web Embed 1".
      It looks like:  <iframe width="100%" height="1000" src="THE_URL_YOU_WANT" ...>
   4. Paste ONLY the value inside src="..." between the quotes below.
   5. Save, deploy, and hard-refresh the site.

   The embed is domain-locked in Charm to:
     ateasefamilymedicalclinic.com
     www.ateasefamilymedicalclinic.com
   It will refuse to load from any other host (including localhost),
   which is expected behaviour, not a bug.
   ========================================================= */
window.ATEASE = {

  /* CharmHealth Web Embed — public online scheduler (no login needed).
     Leave "" until pasted; the site falls back to the Patient Portal. */
  CHARM_EMBED_URL: "https://ehr.charmtracker.com/publicCal.sas?method=getCal&digest=d2007d41a47cedf558241140089795fce6346283cc7d62e04d9043c3087ea2844b5cb98c3566431f1a7bac7c7e9ad5671fd5a498e982bdad",

  /* CharmHealth Patient Portal (PHR) login for this practice.
     Existing patients: records, messages, appointments, forms. */
  CHARM_PORTAL_URL: "https://phr.charmtracker.com/login.sas?FACILITY_ID=6da761489431a97430cdda46beb00fd8d2007d41a47cedf598ee2e5ce9d5cc8ac81b440bc8a53a00",

  /* Clinic contact */
  PHONE_DISPLAY: "682-297-3822",
  PHONE_TEL: "6822973822",

  /* Missed / late-cancelled appointment fee.
     Confirmed by the practice owner 7 Aug 2026. Publishes itself on
     policies.html; set back to null to hide the amount again. */
  MISSED_APPOINTMENT_FEE: 25,

  /* Hours before an appointment that a cancellation becomes billable. */
  CANCELLATION_WINDOW_HOURS: 24
};
