import { shouldBlockIndexing } from './config/indexing';

interface Env {
  ASSETS: Fetcher;
}

const STAGING_ROBOTS = `User-agent: *
Disallow: /
`;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const block = shouldBlockIndexing(url.hostname);

    if (block && url.pathname === '/robots.txt') {
      return new Response(STAGING_ROBOTS, {
        headers: {
          'Content-Type': 'text/plain; charset=UTF-8',
          'Cache-Control': 'public, max-age=300',
        },
      });
    }

    const response = await env.ASSETS.fetch(request);
    if (!block || !response.ok) return response;

    const type = response.headers.get('content-type') ?? '';
    if (!type.includes('text/html')) return response;

    const html = await response.text();
    if (/name=["']robots["']/i.test(html)) {
      return new Response(html, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    }

    const withMeta = html.replace(
      /<head(\s[^>]*)?>/i,
      '<head$1>\n<meta name="robots" content="noindex, nofollow" />',
    );

    const headers = new Headers(response.headers);
    headers.delete('content-length');
    return new Response(withMeta, { status: response.status, headers });
  },
};

export type { Env };
