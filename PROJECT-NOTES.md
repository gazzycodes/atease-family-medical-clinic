# AtEase Family Medical Clinic — Project Notes

> Living handover document. Covers hosting, DNS, SSL, deployment, and the CharmHealth
> booking integration research. Update this when anything infrastructural changes.
>
> Last updated: **26 July 2026**

---

## 1. Live infrastructure

| Layer | Provider | Detail |
|---|---|---|
| Domain registration | Network Solutions | `ateasefamilymedicalclinic.com` — registered 21 Jul 2022, renews **20 Jul 2027**, locked, WHOIS privacy on |
| DNS | **Cloudflare** (Free plan) | Nameservers `sneh.ns.cloudflare.com` / `yevgen.ns.cloudflare.com` |
| SSL / CDN | **Cloudflare** | Universal SSL — covers apex **and** `*.ateasefamilymedicalclinic.com`. Auto-renews. |
| Web hosting | Network Solutions | Premium Hosting-Unix, Linux/Apache/PHP. Origin `74.91.138.142`, web root `/htdocs/`. Renews **22 Jul 2027** |
| Email | Google Workspace | Business Standard, billed *through* Network Solutions. Renews **19 Jun 2027** |
| Staging mirror | Netlify | `ateasemedical.netlify.app` — auto-deploys from this GitHub repo |

### DNS records (managed at Cloudflare)

```
A    @      74.91.138.142    Proxied
A    www    74.91.138.142    Proxied
MX   @      smtp.google.com  (priority 1)   DNS only  ← never proxy this
```

### SSL settings

- Encryption mode: **Full** (encrypted visitor→Cloudflare *and* Cloudflare→origin)
- **Always Use HTTPS: ON** — HTTP→HTTPS redirect happens at Cloudflare's edge
- HSTS: deliberately **off**

---

## 2. Deployment — read this before changing anything

The site is plain static HTML/CSS/JS. No build step.

**GitHub is the source of truth.** Network Solutions does *not* auto-deploy — every change
must be copied to the server by hand.

### To deploy

1. Commit and push to GitHub (this repo)
2. Open the hosting **File Manager**: Network Solutions → Hosting dashboard → File Manager.
   It opens on `11fb659.netsolhost.com` and has an inline editor — that's how the files were
   originally written.
3. Edit files under `/htdocs/`
4. **Purge the Cloudflare cache** — Cloudflare → Caching → Configuration → *Purge Everything*.
   Skip this and your change may not reach visitors for days.

### Files actually deployed to `/htdocs/`

`index.html`, `styles.css`, `script.js`, `.htaccess`

`demo.gif` (11 MB) is **not** referenced by the site and is **not** deployed. Don't upload it.

### ⚠️ `.htaccess` — do NOT add an HTTPS redirect

Cloudflare already forces HTTPS at the edge. Adding an origin-side HTTP→HTTPS redirect as well
causes `ERR_TOO_MANY_REDIRECTS` and takes the site down. The origin `.htaccess` only:

- canonicalises `www` → bare domain **over https**
- sets compression, caching, charset, security headers

### Known quirks

- The File Manager's *"upload from URL"* feature does not work — the server blocks outbound
  fetches. Use the inline editor instead.
- Both the hosting panel session and the Network Solutions login expire quickly.
- `11fb659.netsolhost.com` bypasses Cloudflare — useful for testing the origin directly.

---

## 3. Account reference

| Item | Value |
|---|---|
| Network Solutions account | `52144273` |
| Hosting instance | `WN.HP.841164985` |
| SFTP host | `ftp-a5349bf4.registeredsite.com` |
| SFTP account | `ftp5019154` (password not set — set it in SFTP Account Manager if needed) |
| Cloudflare account | Gazzyjuruj@gmail.com's Account |
| Registrant email | AtEase0417@gmail.com |
| Clinic phone | **682-297-3822** |
| Clinic email | info@ateasefamilymedicalclinic.com |
| Address | 1301 Justin Rd, Ste 201 #5035, Lewisville, TX 75077 |

### Unused Network Solutions SSL certificates

Two paid certs were ordered and **never issued** — they are not needed now that Cloudflare
handles SSL. Worth asking support about a refund on the older one.

- `413177829` — Essential SSL, assigned to the domain, stuck at "In validation"
- `409493978` — Essential SSL, stuck at "Provide CSR" since Nov 2025, expires 14 Dec 2026

**Why they failed:** the DNS validation record DigiCert required was published and verified,
then **deleted from Network Solutions' own authoritative zone**. Their shared
hosting also refuses third-party certificates (no shell, no certbot, ~$60 to install a free one).
This is why the site went behind Cloudflare instead.

---

## 4. Online booking — CharmHealth

The clinic uses **CharmHealth EHR** (`ehr2.charmtracker.com`). Athena is expected to provide an
API in roughly 3 months (as of July 2026); Charm is the interim — and it does everything needed.

### The right integration path

**Use Charm's built-in Web Embed Calendar.** Free, no code, no API, no approval.

- ❌ The **Certified FHIR API** (`forms.zohopublic.com/medicalmine/...CertifiedAPIAccessRequest`)
  is **read-only** — its Appointment resource supports list/get/search only. It **cannot create
  bookings**. Wrong tool.
- 💰 The **partner REST API** (`apiehr.charmtracker.com/api/ehr/v1/`) *can* create/reschedule/
  cancel appointments, but is paid (a third-party guide cites a $1,000 setup + $250/module/year —
  **unverified**) and only needed for a fully custom booking UI.

### What each patient-facing option does

| | Web Embed | Chat Bot ($10/mo) | Patient Portal |
|---|---|---|---|
| Book new appointment | ✅ | ✅ | ✅ |
| No account needed | ✅ | ✅ | ❌ |
| Reschedule / cancel | ❌ | ✅ (SMS OTP) | ✅ |
| Pay at booking | ❌ card captured only | ✅ via Bluefin | ❌ |

**Recommended combo:** Web Embed for new bookings + Patient Portal link for existing patients.
Covers everything without the $10/mo bot.

Patient Portal URL lives at Settings → PHR Settings → **Patient Portal Embed**
(`phr.charmtracker.com/login.sas` + practice-specific ID). Available today, no prerequisites.

### Current blocker chain (as of 26 Jul 2026)

```
Provider working hours NOT SET
   └─► Online Appointments cannot be enabled
          └─► Web Embed refuses to generate code
```

Charm states it explicitly: *"Please configure your working hours under 'Provider Timings'
for enabling online appointment booking."*

**To unblock — Settings → Calendar:**

1. **Provider Timings** → Carol Kalu → Regular Working Hours → Configure Now ← *founder only*
2. **Visit Types** → create telehealth visit types (durations + cash prices)
3. **Visit Types → Visit Types For Providers** → Carol Kalu → assign them (currently none)
4. **Online Appointments** → enable, choose approval mode
   (suggested: approval required for *new patients only*)
5. **Web Embed** → generate code, enter `ateasefamilymedicalclinic.com` as the hosting website
   (the embed is domain-locked — must match exactly)

### Charm account status

| Feature | State |
|---|---|
| Charm TeleHealth | ✅ **Enabled** for Carol Kalu, licensed TX ($20/provider/mo) |
| Patient Portal Embed | ✅ Ready, unused |
| Facility timings / timezone | ✅ US/Central |
| Provider working hours | ❌ **Not set** — the blocker |
| Provider visit types | ❌ None assigned |
| Practice visit types | ⚠️ Only "Follow-up" (30 min) and "New Patient" (60 min), both **In Person** — contradicts a site selling virtual visits |
| Online Appointments | ❌ Blocked |
| Web Embed | ❌ Blocked |
| Bluefin payment gateway | ❌ **Not connected** |
| Appointment Chat Bot | ⚪ Not subscribed ($10/mo) |

### Payments

**Bluefin is the only payment gateway CharmHealth supports** — no Stripe, no Square, no PayPal.
Charm's docs: *"The Practice needs to have a Merchant Account with Bluefin."* Setup takes
**5–10 business days** (merchant underwriting in the founder's name).

Request it at Settings → Billing → Bluefin → *"No, Request for a Bluefin Account"*.

**Nothing is blocked by this.** Booking works with no payment setup at all. The founder's
existing Stripe can be used *outside* Charm (payment links on the site) but won't post back to
patient records — manual reconciliation.

Charm's own payment model is **"Send Payment Link"**: staff send a text/email with a link for a
copay, visit-type charge or fixed amount. Practice-initiated, not patient-initiated.

### Pricing / "quotations"

There is no quoting engine, and pricing cannot key off diagnosis — diagnosis is an *output* of
the visit, and medical billing prices *procedures* (CPT), not *diagnoses* (ICD-10).

What works: **flat cash price per visit type**, i.e. per reason-for-visit
("Virtual visit for UTI symptoms — $X"). Held in Charm's Fee Schedules / visit type charges,
shown at booking, flows into the invoice. The 15 conditions listed on the site should collapse
into 3–4 price tiers.

---

## 5. Compliance flags — raise with the founder / their biller

- **Good Faith Estimate (No Surprises Act)** — self-pay patients are entitled to a written
  estimate at least **3 business days** before a scheduled service. If the final bill exceeds it
  by **$400+**, the patient can open a formal dispute. The site advertising "transparent pricing"
  and cash rates is what creates this obligation. No Charm feature generates one — needs a
  documented manual process.
- **Cash rates vs insurance** — set the self-pay rate at or **below** the median contracted rate.
  Charging cash patients full sticker while accepting much less from insurers draws scrutiny.
- **Medicare** — as of 26 Jul 2026 Medicare and Medicaid were **removed** from the site's accepted
  list, which defuses this. If they are ever re-added: treating a Medicare beneficiary as self-pay
  for a covered service requires a **private written contract signed before the service**, or an
  ABN for non-covered services.
- **HIPAA** — the marketing site collects no PHI and has no forms. Keep it that way. Any booking
  widget must be Charm's own embed (covered by their BAA), never a custom form posting elsewhere.

---

## 6. Outstanding items

| Item | Owner | Priority |
|---|---|---|
| Expired card ending **9567** on the Network Solutions account — domain, hosting *and* Google Workspace all auto-renew on it | Founder | 🔴 High |
| Carol's working hours in Charm | Founder | 🔴 High — blocks booking |
| Cash prices per visit type | Founder | 🟠 Medium |
| Bluefin merchant application (5–10 business days) | Founder | 🟠 Medium — start early, blocks nothing |
| SPF + DMARC records (still absent) | Dev | 🟠 Medium |
| Confirm clinic hours ("subject to confirmation" on site) | Founder | 🟠 Medium |
| Wire up Web Embed + Patient Portal link once unblocked | Dev | — |
| Set GitHub repo back to private (made public to enable deployment) | Dev | 🟢 Low |
| Remove leftover Network Solutions placeholder files from `/htdocs/` (`uc-page.css`, `new-netsol-logo.png`, `icon-61-warning-128.png`, `netsol-favicon.ico`) | Dev | 🟢 Low |
| No favicon / Open Graph image — links preview poorly when shared | Dev | 🟢 Low |
| No analytics | Dev | 🟢 Low |

### Recommended DNS additions (add in Cloudflare)

```
TXT  @        v=spf1 include:_spf.google.com ~all
TXT  _dmarc   v=DMARC1; p=none; rua=mailto:admin@ateasefamilymedicalclinic.com
```
DKIM: generate in the Google Workspace admin console, then add the TXT record it provides.

---

## 7. Site structure

Single page, no framework, no build. Sections: `#home`, `#mission`, `#services`, `#insurance`,
`#about`, `#book`, `#contact`.

- `index.html` — structure and copy
- `styles.css` — full design system (Fraunces + Inter, loaded from Google Fonts)
- `script.js` — renders the services grid and insurer list from arrays, nav behaviour,
  scroll reveal, and the booking hook

### The booking hook

`script.js` line ~146:

```js
const ATHENA_BOOKING_URL = "";
```

While empty, every `[data-athena-book]` button scrolls to `#book` and the note there reads
*"Online scheduling is being connected. Call 682-297-3822 to book a virtual visit in the meantime."*
Graceful — safe to ship. When Charm's Web Embed is ready, replace this mechanism with the embed
rather than setting this constant.

### Remaining placeholder

- Clinic hours in the Contact section still say *"Hours subject to confirmation"*

*(The `[ Provider Name ], FNP-C` card was removed from the About section on 26 Jul 2026. The
`.provider-card` / `.about__visual` CSS remains in `styles.css` — unused but kept so the card is
easy to restore.)*
