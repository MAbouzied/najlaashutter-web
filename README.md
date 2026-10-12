# Najlaa Shutter — custom website (Phase 2A)

Static [Astro](https://astro.build) site for **najlaashutter.com**. WordPress backup is reference-only (`../_wp-reference-readonly/`).

## Commands

```bash
cd najlaashutter-web
npm install
npm run dev      # http://localhost:4321
npm run build    # output: dist/
npm run preview  # serve dist/
```

## Phase 2A scope

- Global layout, design tokens, contact/tracking config
- Landing page: `/window-shutters-jeddah/`
- Placeholder `/` (noindex) until Phase 2B homepage

## Cloudflare Pages

- **Build command:** `npm run build` (production) or `npm run build:staging` (noindex preview)
- **Build output directory:** `dist`
- **Build output directory:** `dist`
- **Deploy command:** leave **empty** when the project is connected to Git. Cloudflare publishes `dist` after `npm run build` — no Wrangler step needed.

Do **not** use `npx wrangler deploy` (Workers). Do **not** set `npm run pages:deploy` on Git builds unless you need a manual Wrangler upload; it calls the Pages API and can fail with token/auth errors even when the build is fine. For local CLI deploy only: `npm run pages:deploy` (uses `name` in `wrangler.toml`).

- Node: 22+ (matches `package.json` engines)

See `docs/PHASE-2A-DELIVERABLES.md` for audit trail and open items.
