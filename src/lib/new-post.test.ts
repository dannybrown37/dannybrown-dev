import { describe, expect, it } from "vitest";
import { postFilename, postFrontmatter } from "./new-post";

describe("postFilename", () => {
  it.each([
    ["Frivolous Spotify Tooling", "2026-08-01-frivolous-spotify-tooling.md"],
    ["Web Dev: The Sequel!", "2026-08-01-web-dev-the-sequel.md"],
    ["  spaced  out  ", "2026-08-01-spaced-out.md"],
  ])("derives the filename for %j", (title: string, expected: string) => {
    expect(postFilename(new Date("2026-08-01"), title)).toBe(expected);
  });

  it("dates the file in UTC, not the local timezone", () => {
    expect(postFilename(new Date("2026-08-01T23:30:00Z"), "Late Night")).toBe(
      "2026-08-01-late-night.md",
    );
  });

  it("rejects a title that slugifies to nothing", () => {
    expect(() => postFilename(new Date("2026-08-01"), "!!!")).toThrow();
  });
});

describe("postFrontmatter", () => {
  it("scaffolds the schema's required fields with empty placeholders", () => {
    expect(postFrontmatter({ title: "My Post", pubDate: new Date("2026-08-01") })).toBe(
      ['---', 'title: "My Post"', 'description: ""', "pubDate: 2026-08-01", "tags: []", "---", "", ""].join(
        "\n",
      ),
    );
  });

  it("escapes double quotes in the title", () => {
    expect(
      postFrontmatter({ title: 'The "Good" Parts', pubDate: new Date("2026-08-01") }),
    ).toContain('title: "The \\"Good\\" Parts"');
  });
});
