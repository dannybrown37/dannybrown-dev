import { getCollection } from "astro:content";
import { OGImageRoute } from "astro-og-canvas";
import { ogTitleSize } from "../../lib/og-image";

interface Card {
  title: string;
  description: string;
}

const posts = await getCollection("blog");

const pages: Record<string, Card> = {
  site: {
    // Mirrors the <h1> on the homepage — the card is the first impression, so
    // it makes the same one the page does.
    title:
      "High throughput, low ceremony. I build the tooling that keeps it that way.",
    description: "Danny Brown · dannybrown.dev",
  },
  ...Object.fromEntries(
    posts.map((post) => [
      `blog/${post.id}`,
      { title: post.data.title, description: post.data.description },
    ]),
  ),
};

export const { getStaticPaths, GET } = await OGImageRoute({
  param: "route",
  pages,
  // The default slug derivation strips a trailing file extension, which would
  // mangle any post id containing a dot. These keys are already the route.
  getSlug: (path) => `${path}.png`,
  getImageOptions: (_path, page: Card) => ({
    title: page.title,
    description: page.description,
    bgGradient: [[30, 32, 41]],
    border: { color: [168, 192, 255], width: 12, side: "block-end" },
    padding: 130,
    font: {
      title: {
        families: ["Instrument Serif"],
        color: [236, 238, 243],
        size: ogTitleSize(page.title),
        lineHeight: 1.15,
        weight: "Normal",
      },
      description: {
        families: ["Inter Tight"],
        color: [163, 168, 184],
        size: 32,
        lineHeight: 1.45,
        weight: "Normal",
      },
    },
    fonts: [
      "./public/fonts/instrument-serif-latin-400.woff2",
      "./public/fonts/inter-tight-latin-var.woff2",
    ],
  }),
});
