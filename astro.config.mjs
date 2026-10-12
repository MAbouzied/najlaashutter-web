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
      filter: (page) => page.includes('/window-shutters-jeddah'),
    }),
  ],
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
});
