import { describe, expect, it } from "vitest";
import { roundSvgPrecision } from "./round-svg-precision";

describe("roundSvgPrecision", () => {
  it.each([
    ["649.7402325794993", "649.74"],
    ["-10.491222994969766", "-10.49"],
    ["dur=\"5.000s\"", "dur=\"5s\""],
    ["1.23622536394086e-15", "1.24e-15"],
  ])("shortens %s to %s", (input: string, expected: string) => {
    expect(roundSvgPrecision(input)).toBe(expected);
  });

  it.each([
    ["<title>dotfiles — $469.43, 5.5 turns/session</title>"],
    ["<title>Cache efficiency — 38.2x</title>"],
    ["<title>Jul 26, 2026 — 28 sessions</title>"],
    ["viewBox=\"0 0 800 848.0\""],
    ["M 375.71,728 Q 376.68,578.00"],
  ])("leaves %s untouched at or below target precision", (input: string) => {
    expect(roundSvgPrecision(input)).toBe(input);
  });

  // A near-zero value must not trim away to "", which would silently
  // corrupt the path data it sits in.
  it.each([
    ["0.001234", "0"],
    ["0.0000001", "0"],
    ["1200.0000", "1200"],
  ])("collapses %s to %s rather than an empty string", (input: string, expected: string) => {
    expect(roundSvgPrecision(input)).toBe(expected);
  });

  it("honors a custom precision", () => {
    expect(roundSvgPrecision("649.7402325794993", 1)).toBe("649.7");
  });

  it("never returns a longer string than it was given", () => {
    const svg = "M 19.271802572434616,3.0254083588104406 L 1.5,2";
    expect(roundSvgPrecision(svg).length).toBeLessThan(svg.length);
  });
});
