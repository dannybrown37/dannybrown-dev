// Extension is explicit because scripts/new-post.mjs loads this through Node's
// TS stripping, which does not resolve extensionless specifiers the way Vite does.
import { slugify } from "./slugify.ts";

// Frontmatter dates are date-only and rendered in UTC (see format-date.ts), so
// the filename's date has to be picked in UTC too or a post written after 5pm
// Pacific lands on tomorrow's date in the filename but today's on the page.
function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function postFilename(pubDate: Date, title: string, slug?: string): string {
  const derived = slugify(slug ?? title);
  if (!derived) throw new Error(`Cannot derive a filename slug from ${JSON.stringify(slug ?? title)}`);
  return `${isoDate(pubDate)}-${derived}.md`;
}

export function postFrontmatter({ title, pubDate }: { title: string; pubDate: Date }): string {
  return [
    "---",
    `title: "${title.replace(/"/g, '\\"')}"`,
    'description: ""',
    `pubDate: ${isoDate(pubDate)}`,
    "tags: []",
    "---",
    "",
    "",
  ].join("\n");
}
