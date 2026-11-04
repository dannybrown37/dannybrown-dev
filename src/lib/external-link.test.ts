import { describe, expect, it } from "vitest";
import { opensInNewTab } from "./external-link";

describe("opensInNewTab", () => {
  it.each([
    ["https://github.com/foo", true],
    ["http://example.com", true],
    ["https://idiom.dannybrown.dev", true],
    ["https://www.dannybrown.dev/blog", true],
    ["https://dannybrown.dev/blog/post", false],
    ["https://DannyBrown.dev", false],
    ["/blog/post", false],
    ["#fn-1", false],
    ["mailto:me@example.com", false],
    ["not a url", false],
    ["https://evil-dannybrown.dev", true],
  ])("%s -> %s", (href, expected) => {
    expect(opensInNewTab(href)).toBe(expected);
  });
});
