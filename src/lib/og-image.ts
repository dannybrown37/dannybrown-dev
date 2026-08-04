/** Shared by the OG route that generates the card and the page that links it. */
export function blogOgImagePath(id: string): string {
  return `/og/blog/${id}.png`;
}

/**
 * astro-og-canvas wraps but never shrinks, so a long title at the base size
 * runs off the bottom of the 630px canvas. These steps keep the title inside
 * four lines at the card's 940px of usable width.
 */
export function ogTitleSize(title: string): number {
  if (title.length <= 55) return 76;
  if (title.length <= 100) return 60;
  return 48;
}
