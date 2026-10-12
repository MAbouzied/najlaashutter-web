/** Production hosts that may be indexed (main WordPress site only). */
export const PRODUCTION_HOSTS = new Set(['najlaashutter.com', 'www.najlaashutter.com']);

/** Paid ads landing host — never index; Worker serves LP at `/` via internal rewrite. */
export const ADS_HOSTS = new Set(['ads.najlaashutter.com']);

export function isAdsHost(hostname: string): boolean {
  const host = hostname.toLowerCase().split(':')[0];
  return ADS_HOSTS.has(host);
}

export function isProductionHost(hostname: string): boolean {
  const host = hostname.toLowerCase().split(':')[0];
  return PRODUCTION_HOSTS.has(host);
}

/** Non-production preview hosts must never be indexed. */
export function shouldBlockIndexing(hostname: string): boolean {
  const host = hostname.toLowerCase().split(':')[0];
  if (isAdsHost(host)) return true;
  if (isProductionHost(host)) return false;
  if (host === 'localhost' || host === '127.0.0.1') return true;
  if (host.endsWith('.workers.dev')) return true;
  if (host.endsWith('.pages.dev')) return true;
  if (host.includes('preview')) return true;
  return true;
}
