import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const outDir = fileURLToPath(new URL('../docs/review-screenshots/parity/', import.meta.url));
mkdirSync(outDir, { recursive: true });

const astroUrl = process.argv[2]?.replace(/\/$/, '') || 'https://najlaashutter-web.mohamed-abouzied.workers.dev';
const wpUrl = process.argv[3]?.replace(/\/$/, '') || 'https://najlaashutter.com';

const browser = await chromium.launch({ headless: true });

async function shot(page, url, name) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: path.join(outDir, `${name}-desktop-1440-fullpage.png`), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
  await page.screenshot({ path: path.join(outDir, `${name}-mobile-390-fullpage.png`), fullPage: true });
}

const page = await browser.newPage();
try {
  await shot(page, wpUrl, 'wordpress');
} catch (e) {
  console.warn('WordPress capture failed (may be blocked):', e.message);
}
await shot(page, astroUrl, 'astro');
await browser.close();
console.log('Parity screenshots in docs/review-screenshots/parity/');
