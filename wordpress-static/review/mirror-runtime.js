/* Static equivalents for WordPress query routing and full-text search only.
 * All original visual interactions remain in the captured original scripts. */
(() => {
  const base = window.REPLICA_BASE || '/';
  const indexed = Boolean(window.REPLICA_INDEXED_ROUTES);
  const path = window.REPLICA_PATH ?? ('/' + location.pathname.slice(base.length).replace(/index\.html$/, ''));
  const renderer = window.REPLICA_PREVIEW_RENDERER || '';
  const pageUrl = path => renderer + base + path.replace(/^\//, '') + (indexed ? 'index.html' : '');
  const params = new URLSearchParams(window.REPLICA_SEARCH ?? location.search);
  if (path === '/' && params.has('s')) {
    location.replace(pageUrl('/search/') + '?' + params.toString());
    return;
  }
  const categories = {1: '/category/blog/', 7: '/category/services/'};
  if (path === '/' && categories[params.get('cat')]) {
    location.replace(pageUrl(categories[params.get('cat')]));
    return;
  }
  if (!path.startsWith('/search')) return;
  const query = params.get('s') || '';
  const normalize = s => s.normalize('NFKC').replace(/[\u064B-\u065F\u0670]/g, '').toLocaleLowerCase('ar');
  const header = document.querySelector('.search-results-header');
  if (!header) return;
  fetch(base + 'search-index.json'+(window.REPLICA_REVISION?'?v='+window.REPLICA_REVISION:'')).then(r => {
    if (!r.ok) throw new Error('Search index unavailable');
    return r.json();
  }).then(records => {
    const words = normalize(query).split(/\s+/).filter(Boolean);
    const results = words.length ? records.filter(r => words.every(w => normalize(r.title + ' ' + (r.search_text || r.text)).includes(w))) : [];
    results.sort((a, b) => {
      const rank = r => words.every(w => normalize(r.title).includes(w)) ? 1 : 0;
      return rank(b) - rank(a) || b.order - a.order;
    });
    const text = header.querySelector('h1 span');
    if (text) text.textContent = query;
    const count = header.querySelector('.fs-6');
    if (count) count.textContent = 'تم العثور على ' + results.length + ' نتائج لبحثك.';
    const column = header.parentElement;
    column.querySelectorAll(':scope > div.pw-search, :scope > nav, :scope > .pagination').forEach(n => n.remove());
    const currentPage = Math.max(1, Number(params.get('page') || 1));
    for (const r of results.slice((currentPage - 1) * 10, currentPage * 10)) {
      const card = document.createElement('div');
      card.className = 'pw-search my-3 p-2 bg-white rounded';
      card.innerHTML = '<div class="row align-items-center"><div class="col-3 col-lg-2"><a><img width="150" height="150" class="img-fluid rounded wp-post-image"></a></div><div class="col-9 col-lg-10"><a class="text-dark"><h2 class="text-unq fs-4"><i class="bi bi-file-earmark-richtext"></i> <span></span></h2></a><div><p></p></div></div></div>';
      card.querySelectorAll('a').forEach(a => {a.href = pageUrl(r.url); a.title = r.title;});
      const image = card.querySelector('img');
      if (r.image) {image.src = window.REPLICA_RESOURCE_MAP?.[r.image] || (r.image.startsWith('/') ? base + r.image.slice(1) : r.image); image.alt = r.title;} else image.remove();
      card.querySelector('h2 span').textContent = r.title;
      card.querySelector('p').textContent = r.excerpt || r.text.slice(0, 350);
      column.append(card);
    }
    if (!results.length) {
      const p = document.createElement('p');
      p.className = 'my-3';
      p.textContent = 'لم يتم العثور على نتائج.';
      column.append(p);
    }
    if (results.length > 10) {
      const holder = document.createElement('div');
      holder.className = 'bg-white p-3 my-3 mx-auto';
      const nav = document.createElement('nav');
      nav.className = 'navigation pagination';
      nav.setAttribute('aria-label', 'تعدد صفحات المقالات');
      const links = document.createElement('div');links.className = 'nav-links';
      for (let n=1;n<=Math.ceil(results.length/10);n++) {
        const item = document.createElement(n===currentPage?'span':'a');
        item.className = 'page-numbers' + (n===currentPage?' current':'');
        item.textContent = n;
        if(n===currentPage)item.setAttribute('aria-current','page');
        else item.href=pageUrl('/search/')+'?s='+encodeURIComponent(query)+'&page='+n;
        links.append(item,document.createTextNode('\n'));
      }
      nav.append(links);holder.append(nav);column.append(holder);
    }
    document.title = 'نتائج البحث عن «' + query + '» – نجلاء شتر';
    document.querySelectorAll('input[name="s"]').forEach(input => {input.value = query;});
  }).catch(() => {
    const count = header.querySelector('.fs-6');
    if (count) count.textContent = 'تعذر تحميل نتائج البحث. يرجى إعادة المحاولة.';
  });
})();
