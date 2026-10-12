import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const parent = path.dirname(repoRoot);
const zipPath = path.join(parent, 'najlaashutter-phase-2b-review-full.zip');

execSync('npm run build', { cwd: repoRoot, stdio: 'inherit' });

const includes = [
  'src',
  'public',
  'docs',
  'scripts',
  'package.json',
  'package-lock.json',
  'astro.config.mjs',
  'tsconfig.json',
  'wrangler.toml',
  'dist',
].map((p) => path.join('najlaashutter-web', p));

execSync(
  `zip -r ${JSON.stringify(zipPath)} ${includes.map((p) => JSON.stringify(p)).join(' ')} -x "*/node_modules/*" "*/.git/*" "*/.astro/*"`,
  { cwd: parent, stdio: 'inherit' },
);

console.log('Review ZIP:', zipPath);
