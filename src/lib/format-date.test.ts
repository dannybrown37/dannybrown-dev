import { describe, expect, it } from "vitest";
import { formatDate } from "./format-date";

describe("formatDate", () => {
  it.each([
    [new Date("2026-07-30"), "July 30, 2026"],
    [new Date("2026-01-01"), "January 1, 2026"],
    [new Date("2026-12-31"), "December 31, 2026"],
  ])("formats %s as %s regardless of local timezone", (date: Date, expected: string) => {
    expect(formatDate(date)).toBe(expected);
  });
});
