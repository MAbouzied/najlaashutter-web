# Phase 2A — external review handoff

**Status:** Development paused. Awaiting client review before Phase 2B.

**Design correction recorded:** [DESIGN-DIRECTION.md](./DESIGN-DIRECTION.md) — main site must **visually match** WordPress; LP is conversion-focused but same brand.

---

## 1. Staging URL

**Not deployed from this environment** — Cloudflare API token was not available (`wrangler pages deploy` requires `CLOUDFLARE_API_TOKEN`).

**To deploy staging (no custom domain):**

```bash
cd najlaashutter-web
npm run build:staging
npx wrangler pages deploy dist --project-name najlaashutter-phase-2a
```

`wrangler.toml` sets `PUBLIC_STAGING=true` for Pages builds. For local staging build, use `npm run build:staging` (already sets `PUBLIC_STAGING=true`).

Expected URL pattern after deploy:  
`https://najlaashutter-phase-2a.pages.dev/window-shutters-jeddah/`

**Local preview (same build as ZIP `dist/`):**

```bash
npm run build:staging && npm run preview
# → http://localhost:4321/window-shutters-jeddah/
```

---

## 2. Review ZIP

**Path:** `/Users/mohamedabouzied/Documents/Projects/Najla_shutters/najlaashutter-phase-2a-review.zip` (~2.9 MB)

Includes: `src/`, `public/`, `docs/` (with screenshots), `dist/` (staging build), configs, lockfile.  
Excludes: `node_modules/`, `.git/`, `.astro/`, secrets.

Re-create after screenshot updates:

```bash
cd /Users/mohamedabouzied/Documents/Projects/Najla_shutters
zip -r najlaashutter-phase-2a-review.zip najlaashutter-web \
  -x "najlaashutter-web/node_modules/*" \
  -x "najlaashutter-web/.git/*" \
  -x "najlaashutter-web/.astro/*"
```

---

## 3. Screenshots

**Directory:** `najlaashutter-web/docs/review-screenshots/`

| File | Description |
|------|-------------|
| `desktop-1440-fullpage.png` | Full page, 1440×900 viewport |
| `desktop-1440-hero.png` | Above-the-fold desktop |
| `mobile-390-fullpage.png` | Full page, 390×844 |
| `mobile-390-hero.png` | Above-the-fold mobile (stacked hero + 2-button bar) |

Captured from local preview against `/window-shutters-jeddah/`.

---

## 4. Commit / build state

- **Git:** No git repository initialized in `najlaashutter-web/`.
- **Build command used for handoff:** `npm run build:staging`
- **Build result:** Success — 2 prerendered pages + `robots.txt` route + sitemap.
- **Staging noindex:** `<meta name="robots" content="noindex, nofollow">` on all pages when `PUBLIC_STAGING=true`; `robots.txt` → `Disallow: /`.
- **Production build:** Use `npm run build` (without `PUBLIC_STAGING`) when launching — landing page will be indexable per future launch plan.

---

## 5. Visual differences — LP vs existing Najlaa WordPress site

Compared to live WP theme (`atira-classic` / homepage `front-page.php`):

| Area | WordPress | Phase 2A LP |
|------|-----------|-------------|
| Header | Promo strip, full primary nav, search + modal “اتصل بنا” | Minimal sticky bar: logo + desktop phone/WhatsApp only |
| Hero | Desktop carousel (category Slider) + separate mobile carousel | Single static image + copy (no carousel) |
| Services | Horizontal Swiper cards linking to posts | In-page type cards (no outbound links) |
| Portfolio | Swiper + Fancybox | CSS grid, no lightbox |
| Testimonials | Google-style carousel (duplicate content in WP) | **Omitted** (audit: duplicate/unverified) |
| FAQ | Accordion on home + full FAQ page | `<details>` FAQ block (6 questions) |
| Footer | Multi-column menus + social icons | Minimal: logo, phone, WhatsApp, privacy link |
| Mobile bar | 5 icons (WhatsApp, call, menu, email, share) | **2** buttons: WhatsApp + call |
| Typography | Noto Kufi + Nunito Sans headings | Noto Kufi only in Phase 2A |
| Motion | AOS, Animate.css, Swiper autoplay | None |

Colors align with audit tokens (`#13304e`, `#8e9dad`, `#25d366`) but **layout density and WP chrome are not yet matched** — intentional for a conversion LP, but **Phase 2B main site must mirror WP**, and **LP may need a visual pass** to feel closer to ATIRA (buttons, header weight, card clipping, etc.) per client correction.

---

## 6. Intentional visual / UX choices in Phase 2A (and why)

| Change | Why |
|--------|-----|
| New LP section order | Google Ads funnel (Hero → Trust → … → CTA) |
| No carousels | Performance + reduced JS |
| Minimal header/footer on LP | Reduce exit paths for paid traffic |
| Static hero vs slider | LCP / no Swiper |
| Lighter shadows, simpler cards | Phase 2A “modernized” CSS — **may need tightening to match WP button/card styling in review** |
| No testimonial block | Unverified duplicate reviews in WP DB |

---

## 7. Unresolved / blocked items

| Item | Notes |
|------|--------|
| **Cloudflare staging URL** | Blocked: no `CLOUDFLARE_API_TOKEN`. Deploy steps above. |
| **Privacy policy link** | Points to `/privacy-policy/` (404 until Phase 2B). |
| **GTM on staging** | Container loads on preview; confirm tags in Tag Assistant after deploy. |
| **Ads conversion labels** | Still not in repo — wire in GTM after verification. |
| **LP visual fidelity to WP** | Client wants LP to “belong” to Najlaa — review may request header/footer/button parity with ATIRA. |
| **Main site faithful rebuild** | Documented in DESIGN-DIRECTION.md; not started (Phase 2B). |

---

## 8. Verification checklist (completed locally)

- [x] `npm run build:staging` succeeds  
- [x] Images resolve under `dist/_astro/`  
- [x] `tel:+966535344170` on phone CTAs  
- [x] `wa.me/966535344170` on WhatsApp CTAs  
- [x] `data-conversion="phone"` / `"whatsapp"` present on CTAs  
- [x] Staging noindex + robots disallow  
- [ ] Cloudflare staging URL (pending credentials)  

---

## 9. Review focus questions for client

1. Does the LP feel like **Najlaa** enough while staying conversion-focused?  
2. Which WP header/footer elements must appear on the LP (full nav vs minimal)?  
3. Approve staging deploy + share Cloudflare access for CI/deploy?  
4. Confirm Phase 2B approach: **pixel-faithful** main pages from `atira-classic` + backup content.
