/* =========================================================
   AtEase Family Medical Clinic — external service config
   ---------------------------------------------------------
   This is the ONLY file you need to touch when a URL from
   the Tebra EHR changes. Nothing else in the site hard-codes
   these values.

   HOW TO REFRESH TEBRA_EMBED_URL
   ------------------------------
   1. Log in to Tebra (app.kareo.com) as a practice admin.
   2. User menu -> Practice Settings -> Scheduling Widget.
   3. Click "Copy Direct Link".
   4. Paste it between the quotes below.
   5. Save, deploy, and hard-refresh the site.

   Unlike the old CharmHealth embed, the Tebra widget is NOT
   domain-locked — it renders from any host, localhost included.
   Verified rendering inside an iframe on the live domain on
   31 Aug 2026.

   NOTE: the widget will correctly show "there are no available
   appointments through online booking" until BOTH of these are
   done in Tebra:
     a) Carol's office hours are set (Calendar Settings ->
        Office Hours), and
     b) Calendar Settings -> Online Scheduling -> "Enable Online
        Scheduling" is ticked.
   Allow 24-48 h after saving for Tebra to propagate.

   MIGRATED FROM CHARMHEALTH, 31 Aug 2026.
   ========================================================= */
window.ATEASE = {

  /* Tebra Scheduling Widget — public online scheduler (no login needed).
     Leave "" to fall back to the phone number. */
  TEBRA_EMBED_URL: "https://d2oe0ra32qx05a.cloudfront.net/?practiceKey=k_1_116619",

  /* Tebra Patient Portal for this practice.
     DELIBERATELY EMPTY. The CharmHealth portal was retired at the
     founder's instruction ("remove charm for patient portal") and the
     Tebra portal is not confirmed activated yet. While this is "",
     every [data-portal-link] on the site hides itself automatically —
     there is no dead link anywhere. Paste the Tebra portal URL here to
     bring all four links back in one edit. */
  TEBRA_PORTAL_URL: "",

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
