/** One static release: repaired full site plus both existing ads pages. */
interface Env { ASSETS: Fetcher; }
const PROD = new Set(['najlaashutter.com', 'www.najlaashutter.com']);
const ADS = 'ads.najlaashutter.com';
const RELEASE = 'performance-seo-20261102';
const PAID = /^\/(?:window-shutters-jeddah|en)(?:\/|$)/;
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url), host = url.hostname.toLowerCase();
    const production = PROD.has(host), ads = host === ADS;
    if (host === 'www.najlaashutter.com') {url.hostname='najlaashutter.com';return Response.redirect(url,301);}
    if (url.pathname === '/about' || url.pathname === '/about/') {url.pathname='/about-us/';return Response.redirect(url,301);}
    if (url.pathname === '/robots.txt') {
      const body = production
        ? 'User-agent: AdsBot-Google\nAllow: /\n\nUser-agent: AdsBot-Google-Mobile\nAllow: /\n\nUser-agent: *\nAllow: /\nDisallow: /search/\nSitemap: https://najlaashutter.com/sitemap.xml\n'
        : 'User-agent: AdsBot-Google\nAllow: /\n\nUser-agent: AdsBot-Google-Mobile\nAllow: /\n\nUser-agent: *\nDisallow: /\n';
      return new Response(body,{headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'public, max-age=300','X-Najlaa-Release':RELEASE}});
    }
    const assetUrl = new URL(url);
    if (ads && url.pathname === '/') assetUrl.pathname='/window-shutters-jeddah/';
    const response = await env.ASSETS.fetch(new Request(assetUrl,request));
    const headers = new Headers(response.headers);
    headers.set('X-Najlaa-Release',RELEASE);
    const type = headers.get('content-type') || '';
    const noindex = !production || PAID.test(url.pathname);
    if (type.includes('text/html')) {
      let html = await response.text();
      if (noindex) {
        const robots = production || ads ? 'noindex, follow' : 'noindex, nofollow';
        html=html.replace(/<meta\s+name=["']robots["'][^>]*>/gi,'');
        html=html.replace('</head>',`<meta name="robots" content="${robots}"></head>`);
        headers.set('X-Robots-Tag',robots);
      } else headers.delete('X-Robots-Tag');
      if (ads) {
        const canonical = `https://${ADS}${url.pathname}`;
        html=html.replace(/(<link\s+rel="canonical"\s+href=")[^"]*/i,'$1'+canonical).replace(/(<meta\s+property="og:url"\s+content=")[^"]*/i,'$1'+canonical);
      }
      if (!production && !ads) html=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,s=>/gtm\.start|googletagmanager\.com/.test(s)?'':s).replace(/<noscript>[\s\S]*?googletagmanager\.com[\s\S]*?<\/noscript>/gi,'');
      headers.delete('content-length');headers.delete('content-encoding');
      headers.set('Cache-Control','public, max-age=0, must-revalidate');
      return new Response(html,{status:response.status,headers});
    }
    if (/^\/(?:mirror-assets|_astro)\//.test(url.pathname) && response.ok) headers.set('Cache-Control','public, max-age=31536000, immutable');
    else if (/^\/fonts\//.test(url.pathname) && response.ok) headers.set('Cache-Control','public, max-age=86400');
    else if (/\.(?:js|css|json)$/.test(url.pathname) && response.ok) headers.set('Cache-Control','public, max-age=0, must-revalidate');
    return new Response(response.body,{status:response.status,headers});
  }
};
export type {Env};
