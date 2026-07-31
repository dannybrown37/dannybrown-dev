import { describe, expect, it } from "vitest";
import { getReadingTime } from "./reading-time";

describe("getReadingTime", () => {
  it.each([
    ["", 0],
    ["word ".repeat(1), 1],
    ["word ".repeat(200), 1],
    ["word ".repeat(201), 2],
    ["word ".repeat(450), 3],
  ])("returns %j minutes for %j words", (text: string, expected: number) => {
    expect(getReadingTime(text)).toBe(expected);
  });
});
