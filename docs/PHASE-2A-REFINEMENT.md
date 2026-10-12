# Phase 2A — LP refinement pass (post-review)

**Not Phase 2B.** Homepage and main site rebuild remain paused.

## Changed files (summary)

| Area | Files |
|------|--------|
| Hero image & gallery | `src/config/project-images.ts`, removed `hero-installation.jpg` |
| LP copy (Jeddah-only) | `src/config/landing-jeddah.ts` |
| LP layout/styles | `src/pages/window-shutters-jeddah.astro` |
| Brand chrome | `Header.astro`, `Footer.astro`, `Button.astro`, `TrustItem.astro`, `global.css` |
| Privacy (minimal) | `src/config/privacy-policy.ts`, `src/pages/privacy-policy.astro` |
| Fonts (self-host) | `public/fonts/*`, `BaseLayout.astro` |
| GTM diagnostic build | `src/config/env.ts`, `package.json` (`build:staging:no-gtm`) |

## Claim verification

| Claim | Status |
|-------|--------|
| Phone, email, GTM/GA4/Ads IDs | Verified in WP backup / `site.ts` |
| Shutter types (manual, electric, smart, interior/exterior) | Aligned with WP service posts (audit) |
| Service in Jeddah on **this LP** | Intentional ad geo; global `site.serviceAreaNote` still Jeddah+Makkah for future main site |
| Hero & gallery photos | Real WP uploads (`2025/11` WhatsApp project set); portfolio slides include «من أعمالنا» branding |
| Pricing in FAQ | No fixed prices — qualified as estimate-after-details |
| Testimonials | Omitted (none verified) |
| Free install over 500 SAR | Not shown (`site.offers.freeInstallOver500Sar: false`) |
| «شتر ذكي» | Listed as option; confirm SKU availability before stronger ads claims |

## Performance (mobile Lighthouse, local preview)

| Build | Performance | LCP | TBT | A11y | Notes |
|-------|-------------|-----|-----|------|--------|
| **GTM on** (`build:staging`, after 2A.1) | **90** | 2.4 s | **340 ms** | 96 | `lighthouse-mobile-gtm-on.json` (2026-10-12) |
| **GTM on** (pre-2A.1 baseline) | **68** | 4.0 s | **760 ms** | 96 | earlier run |
| **GTM off** (`PUBLIC_DISABLE_GTM=true`) | **95** | 2.8 s | **0 ms** | 96 | Diagnostic only — `lighthouse-mobile-gtm-off.json` |

**TBT cause (GTM on):** bootup-time dominated by `googletagmanager.com/gtm.js` (GTM-WXVGK7F4) and `gtag/js?id=AW-17774174461` (Google Ads via GTM). First-party Astro HTML/JS is negligible.

**Hero network:** no manual `<link rel="preload">` for hero; Lighthouse shows a **single** hero WebP fetch (`…48-3.Do7_ZBBJ_*.webp`) for LCP.

**Fonts:** Google Fonts removed; Noto Kufi Arabic self-hosted under `/public/fonts/` (subset woff2). GTM-off run includes self-hosted fonts; use GTM-off delta mainly to isolate tag manager cost.

**SEO score 69:** staging `noindex` + `robots.txt` Disallow — expected for review builds, not production launch config. Do **not** report staging SEO as 100.

## Launch checklist (separate from Phase 2A)

- [ ] **GTM container optimization** — TBT/LCP cost is primarily GTM + Google Ads tag `AW-17774174461`. Review tag firing, deferral, and Ads-only loads in GTM UI before/after cutover. Do **not** delay-load GTM in site code without a signed-off GTM plan.

## Phase 2A.1

- **Mobile overflow:** `site-header__actions { display: none }` below 768px — verified `scrollWidth === clientWidth` at 320, 360, 375, 390, 412, 430 (`docs/review-screenshots/mobile-overflow-test.json`).
- **Raw hero:** `uploads/2024/03/WhatsApp-Image-2024-03-06-at-3.28.45-PM.jpeg` (three black roller shutters, no embedded «Our works» art). Other raw candidates in backup: `…3.28.46-PM-1.jpeg`, `…3.28.47-PM-3.jpeg`.
- **Gallery:** all `loading="lazy"`, `fetchpriority="low"`.
- **Hero subline:** توريد وتركيب شتر نوافذ خارجي وداخلي، يدوي وكهربائي في جدة.
- **Screenshots:** Playwright `fullPage: true` — see `docs/review-screenshots/`.
