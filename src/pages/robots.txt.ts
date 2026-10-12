import type { APIRoute } from 'astro';
import { isStaging } from '../config/env';
import { site } from '../config/site';

export const GET: APIRoute = () => {
  const body = isStaging
    ? `# Staging preview — do not index\nUser-agent: *\nDisallow: /\n`
    : `# Production (pre–full launch)\nUser-agent: *\nAllow: /window-shutters-jeddah/\n\nSitemap: ${site.url}/sitemap-index.xml\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
