# Homepage visual parity checklist

**Reference:** [najlaashutter.com](https://najlaashutter.com/) (WordPress ATIRA)  
**Implementation:** Astro `/` (`src/pages/index.astro`, `src/styles/home-atira.css`)

| Area | WordPress homepage | New Astro homepage | Notes |
|------|-------------------|-------------------|--------|
| Header | Top contact strip + navy bar, logo, main nav, CTAs | Same structure (`HomeSiteHeader.astro`) | Search icon / booking modal not ported (no jQuery/Bootstrap modal); CTAs → phone/WhatsApp |
| Hero | Desktop cat-8 fade carousel + mobile theme slides | Same order; fade carousel + mobile overlay + «اتصل بنا» | Desktop captions + «استشارة مجانية» → WhatsApp |
| Services | Swiper cards, gradient section | Horizontal scroll-snap + prev/next | Same card colors/copy; local service images |
| About | Image + copy + bullets + «اقرأ المزيد» | Same copy; image = `why-choose-us.jpg` (not `we-experts` badges) | Intentional content fix |
| Projects | ACF gallery swiper | Same gallery assets (local uploads) | Fancybox lightbox → static images (no exit to hotlinks) |
| Testimonials | Duplicated ACF «أحمد العتيبي» swiper | Section shell + `GoogleReviewsSlot` placeholder | No fabricated reviews |
| Why us | Corner frame + 3 feature boxes | Recreated in CSS | No AOS |
| FAQ | Bootstrap accordion + side image | `<details>` accordion + same 3 FAQs from ACF SQL | Full FAQ page link → `/faq/` (pending) |
| Blog | Swiper of 6 posts | Same titles/excerpts; default card image | Post pages pending |
| Footer | 3 columns + pill links | `HomeSiteFooter.astro` | Social links omitted until verified |
| Mobile nav | Side drawer + bottom CTA | Drawer + 2-button fixed bar | WP 5-icon bar not confirmed in theme extract |

## Intentional visual / UX differences

- No Bootstrap, Swiper, jQuery, AOS, or Fancybox.
- Booking modal replaced with direct WhatsApp / phone conversion links (same GTM `data-conversion` pattern).
- About section photo switched from stock «experts» image to `why-choose-us.jpg` (client audit).
- Blog cards use `default.jpg` until featured images are migrated per post.
- Inner pages linked in nav/footer return 404 until Phase 2C+ (`docs/HOMEPAGE-PARITY.md` routes in `home-routes.ts`).

## Old-site problems fixed on homepage

- Removed duplicated / fake testimonial content.
- Service images self-hosted (no `htmcssjs.com`).
- Project gallery uses local assets (no hotlinked obsolete URLs).
- Canonical homepage is `/` (no `/home/` duplicate).
- `/about/` link target corrected (was wrong in some WP builds).
- No generic/unverified social URLs in footer.

## Redirect note (future)

- Plan: `301` `/home/` → `/` when Astro replaces production routing.
