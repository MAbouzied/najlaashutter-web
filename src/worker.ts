import { isAdsHost, shouldBlockIndexing } from './config/indexing';

interface Env {
  ASSETS: Fetcher;
}

const STAGING_ROBOTS = `User-agent: *
Disallow: /
`;

/** Built Astro path for the Jeddah ads LP (unchanged route in repo). */
const ADS_LANDING_ASSET_PATH = '/window-shutters-jeddah/';

function isAdsLandingRoot(pathname: string): boolean {
  return pathname === '/' || pathname === '';
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const adsHost = isAdsHost(url.hostname);
    const block = shouldBlockIndexing(url.hostname);

    if (block && url.pathname === '/robots.txt') {
      return new Response(STAGING_ROBOTS, {
        headers: {
          'Content-Type': 'text/plain; charset=UTF-8',
          'Cache-Control': 'public, max-age=300',
        },
      });
    }

    let assetRequest = request;
    if (adsHost && isAdsLandingRoot(url.pathname)) {
      const lpUrl = new URL(ADS_LANDING_ASSET_PATH, url.origin);
      assetRequest = new Request(lpUrl, request);
    }

    const response = await env.ASSETS.fetch(assetRequest);
    if (!block || !response.ok) return response;

    const type = response.headers.get('content-type') ?? '';
    if (!type.includes('text/html')) return response;

    let html = await response.text();
    const hasRobotsMeta = /name=["']robots["']/i.test(html);

    if (adsHost && isAdsLandingRoot(url.pathname)) {
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

    if (adsHost) {
      const robotsContent = 'noindex, follow';
      html = hasRobotsMeta
        ? html.replace(
            /<meta name="robots" content="[^"]*"/i,
            `<meta name="robots" content="${robotsContent}"`,
          )
        : html.replace(
            /<head(\s[^>]*)?>/i,
            `<head$1>\n<meta name="robots" content="${robotsContent}" />`,
          );
    } else if (!hasRobotsMeta) {
      html = html.replace(
        /<head(\s[^>]*)?>/i,
        '<head$1>\n<meta name="robots" content="noindex, nofollow" />',
      );
    } else {
      return new Response(html, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    }

    const headers = new Headers(response.headers);
    headers.delete('content-length');
    return new Response(html, { status: response.status, headers });
  },
};

export type { Env };
