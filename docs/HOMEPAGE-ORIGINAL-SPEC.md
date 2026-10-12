# Homepage original forensic spec

**Sources used:** `_wp-theme-extract/front-page.php`, `_wp-theme-extract/style.css`, live [najlaashutter.com](https://najlaashutter.com/) HTML (Oct 2026), `_wp-reference-readonly/` theme + uploads.

**Note:** Saved file `نجلاء شتر.html` (“Chat HTML”) was not present in the repo; live WP + theme extract are the reference.

## Design tokens (`:root` / ATIRA)

| Token | Value |
|--------|--------|
| `--pw-main` | `#13304e` |
| `--pw-sub` / `--pw-unq` | `#8e9dad` |
| `--pw-fff` | `#f4f5f6` |
| `--pw-wts` | `#25d366` |
| `.bg-new` | `#e8f3ff` |
| Body font | Noto Kufi Arabic, 300 |
| Headings | Nunito Sans (500–700) |

## Bootstrap container (recreated locally)

| Breakpoint | Max width |
|------------|-----------|
| default | 100% − 1rem padding |
| ≥576px | 540px |
| ≥768px | 720px |
| ≥992px | 960px |
| ≥1200px | 1140px |
| ≥1400px | 1320px |

WP also uses `container-lg` on promo bar.

## Section order (front-page.php)

1. Hero desktop `#pwCarousel` (≥lg) + mobile `#pwCarouselMob`
2. Services `.services.section-bg` — Swiper `pw-hom-swp1`
3. About `.bg-new` — `we-experts.jpg`, image col-lg-5, copy col-lg-7
4. Projects `pw-hom-swp3` — ACF gallery, Fancybox
5. Reviews `pw-hom-swp2` — ACF `pw-revs`
6. Why us `.section-why-us` — `why-choose-us.jpg`
7. Contact ban `.home-cont-ban.d-none` — **hidden**
8. FAQ `.bg-new` — accordion + `faq-home-page.jpg`
9. Blog — Swiper `pw-hom-swp3` (same class name in WP)

## Promo bar (`#pw-header-top`)

Desktop (lg+): 3-column row — empty `col-4`, center promo (`promo-text`), end `contact-info` (phone + WhatsApp).  
Mobile: navy row — logo/wordmark + search button (`pw-btn-search`).

**Content exception:** Do not restore htmcssjs.com / free install over 500 SAR. Keep center slot + pulse animation with verified `site.serviceArea.homepagePromo`.

## Desktop header (`#pw-header`)

RTL visual: **logo + wordmark (right)**, **nav (center)**, **search + اتصل بنا (left)**.  
Sticky navy bar; dropdown white panel; active link `--pw-unq`.

## Hero desktop

- Images ~1280×551, `width:100%`, no crop
- Caption: `width:440px; top:30%; right:10%; left:auto` (physical right — light art area)
- Title `fs-2`, excerpt `fs-4`, CTA `btn-unq` + headset icon
- Animations: title/excerpt fadeIn ~1s slow; CTA fadeInUp ~3s delay
- Controls: `bi-arrow-right-circle-fill` (prev), `bi-arrow-left-circle-fill` (next), 6% width, 65px height

## Hero mobile

- `sld-mob-1/2.jpeg`, overlay `.img-overlay`, bottom CTA `btn-home` only

## Swiper carousels (from theme markup + typical ATIRA main.js)

| Class | Section | spaceBetween | slidesPerView (approx.) |
|-------|---------|--------------|-------------------------|
| `pw-hom-swp1` | Services | 30 | 1.1 → 2.2 → 3 → 3.5 |
| `pw-hom-swp3` | Projects / Blog | 30 | 1.1 → 2 → 2.5 → 3 |
| `pw-hom-swp2` | Reviews | 30 | 1.1 → 2 → 3 |

RTL: `dir="rtl"` on document; navigation uses right/left circle icons (prev = arrow-right in markup).

Toolbar below: `col-2` prev | `col-8` center CTA | `col-2` next.

## About

- Image: `we-experts.jpg`, `.pw-home-img` + striped `.pw-home-img-bg`, `data-aos="fade-down"` 1000ms
- Copy: bullets with `bi-check-circle`, CTA `bi-arrow-left-circle`

## Reviews shell

- `.pw-rev` card: height ~210px, white, shadow, Google icon absolute left, name, 5 stars, quoted text
- **No fake أحمد العتيبي cards**; static verified data or empty slides + GBP link

## FAQ

- Bootstrap accordion (collapsed, plus icon), not default `<details>` styling
- FAQ column lg-7, image lg-5; item stagger fade-in 1s/2s/3s

## Footer

- Background: `footer-bg.jpg` on `#footer`
- Four areas: brand+social | روابط مهمة | الخدمات | تواصل معنا (with icons)
- Copyright navy bar; social icons visible but **disabled** until URLs verified

## Mobile chrome

- Fixed footer: 5 items, **center menu raised** with border
- Offcanvas/bottom sheet menu (not side drawer on mobile parity target)
- Desktop: floating WhatsApp (heartbeat) + scroll progress back-to-top (~300px)

## Animations (AOS → native)

| Element | Effect | Duration / delay |
|---------|--------|------------------|
| Hero title/excerpt | fadeIn | 1s slow |
| Hero CTA | fadeInUp | 3s delay |
| About image | fade-down | 1000ms |
| Why image | zoom-in-left | 1500ms |
| Why features | fade-up | 1s, 2s, 3s |
| FAQ items | fade-in | 1s, 2s, 3s |
| FAQ image | fade-down | 1000ms |

Respect `prefers-reduced-motion`.

## Known content exceptions

- No htmcssjs.com, no unverified promo, no generic social URLs, no duplicated testimonials, no “all Saudi Arabia” in footer copy (use Jeddah+Makkah config + TODO).
