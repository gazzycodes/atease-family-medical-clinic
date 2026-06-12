# AtEase Family Medical Clinic — Website Handover

A fast, fully responsive, single-page marketing site. No frameworks, no build step — just open `index.html` in any browser, or upload the folder to any host.

## Files
- `index.html` — page structure & content
- `styles.css` — all styling / design system
- `script.js` — interactions + the booking hook

## Connecting AthenaOne booking (the only integration step)
Every "Book" button on the site carries the attribute **`data-athena-book`** (there are several: nav, hero, insurance, about, contact, footer, and the main Book section).

When AthenaOne gives you the online-scheduling link, open `script.js`, find:

```js
const ATHENA_BOOKING_URL = "";
```

…and paste the URL between the quotes, e.g.:

```js
const ATHENA_BOOKING_URL = "https://schedule.athenahealth.com/your-clinic-id";
```

Every booking button instantly points to it (opens in a new tab). Done.

If AthenaOne instead provides an **embed widget** (an `<iframe>` or `<script>` snippet), drop it inside the `#book` section in `index.html` and you can remove the placeholder buttons there.

## Placeholders to fill in after the doctor reviews
- **Provider name & credentials** — in `index.html`, search for `[ Provider Name ], FNP-C` (and the role line just below it).
- **Hours** — in the Contact section, currently "Mon–Fri · 9:00 AM – 5:00 PM (subject to confirmation)".
- All other content (services, insurance, phone, email, address) is taken from the clinic flyer and can be edited directly in `index.html`.

## Notes
- The location map is a free Google Maps embed pointed at 541 W Main St, Ste 101, Lewisville, TX 75057.
- Fonts load from Google Fonts (Sora + Inter).
- Fully responsive: desktop, tablet, and mobile, with a slide-in mobile menu.
- Respects "reduce motion" accessibility settings.
