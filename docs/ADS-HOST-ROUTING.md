# Full-site release: main website + both ads landing pages

Worker: `najlaashutter-web` — static assets only; no WordPress origin fetch.

| Host/path | Behavior |
|---|---|
| `najlaashutter.com/` | Repaired full site |
| `najlaashutter.com/window-shutters-jeddah/` | Existing Arabic ads landing |
| `najlaashutter.com/en/` | Existing English ads landing |
| `ads.najlaashutter.com/` | Internal rewrite to Arabic ads landing; query preserved |
| `ads.najlaashutter.com/en/` | English ads landing |
| `www.najlaashutter.com/*` | Permanent redirect to apex, path/query preserved |
| `/about/` | Permanent redirect to `/about-us/` |

Ads pages are noindex/follow while AdsBot is allowed to crawl. Preview hosts are
noindex/nofollow and strip production GTM. Main public content is indexable.
The Worker serves robots per hostname. HTML revalidates; fingerprinted media,
fonts and Astro assets receive long immutable browser caching.

`npm ci && npm run build` produces the full `dist/`. The build reconstructs the
captured site offline, applies approved repairs, optimizes suitable images to
WebP, builds the two Astro ads pages, and combines the output. The old Arabic
landing's redirect to the homepage has been removed. `build:staging` creates a
private-review export with no production tags.

## Preserved snapshots

- `wordpress-copy`: untouched exact WordPress copy, commit `2a5ef77`.
- `replica-static-exact-2026-11-01`: same preserved replica history.
- `fixes-static-2026-11-02`: first approved repair snapshot.
- `ads-only-before-full-site-2026-11-02`: prior ads-only main branch.

`wrangler.toml` declares routes on the existing Cloudflare zone. A successful
Wrangler deployment must have Worker and zone route permissions. A Git push or
local dry-run alone is not proof of deployment or DNS/route cutover. Verify the
`X-Najlaa-Release: full-site-20261102` response header and real content on apex,
workers.dev, the Arabic URL and English URL after publication.

## Performance evidence

See `wordpress-static/qa/performance-optimization.json` for exact saved image
bytes. These are asset reductions, not a Lighthouse or live LCP claim. One early
request to the existing Worker took about 9.5 seconds in this environment; later
repeated requests were blocked with 403, so that sample cannot establish normal
site speed. No repaired-page browser rendering sign-off is claimed while the
native browser is unavailable.
