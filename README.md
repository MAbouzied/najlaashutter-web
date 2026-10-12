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

## Cloudflare (Workers Builds + Git)

This project uses **Workers Builds** (Workers & Pages → Git). The dashboard **requires** a deploy command — saving with an empty deploy field returns “Invalid request body”.

| Setting | Value |
|--------|--------|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` or `npm run deploy` |
| Root directory | `/` |

Static files are served from `dist/` via `[assets]` in `wrangler.toml`. Do **not** use `wrangler pages deploy` or `pages_build_output_dir` here.

**Deploy auth error 10000:** In **Settings → Builds**, remove a custom `CLOUDFLARE_API_TOKEN` unless it uses the **Edit Cloudflare Workers** template. Prefer Cloudflare’s auto-generated build token.

- Node: 22+ (matches `package.json` engines)

See `docs/PHASE-2A-DELIVERABLES.md` for audit trail and open items.
