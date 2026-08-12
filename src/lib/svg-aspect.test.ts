import { describe, expect, it } from "vitest";
import { svgAspect } from "./svg-aspect";

describe("svgAspect", () => {
  it.each([
    ["viewBox with a fractional height", `<svg viewBox="0 0 800 966.0" width="800">`, "800 / 966"],
    ["viewBox with a non-zero origin", `<svg viewBox="10 20 400 300">`, "400 / 300"],
    ["single-quoted attribute", `<svg viewBox='0 0 800 848'>`, "800 / 848"],
    ["extra whitespace between values", `<svg viewBox="0  0   800\n966">`, "800 / 966"],
    ["comma-separated values", `<svg viewBox="0,0,800,966">`, "800 / 966"],
    ["no viewBox, falling back to width/height", `<svg width="800" height="966">`, "800 / 966"],
    [
      "the root tag only, ignoring a child's stroke-width",
      `<svg width="800" height="966"><path stroke-width="4" height="2" /></svg>`,
      "800 / 966",
    ],
  ])("reads %s", (_label, markup, expected) => {
    expect(svgAspect(markup)?.css).toBe(expected);
  });

  it("reports the ratio as a number, for sizing width off a height budget", () => {
    expect(svgAspect(`<svg viewBox="0 0 800 966.0">`)?.ratio).toBeCloseTo(0.828, 3);
  });

  it.each([
    ["no dimensions at all", `<svg xmlns="http://www.w3.org/2000/svg">`],
    ["a zero height", `<svg viewBox="0 0 800 0">`],
    ["a non-numeric height", `<svg viewBox="0 0 800 tall">`],
    ["too few viewBox values", `<svg viewBox="0 0 800">`],
  ])("returns null given %s", (_label, markup) => {
    expect(svgAspect(markup)).toBeNull();
  });
});
