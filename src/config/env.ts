/** Staging builds: set PUBLIC_STAGING=true (Cloudflare Pages env or local build:staging). */
export const isStaging = import.meta.env.PUBLIC_STAGING === 'true';

/** Lighthouse / perf diagnosis only — set PUBLIC_DISABLE_GTM=true at build time. Tracking stays in production. */
export const isGtmDisabled = import.meta.env.PUBLIC_DISABLE_GTM === 'true';
