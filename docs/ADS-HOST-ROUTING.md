# Ads landing app (`najlaashutter-web`)

Single Cloudflare **Worker** deployment — Google Ads Jeddah landing page only.

| URL | Content |
|-----|---------|
| `/` | Jeddah ads landing page |
| `/privacy-policy/` | Privacy policy |
| `/window-shutters-jeddah/` | **301** → `/` |
| WordPress-style inner paths (`/about/`, `/services/`, …) | **404** (Worker) |

WordPress remains at **https://najlaashutter.com/** (unchanged).

**Staging:** https://najlaashutter-web.mohamed-abouzied.workers.dev/  
**Future production host:** `ads.najlaashutter.com` — add as **Custom domain** on the same Worker when DNS is ready (GoDaddy CNAME only; no second Cloudflare app).

Archived full-site rebuild: branch **`archive/full-site-rebuild`** (not deployed).
