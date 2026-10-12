import type { APIRoute } from 'astro';
import { isAdsSite } from '../config/env';
import { site } from '../config/site';

/** Production robots; non-production hosts override via Cloudflare Worker / Pages _headers. */
export const GET: APIRoute = () => {
  const body = isAdsSite
    ? `# ads.najlaashutter.com — paid landing (no organic sitemap)
User-agent: *
Disallow:
`
    : `# najlaashutter.com
User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap-index.xml
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
