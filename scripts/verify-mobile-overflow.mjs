/**
 * Playwright: scrollWidth === clientWidth at mobile widths.
 * Usage: node scripts/verify-mobile-overflow.mjs [baseUrl]
 */
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const base =
  process.argv[2]?.replace(/\/$/, '') || 'http://127.0.0.1:4325/';
const widths = [320, 360, 375, 390, 412, 430];
const outDir = new URL('../docs/review-screenshots/', import.meta.url);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const results = [];

for (const width of widths) {
  await page.setViewportSize({ width, height: 844 });
  await page.goto(base, { waitUntil: 'networkidle' });
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  results.push({ width, ...metrics, ok: metrics.scrollWidth === metrics.clientWidth });
}

await browser.close();

const report = { testedAt: new Date().toISOString(), url: base, results };
writeFileSync(new URL('mobile-overflow-test.json', outDir), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
process.exit(results.every((r) => r.ok) ? 0 : 1);
