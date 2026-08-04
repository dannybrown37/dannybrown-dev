import { describe, expect, it } from "vitest";
import { blogOgImagePath, ogTitleSize } from "./og-image";

describe("blogOgImagePath", () => {
  it.each([
    ["2026-08-01-song-unpacking", "/og/blog/2026-08-01-song-unpacking.png"],
    ["nested/post", "/og/blog/nested/post.png"],
  ])("maps %s to %s", (id, expected) => {
    expect(blogOgImagePath(id)).toBe(expected);
  });
});

describe("ogTitleSize", () => {
  it.each([
    ["Strategy vs. Tactics", 76],
    ["Frivolous-yet-absolutely-critical Spotify tooling", 76],
    ["Always a Work In Progress (My .dev Domain) and then some more", 60],
    [
      "High throughput, low ceremony. I build the tooling that keeps it that way.",
      60,
    ],
    ["x".repeat(101), 48],
  ])("sizes %s at %ipx", (title, expected) => {
    expect(ogTitleSize(title)).toBe(expected);
  });
});
