/**
 * Desktop hero-only screenshots: WP vs Astro + multi-width Astro checks.
 * Usage: node scripts/capture-hero-desktop-parity.mjs [astroUrl] [wpUrl]
 */
import { chromium } from 'playwright';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const astroUrl =
  process.argv[2]?.replace(/\/$/, '') || 'https://najlaashutter-web.mohamed-abouzied.workers.dev';
const wpUrl = process.argv[3]?.replace(/\/$/, '') || 'https://najlaashutter.com';
const outDir = fileURLToPath(new URL('../docs/review-screenshots/hero-fix/', import.meta.url));
mkdirSync(outDir, { recursive: true });

const widths = [1280, 1440, 1690, 1920];
const heroSel = '.hero-carousel--desktop, #pwCarousel';

async function heroClip(page) {
  const box = await page.locator(heroSel).first().boundingBox();
  if (!box) throw new Error('Hero not found');
  const headerBottom = await page.evaluate(() => {
    const h = document.getElementById('pw-header');
    return h ? h.getBoundingClientRect().bottom : 0;
  });
  const y = Math.max(0, headerBottom - 8);
  const height = Math.min(box.height + (box.y - y), 720);
  return { x: 0, y, width: box.width + box.x, height };
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

for (const w of widths) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.goto(astroUrl, { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForSelector('.hero-carousel--desktop', { timeout: 30000 });
  const clip = await heroClip(page);
  await page.screenshot({
    path: path.join(outDir, `astro-hero-${w}.png`),
    clip,
  });
}

await page.setViewportSize({ width: 1440, height: 900 });
try {
  await page.goto(wpUrl, { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForSelector('#pwCarousel', { timeout: 30000 });
  const clip = await heroClip(page);
  await page.screenshot({
    path: path.join(outDir, 'wordpress-hero-1440.png'),
    clip,
  });
} catch (e) {
  console.warn('WordPress hero capture failed:', e.message);
}

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(astroUrl, { waitUntil: 'networkidle', timeout: 120000 });
await page.waitForSelector('.hero-carousel--desktop');
const clipAstro = await heroClip(page);
await page.screenshot({ path: path.join(outDir, 'astro-hero-1440.png'), clip: clipAstro });

const sideBySideHtml = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><title>Hero parity 1440</title>
<style>body{margin:0;font-family:system-ui;background:#111;color:#eee}
.wrap{display:flex;gap:8px;padding:8px;align-items:flex-start}
.wrap figure{margin:0;flex:1}
.wrap img{width:100%;height:auto;display:block;border:1px solid #333}
figcaption{text-align:center;padding:6px;font-size:14px}</style></head>
<body><div class="wrap">
<figure><img src="wordpress-hero-1440.png" alt="WordPress hero"><figcaption>WordPress (1440)</figcaption></figure>
<figure><img src="astro-hero-1440.png" alt="Astro hero"><figcaption>Astro staging (1440)</figcaption></figure>
</div></body></html>`;
writeFileSync(path.join(outDir, 'side-by-side-1440.html'), sideBySideHtml);

await browser.close();
console.log('Hero parity screenshots:', outDir);
