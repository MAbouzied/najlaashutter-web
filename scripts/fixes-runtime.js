/* Repair contact and sharing behavior without changing captured source files. */
(() => {
  const PHONE = '966535344170';
  const messageUrl = (name, message, title, source) => {
    const query = new URLSearchParams({phone: PHONE, text: `الاسم: ${name}\nالرسالة: ${message}\nالصفحة: ${title}\nالمصدر: ${source}`});
    return 'https://api.whatsapp.com/send?' + query.toString();
  };
  window.NajlaaContact = {messageUrl};
  document.querySelectorAll('form[data-contact-form]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = form.querySelector('[name=name]');
      const message = form.querySelector('[name=message]');
      name.setCustomValidity(name.value.trim() ? '' : 'يرجى كتابة الاسم.');
      message.setCustomValidity(message.value.trim() ? '' : 'يرجى كتابة استفسارك.');
      if (!form.reportValidity()) return;
      const sourceUrl = new URL(location.pathname, 'https://najlaashutter.com');
      const campaign = new URLSearchParams(location.search);
      ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(key => {if (campaign.has(key)) sourceUrl.searchParams.set(key, campaign.get(key));});
      const source = sourceUrl.href;
      const href = messageUrl(name.value.trim(), message.value.trim(), document.querySelector('h1')?.textContent.trim() || document.title, source);
      window.open(href, '_blank', 'noopener,noreferrer');
      const status = form.querySelector('[role=status]');
      status.textContent = '';
      status.append(document.createTextNode('ستفتح رسالة واتساب لتراجعها وترسلها بنفسك. '));
      const fallback = document.createElement('a');
      fallback.href = href; fallback.target = '_blank'; fallback.rel = 'noopener noreferrer';
      fallback.textContent = 'فتح واتساب'; status.append(fallback);
    });
    form.querySelectorAll('input,textarea').forEach(input => input.addEventListener('input', () => input.setCustomValidity('')));
  });
  document.querySelectorAll('.pw-side-menu .ox-btn').forEach(toggle => {
    toggle.setAttribute('role', 'button'); toggle.tabIndex = 0;
    toggle.setAttribute('aria-label', 'إظهار أو إخفاء الخدمات الفرعية');
    const update = () => toggle.setAttribute('aria-expanded', String(!toggle.parentElement.querySelector('.sub-menu').classList.contains('d-none')));
    toggle.addEventListener('click', update);
    toggle.addEventListener('keydown', e => {if (e.key === 'Enter' || e.key === ' ') {e.preventDefault(); toggle.click();}});
    update();
  });
  const share = document.getElementById('pw-share');
  const status = document.getElementById('share-status');
  share?.addEventListener('click', async () => {
    const url = new URL(location.pathname, 'https://najlaashutter.com').href;
    try {
      if (navigator.share) {await navigator.share({title: document.title, url}); return;}
      if (navigator.clipboard?.writeText) {await navigator.clipboard.writeText(url); status.textContent = 'تم نسخ رابط الصفحة.'; return;}
      throw Error('clipboard unavailable');
    } catch (error) {
      if (error.name === 'AbortError') return;
      status.replaceChildren(document.createTextNode('انسخ رابط الصفحة: '));
      const input = document.createElement('input'); input.readOnly = true; input.value = url;
      input.setAttribute('aria-label', 'رابط الصفحة للمشاركة'); status.append(input); input.focus(); input.select();
    }
  });
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches;
  function applyMotion() {
    document.documentElement.classList.toggle('motion-paused', paused);
    document.querySelectorAll('.swiper').forEach(el => { if (paused) el.swiper?.autoplay?.stop(); else el.swiper?.autoplay?.start(); });
    document.querySelectorAll('.carousel').forEach(el => { const c = window.bootstrap?.Carousel.getOrCreateInstance(el); if (paused) c?.pause(); else c?.cycle(); });
  }
  reduced.addEventListener?.('change', () => {paused = reduced.matches; applyMotion();});
  addEventListener('load', applyMotion, {once:true});
  applyMotion();
})();
