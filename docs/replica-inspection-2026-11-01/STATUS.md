# WordPress static replica — inspection checkpoint

Date: 2026-11-01 (Africa/Cairo)
Source: https://najlaashutter.com/
Repository: MAbouzied/najlaashutter-web
Base commit: b98284bb731fac192da3d944c733b7d166113ead

## Status

**NOT a completed replica. No website implementation or deployment was performed.**
The user explicitly requires visual inspection before implementation, then visual comparison of the finished static website against WordPress. The pre-implementation inspection remains incomplete. Preserve this ordering on resumption.

The current main branch serves the Arabic and English ads landing pages through the existing Cloudflare Worker. Do not replace those routes or publish this checkpoint. Future replica work should remain isolated until verification.

## Captured source

The accompanying archive contains the unmodified homepage response, original theme stylesheet and main JavaScript, sitemap URL inventory, and successfully fetched page responses. The inventory includes HTTP outcomes and original request URLs; failed responses are NOT valid source pages. Cache file names are SHA-256 hashes of original requested URL strings.

- 60 URLs listed in the WordPress sitemaps: 20 posts, 6 pages, 3 categories, 29 tags, 2 author archives.
- Four additional requests examined aliases and the original search template.
- 16 successful cached responses, including two category aliases. This is not 16 distinct completed pages.
- Further pagination URLs discovered, including /category/blog/page/2/; these still need fetching and inspection.
- Assets have NOT been fully downloaded or localized.

## Browser inspection coverage and limits

External browser inspection reported observing the homepage, About, Contact, FAQ and Our Works layouts. Direct screenshot files were not supplied by that browser service, so this report must not be treated as a visual sign-off. Some reported text/details were inconsistent with captured HTML; captured source is authoritative for text and markup.

Service templates and individual blog articles were not successfully inspected visually. Mobile layout, mobile menu, complete lightbox behavior and exact rendered animation timings were not verified.

The original HTML confirms an important difference: the homepage FAQ uses Bootstrap collapsible accordions; /faq/ displays ten questions and answers as static content. Do not turn the internal FAQ page into an accordion.

## Motion facts from original source

- Original theme: ATIRA CLASSIC.
- Original dependencies: Bootstrap 5.3.3 RTL, Bootstrap Icons 1.11.3, Fancybox 5, Swiper 11, Animate.css 4.1.1, AOS 2.3.1, jQuery 3.7.1.
- Logo changes at scrollTop > 60; logo CSS transition is 0.5 seconds.
- Navigation dropdown uses slide-down 0.3 seconds ease-out.
- Buttons use 0.18 second transitions and a -2 px hover translation.
- Hero uses separate desktop/mobile Bootstrap carousel markup, carousel-fade and original caption animations.
- Swiper 1: autoplay 2500 ms; slides 1.3 / 2 at 768 px / 4 at 1024 px; gap 30 px.
- Swiper 2: autoplay 5000 ms; slides 1.2 / 2 / 3; gap 30 px.
- Swiper 3: autoplay 3000 ms; loop true; slides 1.2 / 3 / 3; gap 30 px. The original reuses this class in multiple sections.
- Swiper 4: autoplay 3500 ms; slides 2 / 3 / 4; gaps 5 / 10 / 20 px.
- AOS markup includes fade-down, zoom-in-left, fade-up and fade-in with element durations 1000, 1500, 2000 and 3000 ms.
- Floating WhatsApp heartbeat uses a 2 second animation; smooth scroll-to-top is in the original main script.
- Contact forms use name/message and construct WhatsApp links in inline JavaScript. No test messages or calls were sent.

## Blockers

1. The normal interactive browser process fails before opening a tab: bwrap cannot create /home/agent/.codex/sessions because of a read-only filesystem. Resetting the browser session did not repair this infrastructure issue.
2. The source site repeatedly returns HTTP 429, including root, services and blog URLs. Throttling temporarily cleared, then recurred. Serial paced requests with one-minute backoffs and independent browser retries did not finish the capture. Avoid further rapid retries.
3. Shell Git push is unavailable because no shell GitHub credentials are configured. Native GitHub connector access works and can preserve this checkpoint.

## Remaining work

1. Restore reliable interactive browsing and source-site access.
2. Complete the user's requested visual preflight, including actual service/article pages and responsive behavior.
3. Fetch remaining pages, pagination, images, responsive srcsets, fonts, original CSS and JavaScript. Honor server limits and cache successful fetches.
4. Build the static replica using the original generated markup/assets/motion dependencies; preserve content, links and observed quirks. Changes and redesign belong to the user's later session.
5. Implement static equivalents for WordPress-only behavior such as search without silently sending internal navigation back to the live site.
6. Verify all internal routes, assets, contact-link construction, carousels, dropdowns, modals, FAQ and gallery behavior.
7. Perform actual desktop/mobile side-by-side visual comparison. Do not claim visual parity from source inspection alone.
8. Publish only the intended reviewed result through the existing deployment arrangement; do not replace ads landing pages as a side effect.
