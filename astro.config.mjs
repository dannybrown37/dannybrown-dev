// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://dannybrown.dev',
  // About and Projects folded into the home page; keep the old URLs alive.
  redirects: {
    '/about': '/#about-heading',
    '/projects': '/#work-heading',
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
