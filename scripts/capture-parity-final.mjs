/**
 * Visual parity captures: WP vs Astro at multiple viewports + section crops.
 * Usage: node scripts/capture-parity-final.mjs [astroUrl] [wpUrl]
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const astroUrl =
  process.argv[2]?.replace(/\/$/, '') || 'https://najlaashutter-web.mohamed-abouzied.workers.dev';
const wpUrl = process.argv[3]?.replace(/\/$/, '') || 'https://najlaashutter.com';
const widths = [390, 768, 992, 1280, 1440, 1690, 1920];
const outDir = fileURLToPath(new URL('../docs/parity-final/', import.meta.url));
mkdirSync(outDir, { recursive: true });

const sections = [
  { id: 'header', sel: '#pw-header-top, #pw-header' },
  { id: 'hero', sel: '.hero-carousel--desktop, .hero-carousel--mobile, #pwCarousel, #pwCarouselMob' },
  { id: 'services', sel: '#main-srv, .services' },
  { id: 'about', sel: '.bg-new' },
  { id: 'projects', sel: '.pw-clip-box' },
  { id: 'reviews', sel: '.reviews-section' },
  { id: 'why-us', sel: '.section-why-us' },
  { id: 'faq', sel: '.home-accordion, .accordion' },
  { id: 'blog', sel: '.pw-hom-swp3-blog, section:has(.pw-hom-swp3)' },
  { id: 'footer', sel: '#footer' },
];

async function capture(page, url, label, width) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
  await page.screenshot({
    path: path.join(outDir, `${label}-full-${width}.png`),
    fullPage: true,
  });
  for (const sec of sections) {
    const loc = page.locator(sec.sel).first();
    if (await loc.count()) {
      try {
        await loc.screenshot({ path: path.join(outDir, `${label}-${sec.id}-${width}.png`) });
      } catch {
        /* section not visible at width */
      }
    }
  }
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
for (const w of widths) {
  try {
    await capture(page, wpUrl, 'wordpress', w);
  } catch (e) {
    console.warn('WP capture failed', w, e.message);
  }
  await capture(page, astroUrl, 'astro', w);
}
await browser.close();
console.log('Parity captures in docs/parity-final/');
