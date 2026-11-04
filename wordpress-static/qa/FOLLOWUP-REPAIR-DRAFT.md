# Follow-up repair draft — 5 November 2026

Status: SOURCE_PREPARED_NOT_BUILT_NOT_VISUALLY_REVIEWED_NOT_PUBLISHED

Base: performance-seo-2026-11-02 at 70ae275d3561e8561de87fafd0eb9ccc844995e1.

Prepared changes:
- Remove negative margins from the expanded desktop header logo and limit its width to 72px, retaining the existing 50px scroll state and original image asset.
- Give the mobile services disclosure a 44px hit target and reserve space in the adjacent link.
- Repair skip links during the static build: use a real local target, a focusable content element, and an Arabic label. Reuse existing IDs; add a target after the header on the homepage where no main element exists.
- Replace the two captured empty author archive headings with Arabic text and a useful link to the blog. Do not invent authorship, delete routes, or introduce redirects.

Evidence used: previously committed full visual audit, captured HTML for both author archives and about-us, original theme stylesheet (including negative .naj margins), and current repair scripts. Earlier visual evidence applies to the base only, not this draft.

Unavailable checks:
- The execution environment fails initialization; no local build or syntax tests ran.
- The ChatGPT browser tool is unavailable; no new screenshots or visual checks ran.
- No new performance measurement or SEO/Rich Results verification ran.

Before merging or publishing:
1. Build the combined static site and run existing resource, SEO and Worker checks.
2. Verify the header before/after scrolling and dropdown tap/keyboard behavior at desktop, 390px, 768px and 991px.
3. Test each skip link with keyboard focus and confirm a single target per page.
4. Review both author archive pages through their footer and follow the blog link.
5. Check all pages affected by the shared CSS visually.
6. Measure initial load and internal navigation with repeatable browser runs; do not claim speed improvement from source changes alone.

The reviewed branch, private preview, main and wordpress-copy are unchanged by this draft.
