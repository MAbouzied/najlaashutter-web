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

## Capture and verification

The export contains 63 routes and 234 captured original resource files. Offline
source verification passes with zero errors. A clean rebuild using only captured
HTML and Base64 resources reproduces all 301 output files byte for byte.
Browser checks and visual review are recorded in `qa/browser-review.json`.

The static search preserves the captured WordPress result order, excerpts and
10-result pagination. Forms retain the original WhatsApp destinations.

Two upstream archive pagination URLs returned database errors during capture.
Their cards were reconstructed using the original archive markup and captured
WordPress post/taxonomy metadata; raw error responses remain in
`source/upstream-errors/`. The original missing `overlay.png` remains a local 404.
The broken original `/about/` footer destination is retained; `/about-us/` works.

## Production export

```sh
python3 scripts/mirror-wordpress.py build --production
python3 scripts/verify-replica.py
```

The default review build disables indexing. `--production` removes that review
restriction. Upload `wordpress-static/site/` to a separately configured static
host. Do not use `wrangler.replica.toml` without checking its Worker name: it
currently references the existing Worker. No live deployment, domain change,
main-branch merge or ads landing-page change was made by this replica work.

The GitHub HTMLPreview URL is a review transport, separate from the production
static files. It depends on public GitHub and HTMLPreview availability.
