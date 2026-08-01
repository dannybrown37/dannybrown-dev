import { describe, expect, it } from "vitest";
import { slugifyTag } from "./tag-slug";

describe("slugifyTag", () => {
  it.each([
    ["meta", "meta"],
    ["spotify_player", "spotify-player"],
    ["Web Dev", "web-dev"],
    ["C++", "c"],
    ["  spaced  out  ", "spaced-out"],
    ["a--b", "a-b"],
    ["!!!", ""],
  ])("slugifies %j to %j", (tag: string, expected: string) => {
    expect(slugifyTag(tag)).toBe(expected);
  });
});
