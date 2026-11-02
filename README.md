# Najlaa Shutter — full static site and Jeddah ads pages

Repaired static WordPress export plus the existing Arabic and English Astro ads pages.
The original exact copy is preserved on `wordpress-copy`; see `docs/ADS-HOST-ROUTING.md` for routing, rollback and verification.

## Routes

- `/`: repaired full website
- `/en/`: English landing page
- `/privacy-policy/`: privacy policy
- `/window-shutters-jeddah/`: Arabic landing page; no redirect to the website homepage

Preview: https://najlaashutter-web.mohamed-abouzied.workers.dev/
Planned ads host: https://ads.najlaashutter.com/

## Build and deploy

Use Node 22.12+, Python 3, and `npm ci`, then `npm run build`.
The build runs source verification, image optimization, export link/resource verification and Worker routing tests.
Cloudflare build command: `npm run build`.
Cloudflare deploy command: `npx wrangler deploy` (or `npm run deploy`).
The Worker name is `najlaashutter-web`; static assets come from `dist/`.
The production Git branch is `main`. Verify the Cloudflare build result after pushing; a Git commit alone does not prove publication.

## Contact buttons and branding

Use `Button.astro` for styled contact CTAs; its CSS is component-scoped, so assigning its class names to a plain anchor is insufficient.
Both language pages include phone and WhatsApp links with the existing `data-conversion` markers. A fixed contact bar remains visible below 1024px, including portrait tablet layouts. GTM is preserved; live conversion firing must be verified separately.
Favicons use the original N mark in `src/assets/brand/logo.png`. The favicon link is versioned to refresh cached icons.

## Review

Before completing a release, visually inspect both languages on mobile, tablet and desktop. Check CTA visibility, text wrapping, horizontal overflow, fixed-bar clearance, images and favicon. Do not click live contact links to manufacture test conversions.
