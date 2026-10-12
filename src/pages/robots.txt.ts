import type { APIRoute } from 'astro';
import { site } from '../config/site';

/** Production robots; non-production hosts override via Cloudflare Worker. */
export const GET: APIRoute = () => {
  const body = `# najlaashutter.com
User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap-index.xml
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
