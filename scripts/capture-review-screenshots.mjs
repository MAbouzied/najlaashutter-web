import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const base =
  process.argv[2]?.replace(/\/$/, '') || 'http://127.0.0.1:4325/window-shutters-jeddah/';
const outDir = fileURLToPath(new URL('../docs/review-screenshots/', import.meta.url));
mkdirSync(outDir, { recursive: true });
const shot = (name) => path.join(outDir, name);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(base, { waitUntil: 'networkidle' });
await page.screenshot({ path: shot('desktop-1440-fullpage.png'), fullPage: true });

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(base, { waitUntil: 'networkidle' });
await page.screenshot({ path: shot('mobile-390-fullpage.png'), fullPage: true });
await page.screenshot({ path: shot('mobile-390-hero.png'), fullPage: false });
await page.setViewportSize({ width: 320, height: 568 });
await page.goto(base, { waitUntil: 'networkidle' });
await page.screenshot({ path: shot('mobile-320-hero.png'), fullPage: false });

await browser.close();
console.log('Screenshots written to docs/review-screenshots/');
