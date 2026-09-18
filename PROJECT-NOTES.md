# AtEase Family Medical Clinic — Project Notes

> Living handover document. Covers hosting, DNS, SSL, deployment and the EHR booking
> integration. Update this when anything infrastructural changes.
>
> Last updated: **18 September 2026**
>
> ⚠️ **The practice moved from CharmHealth to Tebra on 31 Aug 2026.** Sections 1-3 and 5-7
> (hosting, DNS, deployment, site structure) still apply. **Sections 4 through 4v describe
> the retired CharmHealth build** — kept for background only. For anything current, go to
> **PART TWO** at the end of this file.

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

### ✅ DEPLOYED 5 Aug 2026 — and how it was done

The whole CharmHealth booking flow, the pricing block and `policies.html` are **live**.

**Getting into the File Manager.** The direct URL `11fb659.netsolhost.com/filemanager/index.php`
returns *401 — your session has ended* even when you are logged in. It needs a fresh SSO handoff:
Network Solutions → **Hosting** (left nav) → hosting-details page → **File Manager**. That click
fires `GET https://sfam.apis.newfold.com/hcp/api/v1/filemanager`, which mints the session. It opens
a new window, but once minted the direct URL works in any tab for a while.

**Deploying files.** Do **not** hand-type into the inline editor. Use **Upload** (the dropzone
auto-uploads on drop, there is no confirm button). Tiny File Manager does **not** overwrite —
it saves alongside as `name_YYMMDDHHMMSS.ext`. So the sequence is:

1. Upload all changed files at once.
2. Rename the existing file to `name_prev_YYYYMMDD.ext.bak` (rename = 2nd icon in Actions).
3. Rename the timestamped upload to the real name.

Old versions are kept as `.bak` rather than deleted, and `.htaccess` now returns **403** for
`*.bak|orig|old|log` so they are neither publicly readable nor indexable. Verified: `403`.

Live in `/htdocs/` as of 6 Aug 2026: `.htaccess`, `clinic-config.js`, `index.html`,
`policies.html`, `script.js`, `styles.css`, `logo.png`, `favicon.ico`, `favicon-32.png`,
`apple-touch-icon.png`, `og-image.png`, plus the `.bak` rollbacks and the four leftover
Network Solutions placeholder assets.

**Verified live over HTTPS after purging the Cloudflare cache:**

- `window.ATEASE` present, embed + portal URLs set
- Clicking **Book a Visit** expands the Charm scheduler in place and it renders — all five
  services listed with durations, "Powered by CharmHealth"
- Walked the flow: service → Any Date → **Step 2 Enter Patient Details**. Stopped there
  deliberately; going further would create a real appointment request in Carol's calendar.
- `policies.html` loads, missed-appointment fee renders as *"— amount to be confirmed"*
- 4 Patient Portal links and 7 booking CTAs wired

### 🔴 Address mismatch — Charm vs everything else

The booking widget shows the facility address straight from Charm, and Charm has:

```
1301 Justin RD
201-5035
Lewisville, TX 76262      <-- wrong ZIP
```

The website, the Network Solutions registrant record and the founder's own documents all say
**75077** (`1301 Justin Rd, Ste 201 #5035, Lewisville, TX 75077-2183`). 76262 is Roanoke /
Trophy Club, not Lewisville.

**Not corrected deliberately** — a practice's address of record can flow into insurance claims and
enrolment, so the founder should confirm before it is changed. Fix at
Settings → Facility → Facility List → edit. Every patient who opens the scheduler sees this, so it
is worth doing early.

### Files actually deployed to `/htdocs/`

`index.html`, `styles.css`, `script.js`, `clinic-config.js`, `policies.html`, `.htaccess`

(Deployed 5 Aug 2026 — see above.)

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
| Clinic hours | Mon 8–5, Tue 12–5, Wed 10–6, Thu 8–6. Closed Fri/Sat/Sun |
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

### Blocker chain — COMPLETE (4 Aug 2026)

```
Provider working hours          ✅ 29 Jul 2026
   └─► Visit types + prices     ✅ 4 Aug 2026
          └─► Assigned to Carol ✅ 4 Aug 2026
                 └─► Online Appointments  ✅ 4 Aug 2026
                        └─► Web Embed     ✅ 4 Aug 2026
```

⚠️ **Gotcha found when setting the hours:** Tuesday had been entered as `12:00 am` instead of
`12:00 pm`, which would have opened Tuesday bookings from midnight. Corrected and verified.
Worth re-checking any future hours edits for the same am/pm slip.

⚠️ **Gotcha: "Show Visit Types" would not persist.** Setting the radio to *Yes* silently reverted
on reload for as long as **zero visit types were ticked** in the list that appears underneath it.
Charm exposes no validation message for this. Fix: switch to *Yes*, tick at least one visit type,
*then* Save.

### Charm booking configuration as built (4 Aug 2026)

**Settings → Calendar → Visit Types** — five telehealth types, all assigned to Carol Kalu
(the pre-existing "Remote" type was deliberately **not** assigned and is **not** exposed online):

| Visit type | Duration | Charge | Charm ID |
|---|---|---|---|
| New Patient Visit | 60 min | $99.00 | `3324387000000017001` |
| Follow-up Visit | 30 min | $65.00 | `3324387000000017003` |
| Simple Prescription Refill | 15 min | $40.00 | `3324387000000059007` |
| Annual Wellness Telehealth Consultation | 45 min | $125.00 | `3324387000000059009` |
| Weight Management Follow-up | 20 min | $60.00 | `3324387000000059011` |

**Settings → Calendar → Online Appointments** (Carol Kalu):

| Setting | Value |
|---|---|
| Enable Online Appointments | ✅ Yes |
| Show Visit Types | ✅ Yes — all five ticked |
| Show Visit Type Duration | ✅ Yes |
| Approval for Appointments | Required for **new patients only** |
| Appointment Request Notification Email | Not required (the Web Embed sends its own — see below) |
| Booking window | No sooner than **24 h** ahead, no further than **180 days** |
| Waiting list | ✅ Patients may add themselves |
| Pre-screening form | *(none — candidate for a future questionnaire)* |
| Slots shown | Mon 8:00–17:00 · Tue 12:00–17:00 · Wed 10:00–18:00 · Thu 8:00–18:00 |

**Settings → Calendar → Web Embed → "Web Embed 1":**

| Setting | Value |
|---|---|
| Facility | ATEASE FAMILY MEDICAL CLINIC |
| Show Facility Details | Yes |
| Show Providers | **No** (single-provider practice — cleaner UI) |
| Visit types exposed | All five above; **"Remote" excluded** |
| Notification email | Required → **Carol Kalu** |
| Hosting Website(s) | `ateasefamilymedicalclinic.com`, `www.ateasefamilymedicalclinic.com` |

⚠️ The embed is **domain-locked**. It will refuse to render on `localhost`, on Netlify preview
URLs, or on any host not in that list. That is expected, not a bug.

### ⚠️ The one thing a human still has to paste

The embed `src` URL could not be copied out of the browser session automatically — the assistant's
tooling blocks long query-string values as a credential-exfiltration guard. It is **not secret**
(it ends up in the public page source), it just has to be moved by hand, once:

1. Charm → **Settings → Calendar → Web Embed** → copy the *Embed code snippet*.
2. Take only the value inside `src="…"`.
3. Paste it into `clinic-config.js` → `CHARM_EMBED_URL`.
4. Deploy `clinic-config.js` and purge the Cloudflare cache.

Until that is done the site falls back to the **Patient Portal** link, which works today.

### Patient Portal URL (live, no paste needed)

```
https://phr.charmtracker.com/login.sas?FACILITY_ID=6da761489431a97430cdda46beb00fd8d2007d41a47cedf598ee2e5ce9d5cc8ac81b440bc8a53a00
```

From Charm → **Settings → PHR Settings → Patient Portal Embed**. Already wired into
`clinic-config.js` → `CHARM_PORTAL_URL`, and rendered in the nav, mobile drawer, footer,
the `#book` section and `policies.html`.

### ⚠️ Duration discrepancy — needs the founder's word

The founder's cash-price list described the New Patient visit as **30–45 minutes** and the
follow-up as **15–20 minutes**. Charm has them at **60** and **30** minutes, as Carol set them.
Because patients see Charm's durations inside the booking widget, the website copy was aligned
**to Charm** so the same page does not contradict itself. If the founder's numbers are the correct
ones, change the durations in Charm's visit types *and* in the `#pricing` block of `index.html`
together — never one without the other.

### Charm account status

| Feature | State |
|---|---|
| Charm TeleHealth | ✅ **Enabled** for Carol Kalu, licensed TX ($20/provider/mo) |
| Patient Portal Embed | ✅ Ready, unused |
| Facility timings / timezone | ✅ US/Central |
| Provider working hours | ✅ **Set** (29 Jul 2026) — Mon 8–5, Tue 12–5, Wed 10–6, Thu 8–6, Fri/Sat/Sun closed |
| Provider visit types | ✅ **5 assigned** to Carol Kalu (4 Aug 2026) |
| Practice visit types | ✅ 5 telehealth types with cash charges (see table above) |
| Online Appointments | ✅ **Enabled** — approval required for new patients only |
| Web Embed | ✅ **Generated** — domain-locked, `src` pending one manual paste |
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

### Telehealth consent forms — Charm handles this natively

**Texas requires informed consent before a telemedicine service.** It may be written or verbal,
but **it must be documented in the patient's medical record**. Physicians/NPs must also provide
the HIPAA notice of privacy practices and the Texas Medical Board complaint notice, and give
guidance on appropriate follow-up care.

**Charm has the whole mechanism built in — no development work required:**

| Where | What it does |
|---|---|
| Settings → Questionnaires → Practice Questionnaires | Form type **"Consent Form"** is a first-class type alongside Questionnaire / Pre-screening / Feedback / New Patient |
| Settings → Questionnaires → CharmHealth Library | Shared templates from other practices — **4 telehealth consent templates exist**: "Ascend Health Telehealth Consent", "Bhive Telehealth Consent", "LCpsych Telehealth Consent" (+ a copy). Can be copied and edited. |
| Settings → Charm TeleHealth → Preferences → **Consent Forms** | *"Mandate patients to fill the consent forms prior joining the telehealth session"* — hard gate before video starts |
| Settings → Charm TeleHealth → Preferences → **Custom Terms Of Service** | Show custom ToS to patients. Currently **not configured** (`TELE_TOS_CONFIGURED = false`) |
| Settings → Charm TeleHealth → Preferences → **Telehealth Disclaimer Statement** | Adds a disclaimer to the consultation summary shared with patients |
| Pre-appointment questionnaires | Consent forms can be attached at booking and completed via the patient portal before the visit; the provider is notified when submitted |

**Status — BUILT 4 Aug 2026.** Six consent forms now exist in
Settings → Questionnaires → Practice Questionnaires, all of type **Consent Form**, transcribed
from the founder's own PDFs (not from the CharmHealth Library — those are other practices' forms):

| Consent form | Built from |
|---|---|
| Telehealth Informed Consent | AtEase Telehealth_Consent_Form.pdf |
| General Consent for Treatment | AtEase General consent for treatment.pdf |
| Financial Policy Acknowledgment | AtEase Financial Policy.pdf |
| Cancellation and No-Show Policy Acknowledgment | AtEase cancellation policy.pdf |
| Authorization to Communicate | AtEase auth to communicate.pdf |
| HIPAA Notice of Privacy Practices — Acknowledgment of Receipt | AtEase HIPAA NOTICE AND BILL OF RIGHTS.pdf |
| GLP-1 Weight Management Informed Consent | AtEase GLP-1 CONSENT.pdf |

Each ends with a mandatory Yes/No acknowledgement, a mandatory **Signature** component, a
mandatory **Date**, and a printed patient name — so a signed, dated record lands in the chart.
`Authorization to Communicate` uses multi-select option questions for the reminder / lab-result /
prescription channel preferences. The HIPAA form is an *acknowledgement of receipt* rather than a
reproduction of the full notice, because the notice's effective date is still blank — it points
patients at `ateasefamilymedicalclinic.com/policies.html` for the full text.

**Settings → Questionnaires → Preferences:** configured **All Providers / All Visit Types** →
the six general forms above are shared automatically when an appointment is booked (from the EHR,
the PHR and the Web Embed calendar). Share option is **To PHR** (SMS/email sharing needs the paid
SMS add-on, which the practice has not subscribed to).

⚠️ **GLP-1 consent is deliberately NOT auto-attached.** Charm's preference model is exclusive, not
additive: switching from "All Visit Types" to "Individual Visit Type" pops a dialog that says
*"Changing the preference will delete all the previous configurations"*. Rather than lose the
baseline, the GLP-1 consent is left for Carol to send to the specific patient at the point she
prescribes — which is also the clinically correct moment to consent someone, not at booking.

**Settings → Charm TeleHealth → Preferences:** verified already enabled —
✅ *Mandate patients to fill the consent forms prior joining the telehealth session*
✅ *Mandate patients to upload their ID prior joining the telehealth session*
Video platform is **Charm Integrated Video** (browser-based, no Zoom app install for patients).
Custom Terms of Service remains unconfigured — optional, and duplicative now that the consent
forms are gated.

**Division of labour:**

- **Developer:** nothing. Do *not* put a consent form on the marketing website — it would collect
  PHI on a site with no BAA, produce no signed record in the chart, and satisfy no legal
  requirement. Consent belongs inside Charm, which is covered by their BAA.
- **Founder + her attorney or malpractice carrier:** owns the *wording*. The library templates
  are other practices' forms — a starting point, not legal advice, and not vetted for AtEase.
  Her malpractice carrier will usually review consent language for free.
- **Either of us:** the mechanical setup in Charm once the approved text exists.

**What the consent should cover** (for the attorney's checklist, not as legal advice): the nature
and limits of telehealth, that a video visit may not substitute for in-person care, technology
failure and what happens then, privacy/security and its limits, that no controlled substances are
prescribed, emergency instructions (call 911), how to obtain follow-up care, financial
responsibility, and the patient's right to withdraw consent.

---

## 4b. Cash pricing — canonical list

Published on the website (`index.html` → `#pricing`) **and** to be mirrored as Charm visit-type
charges. **If one changes, change both** — they will drift otherwise.

| Visit type | Price | Charm duration | Source range |
|---|---|---|---|
| New Patient Telehealth Visit | **$99** | 45 min | 30–45 min |
| Established Follow-up & Medication Management | **$65** | 20 min | 15–20 min |
| Simple Prescription Refill | **$40** | 15 min | — |
| Annual Wellness Telehealth Consultation | **$125** | 45 min | — |
| Weight Management Follow-up | **$60** | 20 min | — |

Durations take the **longer** end of each stated range so slots don't overrun. Charm requires a
single fixed duration per visit type — it does not accept ranges.

Site copy states prices cover the consultation only; labs, imaging, medications and referrals are
billed separately, and self-pay patients may request a Good Faith Estimate.

---

## 4c. Patient-facing documents

Source PDFs live in `consent and disclaimers/` — **gitignored**, never commit them (repo is public).

| Document | Where it goes | Status |
|---|---|---|
| Notice of Privacy Practices (HIPAA) | Website `policies.html` + Charm acknowledgement | ⚠️ **Effective date blank** |
| Financial Policy | Website `policies.html` + Charm acknowledgement | ⚠️ Fee amounts blank |
| Cancellation & No-Show Policy | Website `policies.html` + Charm acknowledgement | ⚠️ Fee amount blank |
| Telemedicine Consent | Charm only (signed) | See gaps below |
| General Consent for Treatment | Charm only (signed) | OK |
| Authorization to Communicate | Charm only (signed) | OK |
| GLP-1 Weight Management Consent | Charm only (signed), conditional | See note below |

**Split rule:** public policy text goes on the website (read-only, no PHI, no signature).
Anything requiring a signature lives in Charm, which is covered by their BAA. **Never** build a
signature or acknowledgement form on the marketing site.

### Review gaps flagged to the founder's attorney (4 Aug 2026)

Telemedicine Consent is missing:

1. **Patient-location clause** — the biggest one. Carol is licensed in **Texas only**. The consent
   should require the patient to be physically in Texas at the time of the visit and to confirm
   their location each session.
2. **Controlled substances** — the website says they won't be prescribed virtually; the consent is
   silent. Make them match.
3. Right to withdraw consent / switch to in-person.
4. Guidance on appropriate follow-up care (Texas requires this).
5. Texas Medical Board complaint notice (TMB requires it be provided).
6. Note that insurance coverage for telehealth varies by plan.
7. No effective date, version, or provider name line.

GLP-1 Consent is thorough (contraindications, side effects, compounded-medication disclosure).
Minor notes: it lists **BPC-157** in the allergy section, which suggests it was adapted from a
practice also offering peptide therapy — probably should be removed; it doesn't mention that GLP-1s
are usually **not covered by insurance** for weight loss; and there's no provider attestation line.

⚠️ Compounded GLP-1 prescribing and advertising is a live regulatory area. Decide deliberately
whether to promote it on the website — currently the site says only "Weight Management — guided
consultations", which is a safe framing.

---

---

## 4d. Why the consent forms never appeared — investigated 6 Aug 2026

The founder booked a test appointment in her husband's name and reported that *"the forms didn't
pop up for me to sign."* Four separate things were wrong. Two are fixed, two need her.

### Finding 1 — the test booking never reached Charm at all

Checked across the whole quarter: **no appointment, no appointment request, no patient record, no
notification.** The only patient in the system is the seeded `TEST0001 Dummy Patient`. So whatever
happened last night did not submit. The web-embed flow is three steps
(preference → patient details → confirm); it is easy to stop at step 2 and believe you are done.

### Finding 2 — new patients were never given a portal account ✅ FIXED

`Settings → Patient → Patient Registration → Other Customization → PHR invitation required`
was **No**. Consent forms are delivered *into the patient portal*, so a patient with no portal
account has nowhere to see them. Set to **Yes** — new patients booking online now get a portal
invite by email automatically.

### Finding 3 — every patient-portal module was switched off ✅ FIXED

`Settings → PHR Settings → Preferences → PHR Modules` had **all seven boxes unchecked**, including
**Questionnaire**. Even a patient with a portal account would have seen nothing. All seven are now
on: Clinical Summary, Visit Summary, Appointments, Billing, Questionnaire, Announcements, Messages.

⚠️ **This screen lies about saving.** The first attempt showed no toast and silently reverted on
reload. The second attempt — ticking the boxes and clicking Save in one go — produced
*"PHR Module configuration updated"* and persisted. Always reload and re-check this screen.
(Same class of bug as the `Show Visit Types` radio in §4.)

### Finding 4 — Carol cannot receive ANY Charm notification email 🔴 NOT FIXED

Her member record (`Settings → Facility → Facility Members → Carol Kalu → Edit`) has:

```
Email: info@ateasefmailymedicalclinic.com
                    ^^^^^^ "fmaily", not "family"
```

That domain does not exist, so **every notification Charm sends her bounces** — including the
appointment-request emails the Web Embed is configured to send her. This alone would explain her
seeing nothing after booking.

**Deliberately not corrected.** It is also her *login* email, and the obvious fix
(`info@ateasefamilymedicalclinic.com`) is already taken by Ifeyinwa Egwuenu, the Office Manager —
Charm will likely reject the duplicate. She needs to pick the address and Charm support may need
to move the login.

### Verified 6 Aug 2026 (post-deploy re-check)

| Setting | Reads |
|---|---|
| `NEED_INVITATION` (PHR invitation required) | ✅ `true` — persisted |
| PHR Modules | ✅ Visit Summary, Appointments, Billing, **Questionnaire**, Announcements, Messages all ON |
| PHR Modules → Clinical Summary | ❌ Will not stay on. Ticking it returns `POST updatePHRModules 200` and the success toast, but it reads OFF after reload. The other six persist from the same POST, so it is that one field specifically — likely plan-gated. Not blocking: the forms live under Questionnaire. Raise with Charm support. |

⚠️ **The PHR Modules screen needed three attempts.** Two saves returned HTTP 200 and the
"PHR Module configuration updated" toast and still reverted. Never trust the toast on this screen —
always reload and re-read the checkboxes.

### The email typo — full audit (6 Aug 2026)

`ateasefmailymedicalclinic.com` **does not resolve** (`socket.gethostbyname` → `NXDOMAIN`), so mail
to it hard-bounces. Everywhere the address appears:

| Location | Value |
|---|---|
| Carol's Charm member record / login (`USER_EMAIL`) | ❌ `info@ateasefmailymedicalclinic.com` |
| Facility record shown to patients in the Web Embed | ✅ `info@ateasefamilymedicalclinic.com` |
| Website (12 occurrences across `index.html`, `policies.html`) | ✅ correct |
| All seven Charm consent forms | ✅ correct |
| Ifeyinwa Egwuenu's member record | ✅ correct |

**One field only** — but it is the one the Web Embed notifies, so she receives nothing when a
patient books.

Fix options (founder chooses; do not guess — it is her login):
1. Create `carol@ateasefamilymedicalclinic.com` on the existing Google Workspace, then update Charm.
2. Point it at a personal address she actually reads.

`info@ateasefamilymedicalclinic.com` is **not** available — Charm already has it on Ifeyinwa's
record and will reject the duplicate. Changing a login email may need Charm support.

### When patients actually sign the forms

| Moment | What happens |
|---|---|
| During booking | Nothing — unless a **Pre-screening Form** is configured (see below) |
| Right after booking | The six consent forms are attached to the appointment and pushed to the patient's portal |
| Before the video visit | Charm **hard-blocks** joining until consent is signed and ID is uploaded (verified enabled) |

### Insurance is not collected at booking — and cannot be, on this plan

`Settings → Calendar → Appointment Fields` lists every field the booking flow can capture:
facility, patient, provider, status, date/time, visit type, resource, reason, message to patient,
patient email, patient mobile, comment. **There is no insurance field**, and Charm's own
documentation does not offer one for the web embed.

The only way to capture insurance *during* booking is a **Pre-screening Form** — and attempting to
create one returns:

> *"Pre-screening form is available only for CharmHealth PAID accounts. Please upgrade to the paid
> plan to use this feature."*

**The practice is on the CharmHealth free plan** (with paid add-ons — TeleHealth, eRx, FullScript;
July usage invoiced at $25). So today the options are:

1. **Upgrade to a paid plan** → build a pre-screening form that asks for carrier, member ID, group
   number and policy holder right inside the booking flow. Cleanest, costs money.
2. **Patient enters it in the portal** — now possible, since the portal modules are switched on.
3. **Staff collects it** before the visit. Zero cost, manual.

Related plan limit: sharing forms **By SMS/Email** (a secure link, no portal account needed)
requires the paid **SMS add-on**, which is not subscribed. That is why "To PHR" is the only
delivery route in use.

---

## 4e. Visit durations — settled 6 Aug 2026

The founder confirmed: *"It's 30-45 and 15-20."*

| Visit type | Charm books | Website shows |
|---|---|---|
| New Patient Visit | **45 min** | 30–45 minutes |
| Follow-up Visit | **20 min** | 15–20 minutes |

Charm needs a single number, so it books the **top of her range** — the visit can always finish
early, and she is never double-booked. The website shows the range she gave.

✅ Deployed and verified live 6 Aug 2026 — the pricing block reads "30–45 minutes" /
"15–20 minutes" and Charm books 45 / 20.

---

## 4f. Open questions and data errors for the founder

| Item | Detail |
|---|---|
| 🔴 **Charm login email typo** | `info@ateasefmailymedicalclinic.com` — all her Charm email bounces |
| 🔴 **Facility ZIP** | Charm facility = `1301 Justin RD, 201-5035, Lewisville, TX 76262`. 76262 is **Roanoke** — it is the ZIP from her *personal* member address (343 Falstaff Dr, Roanoke). The website and the domain registration both say **75077**. Patients see the Charm one in the booking widget. |
| 🟠 **"Cash price wrong"** | Ambiguous. Read in context it follows straight after her duration correction, so it most likely means *the durations printed beside the prices were wrong*. But the price figures themselves ($99 / $65 / $40 / $125 / $60) came from her list and should be re-confirmed before assuming. |
| 🟠 **Logo** | See §4g. |

---

## 4g. The logo — resolved 6 Aug 2026

She wrote *"Just realized you used a different logo. I like my old logo better."*

**Nothing had been changed.** The placeholder mark (dark-green arch + orange plus) was
byte-identical between the first commit (`b13c054`, 12 Jun 2026) and 6 Aug — `git log --all` shows
no logo asset was ever added or removed. She was comparing it against her own brand mark, which
this site had never carried.

She then supplied the real mark (192×140 PNG, flat white backdrop). Processing applied:

1. **Knocked out the white backdrop** with a feathered alpha (`alpha = distance-from-white`,
   then un-premultiplied against white). A plain "make white transparent" would have punched holes
   through the negative space inside the ring; a border-only flood fill would have left that space
   opaque white, which reads as a white blob on the cream palette. The feathered approach also
   removes the anti-aliasing halo.
2. **Trimmed** on an alpha threshold (a plain `getbbox()` doesn't crop, because the feather leaves
   faint non-zero pixels in the corners) → `logo.png`, 133×123.

| File | Purpose |
|---|---|
| `logo.png` | 133×123 transparent mark. Displayed at 46px, so ~2.9× — sharp on retina without upscaling |
| `favicon.ico` | 16/32/48/64 on a cream rounded chip |
| `favicon-32.png` | modern PNG favicon |
| `apple-touch-icon.png` | 180×180 |
| `og-image.png` | 1200×630 link-preview card: mark + name + phone |

Wiring: replaced the inline SVG in the nav and footer of **both** pages, swapped the data-URI
favicon for the real icon set, and added Open Graph / Twitter card tags to both pages.

⚠️ **The footer needed special handling.** Her mark's darkest circle is a deep teal that all but
vanished against the dark-green footer. `.brand--light .brand__mark` now sits it on a cream rounded
chip. Check this any time the footer colour changes.

**Still worth asking for:** the vector original (AI / EPS / SVG). 133px is comfortable for a 46px
nav mark but the OG card scales it to 260px, which is soft up close. A vector would fix that and
future-proof any print use.

---

## 4h. The "morning and evening" bug — FIXED 7 Aug 2026

The founder reported: *"It still say morning and evening instead of actual clinic hours."* She was
right, and it was the single biggest thing standing between her and seeing patients.

### What was happening

The widget was running in **request mode**, not **booking mode**:

| | Before | After |
|---|---|---|
| Heading | "**Request** Appointment in 3 Easy Steps" | "**Book** Your Appointment in 3 Easy Steps" |
| Step 1 | "Select Appointment **Preference**" | "Select Appointment **Slot**" |
| Date | Date Choice 1 / 2 / 3 (free-text) | A real week grid |
| Time | A dropdown: *Any Time / Morning / Evening* | Actual clickable times |

### Root cause

`Settings → Calendar → Web Embed → Show Providers` was **No**.

With no provider attached, Charm has nobody's calendar to read, so it silently degrades to a
"tell us roughly when suits you" request form. Charm's own docs hint at this: *"if no provider was
listed in the embed code, practice staff must manually assign one."*

**Fix:** Show Providers → **Yes**, and tick **Carol Kalu**.

### Two things to know about that switch

1. **The form changes shape.** In provider mode the Web Embed screen drops its own visit-type and
   notification fields — those now come from the provider's `Online Appointments` config instead.
2. **It silently drops the notification recipient.** `Appointment Request Notification Email` had
   been set on the Web Embed; after the switch it reverted to *Not Required* on the Online
   Appointments side. Re-set to **Required → Carol Kalu**. Always re-check this after touching
   Show Providers.

### Verified live

Slots now render against her real hours, spaced by the selected visit's duration (45 min for a
New Patient Visit):

| Day | Slots shown | Her hours |
|---|---|---|
| Sunday | none | closed ✅ |
| Monday | 08:00 → 14:45 + More | 8–5 ✅ |
| Tuesday | 12:00 → 15:45 | 12–5 ✅ |
| Wednesday | 10:00 → 16:45 | 10–6 ✅ |
| Thursday | 08:00 → 14:45 + More | 8–6 ✅ |
| Fri / Sat | none | closed ✅ |

The `Appointment Slot: 30 min` setting is **not** what drives spacing — the visit type's own
duration does. No change needed there.

---

## 4i. Values confirmed by the founder, 7 Aug 2026

| Item | Value | Where it went |
|---|---|---|
| Missed appointment fee | **$25** | `clinic-config.js`, `policies.html`, and both Charm consent forms (Cancellation + Financial Policy) |
| HIPAA notice effective date | **1 March 2023** | `policies.html` — the "to be confirmed" marker is gone |
| Clinic ZIP | **75077** | Already corrected — **she fixed the Charm facility record herself**; the booking widget now shows 75077 |

`MISSED_APPOINTMENT_FEE` is now `25`. The amount is also written into the static HTML, so it
survives even if JavaScript fails; the config still overrides it.

⚠️ `clinic-config.js` and `policies.html` are committed but **not yet uploaded** — the Network
Solutions session expired again. The booking fix needed no deploy (it was entirely Charm-side).

---

## 4j. Bluefin — approved, one step left

Bluefin approved the merchant account (**merchant # 8047397214**, email received 7 Aug). Charm's
Bluefin page still reads *Status: Submitted, Requested Jul 27 2026 by Carol Kalu* — that status
does not update itself.

**The remaining step is `Settings → Billing → Bluefin → + Bluefin Beneficiary`**, which needs four
things:

| Field | Where it comes from |
|---|---|
| Beneficiary name | Any display name, e.g. `AtEase Family Medical Clinic` |
| **Account number** | PayConex portal → **Settings → Manage Settings** |
| **API access key** | PayConex portal → **Settings → Manage Settings** |
| Facilities | tick `ATEASE FAMILY MEDICAL CLINIC` |

🔴 **The founder must do this herself.** Two of those fields are live payment credentials, and
handling those is out of scope for the assistant. She first has to complete the PayConex password
reset Bluefin emailed her (they said within 24–48 h).

Once the beneficiary exists, `Billing → Send Payment Link` and card-on-file both become usable —
that is her "payment link" item.

---

## 4k. Insurance — the card reader is the answer, and it is already paid for

**`Settings → Charm Assist → Insurance Card Reader` shows: *"Service has been enrolled on
Jul 26, 2026 by Carol Kalu."*** Zero transactions so far. She subscribed to it and never used it.

This changes the earlier §4d conclusion. We do **not** need a plan upgrade to capture insurance —
we just need the right workflow. The card reader is **staff-side OCR**: it lives at
`Patient Details → Insurance → + Insurance`, takes front/back images (JPEG/PNG, ≤5 MB each), and
an **Extract** button pulls out insured ID, group number, policy name, payer, contact details and
valid-from/to dates for staff to verify before saving.

**The workflow that closes the loop, at no extra cost:**

1. Patient books online
2. Patient gets their portal invite and signs the consent forms
3. Patient uploads a photo of the front and back of their insurance card to the portal
   (`Allow patients to share documents from PHR` is already **Yes**)
4. Staff open the chart → Insurance → Extract → verify → save

Step 3 needs telling. A portal announcement covering it has been **drafted and saved** at
`Settings → Patient → Announcements` — *"Before your visit: insurance card and forms"*. It is
**saved, not published**: publishing pushes it to every patient's portal, which is the founder's
call. One click on **Publish** when she is happy with the wording.

---

## 4l. The email conflict

The founder replied with `info@ateasefamilymedicalclinic.com` — the correct spelling. But that
address already sits on **Ifeyinwa Egwuenu's** member record, and a shared mailbox is arguably the
better fit for an office manager than for the provider.

Options, in order of preference:

1. **`carol@ateasefamilymedicalclinic.com`** — new mailbox on the existing Google Workspace. Free,
   personal to her, no conflict.
2. Move `info@` to Carol and give Ifeyinwa her own address — more disruption, since it is also
   Ifeyinwa's login.
3. Any personal address she checks daily.

Whichever she picks, changing a Charm **login** email may need Charm support.

**Interim safety net:** `Online Appointments → Members To Be Notified` can have **Ifeyinwa** ticked
alongside Carol. Her address is spelled correctly, so booking alerts would reach the clinic
immediately. Left unticked pending the founder's approval — it decides who receives patient
appointment information.


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
| ~~Carol's working hours in Charm~~ ✅ done 29 Jul 2026 | — | — |
| ~~Create 5 telehealth visit types + assign to Carol~~ ✅ done 4 Aug 2026 | — | — |
| ~~Paste the Web Embed `src` into `clinic-config.js`~~ ✅ done 5 Aug 2026 — booking is live | — | — |
| ~~Facility ZIP in Charm~~ ✅ confirmed 75077 and already corrected by the founder | — | — |
| **Carol's Charm email is misspelled `ateasefmaily...`** — she wants `info@`, but it is taken (§4l) | Founder + Charm support | 🔴 High |
| **Add the Bluefin beneficiary** — needs the PayConex account # and API key (§4j) | Founder only — payment credentials | 🔴 High |
| Publish the portal announcement about insurance cards (§4k) | Founder to approve | 🟠 Medium |
| Deploy `clinic-config.js` + `policies.html` (the $25 fee and HIPAA date) | Dev — needs NetSol login | 🟠 Medium |
| ~~Deploy the 30–45 / 15–20 duration text~~ ✅ deployed 6 Aug 2026 | — | — |
| ~~Decide how insurance is collected~~ ✅ solved — the Insurance Card Reader is already enrolled (§4k) | — | — |
| ~~Original logo file from the founder~~ ✅ received and shipped 6 Aug 2026 (§4g) | — | — |
| Vector original of the logo (AI/EPS/SVG) — the PNG is soft at large sizes | Founder | 🟢 Low |
| Confirm the cash price figures are right, or say which is wrong (§4f) | Founder | 🟠 Medium |
| Load consent forms into Charm + enable the telehealth consent gate | Dev — needs Charm unlocked | 🔴 High |
| **Missed appointment fee amount** — blank in Financial Policy, Cancellation Policy and on `policies.html` | Founder | 🟠 Deferred, agreed 4 Aug |
| **HIPAA notice effective date** — blank; `policies.html` shows a visible "to be confirmed" marker | Founder | 🟠 Fix before promoting the policies page |
| Attorney review of consent docs (see §4c gaps) | Founder | 🟠 Medium |
| ~~Cash prices per visit type~~ ✅ received and published 4 Aug 2026 | — | — |
| Bluefin merchant application (5–10 business days) | Founder | 🟠 Medium — start early, blocks nothing |
| SPF + DMARC records (still absent) | Dev | 🟠 Medium |
| ~~Confirm clinic hours~~ ✅ confirmed and published 29 Jul 2026 | — | — |
| ~~Wire up Web Embed + Patient Portal link~~ ✅ done 4 Aug 2026 | — | — |
| ~~Confirm visit durations~~ ✅ confirmed 6 Aug 2026 — Charm now books 45 / 20 (§4e) | — | — |
| Set GitHub repo back to private (made public to enable deployment) | Dev | 🟢 Low |
| Remove leftover Network Solutions placeholder files from `/htdocs/` (`uc-page.css`, `new-netsol-logo.png`, `icon-61-warning-128.png`, `netsol-favicon.ico`) | Dev | 🟢 Low |
| ~~No favicon / Open Graph image~~ ✅ done 6 Aug 2026 (§4g) | — | — |
| No analytics | Dev | 🟢 Low |

### Recommended DNS additions (add in Cloudflare)

```
TXT  @        v=spf1 include:_spf.google.com ~all
TXT  _dmarc   v=DMARC1; p=none; rua=mailto:admin@ateasefamilymedicalclinic.com
```
DKIM: generate in the Google Workspace admin console, then add the TXT record it provides.

---

## 7. Site structure

No framework, no build step. Two pages:

| File | Purpose |
|---|---|
| `index.html` | Main page — `#home`, `#mission`, `#services`, `#insurance`, `#pricing`, `#about`, `#book`, `#contact` |
| `policies.html` | Standalone policies page — `#privacy`, `#financial`, `#cancellation`, `#forms` |
| `styles.css` | Full design system (Fraunces + Inter from Google Fonts) |
| `script.js` | Services grid + insurer list from arrays, nav behaviour, scroll reveal, booking logic |
| `clinic-config.js` | **The only file with external URLs in it.** Charm embed, Charm portal, phone, missed-appointment fee |

### The booking hook (rewritten 4 Aug 2026 — Athena hook removed)

All configuration now lives in `clinic-config.js` as `window.ATEASE`. `script.js` reads it and
never hard-codes a URL.

| Attribute | Behaviour |
|---|---|
| `[data-book-cta]` | Expands the Charm scheduler inline inside `#book` |
| `[data-portal-link]` | Opens the Charm Patient Portal in a new tab |

Three-way graceful degradation, verified headlessly at 1440 / 1200 / 1100 / 900 / 420 px:

| Config state | What happens |
|---|---|
| `CHARM_EMBED_URL` set | Scheduler iframe mounts **lazily on first click**, expands in place, Close button collapses it. Re-opening does not duplicate the iframe. |
| Only `CHARM_PORTAL_URL` set | Buttons open the portal in a new tab; the note reads *"Scheduling opens in our secure CharmHealth patient portal…"* |
| Neither set | Scrolls to `#book` and shows the phone number |

The iframe is deliberately **not** in the initial HTML — it is 1000 px tall and third-party, so
mounting it on click keeps the homepage fast and avoids a third-party frame loading for every
visitor who never books.

### Deferred value scaffolding

`policies.html` renders the missed-appointment fee from
`clinic-config.js → MISSED_APPOINTMENT_FEE`:

- `null` → the page shows *"A missed appointment fee — amount to be confirmed"*
- a number (current: `25`) → the page shows *"A missed appointment fee of $25"*

Nothing else needs editing when the founder confirms the amount.

### Remaining placeholders — none

- `CHARM_EMBED_URL` — ✅ pasted 5 Aug 2026.
- HIPAA notice effective date — ✅ set to 1 March 2023 on 7 Aug 2026.
- Missed appointment fee — ✅ set to $25 on 7 Aug 2026.

There are no `to be confirmed` markers left in `policies.html` (verified: `.doc__pending` count = 0).

*(The `[ Provider Name ], FNP-C` card was removed from the About section on 26 Jul 2026. The
`.provider-card` / `.about__visual` CSS remains in `styles.css` — unused but kept so the card is
easy to restore.)*


---

## 4m. Full re-verification sweep — 8 August 2026

Everything below was read back **from the Charm server**, not from a screenshot taken right after
saving. Where the two disagree, the server wins (see the PHR Modules defect).

### Charm — confirmed good

`Settings → Calendar → Online Appointments` (`calendarSettings.do?method=fetchOnlineAppointments`):

| Setting | Server value |
|---|---|
| `ALLOW_ONLINE_BOOKING` | ✅ on |
| Show Visit Types | ✅ **Yes** (this is the one that kept reverting — it has now held for 4 days) |
| Visit types exposed | ✅ all 5 ticked — Annual Wellness (45), Follow-up (20), New Patient (45), Refill (15), Weight Mgmt (20) |
| `SHOW_VISIT_DURATION` | ✅ on |
| Approval required | ✅ **New Patients only** |
| `APP_REQUEST_MAIL` | ✅ **Required** — persisted |
| Members notified | ✅ Carol Kalu ticked · Ifeyinwa Egwuenu unticked |
| Waitlist | ✅ on |
| Slots shown | ✅ Mon 8–5, Tue 12–5, Wed 10–6, Thu 8–6 — all "Show this Slot" |
| `IS_CARD_PROCESSING_ENABLED` | ⬜ **off** — correct for now; it cannot be turned on until Bluefin has a beneficiary |

`Settings → Calendar → Web Embed → Web Embed 1`:

| Field | Value |
|---|---|
| Facility | ATEASE FAMILY MEDICAL CLINIC |
| Provider(s) | ✅ **Carol Kalu** (the morning/evening bug fix — held) |
| Hosting Website(s) | ✅ `ateasefamilymedicalclinic.com`, `www.ateasefamilymedicalclinic.com` |

`Settings → Charm TeleHealth → Preferences`:

| Field | Value |
|---|---|
| `TELE_CONSENT_FORM_PREFERENCE` | ✅ on — patients **must** complete consent forms before joining |
| `TELE_PAT_IDS_PREFERENCE` | ✅ on — patients **must** upload photo ID before joining |
| `TELEHEALTH_DISCLAIMER_CHECK` | ✅ on |
| Video platform | Charm Integrated Video (browser-based, no app install) |
| Reminders go to | ✅ All Patients (including those with a portal account) |

### Charm — still broken (vendor-side)

**PHR Modules will not save.** `messageSettings.do?method=updatePHRModules` returns HTTP 200 with a
green *"PHR Module configuration updated"* toast, but re-fetching
`messageSettings.do?method=showPatientMsgSettings` **from the server** returns every module OFF —
Clinical Summary, Appointments, Questionnaire, Messages, Visit Summary, Billing, Announcements.
A deliberate single-checkbox save reproduced it. The admin screen reads 6/7 ON right after saving
and all-OFF after navigating via `home.do` first, which means the "ON" reading is a client-side
artifact, not stored state. **This is a Charm support ticket.** It cannot be fixed from the UI.

Unknown until a real patient logs in: whether *all modules off* means the portal hides everything,
or whether an unset row falls back to Charm's default (show everything). Only the end-to-end test
booking settles it.

### Bluefin — the exact state

`Settings → Billing → Bluefin` reads:

```
Status        Submitted
Requested On  Jul 27, 2026
Requested by  Carol Kalu
```

The beneficiary list is **empty**. Bluefin approved the merchant account by email on 7 Aug, but
Charm's status field does not update itself and never will until a beneficiary row exists.
The `+ Bluefin Beneficiary` form wants the PayConex **Account number** and **API access key** —
live payment credentials, so the founder enters those herself. Everything downstream (card on file
at booking, `Billing → Send Payment Link`) is gated behind that one form.

### The email conflict — resolved by the practice

Re-read from the member records, not from a cached page:

- Ifeyinwa Egwuenu → `atease0417@gmail.com`
- Carol Kalu → `info@ateasefamilymedicalclinic.com` (correct spelling, both fields on her Edit
  Member form)

The misspelled `ateasefmailymedicalclinic.com` (NXDOMAIN — every Charm mail to it hard-bounced) is
gone from Charm. The `76262` still on Carol's member record is her **personal Roanoke home ZIP**,
which is correct and is unrelated to the facility address (75077, already fixed).

### Site — verified locally against the current commit

Rendered `index.html` and `policies.html` from the repo in a headless browser:

| Check | Result |
|---|---|
| `window.ATEASE` embed + portal URLs | ✅ both set |
| `MISSED_APPOINTMENT_FEE` / `CANCELLATION_WINDOW_HOURS` | ✅ `25` / `24` |
| Booking CTAs wired | ✅ 7 |
| Patient Portal links wired | ✅ 4 |
| Logo in nav + footer | ✅ both `<img>`, no 404 |
| Scheduler before click | ✅ hidden, **0** iframes (lazy — no third-party request on page load) |
| Scheduler after click | ✅ visible, 1 iframe, `src` set |
| Pricing durations | ✅ 30–45 min / 15–20 min (the founder's numbers) |
| `policies.html` HIPAA date | ✅ `Effective date: 1 March 2023` |
| `policies.html` missed fee | ✅ `A missed appointment fee of $25` |
| `.doc__pending` markers left | ✅ **0** |
| HTTP 4xx/5xx responses | ✅ none |
| JavaScript errors | ✅ none |

`clinic-config.js` and `policies.html` are correct **in git** but still **not uploaded** — the
Network Solutions session is unavailable. The live site therefore still reads "to be confirmed" in
both places. Nothing else is pending a deploy.

### Git

`origin/main` had two `Update site` commits pushed from the founder's machine that predated the
7 Aug value changes. Merged; conflicts in `PROJECT-NOTES.md`, `clinic-config.js` and
`policies.html` resolved in favour of the newer local content (verified afterwards: fee `25`,
HIPAA date present).


---

## 4n. "Our Team" section — built, DRAFT, not deployed (10 Aug 2026)

Carol asked for three things in one WhatsApp message:

1. Change her displayed name to **"Dr. Carol Kalu, DNP, APRN"** — she said she'd already done
   this. Confirmed: `Settings → Facility → Facility Members → Edit Member` now has
   `Prefix = Dr`, `First/Last = Carol Kalu`, `Degree = DNP, APRN`. This satisfies the Texas
   Board of Nursing requirement that APRNs identify their licensure in public materials.
2. **A "Team" page/section** on the website — the site currently has **zero** mention of her
   name anywhere (confirmed by grep across every HTML file). The `.provider-card` /
   `.about__visual` CSS left over from the removed 26 Jul provider card was reused as a
   starting point.
3. **No photo** — she was explicit about this.

**What's built:** a new `#team` section (nav link "Our Team", desktop + mobile), a text-only
card with a "CK" monogram instead of a headshot, her name/credentials, an
"Founder & Advanced Practice Registered Nurse" role line, three credential chips, and a bio
paragraph.

**The bio paragraph is a placeholder — do not deploy as-is.** It is wrapped in `[DRAFT — ...]`
and gives the shape (nursing school / degree program, years in practice, clinical focus,
philosophy of care) without inventing specifics. Nothing about her education, years of
experience, or specialty focus was fabricated — those facts aren't available from Charm or the
site, only her name/credentials/role are confirmed. The WhatsApp screenshot she sent showing a
different practice's "Our Team" layout was used only as a **style reference** (two-column card,
tone) — its text describes a different provider (Dr. Njideka Domrufus) and was not reused.

**Next step:** get Carol's real bio copy (2–4 sentences), drop it into the `[DRAFT ...]`
paragraph in `index.html`, remove the HTML comment flag at the top of the section, then deploy
with the rest of the batch.

Verified locally: nav link present desktop + mobile, section renders, no console/network errors.

---

## 4n. Insurance intake before the visit — 10 Aug 2026

**Carol's ask (via call, clarifying an earlier confused message):** insurance info must be
uploaded/entered **before staff confirms the appointment**, for both insurance and cash-pay
patients, matching standard US intake practice — verify coverage before the visit happens, not
after.

**What Charm can and cannot do:**

- The questionnaire *builder's* generic field-type list is: Question, Question with Options,
  Rating Scale, Yes/No, Label, Date, Signature, Section, Personal Details, Primary Contact Details,
  **Primary Insurance Details**, Allergies, Medications, Supplements, and several history sections.
  None of those generic building-block types is a raw file-upload widget — confirmed by inspecting
  the Component/Widget dropdown directly.

  🟢 **CORRECTED 12 Aug 2026, later same day (§4u):** that generic-toolbox fact does **not** mean
  patients can't upload a card photo — it means the file upload isn't a *separate component you'd
  drag onto a blank questionnaire*. It turns out to be **built into the "Primary Insurance Details"
  smart-field itself.** Confirmed live by actually registering PAT0003's real Patient Portal
  account, logging in as the patient, and opening the Patient Details questionnaire: the Insurance
  Details section ends with a dedicated **"Insurance Card"** block — *"Front page: Click to
  upload (Allowed file size: 10MB)"* and *"Back page: Click to upload (Allowed file size: 10MB)"* —
  live, clickable, unmistakably real. So patients filling out Patient Details **can** photograph
  and upload both sides of their insurance card themselves, no staff step required. This corrects
  every earlier statement in this document (and told to Gazzy/Carol) that no upload path exists —
  that was wrong, and the record is fixed here rather than silently edited. The Insurance Card
  Reader (§4k) is still useful as a *staff-side* OCR/extract tool for whatever the patient uploads,
  but it is no longer the only way a card photo reaches the chart.
- What Charm *can* do: a pre-built **"Patient Details"** questionnaire already existed in the
  account (Personal Details + Primary Contact Details + **Primary Insurance Details**, all
  typed fields — payer, member ID, group #, etc.). It was built but never attached to booking.

**Fix applied (Charm-side, live immediately, no deploy):** `Settings → Questionnaires →
Preferences` — added **Patient Details** to the same "All Providers / All Visit Types" list that
already sends the 6 consent forms at booking. Confirmed saved: the list now reads Authorization to
Communicate, Cancellation/No-Show, Financial Policy, General Consent, HIPAA Notice, **Patient
Details**, Telehealth Informed Consent.

**How it behaves now:** every patient who books gets a PHR invite (per the existing "To PHR" share
option — SMS/Email delivery is still the paid add-on, unchanged) and must fill Patient Details,
including the insurance section, from their portal before the visit. Cash-pay patients simply
leave the insurance fields blank — there is no separate "cash" link; it's one combined form.

**What this does *not* do automatically:** Charm does not block appointment approval on the
questionnaire being completed. For new patients (where approval is already required — see §4m),
Carol/Ifeyinwa still need to manually check the patient's Patient Details submission in the chart
before clicking Confirm. This is a process habit, not a system gate.

**Told Carol (short version):** no API needed, it's a built-in feature; there's one universal
intake form now attached to every booking, not two separate links; cash patients skip the insurance
section.

🟢 **CORRECTED §4u (12 Aug 2026):** the "Charm has no upload field" claim above was wrong — the
Insurance Details section of this exact form has a built-in "Insurance Card" front/back upload,
confirmed live. Patients *can* photograph and upload the card themselves; the Insurance Card
Reader is now a staff-side verification/extract tool for what they upload, not the only path in.

## 4o. Bluefin — now fully connected

Carol linked the PayConex account herself. `Settings → Billing → Bluefin` now shows a live
beneficiary row: **AtEase Family Medical Clinic**, Account # `120616010375`, API Access Key set.
Card-on-file and `Send Payment Link` are usable as soon as she wants to start using them.
`IS_CARD_PROCESSING_ENABLED` under Online Appointments is still **off** — that's a separate switch
for collecting a card *at booking time*; nothing needs to change there unless she wants that too.

## 4p. "Our Team" section — built, waiting on her bio

A draft `#team` section was added to `index.html` (nav link + section, name "Dr. Carol Kalu, DNP,
APRN" pulled from her actual Charm member record, no photo per her request, credential chips,
placeholder bio paragraph marked `[DRAFT ...]`). **Not deployed yet** — waiting on her real bio
copy (education, licensure, years of experience, specialties, philosophy) before this goes live.
Gazzy has asked her for this directly.

## 4q. Card processing at booking — turned on, 10 Aug 2026

Carol's decision, confirmed via Gazzy: **"patients will pay before we see them"** — every
patient, insurance included, pays the visit's listed price at the moment they book.

**Charm setting:** `Settings → Calendar → Online Appointments → Enable Card Processing`

| Field | Value |
|---|---|
| Enable Card Processing | ✅ On |
| Beneficiary | AtEase Family Medical Clinic (the Bluefin account from §4o) |
| Processing Type | **Store card on file and charge** — card is saved *and* charged immediately at booking |
| Charge Type | **Based on visit** — charges each visit type's own listed price ($99/$65/$40/$125/$60), not one flat amount |

**🔴 Reproducible Charm bug, confirmed twice:** the instant "Enable Card Processing" is checked,
Charm silently resets "Approval for Appointments" from *Required for New Patients only* back to
*Not Required* — **before Save is even clicked.** Caught this by reloading fresh, toggling the
checkbox, and re-reading the DOM immediately (no save in between): the radio visibly flips.
If anyone turns this off and back on later, or changes the beneficiary/processing type, **always
re-check the Approval radio before saving** — verified server-side afterward, not just eyeballed
the screen, because the screen and server have disagreed before (see the PHR Modules defect, §4m).

**Verified server-side after save (fresh reload, not the cached form):** `IS_CARD_PROCESSING_ENABLED`
on, `APPROVAL_REQUEST = Required for New Patients only` still correct, `APP_REQUEST_MAIL` and the
notified members unchanged, all 5 visit types and all 4 time slots unchanged.

**What this means for a patient booking now:** they can't submit a request without entering a
card; it's charged the visit's cash price immediately; approval is still required for new
patients before the appointment is confirmed on Carol's calendar. This applies uniformly —
insurance patients are charged the same way (no per-visit-type or per-payer scoping exists in
this settings screen). Carol's biller reconciles/refunds against the insurance claim afterward if
needed — that's a billing-process decision on her end, not a technical constraint.

## 4r. §4q is wrong for insurance patients — Carol pushed back, 12 Aug 2026

Carol, via WhatsApp (1:53am + 3:15am): *"We supposed to have two options. Cash pay patients will
pay for their visit before and insurance people will move on to complete their insurance
information before confirmation... It won't let patients move on unless they make a payment, but
insurance only make payment after insurance verification."* The global card gate from §4q blocks
insurance patients exactly the way she's describing — this is not new breakage, it's what "one
switch for the whole practice" always does. Gazzy asked for a thorough, one-time, complete
investigation instead of another partial fix.

**Confirmed exhaustively (multiple independent checks, live in Charm) that no per-patient-type
branching exists anywhere in Charm's online booking:**
- Visit Type edit dialog (Settings → Calendar → Visit Types → Edit): no payment field at all —
  Visit Type, Appointment Mode, Duration, Charge, Default template(s), Procedure Code, "Send
  Invoice automatically" Yes/No, Color. That's the complete field set.
- Online Appointments settings page: "Enable Card Processing" is one checkbox for the entire
  (Facility, Provider) — Beneficiary, Processing Type, Charge Type, Approval for Appointments,
  notification settings, booking-window limits, waitlist — no per-visit-type or per-payer option
  anywhere on the page.
- Live patient-facing widget (ateasefamilymedicalclinic.com → Book a Visit): straight linear flow,
  service → slot → patient info → card. No "how will you pay" branch step that could route cash
  vs. insurance differently.
- Confirmed the "New Patient Visit" step still shows "Requests from new patients are reviewed by
  our team before they are confirmed" — Approval setting is intact and working as documented in
  §4q.

**Conclusion: Charm's online-booking card gate is genuinely all-or-nothing.** It cannot be made
mandatory for cash-pay patients only while insurance patients skip it. This is a hard product
limitation, not a misconfiguration.

**The fix that doesn't require a Charm feature that doesn't exist:** Billing → Invoices has a
"Use Payment Gateway" option tied directly to the same live Bluefin/PayConex connection (§4o) —
a per-invoice, staff-triggered payment tool completely separate from the booking widget's card
gate. Recommended path: turn OFF "Enable Card Processing" on Online Appointments (removes the
gate for everyone), then for cash-pay patients staff sends a Bluefin-backed invoice right after
booking and holds confirmation/approval until it's paid; insurance patients book straight through
with no gate and pay after verification, per Carol's description. Trade-off, stated plainly to
Gazzy: this turns cash-pay collection from automatic-at-booking into a manual staff step
(send invoice → confirm paid → approve) — there's no way to keep it automatic for cash patients
only, since the automatic gate is inherently all-or-nothing.

**Not yet implemented — holding for Carol's decision.** Gazzy is asking Carol to check with her
Bluefin/PayConex contact whether a static, reusable self-serve "Pay Now" hosted payment link
exists (would let cash-pay patients pay themselves from a link on the site, cutting out per-
patient manual invoice work) — this wasn't checked because neither Gazzy nor Claude has direct
login access to Bluefin's own merchant portal, only what's reachable through Charm's connection
to it. **No live Charm settings were changed in this investigation** — card processing remains ON
exactly as configured in §4q until Carol responds.

## 4s. Card processing turned OFF, manual-invoice workflow adopted — 12 Aug 2026

Carol answered directly (WhatsApp, 6:31pm): *"Good morning, how do we turn off the payment and
just send payment link before confirming the appointment?"* — confirms the §4r recommendation.
Gazzy made the change live in Charm (Settings → Calendar → Online Appointments), confirmed via
screenshots:

| Field | Value (confirmed via screenshot) |
|---|---|
| Enable Online Appointments | ✅ On |
| Enable Card Processing | ⬜ **Off** (was On since §4q) |
| Approval for Appointments | **Not Required** ⚠️ see below |
| Appointment Request Notification Email | Required, sent to Dr. Carol Kalu |
| Booking window | ≥24 hrs advance, ≤180 days out (unchanged) |

**⚠️ Open gap, not yet fixed:** Approval for Appointments reset to **"Not Required"** — matches
the reproducible bug from §4q (toggling Enable Card Processing resets this radio), just in the
opposite direction this time. **This matters a lot for the new plan:** with Approval "Not
Required," every booking — cash-pay included — auto-confirms the instant the patient submits it,
with zero staff review step. That defeats the entire point of "hold off confirming until the
cash-pay patient's payment link comes back paid," because there is nothing left to hold — Charm
confirms it automatically before staff ever sees it.

**Fix needed:** change Approval for Appointments to **"Required for All Patients"** (not
"Required for New Patients only," the old §4q value — cash-pay-before-visit has to apply to
*every* cash-pay patient, new or returning, so every booking needs to land in the
Appointment Requests queue for staff to act on, not just new-patient ones). Settings → Calendar →
Online Appointments → Approval for Appointments → Required for All Patients → Save. **Verify
server-side after saving** (reload fresh, don't trust the on-screen state) that Card Processing
is still off and Approval didn't bounce back — same bug can trigger either direction.

**The manual-payment workflow, once Approval is fixed:**
1. Patient books (cash-pay or insurance) → lands in Calendar → Appointment Requests as pending,
   nothing is confirmed yet, no card was collected.
2. **Cash-pay patient:** staff opens Billing → Invoices, creates/opens the invoice for that
   encounter, checks **"Use Payment Gateway"** (tied to the live Bluefin/PayConex beneficiary from
   §4o), and uses **Send Invoices** to email the patient a payable link. Staff leaves the booking
   in Appointment Requests until payment shows up (Billing → Receipts / the invoice's Payment
   status), then goes to Appointment Requests and approves/confirms the visit.
2. **Insurance patient:** patient already submitted their Primary Insurance Details at booking
   (§4n questionnaire). Staff reviews the request in Appointment Requests, confirms once the
   insurance info looks complete — no payment gate, no invoice needed at this stage. Payment/copay
   is handled after eligibility verification, per Carol's own description.
3. Both paths land in the same Appointment Requests queue because Approval is required for
   everyone now — the only difference is *what* staff checks before clicking approve (payment
   received vs. insurance info complete).

**Not yet verified live:** the exact patient-facing experience of "Use Payment Gateway" +
"Send Invoices" — i.e., whether the emailed invoice actually contains a clickable pay-now link
and what it looks like to the patient. Recommend Carol send herself (or Gazzy) one test invoice
before relying on this for a real patient, the same way we've verified everything else server-side
rather than assuming the UI does what it implies.

## 4t. Real end-to-end test booking — findings, correction, and the actual payment answer, 12 Aug 2026

Gazzy applied the §4s settings live (Card Processing off, confirmed via screenshot) and personally
submitted one real booking through the public widget (browser automation couldn't reliably click
through the widget's accordion — a pre-existing, unresolved flake — so Gazzy drove that part while
Claude verified the Charm admin side). Test patient: **PAT0003 "Test ZZDeleteMe"**, email
`gazzyjuruj@gmail.com`, phone `972-555-0142` (fabricated 555 number), booked New Patient Visit for
Aug 13 2026. Everything below is read from the live server after that real booking, not assumed.

### Correction to §4s — "Use Payment Gateway" is a staff terminal, not a patient link

§4s described "Use Payment Gateway" + "Send Invoices" as emailing the patient a payable link. That
was wrong, confirmed by actually opening it: **"Use Payment Gateway" opens a staff-side card-entry
form** — Input Type dropdown offers only **Swipe / Key-in / EMV Chip Reader**. A staff member has
to have the card in hand or take the number over the phone and key it in. It is not a self-service
patient link. (No card number was entered anywhere during this check, per standing policy.)

### The actual patient journey, confirmed live

1. Patient submits the booking → lands in **Calendar → Appointment Requests** as genuinely
   pending — confirmed via screenshot walkthrough with Gazzy. Nothing auto-confirms.
2. Staff clicks **Confirm** → this single action fires three things at once, confirmed by the four
   real emails that landed in the test inbox: **Appointment Request** (sent immediately at
   submission), then together at confirmation — **Video Consult Confirmation**,
   **Questionnaire Notification**, **Patient Portal Registration**.
3. Confirming **creates the Patient record** (PAT0003 didn't exist until Confirm was clicked) but
   does **not** create an Encounter — Billing → Encounters for PAT0003 reads "Encounters not
   available" even after confirmation. A separate step (check-in, not yet identified precisely)
   still creates the encounter.
4. **This is when/how ID and insurance get filled in:** the Questionnaire Notification email links
   to the **Patient Details** questionnaire (attached to every booking since §4n) — Personal
   Details, Contact, and **Primary Insurance Details** (payer, member ID, group #, plus a built-in
   front/back Insurance Card photo upload — see the §4u correction below). Patients type this in;
   cash-pay patients leave the insurance section blank.

### The real answer to "portal self-pay vs. send a link"

Both are genuine, separate, working Charm features — confirmed two different ways.

**"Send Payment Link" — confirmed live in Carol's account**, under
`Calendar → List View → (per-appointment/bulk) More`. This is the literal feature Carol asked for
("just send payment link before confirming the appointment") — not the invoice/terminal workaround
§4s substituted for it. The List View's own filter dropdown proves it's a first-class, tracked
workflow, not a one-off action:

> Patients With Card on File · Patients With Card on File & Not Charged yet · Patients With No
> Card on File · **Patients With No Card on File and Payment Link not Sent** · **Payment Link
> Sent** · **Payment Link Sent & Payment Not Received Yet** · Payment Received/Card Charged

No portal registration or card-on-file is required for this path — staff triggers it, the patient
gets a link, Charm tracks paid/unpaid status against the appointment. This is the recommended
primary mechanism for cash-pay collection, and it directly replaces the manual-invoice workaround
in §4s.

**Patient Portal self-pay also works, once a patient is registered.** Confirmed via CharmHealth's
own documentation (cited below) and cross-checked against the live account: once a patient has a
PHR account and the practice has Bluefin connected (already true — §4o), invoices show a **"Pay" /
"Make Payment"** button inside the portal's Billing tab, and the patient can pay with a saved or
new card themselves. Testing this personally hit one wrinkle worth recording: the **first**
registration link Charm emailed came back `{"result":"failure","message":"short_url not found"}` —
looked broken. Clicking **Resend Invitation** on the patient's chart (Patient Details → PHR
Registration) generated a fresh link that resolved correctly to a real "Patient Portal Account
Activation" page — so the first link was a one-off glitch, not a systemic defect. Full registration
couldn't be completed by Claude because the same browser was simultaneously logged into Carol's
Charm **admin** account, which the portal login explicitly refuses to run alongside
("You may have logged in to accounts.charmtracker.com. Please 'logout' and then try again") — a
testing-environment conflict a real patient will never hit, since they'll never be logged into the
clinic's staff account.

**Recommendation:** use **Send Payment Link** from the Calendar as the everyday cash-pay
mechanism — no portal signup required, matches what Carol actually asked for, and Charm tracks the
paid/unpaid state for you. Patient Portal self-pay is a legitimate second option for patients who
already have (or want) a portal account, but isn't necessary for the core workflow.

Sources: [CharmHealth — Online Patient Payment](https://www.charmhealth.com/resources/billing/online-patient-payment.html),
[CharmHealth — Payment Collection from the Calendar section](https://www.charmhealth.com/resources/billing/payment-collection-from-calendar.html),
[CharmHealth — Patient Portal Billing/Invoices](https://www.charmhealth.com/resources/phr-user-guide/patient-billing.html)

### 🔴 Procedure Codes blocker — CORRECTED, only affects the invoice path, not Send Payment Link

**Zero Procedure Codes are configured in the practice** — confirmed by opening "Choose from Master
List" on an invoice (empty list) and by the Billing Setup Wizard, which reads *"Procedure Codes are
not yet added."* This blocks Charm's standard invoice screen (Billing → Invoices → +Invoice →
Use Payment Gateway) from calculating any dollar amount.

**Correction — this does NOT block Send Payment Link.** Opened the feature directly
(Calendar → List View → "•••" menu → Send Payment Link → **Payment Preference**) and it offers four
independent sources for the amount, none of which touch procedure codes:

| Source | Needs |
|---|---|
| Primary Insurance Copay (current default) | Copay on file for the patient |
| **Visit Type Charge** | Nothing extra — pulls straight from the $99/$65/$40/$125/$60 already set in Settings → Calendar → Visit Types (§4b) |
| Primary Insurance Additional PR | Patient-responsibility figure from a processed claim |
| Fixed Amount | A flat number typed right there |

**So Send Payment Link can go live today**, with zero dependency on Procedure Codes, by switching
Payment Preference from its current default (Primary Insurance Copay) to **Visit Type Charge**.
Procedure Codes only matter if the practice wants to invoice through Charm's standard Billing →
Invoices screen or eventually submit insurance claims — worth doing eventually, not a blocker for
this specific feature. (Popped the Payment Preference dialog to inspect it, then clicked Cancel and
closed the tab without sending or updating anything — no real payment link was sent to the real
patient whose row was open, Praise Kalu/PAT0002.)

**Needs Carol or Gazzy to add Procedure Codes eventually** via Settings → Billing → Procedure Codes
→ "+ Procedure Code" (Code number, Description, Charge, Category are the fields; Charge is the
dollar amount — [CharmHealth docs](https://www.charmhealth.com/resources/billing/procedure-codes.html)).
Claude still cannot reach Settings at all this session (see the gear-icon defect below) — confirmed
again this pass, so this remains something only a human with a working Charm session can do.

### 🔴 Still unresolved from this session — Charm admin "Settings" gear icon

Extensively retested (20+ approaches: coordinate and reference clicks, single/double-click, hover,
keyboard, fresh tabs). It fires **zero network requests** on click — no client-side handler even
attempts navigation. Two unrelated real JS errors are present on page load
(`Identifier 'PrescriptionHtml' has already been declared`, `photoUploadTrack is not defined`) —
possibly connected, not confirmed. **Workaround, as used throughout:** exact manual click-path
instructions given to whoever has the Charm session open (Settings → Billing → Procedure Codes, in
this case) — this is why the Procedure Codes fix above needs a human, not Claude.

### Bluefin — reconciled

Carol's 2 successful test charges ($99, $10) confirm the Bluefin/PayConex connection itself
processes real charges end-to-end — the most important piece to have working. The exact mechanism
she used to run them (Use Payment Gateway terminal vs. Send Payment Link vs. Bluefin's own
PayConex virtual terminal outside Charm) wasn't asked — doesn't change the conclusion, since all
three ultimately settle through the same beneficiary.

### Cleanup — needs a human, not Claude

**PAT0003 "Test ZZDeleteMe" and its Aug 13 2026 test appointment are still live** in Carol's
production Charm account. Claude does not permanently delete data under any circumstances, even
with explicit permission (standing policy) — so this needs Carol or Gazzy to delete it manually:
**Patients → PAT0003 Test ZZDeleteMe → open the record → delete the patient** (and the linked
appointment on Calendar, Aug 13 2026, if deleting the patient doesn't remove it automatically).

### Bottom line for Gazzy

1. **Send Payment Link** (Calendar → List View → "•••" menu) is the real, built-in answer to
   Carol's original question — confirmed live, exact click path, and confirmed it works **today**
   with no Procedure Codes needed, once Payment Preference is set to "Visit Type Charge."
2. Portal self-pay works too, as a secondary option, once patients register — the one broken link
   found was a one-off, not a pattern.
3. ID/insurance-card **photo** upload — corrected below in this same section: it *is* possible,
   built directly into the Patient Details questionnaire.
4. **Procedure Codes are not a blocker for Send Payment Link** (corrected above) — only needed for
   Charm's standard Billing → Invoices screen and for real insurance-claim submission down the
   line. Still worth Carol/a biller adding real CPT codes eventually for that reason, just not
   urgent for getting cash-pay collection working.
5. Test patient PAT0003 needs manual deletion by Carol or Gazzy.

## 4u. Send Payment Link — live end-to-end test, real send, 12 Aug 2026

Gazzy asked for a full real test before briefing Carol. Done — this is a live, real send against
PAT0003 (`gazzyjuruj@gmail.com`), not a dry run.

**Steps taken, live in Carol's account:**

1. Calendar → List View → Aug 13 → PAT0003's appointment row → "•••" menu → **Send Payment Link**.
2. Opened **Payment Preference**, switched it from the default ("Primary Insurance Copay") to
   **"Visit Type Charge."** The Payment Request field auto-filled to **$99.00** — the New Patient
   Visit's price, pulled automatically, no procedure code involved anywhere in this flow.
3. Clicked **Send Payment Link**. Confirmation screen: **1 sent successfully, 0 failed**, "Sent to
   gazzyjuruj@gmail.com, $99.00."
4. Checked the actual inbox. Real email arrived immediately, subject "Payment Request from ATEASE
   FAMILY MEDICAL CLINIC" — professional, correct clinic address/phone, correct amount. Gmail's own
   bill-detection even auto-added a "Pay bill — US$99.00" smart chip on top of it.
5. Opened the "Pay Now" link in the email (`chrm.care/...` short link → resolves to
   `ehr.charmtracker.com/payment.sas`). **Real, working, patient-facing payment page** — no portal
   login, no account of any kind required. Shows Patient Name, "Payment Requested: US$99.00",
   Description "For Appointment with Dr. Carol Kalu on Aug 13, 2026," and a card-entry form (Card
   Number, Exp, CVV, name, billing address). Footer note: *"CharmHealth does not store your card
   information"* — goes straight to Bluefin.
6. **Stopped there deliberately** — did not enter any card number or click Pay, per standing policy
   (Claude never enters payment credentials anywhere, even in a test, even with permission).

**This confirms, with certainty, not inference:**
- The amount calculates correctly from Visit Type Charge with **zero Procedure Codes** configured —
  directly observed, not assumed.
- The send mechanism works end-to-end — Charm's own success counter, not just a "should work."
- The email is real, professional, and lands normally in Gmail (not spam-flagged in this test).
- The payment page is genuinely patient-facing with **no login/portal requirement** — reachable by
  anyone with the link, which is the whole point of "send a payment link."
- The only unverified link in the chain is the final card charge itself — not tested here (policy),
  but already independently confirmed working by Carol's own 2 real Bluefin charges ($99, $10)
  reported earlier in this project.

**What was checked and is a known rough edge:** the Calendar List View "Filter by → Payment Link
Sent" status filter didn't reliably reflect the new send when checked immediately after (native
dropdown, may just need a moment or a page refresh — not re-verified further to avoid over-spending
on a cosmetic detail). The authoritative place to check payment status day-to-day is
**Calendar → Reports → Payment Collection History**, which Charm's own confirmation screen points
to directly.

### Insurance/questionnaire step — re-confirmed, not re-tested visually

Opened the actual **Questionnaire Notification** email for PAT0003 and read it directly. It lists
all 7 attached forms (Patient Details, Telehealth Consent, General Consent, Financial Policy,
Cancellation Policy, Authorization to Communicate, HIPAA Acknowledgment) and states explicitly:
register/log into the **Patient Portal** → Questionnaires section → fill and submit. **This confirms
insurance intake genuinely requires the Patient Portal — there is no separate, portal-free link for
questionnaires**, unlike Send Payment Link which needs no portal at all. These are two independent
mechanisms, not two versions of the same thing.

**Did not obtain a fresh screenshot of the blank insurance form this pass.** Completing PAT0003's
real portal registration to get one would have required logging out of the Charm admin session
this browser is also using — risking losing admin access for the rest of the session (no way to log
back in without Carol's credentials, which Claude does not have and should not enter regardless).
Declined that trade for a screenshot. The Patient Details questionnaire's actual field structure
(Personal Details, Contact Details, Primary Insurance Details: payer, member ID, group number) was
already verified directly in Charm when it was built and attached — see §4n. Nothing about that
has changed. If Gazzy wants a real screenshot of the patient-side insurance form, the clean way is
completing PAT0003's registration from a device that is **not** logged into Carol's Charm admin
account (e.g., Gazzy's phone) — happy to walk through that whenever wanted.

## 4v. Full portal registration completed, insurance-card upload discovered — 12 Aug 2026, same day

Gazzy chose the clean option above himself: signed out of the Charm admin session in the shared
browser (his own device, so trivially reversible — no credentials needed to get back in besides
what he already has), then let Claude drive the rest with one carved-out exception.

**Registration, step by step, live:**
1. Opened the resent PHR link from §4t (`chrm.care/OZW6U0E0itaG`) with admin logged out — this time
   it worked cleanly: no session conflict, straight to a real 2-step wizard.
2. Step 1, DOB Verification — entered PAT0003's DOB (`10/27/1999`). Not a credential, just an
   identity check; Claude filled this.
3. Step 2, Account Creation — Password/Confirm Password + captcha + Terms of Service. **Claude did
   not touch this step.** Creating an account / entering a password is one of the standing
   prohibited actions regardless of permission — flagged to Gazzy plainly, and he typed his own
   password directly into his own open browser tab.
4. Gazzy confirmed: account created, logged in.

**From there, Claude drove the patient-side session (pure navigation/viewing, no credentials):**
dashboard → Questionnaire (7 pending, all "New") → opened **Patient Details**. Confirmed live,
patient's own view:
- Personal Details / Contact Details pre-filled from the original booking (name, DOB, phone,
  address) — patient only has to fill gaps and add insurance, not retype everything.
- **Insurance Details** section: "Do you have insurance?" Yes/No, then Insurance Type, Plan Name,
  ID, Insurance Company Name, Valid From/Until, Policy Group/FECA Number, Copay, Deductible,
  Employer/School Name, Comments, and an **Insured Person** sub-section (relationship, name, DOB,
  gender, address — for when the subscriber isn't the patient).
- **🟢 Insurance Card upload — real, working, confirmed by screenshot:** directly below Insured
  Person, a dedicated **"Insurance Card"** block: *"Front page: Click to upload (Allowed file
  size: 10MB)"* and *"Back page: Click to upload (Allowed file size: 10MB)"*. This overturns the
  "no upload anywhere in Charm" claim repeated through §4d/§4n/§4t of this document — that claim
  was checked against the generic questionnaire-builder toolbox, not this specific built-in
  Insurance Details smart-field, which turns out to already have the upload baked in.

**Direct answer to Gazzy's question — "where do patients see insurance, another email or only
after login?":** Only after login. There is no separate insurance email and no direct link to just
the insurance section. The **Questionnaire Notification** email (one email, sent right after
Confirm) lists all 7 forms by name — including "Patient Details" — and tells the patient to log
into the Patient Portal and open Questionnaires from there. The insurance fields (and the card
upload) are inside that one Patient Details form, invisible until the patient has registered and
logged in. Cash-pay patients see the exact same form and just answer "No" to "Do you have
insurance?" and skip the rest of that section.

**Updated picture of ID/insurance intake, corrected end-to-end:**
- Insurance details (typed) + insurance card photo (uploaded) → both inside Patient Details,
  patient-portal-gated, confirmed live.
- Government ID photo → separate mechanism, not this form: `TELE_PAT_IDS_PREFERENCE` (§4) already
  hard-blocks joining the telehealth video visit until the patient uploads photo ID — verified
  enabled earlier in this project, unrelated to and independent of the Patient Details form.
- So between these two mechanisms, Charm **does** capture photographed ID and photographed
  insurance card from the patient directly — no staff manual-photo step required for either,
  contrary to what was stated earlier in this project.

**Cleanup reminder, unchanged:** PAT0003 is now a *real, registered* Patient Portal account on top
of being a live patient/appointment record — one more reason this needs deleting once testing
wraps (Carol or Gazzy, per standing policy on Claude never permanently deleting data).

---

# PART TWO — THE TEBRA ERA (31 Aug – 18 Sep 2026)

> **Everything above this line describes the CharmHealth build and is superseded.**
> Keep it for history — the consent-form research, the payment findings and the
> test-booking walkthroughs still explain *why* things are shaped the way they are —
> but Charm is gone from the site and from the practice. Start here.

---

## 8. The switch to Tebra

Carol told us on 30 Aug 2026 that she had left CharmHealth: *"I don't use charm anymore.
We can't see patients with charm. I switched to a different EHR."* Everything in §4–§4v
about Charm booking, the Charm portal, Bluefin and Send Payment Link is now dead.

### 8.1 Account facts

| | |
|---|---|
| App | `app.kareo.com` (Tebra is the rebranded Kareo) |
| Practice | `AtEase Family Medical Clinic\|1` |
| Practice key | `k_1_116619` |
| Provider | Carol Kalu, NPI 1932669348 |
| Our login | `atease0417@gmail.com` → resolves to user **Uruj Gazzy**, `gazzyjuruj@gmail.com` |
| Our role | **Office Staff — not System Administrator** |
| Tier | Engage / Patient Experience (includes the scheduling widget; no upgrade needed) |

**Carol is the only administrator and intends to stay that way.** That permanently blocks
us from Tebra Payments settings, Portal Settings, and the service-location record. Anything
in those areas has to go through her. 2FA codes go to Gazzy's Gmail because the user was
created against his address — deliberate, confirmed by Carol.

The password she originally supplied (`Group123@`) is dead; a reset was done 31 Aug 2026.

### 8.2 Is the scheduling widget included? Yes — audited 31 Aug 2026

Tebra gates the scheduling widget behind an **Engage or Patient Experience** subscription.
This account has both the Patient Experience module and a live Performance Dashboard, and
the Scheduling Widget settings page renders real embed codes rather than an upsell. **No
plan change and no add-on purchase was ever required.**

Also confirmed included at no extra cost, all of which Charm either charged for or lacked:
email + SMS + **voice** appointment reminders on a five-stage schedule; intake forms
delivered by SMS/email with **no patient portal account required**; Carol's six custom
consent forms already loaded into Patient Intake; a signed BAA under Legal Agreements.

### 8.3 THE BOOKING EMBED

```
https://d2oe0ra32qx05a.cloudfront.net/?practiceKey=k_1_116619
```

Lives in `clinic-config.js` as `TEBRA_EMBED_URL`. To refresh it: Tebra → user menu →
Practice Settings → **Scheduling Widget** → *Copy Direct Link*.

That page also offers a **Widget snippet** — a script that floats a booking bubble in the
corner instead of embedding inline. We use the direct link; Carol was told the other exists.

**Unlike Charm's embed, this is not domain-locked.** It renders from any host, localhost
included. Proven by injecting it as an iframe on the live domain and screenshotting it.

**It is white-label.** The direct link serves a bare booking panel — no Tebra branding, no
marketplace, no navigation away. It is *not* the Care Connect directory page. (Her public
Care Connect profile at `tebra.com/care/provider/carol-kalu-1932669348` is a separate thing
that does list competing specialties, but patients arriving from her site never see it.)

### 8.4 Practice scheduling URL — permanent, has a suffix

```
https://practice.kareo.com/ateasefamilymedicalclinic-1
```

Carol enabled online scheduling herself on 2 Sep after saying *"use all lowercases to match
the website"*. **Tebra appended the `-1` on its own** — same convention as her provider URL
`dr-carol-kalu-2`. It cannot be edited, ever. It does not exactly match her domain and she
may not have noticed. Nothing is broken by it: the website embed does not use this URL, it
only powers the standalone page for Google and print.

### 8.5 The empty-calendar saga — resolved

From 31 Aug to early Sep the widget reported *"Currently, there are no available
appointments through online booking."* Two weeks of diagnosis:

- **It was never the website.** Tebra's own practice page and Tebra's own provider page
  both embed the identical CloudFront widget and were **equally empty**. Tebra could not
  show her availability on Tebra's own properties.
- Ruled out one by one: office hours (set), provider-level online booking (enabled), the
  global visit-reason toggle (on), per-visit-reason toggles (**do not exist** — the Edit
  Visit Reason modal has only Name, Duration, Color, Associated Procedures), Schedules
  (optional; availability derives from Office Hours).
- We deliberately did **not** flip the practice-level toggle to "fix" it, because that
  setting creates a permanent URL and we had no evidence it was the cause. Correct call —
  Carol flipped it herself and the calendar stayed empty afterwards, so it wasn't that.
- **Resolution: it came good on its own** once Carol finished configuring. Confirmed live
  18 Sep 2026. Cause was Tebra-side propagation, restarted by each of her edits.

**Live booking flow as at 18 Sep 2026:** three steps — *Appointment details → Contact info
→ **Insurance info*** — with New/Returning patient, a Reason for visit selector, In-person
vs Virtual visit, and a working date strip. **Insurance is collected inline at booking**,
which Charm could not do (see §4n, where we solved it with a portal upload instead).

Carol's office hours: Mon 9–5, Tue 11–5, Wed 11–5, Thu 9–5. No Friday or weekend.

### 8.6 Bookings are REQUESTS, not confirmations

A Tebra online booking lands **tentative**. Front-office staff must confirm it from the
dashboard, and only then does the intake-form invitation go out by SMS/email. This differs
from Charm and matters for how the site describes booking.

Also: **Tebra shows no price at booking.** Visit reasons carry a duration and a procedure
code only. Charm displayed the charge. The cash-price block on the website is therefore
the only place a patient sees prices before booking — which is exactly what Carol wants:
*"Tebra already took care of the payment. All you have to do is make it transparent on the
website."* **The website must never take payment.**

---

## 9. 🔴 TWO TRAPS THAT BIT US — read before any deploy

### 9.1 The `.htaccess` 7-day asset cache

`.htaccess` sets **`max-age=604800` (7 days) on js and css**, but **`max-age=0` on
index.html**. Upload new files alone and returning visitors get the **new HTML with the old
JavaScript**. That is exactly what happened on 31 Aug: Medicare missing from the insurance
list, and the Book button still opening **CharmHealth**, on a page that said "Secure
scheduling by Tebra".

**A Cloudflare purge does not fix this.** The stale copy is in each visitor's browser, not
at the edge.

**The fix, now in place:** assets are requested with a version query —
`styles.css?v=20260918`, `script.js?v=20260918`, `clinic-config.js?v=20260918` — from both
`index.html` and `policies.html`. Since the HTML itself is never cached, every visitor gets
a URL their browser has never seen.

> **BUMP `?v=` ON EVERY DEPLOY THAT CHANGES JS OR CSS.** Current value: `20260918`.

### 9.2 `[hidden]` did not hide — two dead links were live for 18 days

The `hidden` attribute is only `display:none` from the *user-agent* stylesheet, and it
loses to any author rule. `.nav__portal{display:flex}` and `.footer__col a{display:block}`
both beat it. So `script.js` set the attribute and **the links kept rendering** — the
homepage nav "Patient Portal" and the footer "Patient Portal sign-in", both pointing at
`href="#"`, live from 31 Aug to 18 Sep.

**Fixed at the root** in `styles.css`:

```css
[hidden]{display:none !important}
```

**The lesson, which matters more than the bug:** the 31 Aug check counted elements *without*
the `hidden` attribute, got zero, and passed. It was measuring the attribute, not whether
anything rendered. **Verify visibility by computed `display` and bounding box, never by the
presence of an attribute or a class.**

---

## 10. Deploying — the procedure that works

Production is Network Solutions and does **not** auto-deploy. GitHub and Netlify are not
the live site.

### 10.1 Getting into the File Manager

The direct URL `11fb659.netsolhost.com/filemanager/index.php?p=htdocs` returns **401 —
session ended**, even when logged into Network Solutions. It needs a fresh SSO handoff:

> Network Solutions → **Hosting** (left nav) → hosting-details page → **File Manager**

That click mints the session; the direct URL then works in any tab for a while. A human has
to do this click — it cannot be driven from the account-manager page directly.

### 10.2 Uploading and swapping

Tiny File Manager **never overwrites**. An upload of `x.html` lands as
`x_YYMMDDHHMMSS.html`. So for each file:

1. Upload everything at once (the file input, not the dropzone click).
2. Rename the live file → `name_prev_YYYYMMDD.ext.bak`
3. Rename the timestamped upload → the real name

The rename UI is a form `#renameDailog` with fields `rename_from`, `rename_to` and a CSRF
`token`. **Setting both values and submitting that form directly is far more reliable than
clicking**, especially since Chrome-extension screenshots time out on this project.

Old versions are kept as `.bak`; `.htaccess` returns 403 for `*.bak|orig|old|log` so they
are neither readable nor indexable.

### 10.3 ⚠️ NEVER deploy `index.html` or `styles.css` straight from the repo

They carry the **DRAFT "Our Team" section** (§4n/§4p) with bracketed placeholder bio text —
*"[DRAFT — replace with Carol's real bio…]"* — which must not reach a live medical clinic
homepage. It nearly did on 31 Aug.

Build from **`.deploy/`** (gitignored), which strips the section and its two `#team` nav
links. `policies.html` has no draft content, so it deploys straight from the repo.

### 10.4 Cloudflare

Only needed when the HTML itself must change immediately, which it rarely does since
index.html is `max-age=0` and Cloudflare reports `DYNAMIC` for it. The asset-version bump
in §9.1 is the real mechanism. Cloudflare login is Google SSO on `gazzyjuruj@gmail.com`.

---

## 11. The privacy notice — attorney-reviewed, live 18 Sep 2026

Carol's lawyer's document arrived 18 Sep as
`consent and disclaimers/NOTICE OF PRIVACY PRACTICES (HIPAA) (2) (4).pdf`
(that folder is **gitignored** — client legal PDFs stay out of the repo).

The `#privacy` section of `policies.html` is **transcribed from it, not reworded**, so the
page can be diffed against the document. Every sentence was machine-checked as present.

This closed a compliance flag open since August: the old notice was our own paraphrase with
a placeholder effective date of **1 March 2023**. It is now the real one: **1 August 2026**.

New material her lawyer added: substance-use-disorder records (42 CFR Part 2); a "Your
choices" section; an explicit *"does not sell your health information"*; the statutory
specifics under Your Rights (30 days for access, 60 for an amendment denial, six-year
accounting, one free per 12 months, the out-of-pocket restriction right, personal
representatives); the full HHS Office for Civil Rights address and phone; and an "Other
notice and information for patients" block that adds two commitments the site had never
made — **controlled substances are not prescribed via telehealth**, and the patient must be
physically located in a state where the provider is licensed.

### 11.1 ⚠️ ONE DELIBERATE DEVIATION FROM THE PDF

| | |
|---|---|
| PDF says | "Appointment fees are due **at the time of booking** unless other arrangements have been made." |
| Site says | "Appointment fees are due **before service** unless other arrangements have been made." |

Changed on Carol's express instruction, 18 Sep 2026: *"payment is due before service not at
time of booking. Tebra is built a little differently."* The PDF wording promised something
the system does not do — Tebra takes nothing at booking, a request arrives tentative and is
invoiced separately.

There is a comment above the section in `policies.html` recording this. **Do not "fix" it
back by diffing against the PDF.**

---

## 12. Open items — carried into the next session

| Item | Owner | Note |
|---|---|---|
| 🔴 **Address mismatch, NEW** | Carol | The live booking widget shows **"lewisville, TX 75057"**. The website says **1301 Justin Rd, Lewisville, TX 75077** in four places (contact block, map embed, both footers). `75057` is the zip of the old *541 W Main St* address. Ask which is current; if she has moved, four places need updating. |
| 🔴 **Tebra's copy of the privacy notice** | Carol | Patient Intake still holds the **superseded** notice. That is the version patients actually sign into their medical record — the website copy is only informational. Only she can replace it. |
| 🔴 **Attorney PDF still says "at booking"** | Carol | Should be reissued to match §11.1, or the document of record disagrees with the site. |
| Financial Policy wording | Carol | Still says "at the time services are rendered" / "at the time of the visit", vs her "before service" ruling. Not a flat contradiction, but a two-line change if she wants one rule stated consistently. |
| "Our Team" section | Carol | Still placeholder. Needs her real bio, then re-add and **bump `?v=`**. |
| Tebra provider profile | Carol | Still no photo, no bio, **no insurances added in Tebra** (the website lists 8). Her Care Connect profile is Published and indexable while nearly empty. |
| Tebra address formatting | Carol | Service location printed the suite twice — `1301 Justin Rd # 201-5035, 201-5035` — on her public profile. Needs admin. |
| Visit reasons | Carol | Still the Charm-era set. No "Simple Prescription Refill", no "Weight Management Follow-up", so patients book against reasons that don't match published prices. |
| Tebra Patient Portal | Carol / us | Not activated, or hidden from Office Staff. `TEBRA_PORTAL_URL` is `""`, so all five portal links auto-hide. **Paste a URL there and they all come back in one edit** — including the policies-page one, which has its own small inline script for this. |

---

## 13. Environment gotchas

- **Chrome-extension screenshots time out** on this project. The desktop app's built-in
  browser pane works, though it throws `UnknownVizError` intermittently — retry once, then
  fall back to text extraction. Headless Chromium in the cloud container is the most
  reliable way to verify a page.
- **The extension's `javascript_tool` blocks any return value containing a query string**
  ("Cookie/query string data"). Return booleans or derived values instead, or ask the user
  to copy the value out.
- **git through the folder bridge cannot delete its own lock files.** On
  `index.lock: File exists`, `mv` them into `.git/_stale/`. Worse: `git add` leaves a lock
  that makes a chained `git commit` fail, so **run add and commit as separate calls**.
- **A failed `git checkout` followed by `git merge <branch>` reports "Already up to date"
  and silently does nothing.** This ate two merge attempts. Always verify with
  `git log --oneline -1 main`.
- **The bridge has no GitHub credentials** — pushes must run from PowerShell.
- **PowerShell 5 does not support `&&`.** Semicolons chain but run regardless of failure,
  which is how the silent merge failure above got missed.
- **`git status` from the bridge shows every file modified.** Files on disk are CRLF
  (Windows checkout), repo blobs are LF. Not drift — `git diff --ignore-all-space` is empty
  and Windows git shows a clean tree. Ignore it.
- **Carol edits Tebra settings directly and does not always say so.** Re-read the account
  before assuming an earlier reading still holds.
