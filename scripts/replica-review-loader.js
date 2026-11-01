/* Review transport only: the production export uses ordinary local asset files.
 * The browser receives the unchanged captured resources as data URLs so this
 * review can run on a read-only static-file CDN without a hosting configuration. */
(async () => {
  const base = '__PREFIX__';
  const revision = '__REVISION__';
  const renderer = 'https://htmlpreview.github.io/?https://raw.githubusercontent.com';
  const current = new URL(location.hostname==='htmlpreview.github.io' ? location.search.slice(1) : location.href);
  const pathname = decodeURI(current.pathname.slice(base.length));
  const route = pathname.replace(/index\.html$/, '');
  const response = await fetch(base + 'pages/' + route + 'index.html?v='+revision);
  if (!response.ok) throw new Error('Review page unavailable: ' + response.status);
  let html = await response.text();
  const map = window.REPLICA_RESOURCE_MAP;
  for (const [url, data] of Object.entries(map).sort((a,b) => b[0].length-a[0].length)) {
    html = html.split(url).join(data);
  }
  const page = value => {
    const url = new URL(value, 'https://replica.example/');
    let path = url.pathname;
    if (path.endsWith('/')) path += 'index.html';
    url.searchParams.set('v',revision);
    return renderer + base + path.replace(/^\//, '') + url.search + url.hash;
  };
  html = html.replace(/\b(href|action|src)=(["'])(.*?)\2/g, (whole, key, quote, value) => {
    if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/cdn-cgi/l/email-protection')) return whole;
    return key + '=' + quote + (key==='src' ? base+value.slice(1) : page(value)) + quote;
  });
  const config = {REPLICA_BASE:base,REPLICA_INDEXED_ROUTES:true,REPLICA_PATH:'/'+route,REPLICA_SEARCH:current.search,REPLICA_PREVIEW_RENDERER:renderer,REPLICA_REVISION:revision};
  html = html.replace('<head>', '<head><base href="https://raw.githubusercontent.com/">');
  html = html.replace('</head>', '<script>Object.assign(window,'+JSON.stringify(config)+');<\/script></head>');
  html = html.replace('</body>', '<script>document.documentElement.dataset.replicaReady="true";<\/script></body>');
  document.open();
  document.write(html);
  document.close();
})().catch(error => {
  document.body.textContent = 'تعذر تحميل المعاينة: ' + error.message;
});
