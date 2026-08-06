# AtEase Family Medical Clinic — Project Notes

> Living handover document. Covers hosting, DNS, SSL, deployment, and the CharmHealth
> booking integration research. Update this when anything infrastructural changes.
>
> Last updated: **4 August 2026**

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
| **Facility ZIP in Charm reads 76262, should be 75077** — shown to every patient in the scheduler (§4f) | Founder to confirm, dev to change | 🔴 High |
| **Carol's Charm email is misspelled `ateasefmaily...`** — all her Charm notifications bounce (§4d) | Founder + Charm support | 🔴 High |
| ~~Deploy the 30–45 / 15–20 duration text~~ ✅ deployed 6 Aug 2026 | — | — |
| Decide how insurance is collected — upgrade Charm, portal, or staff (§4d) | Founder | 🟠 Medium |
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

- `null` (current) → the page shows *"A missed appointment fee — amount to be confirmed"*
- a number, e.g. `35` → the page shows *"A missed appointment fee of $35"*

Nothing else needs editing when the founder confirms the amount.

### Remaining placeholder

- `CHARM_EMBED_URL` in `clinic-config.js` — one manual paste (see §4).
- HIPAA notice effective date on `policies.html` — shows a visible "to be confirmed" marker.

*(The `[ Provider Name ], FNP-C` card was removed from the About section on 26 Jul 2026. The
`.provider-card` / `.about__visual` CSS remains in `styles.css` — unused but kept so the card is
easy to restore.)*
