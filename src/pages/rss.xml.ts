import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = (await getCollection("blog")).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  return rss({
    title: "Danny Brown",
    description: "Notes on whatever I care to write about. While I use LLM tooling in my work as a software engineer, the writing on this part of the site is 100% artisan and handcrafted by me.",
    // Set from `site` in astro.config.mjs; the non-null assertion is safe
    // because a build without it fails long before this route runs.
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      categories: post.data.tags,
      link: `/blog/${post.id}/`,
    })),
    customData: "<language>en-us</language>",
  });
}
