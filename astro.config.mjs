// @ts-check

import sitemap from "@astrojs/sitemap";

import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import rehypeExternalLinks from "rehype-external-links";
import { opensInNewTab } from "./src/lib/external-link.ts";

// https://astro.build/config
export default defineConfig({
  site: "https://dannybrown.dev",
  integrations: [
    sitemap({
      // The og/ routes are 1200x630 card images, not pages, and /about is a
      // redirect that resolves to an anchor on the home page.
      filter: (page) => !page.includes("/og/") && !page.endsWith("/about/"),
    }),
  ],
  // About is folded into the home page; keep the old URL alive.
  redirects: {
    "/about": "/#about-heading",
  },
  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: "_blank",
          rel: ["noopener", "noreferrer"],
          content: [
            // Word joiner: keeps the icon from wrapping alone onto the next line.
            { type: "text", value: "⁠" },
            {
              type: "element",
              tagName: "span",
              properties: { className: ["external-icon"], ariaHidden: "true" },
              children: [{ type: "text", value: "↗" }],
            },
            {
              type: "element",
              tagName: "span",
              properties: { className: ["sr-only"] },
              children: [{ type: "text", value: " (opens in new tab)" }],
            },
          ],
          test: (/** @type {import("hast").Element} */ el) =>
            typeof el.properties.href === "string" &&
            opensInNewTab(el.properties.href),
        },
      ],
    ],
    shikiConfig: {
      // Dual themes: light colors land inline, dark ones in --shiki-dark-*
      // custom properties that global.css swaps in under the .dark class.
      themes: { light: "github-light", dark: "github-dark-dimmed" },
      wrap: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
