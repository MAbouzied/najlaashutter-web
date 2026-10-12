// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://najlaashutter.com',
  output: 'static',
  compressHTML: true,
  integrations: [
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
