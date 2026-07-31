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
  vite: {
    plugins: [tailwindcss()]
  }
});
