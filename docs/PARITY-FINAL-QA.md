# Homepage parity final QA

## Animation parity

- [ ] Desktop hero fade + autoplay (delayed)
- [ ] Hero caption fade-in / CTA fade-in-up
- [ ] About image fade-down
- [ ] Why-us zoom-in-left + feature fade-up stagger
- [ ] FAQ fade-in stagger + image fade-down
- [ ] `prefers-reduced-motion` disables motion

## Interaction QA

- [ ] Desktop hero prev/next (circle icons)
- [ ] Services Swiper arrows + center CTA
- [ ] Projects Swiper + lightbox dialog
- [ ] Reviews Swiper shell + GBP link
- [ ] Blog Swiper
- [ ] FAQ accordion (Bootstrap-like)
- [ ] Search modal UI
- [ ] Booking modal + WhatsApp form submit
- [ ] Bottom offcanvas menu + services sub-expand
- [ ] Mobile fixed footer (raised menu)
- [ ] Desktop floating WhatsApp + scroll progress top

## Responsive overflow

Run: `node scripts/verify-mobile-overflow.mjs <staging-url>`

Widths: 320, 360, 375, 390, 412, 430, 768, 992, 1280, 1440, 1690, 1920

## Data dependencies

- Google Reviews: static `googleReviewsData[]` empty until verified sync
- Project gallery: local uploads (ACF `pw-bag` branded slides if business provides files)
