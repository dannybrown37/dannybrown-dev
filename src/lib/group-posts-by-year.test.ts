import { describe, expect, it } from "vitest";
import { groupPostsByYear } from "./group-posts-by-year";

const post = (pubDate: string) => ({ data: { pubDate: new Date(pubDate) } });

describe("groupPostsByYear", () => {
  it("returns nothing for no posts", () => {
    expect(groupPostsByYear([])).toEqual([]);
  });

  it("groups a single year", () => {
    const a = post("2026-08-01");
    const b = post("2026-07-31");
    expect(groupPostsByYear([a, b])).toEqual([{ year: 2026, posts: [a, b] }]);
  });

  it("splits posts across years, preserving the order given", () => {
    const a = post("2026-01-02");
    const b = post("2025-12-31");
    const c = post("2025-03-04");
    const d = post("2024-06-06");
    expect(groupPostsByYear([a, b, c, d])).toEqual([
      { year: 2026, posts: [a] },
      { year: 2025, posts: [b, c] },
      { year: 2024, posts: [d] },
    ]);
  });

  it("reopens a year rather than merging non-adjacent posts from it", () => {
    const a = post("2026-01-02");
    const b = post("2025-12-31");
    const c = post("2026-05-05");
    expect(groupPostsByYear([a, b, c])).toEqual([
      { year: 2026, posts: [a] },
      { year: 2025, posts: [b] },
      { year: 2026, posts: [c] },
    ]);
  });

  it.each([
    ["2026-01-01", 2026],
    ["2026-12-31", 2026],
  ])("puts %j in year %i regardless of local timezone", (date, expected) => {
    expect(groupPostsByYear([post(date)])[0]!.year).toBe(expected);
  });
});
