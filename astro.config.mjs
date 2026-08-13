// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://dannybrown.dev',
  integrations: [
    sitemap({
      // The og/ routes are 1200x630 card images, not pages, and /about is a
      // redirect that resolves to an anchor on the home page.
      filter: (page) => !page.includes('/og/') && !page.endsWith('/about/'),
    }),
  ],
  // About is folded into the home page; keep the old URL alive.
  redirects: {
    '/about': '/#about-heading',
  },
  markdown: {
    shikiConfig: {
      // Dual themes: light colors land inline, dark ones in --shiki-dark-*
      // custom properties that global.css swaps in under the .dark class.
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      wrap: false,
    },
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
