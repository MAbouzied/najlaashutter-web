import { isAdsHost, shouldBlockIndexing } from './config/indexing';

interface Env {
  ASSETS: Fetcher;
}

const STAGING_ROBOTS = `User-agent: *
Disallow: /
`;

const LEGACY_LP_PATHS = new Set(['/window-shutters-jeddah', '/window-shutters-jeddah/']);

/** WordPress inner routes — must not expose unfinished Astro pages. */
const BLOCKED_SITE_PATHS = [
  '/about',
  '/about-us',
  '/services',
  '/category/services',
  '/our-works',
  '/category/blog',
  '/faq',
  '/contact-us',
];

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
  return pathname || '/';
}

function isBlockedSitePath(pathname: string): boolean {
  const p = normalizePath(pathname);
  return BLOCKED_SITE_PATHS.some((blocked) => p === blocked || p.startsWith(`${blocked}/`));
}

function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith('/_astro/') ||
    pathname.startsWith('/fonts/') ||
    pathname.startsWith('/assets/') ||
    pathname === '/favicon.svg' ||
    pathname === '/favicon.png' ||
    pathname === '/robots.txt'
  );
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const block = shouldBlockIndexing(url.hostname);
    const path = url.pathname;

    if (LEGACY_LP_PATHS.has(path)) {
      return Response.redirect(new URL('/', url), 301);
    }

    if (isBlockedSitePath(path) && !isStaticAsset(path)) {
      return new Response('Not Found', { status: 404 });
    }

    if (block && path === '/robots.txt') {
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

    let html = await response.text();
    const hasRobotsMeta = /name=["']robots["']/i.test(html);
    const robotsContent = isAdsHost(url.hostname) ? 'noindex, follow' : 'noindex, nofollow';

    if (isAdsHost(url.hostname)) {
      const adsOrigin = `https://${url.hostname.toLowerCase().split(':')[0]}`;
      html = html
        .replace(
          /<link rel="canonical" href="[^"]*"/i,
          `<link rel="canonical" href="${adsOrigin}/"`,
        )
        .replace(
          /<meta property="og:url" content="[^"]*"/i,
          `<meta property="og:url" content="${adsOrigin}/"`,
        );
    }

    if (hasRobotsMeta) {
      html = html.replace(
        /<meta name="robots" content="[^"]*"/i,
        `<meta name="robots" content="${robotsContent}"`,
      );
    } else {
      html = html.replace(
        /<head(\s[^>]*)?>/i,
        `<head$1>\n<meta name="robots" content="${robotsContent}" />`,
      );
    }

    const headers = new Headers(response.headers);
    headers.delete('content-length');
    return new Response(html, { status: response.status, headers });
  },
};

export type { Env };
