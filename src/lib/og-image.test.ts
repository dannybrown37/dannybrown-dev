import { describe, expect, it } from "vitest";
import { blogOgImagePath } from "./og-image";

describe("blogOgImagePath", () => {
  it.each([
    ["2026-08-01-song-unpacking", "/og/blog/2026-08-01-song-unpacking.png"],
    ["nested/post", "/og/blog/nested/post.png"],
  ])("maps %s to %s", (id, expected) => {
    expect(blogOgImagePath(id)).toBe(expected);
  });
});
