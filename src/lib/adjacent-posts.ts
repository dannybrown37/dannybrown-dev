import type { CollectionEntry } from "astro:content";

type Post = CollectionEntry<"blog">;

export function getAdjacentPosts(
  posts: Post[],
  currentId: string,
): { older: Post | undefined; newer: Post | undefined } {
  const sorted = [...posts].sort(
    (a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf(),
  );
  const idx = sorted.findIndex((p) => p.id === currentId);
  return {
    older: idx > 0 ? sorted[idx - 1] : undefined,
    newer: idx < sorted.length - 1 ? sorted[idx + 1] : undefined,
  };
}
