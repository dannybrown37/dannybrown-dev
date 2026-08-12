export interface SvgAspect {
  /** Ready for a CSS `aspect-ratio` declaration, e.g. `"800 / 966"`. */
  css: string;
  /** width ÷ height, for deriving one dimension from a budget for the other. */
  ratio: number;
}

/**
 * Intrinsic aspect ratio of an SVG.
 *
 * The garden is regenerated from session history and gets taller as the tree
 * grows, so any ratio hardcoded next to it goes stale and clips the canopy.
 * Read it off the file instead.
 */
export function svgAspect(markup: string): SvgAspect | null {
  // Just the root tag: the file is minified onto one line, and `\bwidth=` would
  // otherwise happily match a child's `stroke-width`.
  const head = markup.slice(0, markup.indexOf(">") + 1 || 2000);

  const viewBox = attribute(head, "viewBox")?.trim().split(/[\s,]+/);
  if (viewBox?.length === 4) {
    return aspect(viewBox[2], viewBox[3]);
  }

  return aspect(attribute(head, "width"), attribute(head, "height"));
}

function attribute(markup: string, name: string): string | undefined {
  return markup.match(new RegExp(`\\b${name}=["']([^"']*)["']`))?.[1];
}

function aspect(rawWidth?: string, rawHeight?: string): SvgAspect | null {
  const width = Number(rawWidth);
  const height = Number(rawHeight);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return null;
  }
  return {
    // Rounded: the generator emits a fractional height, and a fractional ratio
    // buys nothing at render size.
    css: `${Math.round(width)} / ${Math.round(height)}`,
    ratio: width / height,
  };
}
