// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const isAdsSite = process.env.PUBLIC_ADS_SITE === 'true';
const siteOrigin =
  process.env.PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://najlaashutter.com';

// https://astro.build/config
export default defineConfig({
  site: siteOrigin,
  output: 'static',
  compressHTML: true,
  integrations: isAdsSite
    ? []
    : [
        sitemap({
          filter: (page) =>
            page.includes('/window-shutters-jeddah') ||
            page === 'https://najlaashutter.com/' ||
            page === 'https://najlaashutter.com',
        }),
      ],
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
});
