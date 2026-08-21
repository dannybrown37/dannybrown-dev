import { describe, expect, it } from "vitest";
import { commentMailto } from "./comment-mailto";

describe("commentMailto", () => {
  it("builds a mailto with the post title as the subject", () => {
    expect(commentMailto("Agent skills turn notes into ethos")).toBe(
      "mailto:tinker@dannybrown.dev?subject=Re%3A%20Agent%20skills%20turn%20notes%20into%20ethos",
    );
  });

  it.each([
    ["Ampersands & plus + signs", "Re%3A%20Ampersands%20%26%20plus%20%2B%20signs"],
    ["Em — dash", "Re%3A%20Em%20%E2%80%94%20dash"],
    ["  padded  ", "Re%3A%20padded"],
  ])("encodes %j", (title, subject) => {
    expect(commentMailto(title)).toBe(`mailto:tinker@dannybrown.dev?subject=${subject}`);
  });

  it("falls back to a bare mailto for an empty title", () => {
    expect(commentMailto("   ")).toBe("mailto:tinker@dannybrown.dev");
  });
});
