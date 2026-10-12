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
- **Deploy command:** leave **empty** — Pages uploads `dist` automatically from Git.

Do **not** use `npx wrangler deploy` (Workers). That fails on this static site with “Missing entry-point to Worker script”. If you must deploy from CI with Wrangler, use `npm run pages:deploy` (`wrangler pages deploy dist`). Project name and `pages_build_output_dir` are in `wrangler.toml`.

- Node: 22+ (matches `package.json` engines)

See `docs/PHASE-2A-DELIVERABLES.md` for audit trail and open items.
