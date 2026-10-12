/** Verify workers.dev returns noindex + robots disallow. */
const base = process.argv[2]?.replace(/\/$/, '') || 'https://najlaashutter-web.mohamed-abouzied.workers.dev';

const home = await fetch(`${base}/`);
const homeHtml = await home.text();
const robots = await fetch(`${base}/robots.txt`);
const robotsText = await robots.text();

const hasNoindex = /name=["']robots["'][^>]+noindex/i.test(homeHtml);
const robotsBlock = /Disallow:\s*\//i.test(robotsText);

console.log(
  JSON.stringify(
    {
      url: base,
      homeStatus: home.status,
      hasNoindexMeta: hasNoindex,
      robotsStatus: robots.status,
      robotsDisallowRoot: robotsBlock,
      robotsSnippet: robotsText.trim().slice(0, 80),
    },
    null,
    2,
  ),
);

if (!hasNoindex || !robotsBlock) process.exit(1);
