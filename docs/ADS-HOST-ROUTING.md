# Ads hostname routing (single project: `najlaashutter-web`)

One Cloudflare **Worker** deployment serves the Astro static build. There is **no** separate Pages project.

| URL | Role |
|-----|------|
| `https://najlaashutter-web.mohamed-abouzied.workers.dev/` | Staging / review (homepage + LP routes as built) |
| `https://najlaashutter-web.mohamed-abouzied.workers.dev/window-shutters-jeddah/` | **Current stable ads LP URL** for testing |
| `https://ads.najlaashutter.com/` | **Future** production ads host (not configured until DNS + Worker custom domain) |

WordPress stays at `https://najlaashutter.com/` (unchanged).

---

## Host-based behavior (implemented in `src/worker.ts`)

When the request **Host** is `ads.najlaashutter.com` and the path is **`/`**:

1. The Worker **internally** fetches the static asset for `/window-shutters-jeddah/` (same HTML as today).
2. The browser URL stays **`/`** (no redirect).
3. HTML adjustments for that case only: canonical / `og:url` → `https://ads.najlaashutter.com/`, `robots` → `noindex, follow`.

When the Host is **anything else** (e.g. `*.workers.dev`):

- No LP rewrite; `/window-shutters-jeddah/` continues to work as the normal Astro route.
- Non-production hosts keep `noindex, nofollow` via the Worker (unchanged).

**Nothing activates for `ads.najlaashutter.com` until DNS sends traffic to this Worker** (see below).

---

## Landing page in the repo

- Route: **`/window-shutters-jeddah/`** (unchanged).
- Component: `src/components/landing/LandingJeddahPage.astro` (shared markup; not a redesign).

Build: **`npm run build`** → deploy via existing Worker CI / `wrangler deploy`.

---

## Connecting `ads.najlaashutter.com` to **this** Worker (DNS stays at GoDaddy)

### What works

You can point **only the subdomain** `ads` at Cloudflare **without** moving the whole domain or creating another app:

1. Cloudflare dashboard → **Workers & Pages** → **`najlaashutter-web`** → **Settings** → **Domains & Routes** (or **Triggers** → **Custom Domains**).
2. **Add custom domain:** `ads.najlaashutter.com`.
3. Cloudflare shows a **CNAME target** (hostname varies by account; it is **not** a second project name you choose).
4. In **GoDaddy**, add **CNAME** `ads` → that exact target. Do **not** change `@`, `www`, MX, or nameservers unless you decide to later.

Traffic for `ads.najlaashutter.com` then hits the **same** Worker and asset bundle as staging.

### Limitations (no second project required, but constraints apply)

| Topic | Detail |
|-------|--------|
| **Zone on Cloudflare** | The **apex** `najlaashutter.com` does **not** need to be a full Cloudflare zone for **subdomain → Worker** custom domains; Cloudflare validates the subdomain and gives a CNAME target. |
| **Apex / www on Worker** | Attaching **`najlaashutter.com`** or **`www`** to this Worker while DNS remains entirely at GoDaddy is **much harder** (apex often needs Cloudflare DNS or advanced setup). That is **not** required for `ads.` only. |
| **SSL** | Certificate for `ads.najlaashutter.com` is provisioned by Cloudflare once the custom domain is active and DNS points correctly. |
| **No Pages project** | This path uses **Workers + static assets**, not a separate `*.pages.dev` project. |

### If custom domain on the Worker is blocked or undesirable

Discuss explicitly before building anything new:

1. **Cloudflare DNS for `ads` only** — partial setup / delegate subdomain (still one Worker).
2. **Reverse proxy** elsewhere that forwards `ads.` to the Worker URL (operational overhead).
3. **Separate host** (e.g. Pages) — **only if you explicitly approve** a second deployment; not the default.

---

## Tracking

Unchanged in code: GTM `GTM-WXVGK7F4`, GA4 `G-RE7E53N9DJ`, Google Ads `AW-17774174461`, `data-conversion="phone"` / `"whatsapp"`.

Before go-live on `ads.`, verify GA4 referral / cross-subdomain settings between `ads.najlaashutter.com` and `najlaashutter.com` in GTM/GA4 (no account changes in this repo).

---

## Paused scope

Full WordPress homepage parity and inner pages are **not** in active development. Homepage code may remain in the repo for the Worker staging URL only.
