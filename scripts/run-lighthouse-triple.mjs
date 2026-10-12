import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const url = process.argv[2] || 'https://najlaashutter-web.mohamed-abouzied.workers.dev/';
const outDir = fileURLToPath(new URL('../docs/review-screenshots/', import.meta.url));

const runs = [];
for (let i = 1; i <= 3; i++) {
  const out = path.join(outDir, `lighthouse-home-live-run${i}.json`);
  execSync(
    `npx lighthouse ${JSON.stringify(url)} --form-factor=mobile --output=json --output-path=${JSON.stringify(out)} --quiet`,
    { stdio: 'inherit' },
  );
  const data = JSON.parse(readFileSync(out, 'utf8'));
  runs.push({
    run: i,
    performance: Math.round(data.categories.performance.score * 100),
    accessibility: Math.round(data.categories.accessibility.score * 100),
    bestPractices: Math.round(data.categories['best-practices'].score * 100),
    lcp: data.audits['largest-contentful-paint'].displayValue,
    lcpMs: data.audits['largest-contentful-paint'].numericValue,
    tbt: data.audits['total-blocking-time'].displayValue,
    cls: data.audits['cumulative-layout-shift'].displayValue,
  });
}

const perf = runs.map((r) => r.performance).sort((a, b) => a - b);
const lcp = runs.map((r) => r.lcpMs).sort((a, b) => a - b);
const summary = {
  testedAt: new Date().toISOString(),
  url,
  runs,
  medianPerformance: perf[1],
  medianLcpMs: lcp[1],
};
writeFileSync(path.join(outDir, 'lighthouse-home-live-summary.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
