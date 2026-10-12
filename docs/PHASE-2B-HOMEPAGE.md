# Phase 2B — Homepage deliverables

## Staging URL

After deploy: `https://najlaashutter-web.mohamed-abouzied.workers.dev/`

(Landing page unchanged: `/window-shutters-jeddah/`)

## Screenshots

Generated under `docs/review-screenshots/`:

- `homepage-desktop-1440-fullpage.png`
- `homepage-mobile-390-fullpage.png`
- `homepage-desktop-1440-above-fold.png`
- `homepage-mobile-390-above-fold.png`

## Lighthouse (local preview, mobile, GTM on)

| Page | Performance | Accessibility | Best practices | LCP |
|------|-------------|---------------|----------------|-----|
| `/` | ~84–86 | **100** (post-fix) | ~73 (GTM third-party cookies) | ~2.9–3.0s |
| `/window-shutters-jeddah/` | ~90 | **100** | ~77 | ~2.6s |

Artifacts: `lighthouse-home-mobile.json`, `lighthouse-home-a11y.json`, `lighthouse-lp-mobile-post-fix.json`

## Changed files (summary)

- `src/pages/index.astro` — full homepage
- `src/styles/home-atira.css` — ATIRA visual tokens/layout
- `src/config/homepage-content.ts` — WP SQL content + local assets
- `src/config/home-routes.ts` — menu URL mapping
- `src/components/home/*` — header, footer, reviews slot, mobile bar
- `src/layouts/BaseLayout.astro` — optional `bodyClass`
- `astro.config.mjs` — sitemap includes `/`
- Part 2A fixes: WhatsApp contrast, logo DPR (`Header`, `Footer`, `Button`, `global.css`)

## Review ZIP

Parent folder: `najlaashutter-phase-2b-review.zip` (repo + screenshots + Lighthouse JSON)
