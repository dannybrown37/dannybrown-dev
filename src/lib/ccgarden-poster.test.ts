import { describe, expect, it } from "vitest";

import { ccgardenPoster } from "./ccgarden-poster";

const wrap = (body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">${body}</svg>`;

describe("ccgardenPoster", () => {
  it("drops every SMIL animation element", () => {
    const poster = ccgardenPoster(
      wrap(
        `<g opacity="1"><animate attributeName="opacity" values="0;1" fill="freeze" /></g>`,
      ),
    );
    expect(poster).not.toContain("<animate");
  });

  it.each([
    ["opacity", `<g opacity="0"><animate attributeName="opacity" values="0;0.5;1" /></g>`, `opacity="1"`],
    ["d", `<path d="M0 0"><animate attributeName="d" values="M0 0;M1 1" /></path>`, `d="M1 1"`],
    [
      "stroke-width",
      `<path stroke-width="9"><animate attributeName="stroke-width" values="1;4" /></path>`,
      `stroke-width="4"`,
    ],
  ])("freezes an animated %s at its final value", (_name, body, expected) => {
    expect(ccgardenPoster(wrap(body))).toContain(expected);
  });

  it.each([
    [
      "translate",
      `<g transform="translate(0,0)"><animateTransform attributeName="transform" type="translate" values="0,0;5,7" /></g>`,
      `transform="translate(5,7)"`,
    ],
    [
      "scale",
      `<g transform="scale(1)"><animateTransform attributeName="transform" type="scale" values="0;0.4;1" /></g>`,
      `transform="scale(1)"`,
    ],
  ])("freezes an animated %s transform at its final value", (_name, body, expected) => {
    expect(ccgardenPoster(wrap(body))).toContain(expected);
  });

  it("adds the frozen attribute when the element carried no base value", () => {
    const poster = ccgardenPoster(
      wrap(`<g><animateTransform attributeName="transform" type="translate" values="0,0;3,4" /></g>`),
    );
    expect(poster).toContain(`transform="translate(3,4)"`);
  });

  it("freezes a self-closing element's animation onto that element", () => {
    const poster = ccgardenPoster(
      wrap(
        `<circle r="1" opacity="0"><animate attributeName="opacity" values="0;1" /></circle><rect opacity="0.2" />`,
      ),
    );
    expect(poster).toContain(`<circle r="1" opacity="1">`);
    expect(poster).toContain(`opacity="0.2"`);
  });

  it("targets the nearest open element, not an earlier sibling", () => {
    const poster = ccgardenPoster(
      wrap(
        `<g opacity="0.1"><rect opacity="0.2" /><g opacity="0.3"><animate attributeName="opacity" values="0;1" /></g></g>`,
      ),
    );
    expect(poster).toContain(`opacity="0.1"`);
    expect(poster).toContain(`opacity="0.2"`);
    expect(poster).toContain(`opacity="1"`);
    expect(poster).not.toContain(`opacity="0.3"`);
  });

  it("strips scripts, tooltip payloads, and interactivity hooks", () => {
    const poster = ccgardenPoster(
      wrap(
        `<script><![CDATA[ window.x = 1 ]]></script><g data-tt='["a","b"]'><title>t</title></g>`,
      ),
    );
    expect(poster).not.toContain("<script");
    expect(poster).not.toContain("data-tt");
    expect(poster).not.toContain("<title>");
  });

  it("pins CSS keyframe motion to a still frame", () => {
    const poster = ccgardenPoster(
      wrap(`<style>.sway{animation:sway 3s infinite}</style><g class="sway" />`),
    );
    expect(poster).toMatch(/animation:\s*none/);
    expect(poster).toMatch(/will-change:\s*auto/);
  });

  it("keeps the source's trailing newline", () => {
    expect(ccgardenPoster(`${wrap("<g />")}\n`)).toMatch(/<\/svg>\n$/);
  });

  it("is idempotent", () => {
    const source = wrap(
      `<g opacity="0"><animate attributeName="opacity" values="0;1" /></g>`,
    );
    const once = ccgardenPoster(source);
    expect(ccgardenPoster(once)).toBe(once);
  });
});
