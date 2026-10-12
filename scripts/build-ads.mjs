/**
 * Ads-only static build for Cloudflare Pages (ads.najlaashutter.com).
 * Swaps homepage index out so dist/ contains LP at / only (no unfinished homepage HTML).
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pagesDir = path.join(root, 'src/pages');
const indexPath = path.join(pagesDir, 'index.astro');
const stashDir = path.join(root, '.ads-build-stash');
const stashPath = path.join(stashDir, 'index.homepage.astro');
const publicDir = path.join(root, 'public');
const redirectsPath = path.join(publicDir, '_redirects');
const headersPath = path.join(publicDir, '_headers');
const deployAds = path.join(root, 'deploy/ads');

const adsIndex = `---
import LandingJeddahPage from '../components/landing/LandingJeddahPage.astro';
---

<LandingJeddahPage canonicalPath="/" />
`;

function restore() {
  if (fs.existsSync(stashPath)) {
    fs.renameSync(stashPath, indexPath);
  }
  for (const p of [redirectsPath, headersPath]) {
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
}

if (fs.existsSync(stashPath)) {
  console.error('Stale .ads-build-stash — run restore or delete stash first.');
  process.exit(1);
}

fs.mkdirSync(stashDir, { recursive: true });
fs.renameSync(indexPath, stashPath);
fs.writeFileSync(indexPath, adsIndex, 'utf8');
fs.copyFileSync(path.join(deployAds, '_redirects'), redirectsPath);
fs.copyFileSync(path.join(deployAds, '_headers'), headersPath);

const env = {
  ...process.env,
  PUBLIC_ADS_SITE: 'true',
  PUBLIC_SITE_URL: 'https://ads.najlaashutter.com',
};

try {
  execSync('npm run build', { cwd: root, stdio: 'inherit', env });
} catch (err) {
  restore();
  throw err;
}

restore();
console.log('Ads build complete → dist/ (homepage index restored)');
