# Phase 2A deliverables

## 1. Project structure

```
najlaashutter-web/
├── astro.config.mjs
├── public/robots.txt, favicon.png
├── src/
│   ├── config/site.ts, landing-jeddah.ts, project-images.ts
│   ├── components/     # Header, Footer, CTAs, FAQ, gallery, etc.
│   ├── layouts/BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro                    # noindex placeholder
│   │   └── window-shutters-jeddah.astro
│   └── styles/global.css
└── docs/ASSETS.md
```

WordPress reference (read-only): `../_wp-reference-readonly/`  
Original backup untouched: `../najlaashutter-com-20261012-135832-letz9kyux0rl.wpress`

## 2. Technical decisions

| Decision | Rationale |
|----------|-----------|
| Astro static output | Matches marketing + LP scope, minimal JS |
| TypeScript strict | Type-safe config and content |
| Native CSS + tokens | No Tailwind/Bootstrap; smaller CSS, brand control |
| `astro:assets` + sharp | Responsive WebP, explicit widths/sizes |
| `<details>` FAQ | Zero JS accordion |
| CSS grid gallery | No Fancybox/Swiper |
| Central `site.ts` | Single phone/WhatsApp/email/tracking source |
| Placeholder `/` with noindex | Avoid competing with live WP until Phase 2B |

## 3. Dependencies

| Package | Why |
|---------|-----|
| `astro` | Static site generator |
| `@astrojs/sitemap` | `sitemap-index.xml` for landing URL |
| `sharp` | Image optimization (Astro image service) |

No React, Vue, Tailwind, or Bootstrap.

## 4. Curated assets

See [ASSETS.md](./ASSETS.md).

## 5. Design system summary

- Colors: `#13304e`, `#8e9dad`, `#25d366`, `#f4f5f6`
- Font: Noto Kufi Arabic (Google Fonts, `display=swap`)
- Buttons: 15px radius, light shadow on cards only
- RTL: `lang="ar"` `dir="rtl"` on `<html>`

## 6. Landing page section map

1. Hero — H1, CTAs, hint, hero photo  
2. Trust strip — 4 verified-style bullets (no fake stats)  
3. Why shutters — 5 benefits  
4. Shutter types — 5 cards (in-page, no exit links)  
5. Project gallery — 8 photos  
6. How it works — 3 steps  
7. Why Najlaa — 3 points  
8. FAQ — 6 questions  
9. Final CTA — WhatsApp + phone  
10. Minimal footer + mobile 2-button bar  

Route: **`/window-shutters-jeddah/`**

## 7. Content assumptions needing verification

- [ ] Exact **service area** beyond Jeddah/Makkah  
- [ ] Whether Najlaa **manufactures** vs supplies/ installs only (wording kept neutral)  
- [ ] **Warranty** terms (not claimed on LP)  
- [ ] **Free install over 500 SAR** — intentionally omitted  
- [ ] **Privacy policy** URL linked but page not built until Phase 2B  
- [ ] Real **Google reviews** — not shown (WP testimonials were duplicate/fake)

## 8. Tracking implementation status

| Item | Status |
|------|--------|
| GTM `GTM-WXVGK7F4` | Implemented in `BaseLayout.astro` (head + noscript) |
| GA4 / Ads via GTM | Expected via container (not duplicated as hardcoded gtag) |
| IDs in `site.ts` | GA4, AW- IDs documented for launch checklist |
| `data-conversion="phone\|whatsapp"` | On all primary CTAs |
| Ads conversion **labels** | **Not set** — awaiting your GTM/Ads verification |
| Custom JS tracking | None |

## 9. SEO implementation status

| Item | Status |
|------|--------|
| Semantic HTML + heading hierarchy | Yes |
| `PageMeta`: title, description, canonical | Yes |
| Open Graph | Yes |
| JSON-LD LocalBusiness | On landing page |
| `robots.txt` | `public/robots.txt` |
| Sitemap | `@astrojs/sitemap` (filters to landing only for now) |
| Legacy URLs | Unchanged; no redirects implemented |

## 10. Performance (local Lighthouse, mobile)

Measured on `http://localhost:4322/window-shutters-jeddah/` after `npm run build && npm run preview` (Oct 2026):

| Category | Score |
|----------|------:|
| Performance | 68 |
| Accessibility | 96 |
| Best practices | 73 |
| SEO | 100 |

| Metric | Value |
|--------|--------|
| LCP | 2.7 s |
| CLS | 0.103 |
| TBT | 900 ms |

Lab score is pulled down by **Google Fonts** (render-blocking stylesheet) and **GTM** (third-party JS), which are required for brand/tracking in this phase. Hero image uses `preload` + `fetchpriority="high"`. Re-test on Cloudflare staging with self-hosted fonts or font subsetting before expecting 95+.

```bash
npx lighthouse http://localhost:4321/window-shutters-jeddah/ \
  --preset=perf --form-factor=mobile --chrome-flags="--headless" \
  --only-categories=performance,accessibility,best-practices,seo
```

## 11. Build output

```bash
npm run build
# → dist/ (static HTML, _astro/* optimized images, sitemap-index.xml)
```

## 12. Cloudflare Pages readiness

- Build: `npm run build`
- Output: `dist`
- Node 22+
- No server functions required for Phase 2A
- Before production: point domain, verify GTM in Tag Assistant, add `_headers` for caching if desired

## 13. Pre-production blockers

1. Confirm GTM phone/WhatsApp conversion tags and Ads labels  
2. Publish `/privacy-policy/` or remove footer link until ready  
3. Decide whether root `/` should redirect to LP or full homepage at launch  
4. Re-run Lighthouse on Cloudflare URL (fonts + GTM add third-party cost)  
5. Legal review of FAQ pricing wording  
