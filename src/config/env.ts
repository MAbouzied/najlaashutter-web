/** Staging builds: set PUBLIC_STAGING=true (Cloudflare Pages env or local build:staging). */
export const isStaging = import.meta.env.PUBLIC_STAGING === 'true';
