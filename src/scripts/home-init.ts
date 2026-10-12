import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initSwipers() {
  const common = {
    modules: [Navigation],
    spaceBetween: 30,
    grabCursor: true,
  };

  const mk = (
    sel: string,
    prev: string,
    next: string,
    slidesPerView: Record<number, number | 'auto'>,
  ) => {
    const el = document.querySelector<HTMLElement>(sel);
    if (!el) return;
    const breakpoints: Record<number, { slidesPerView: number }> = {};
    for (const [w, spv] of Object.entries(slidesPerView)) {
      if (spv !== 'auto') breakpoints[Number(w)] = { slidesPerView: spv };
    }
    new Swiper(el, {
      ...common,
      slidesPerView: 1.15,
      breakpoints,
      navigation: { prevEl: prev, nextEl: next },
    });
  };

  mk('.pw-hom-swp1', '.pw-hom1-prev', '.pw-hom1-next', { 0: 1.15, 768: 2.2, 992: 3, 1200: 3.5 });
  mk('.pw-hom-swp2', '.pw-hom2-prev', '.pw-hom2-next', { 0: 1.15, 768: 2, 992: 3 });
  mk('.pw-hom-swp3-projects', '.pw-hom3-prev', '.pw-hom3-next', { 0: 1.1, 768: 2, 992: 2.5, 1200: 3 });
  mk('.pw-hom-swp3-blog', '.pw-hom4-prev', '.pw-hom4-next', { 0: 1.15, 768: 2.2, 992: 3, 1200: 3.5 });
}

function initScrollAnimations() {
  if (reducedMotion) {
    document.querySelectorAll('[data-home-animate]').forEach((el) => el.classList.add('is-inview'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-inview');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -5% 0px' },
  );
  document.querySelectorAll('[data-home-animate]').forEach((el) => io.observe(el));
}

function initAccordion() {
  document.querySelectorAll<HTMLElement>('[data-faq-item]').forEach((item) => {
    const btn = item.querySelector<HTMLButtonElement>('[data-faq-trigger]');
    const panel = item.querySelector<HTMLElement>('[data-faq-panel]');
    if (!btn || !panel) return;
    btn.addEventListener('click', () => {
      const open = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.hidden = !open;
    });
  });
}

function initScrollProgress() {
  const btn = document.getElementById('pw-to-top');
  if (!btn) return;
  const ring = btn.querySelector<SVGCircleElement>('[data-progress-ring]');
  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? y / max : 0;
    btn.classList.toggle('is-visible', y > 300);
    if (ring) {
      const c = 2 * Math.PI * 18;
      ring.style.strokeDashoffset = String(c * (1 - p));
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  onScroll();
}

function initBookingForm() {
  const form = document.getElementById('pw-book-form') as HTMLFormElement | null;
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = String(fd.get('name') || '').trim();
    const message = String(fd.get('message') || '').trim();
    const text = `السلام عليكم، أنا ${name || 'عميل'}. ${message}`;
    const base = form.getAttribute('data-wa-base') || '';
    window.open(`${base}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  });
}

function initBottomMenu() {
  const menu = document.getElementById('pw-bottom-menu');
  const openBtns = document.querySelectorAll('[data-open-nav]');
  const setOpen = (open: boolean) => {
    menu?.classList.toggle('is-open', open);
    menu?.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.classList.toggle('home-menu-open', open);
    openBtns.forEach((b) => b.setAttribute('aria-expanded', open ? 'true' : 'false'));
  };
  openBtns.forEach((b) => b.addEventListener('click', () => setOpen(true)));
  document.querySelectorAll('[data-close-nav]').forEach((el) => el.addEventListener('click', () => setOpen(false)));
  document.querySelectorAll('[data-services-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sub = btn.parentElement?.querySelector('[data-services-sub]');
      sub?.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', sub?.classList.contains('is-open') ? 'true' : 'false');
    });
  });
}

export function initHomePage() {
  initSwipers();
  initScrollAnimations();
  initAccordion();
  initScrollProgress();
  initBookingForm();
  initBottomMenu();
}

if (document.body.classList.contains('home-atira')) {
  initHomePage();
}
