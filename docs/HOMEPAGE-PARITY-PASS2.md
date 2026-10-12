# Homepage parity pass 2 (refinement)

## Staging indexing

- Cloudflare Worker (`src/worker.ts`) injects `<meta name="robots" content="noindex, nofollow">` on all non-`najlaashutter.com` hosts.
- `/robots.txt` on staging returns `Disallow: /`.
- Production HTML builds without noindex; only `najlaashutter.com` / `www.najlaashutter.com` are indexable.

Verify: `node scripts/verify-staging-noindex.mjs`

## Visual / UX restorations

| Section | Change |
|---------|--------|
| Header | Search + «اتصل بنا» dialog triggers; promo strip uses centralized service area |
| Hero | Desktop slides mount only ≥992px (`<template>`); mobile-first LCP; delayed autoplay |
| Contact CTA | `home-cont-ban` restored (background from WP `blog-bannar.jpg`) |
| Reviews | ATIRA card layout + Google Business Profile link (no fabricated reviews) |
| Blog | Real featured images from WP uploads |
| Services | Full-resolution covers from backup (e.g. exterior shutter ~62KB source) |
| Projects | Native `<dialog>` lightbox (no Fancybox) |
| Mobile chrome | 5-item `pw-fixed-footer` (not LP 2-button bar) |
| Footer | WP-style columns + footer background image; social icons disabled until verified |
| Copy | «لماذا تختارنا؟» typo fixed |

## Service area (FLAG)

Central config: `site.serviceArea` — currently **جدة ومكة** on homepage/footer. Broader WP claims not used until client confirms.

## Remaining intentional differences

| Item | Why |
|------|-----|
| Site search | UI present; full search deferred until inner pages exist (dialog explains) |
| Social footer icons | Shown disabled — WP URLs were generic/unverified |
| Google review cards | Empty data interface until GBP API/sync task |
| Inner nav links | Routes defined but pages not built (Phase 2C+) |

## Artifacts

- Parity screenshots: `docs/review-screenshots/parity/`
- Triple Lighthouse: `docs/review-screenshots/lighthouse-home-live-summary.json`
- Full review ZIP: `najlaashutter-phase-2b-review-full.zip` via `node scripts/create-review-zip.mjs`
