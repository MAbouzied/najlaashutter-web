# Google Ads landing — Cloudflare Pages handoff

Production hostname: **https://ads.najlaashutter.com/**  
WordPress (unchanged): **https://najlaashutter.com/**

---

## 1. Cloudflare Pages project

| Item | Value |
|------|--------|
| Suggested project name | `najlaashutter-ads` |
| Expected Pages URL | **https://najlaashutter-ads.pages.dev/** |
| Build command | `npm run build:ads` |
| Build output directory | `dist` |
| Node.js version | **22** (see `package.json` engines) |

**Important:** Use `npm run build:ads`, not `npm run build`. The ads script temporarily swaps the homepage out so `dist/` contains only the Jeddah LP at `/`, plus `privacy-policy/`, redirects, and assets.

Optional Pages environment variables (the script sets these for local/CI builds; setting them in the dashboard is harmless):

- `PUBLIC_ADS_SITE=true`
- `PUBLIC_SITE_URL=https://ads.najlaashutter.com`

No Workers runtime is required for this project (static assets only).

---

## 2. GoDaddy DNS (manual — do not automate)

After the Pages project exists and you have deployed at least once:

| Field | Value |
|-------|--------|
| Type | **CNAME** |
| Name / Host | **ads** |
| Points to / Value | **najlaashutter-ads.pages.dev** |
| TTL | Default (e.g. 1 hour) |

Do **not** change nameservers, `@`, `www`, or MX records.

---

## 3. Cloudflare Pages custom domain (manual)

DNS alone is not enough:

1. Cloudflare Dashboard → **Workers & Pages** → project **najlaashutter-ads**
2. **Custom domains** → **Set up a custom domain**
3. Enter **ads.najlaashutter.com**
4. Complete validation (CNAME at GoDaddy must match the target above)

---

## 4. What the ads build ships

| Route | Behavior |
|-------|----------|
| `/` | Jeddah landing page (same layout/content as legacy `/window-shutters-jeddah/`) |
| `/window-shutters-jeddah/` | **301** → `/` (via `deploy/ads/_redirects`) |
| `/privacy-policy/` | Privacy page |
| `/robots.txt` | No sitemap reference on ads build |

The unfinished Astro **homepage is not built** into the ads deployment.

---

## 5. SEO / indexing

- **ads.najlaashutter.com:** `noindex, follow` in HTML; canonical **https://ads.najlaashutter.com/**
- **\*.pages.dev:** `X-Robots-Tag: noindex, follow` via `_headers` on ads build
- No sitemap integration when `PUBLIC_ADS_SITE=true`

---

## 6. Tracking (unchanged)

| Tag | ID |
|-----|-----|
| GTM | `GTM-WXVGK7F4` |
| GA4 | `G-RE7E53N9DJ` |
| Google Ads | `AW-17774174461` |

Conversion hooks: `data-conversion="phone"` and `data-conversion="whatsapp"`. No new Ads conversion labels were added.

### GA4 / GTM — verify before launch

Both hosts share the registrable domain **najlaashutter.com**:

- **Referral / self-referral:** If the LP links to `https://najlaashutter.com/`, confirm GA4 treats `ads.najlaashutter.com` → `najlaashutter.com` as you expect (internal vs referral). Adjust **Referral exclusion list** or cross-domain settings in GA4 if needed.
- **Cookie domain:** If you use a single GA4 property for both sites, consider `_ga` cookie domain `.najlaashutter.com` in GTM/GA4 config so sessions can stitch across subdomains (only if you want unified reporting).
- **Google Ads auto-tagging:** Landing URL in Ads should eventually point to `https://ads.najlaashutter.com/` (you asked not to change Ads yet).

---

## 7. Production contact actions

| Channel | Value |
|---------|--------|
| WhatsApp | `+966535344170` / `https://wa.me/966535344170?...` |
| Phone | `tel:+966535344170` |
| Email | `info@najlaashutter.com` |

---

## 8. Deploy without Git (optional)

With `CLOUDFLARE_API_TOKEN` set:

```bash
npm run build:ads
npx wrangler pages deploy dist --project-name=najlaashutter-ads --branch=main
```

First-time project creation may require the Cloudflare dashboard or `wrangler pages project create najlaashutter-ads`.

---

## 9. QA checklist (re-run on **\*.pages.dev** after deploy)

- [ ] `/` shows Jeddah LP; no homepage
- [ ] `/window-shutters-jeddah/` redirects to `/`
- [ ] `/privacy-policy/` loads
- [ ] WhatsApp + tel links correct
- [ ] GTM loads (`GTM-WXVGK7F4`)
- [ ] No `htmcssjs.com` requests
- [ ] Mobile widths 320–430: no horizontal overflow
- [ ] Lighthouse mobile: Performance ≥ 90 (target), Accessibility 100, CLS ≤ 0.1

Local preflight (against `serve dist`): overflow **pass** at 320–430; Lighthouse on localhost is not representative of Pages CDN (GTM + local server lowered performance score).

---

## 10. Manual actions summary

**You (GoDaddy):** CNAME `ads` → `najlaashutter-ads.pages.dev`

**You (Cloudflare Pages):** Create project, connect repo or upload `dist`, set build to `npm run build:ads`, add custom domain `ads.najlaashutter.com`

**Not in scope:** WordPress, Google Ads URL changes, nameserver moves, DNS automation
