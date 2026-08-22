import { describe, it, expect } from "vitest";
import { getAdjacentPosts } from "./adjacent-posts";

const post = (id: string, pubDate: string) => ({
  id,
  data: { pubDate: new Date(pubDate), title: id },
});

const posts = [
  post("first", "2024-01-01"),
  post("second", "2024-02-01"),
  post("third", "2024-03-01"),
];

describe("getAdjacentPosts", () => {
  it.each([
    {
      label: "middle post has both neighbors",
      currentId: "second",
      expected: {
        older: { id: "first", title: "first" },
        newer: { id: "third", title: "third" },
      },
    },
    {
      label: "newest post has no newer",
      currentId: "third",
      expected: {
        older: { id: "second", title: "second" },
        newer: undefined,
      },
    },
    {
      label: "oldest post has no older",
      currentId: "first",
      expected: {
        older: undefined,
        newer: { id: "second", title: "second" },
      },
    },
  ])("$label", ({ currentId, expected }) => {
    const result = getAdjacentPosts(posts as any, currentId);
    expect(result.older && { id: result.older.id, title: result.older.data.title }).toEqual(expected.older);
    expect(result.newer && { id: result.newer.id, title: result.newer.data.title }).toEqual(expected.newer);
  });

  it("returns both undefined for a single post", () => {
    const result = getAdjacentPosts([posts[0]] as any, "first");
    expect(result).toEqual({ older: undefined, newer: undefined });
  });
});
