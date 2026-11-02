# Approved repairs — 2 November 2026

The exact replica remains on `replica-static-exact-2026-11-01`. Repairs live on
`fixes-static-2026-11-02`; captured original HTML and resource files are untouched.

## Confirmed business decisions

- Service area: Jeddah and Makkah.
- Free installation offer: orders over SAR 500; keep the offer and route inquiries to WhatsApp.
- Use confirmed details only. Hide generic social links; do not invent account URLs, motor models, prices or warranty periods.
- Selected positive Google Maps reviews may be used. Three short quotations are recorded with author, exact source link, date, and excerpt marker in `customer-reviews.json`. No aggregate rating is invented.

## Build

```
npm run build:replica:fixed
```

The baseline build/source verification remains separate. `improve-replica.py`
creates `fixed-site/`, then the new verification checks all 63 routes and 123
contact forms. An additional `/about/` fallback and redirect cover the old URL.
The contact tests execute the actual runtime with adapters, covering special
characters, pasted/autofilled data, whitespace validation, and sharing fallbacks.
No WhatsApp messages or phone calls are sent.

The repair output defaults to staging noindex and removes production tracking.
`improve-replica.py --production` is reserved for a later reviewed cutover; no
live domain, Worker, main branch or ads landing page was changed.

## Implemented

- Real submit buttons and validation; URL-safe WhatsApp messages assembled at submission time.
- Correct page attribution and approved campaign parameters; popup fallback link.
- Share API, clipboard and manual-copy fallback; semantic modal/offcanvas buttons.
- Correct offer/Maps/about destinations; hide generic social accounts and unverified link hub.
- Three distinct attributed review cards in place of the repeated placeholder.
- Approved geography, language corrections, removal of numeric performance promises,
  neutral motor guidance and useful service detail without fabricated specifications.
- Readable contrast, quiet footer, useful mobile introductory text, stable mobile image box,
  explicit motion control, reduced-motion handling and keyboard submenu support.
- Heading, metadata, social tags, basic verified business schema, sitemap, unique IDs,
  accordion ARIA, valid hover CSS and first-hero image priority.

## Verification limits / remaining inputs

Native browser could not start in this environment; the repaired version has no new
visual sign-off. Source/link/form checks and runtime adapter tests are recorded in
`qa/fixes-verification.json` and `qa/contact-fixes.json`. The private direct Site
is the review target; the prior HTMLPreview still shows the untouched exact replica.

Real social URLs, product/model-specific warranty specifications and project
captions remain absent until supplied. No invented substitutes are displayed.
Production analytics deduplication and actual network-performance measurement
remain cutover checks; no Lighthouse score or live conversion fix is claimed.
