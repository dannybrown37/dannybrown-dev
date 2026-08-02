import { describe, expect, it } from "vitest";
import { nextTheme, parseTheme, resolveTheme, type Theme } from "./theme";

describe("parseTheme", () => {
  it.each([
    ["light", "light"],
    ["dark", "dark"],
    ["system", "system"],
    [null, "system"],
    ["", "system"],
    ["nonsense", "system"],
  ])("parses %j as %j", (raw: string | null, expected: Theme) => {
    expect(parseTheme(raw)).toBe(expected);
  });
});

describe("nextTheme", () => {
  it.each([
    ["system", "light"],
    ["light", "dark"],
    ["dark", "system"],
  ])("advances %j to %j", (current: Theme, expected: Theme) => {
    expect(nextTheme(current)).toBe(expected);
  });

  it("returns to the starting theme after a full cycle", () => {
    expect(nextTheme(nextTheme(nextTheme("system")))).toBe("system");
  });
});

describe("resolveTheme", () => {
  it.each([
    ["light", true, "light"],
    ["light", false, "light"],
    ["dark", true, "dark"],
    ["dark", false, "dark"],
    ["system", true, "dark"],
    ["system", false, "light"],
  ])(
    "resolves %j with prefersDark=%j to %j",
    (theme: Theme, prefersDark: boolean, expected: "light" | "dark") => {
      expect(resolveTheme(theme, prefersDark)).toBe(expected);
    },
  );
});
