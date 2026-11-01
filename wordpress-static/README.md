# WordPress static replica

Source: https://najlaashutter.com/

This directory preserves the original generated page markup, original images,
fonts, stylesheets and JavaScript. The existing ads landing pages are separate.

## Rebuild offline

```sh
python3 scripts/mirror-wordpress.py build
python3 scripts/verify-replica.py
```

The resulting `wordpress-static/site/` is a conventional static website. Original
resource bytes are stored as Base64 text next to the source manifest so all files
can be recreated offline without WordPress or additional Python packages.

`wrangler.replica.toml` points to this explicit export. The normal `wrangler.toml`
and normal `npm run build` still refer to the existing ads landing pages.

## Review

The `review/` directory is a separate review transport for a static-file CDN. It
loads the same captured pages and original resource bytes in the browser. Its
loader is not part of the production export.

- `review/index.html`: website preview.
- `review/compare.html`: original and replica at equal viewport sizes.
- `review/qa.html`: actual browser interaction checks.
- `qa/source-verification.json`: offline source, asset, content and route checks.

## Current status

Capture and verification are in progress. Do not treat an initial review version
as final parity sign-off; some resources may still reference their original URL
until resource capture finishes. No live WordPress or ads deployment was changed.
