import { describe, expect, it } from "vitest";
import { filterCommands, nextIndex, type PaletteCommand } from "./palette";

const command = (id: string, title: string, keywords: string[] = []): PaletteCommand => ({
  id,
  title,
  keywords,
  kind: "navigate",
  action: { type: "href", href: `/${id}` },
});

const home = command("home", "Home", ["index", "about"]);
const writing = command("writing", "Writing", ["blog", "posts"]);
const projects = command("projects", "Projects");
const theme = command("theme", "Cycle theme", ["dark", "light"]);

const all = [home, writing, projects, theme];
const ids = (found: PaletteCommand[]) => found.map((c) => c.id);

describe("filterCommands", () => {
  it("returns everything, in the order given, for an empty query", () => {
    expect(filterCommands(all, "")).toEqual(all);
  });

  it("ignores surrounding whitespace", () => {
    expect(ids(filterCommands(all, "  writing  "))).toEqual(["writing"]);
  });

  it.each([
    ["writing", ["writing"]],
    ["WRITING", ["writing"]],
    ["proj", ["projects"]],
    ["wtg", ["writing"]],
    ["zzz", []],
  ])("matches %j to %j", (query: string, expected: string[]) => {
    expect(ids(filterCommands(all, query))).toEqual(expected);
  });

  it("matches on keywords the title doesn't contain", () => {
    expect(ids(filterCommands(all, "blog"))).toEqual(["writing"]);
  });

  it("ranks a title prefix above a title substring", () => {
    const pro = command("pro", "Pro");
    const amateur = command("amateur", "Amateur pro");
    expect(ids(filterCommands([amateur, pro], "pro"))).toEqual(["pro", "amateur"]);
  });

  it("ranks a title substring above a keyword-only match", () => {
    const viaKeyword = command("kw", "Zebra", ["theme"]);
    const viaTitle = command("title", "Cycle theme");
    expect(ids(filterCommands([viaKeyword, viaTitle], "theme"))).toEqual([
      "title",
      "kw",
    ]);
  });

  it("ranks a contiguous match above a scattered subsequence", () => {
    const scattered = command("s", "Ping around Jets");
    const contiguous = command("c", "Projects");
    expect(ids(filterCommands([scattered, contiguous], "proj"))).toEqual(["c", "s"]);
  });

  it("keeps the given order between equally good matches", () => {
    const a = command("a", "Deploy");
    const b = command("b", "Deploy");
    expect(ids(filterCommands([a, b], "deploy"))).toEqual(["a", "b"]);
  });
});

describe("nextIndex", () => {
  it.each([
    [0, 3, 1, 1],
    [1, 3, 1, 2],
    [2, 3, 1, 0],
    [0, 3, -1, 2],
    [2, 3, -1, 1],
  ])(
    "moves from %i by %i of %i to %i",
    (current: number, length: number, delta: number, expected: number) => {
      expect(nextIndex(current, length, delta)).toBe(expected);
    },
  );

  it("stays at 0 when there is nothing to move through", () => {
    expect(nextIndex(0, 0, 1)).toBe(0);
    expect(nextIndex(0, 0, -1)).toBe(0);
  });

  it("snaps a stale index to the end it is heading for", () => {
    expect(nextIndex(9, 3, 1)).toBe(0);
    expect(nextIndex(9, 3, -1)).toBe(2);
    expect(nextIndex(-4, 3, 1)).toBe(0);
  });
});
