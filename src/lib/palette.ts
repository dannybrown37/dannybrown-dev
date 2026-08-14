export type PaletteAction =
  | { type: "href"; href: string; external?: boolean }
  | { type: "say"; lines: string[] };

export interface PaletteCommand {
  id: string;
  title: string;
  keywords: string[];
  kind: "navigate" | "action" | "external";
  action: PaletteAction;
  /** Hidden from the empty-query list, and listed by `ls`. */
  secret?: boolean;
  /** Hidden from the empty-query list, but not an easter egg — content, not commands. */
  hidden?: boolean;
  /** Right-aligned category label, e.g. "post". */
  hint?: string;
}

interface PostLike {
  id: string;
  data: { title: string; tags?: string[] };
}

interface ProjectLike {
  name: string;
  description: string;
  url: string;
  tech: string[];
}

export function postCommands(posts: PostLike[]): PaletteCommand[] {
  return posts.map((post) => ({
    id: `post-${post.id}`,
    title: post.data.title,
    keywords: ["blog", "post", "writing", ...(post.data.tags ?? [])],
    kind: "navigate",
    action: { type: "href", href: `/blog/${post.id}` },
    hidden: true,
    hint: "post",
  }));
}

export function projectCommands(projects: ProjectLike[]): PaletteCommand[] {
  return projects.map((project) => ({
    id: `project-${project.name}`,
    title: project.name,
    keywords: ["project", "repo", "code", ...project.tech],
    kind: "external",
    action: { type: "href", href: project.url, external: true },
    hidden: true,
    hint: "project",
  }));
}

/**
 * Subsequence match, so "wtg" still finds "Writing" — the point of the palette
 * is landing somewhere in fewer keystrokes than the nav bar costs.
 * Returns the index the match started at, or -1.
 */
function subsequenceStart(haystack: string, needle: string): number {
  let start = -1;
  let at = 0;
  for (const char of needle) {
    at = haystack.indexOf(char, at);
    if (at === -1) return -1;
    if (start === -1) start = at;
    at += 1;
  }
  return start;
}

/** Lower sorts first. */
function score(command: PaletteCommand, query: string): number | null {
  const title = command.title.toLowerCase();

  if (title.startsWith(query)) return 0;
  const contiguous = title.indexOf(query);
  // Later substring hits rank below earlier ones, but never below a scattered
  // subsequence — hence the bounded contribution rather than a raw index.
  if (contiguous !== -1) return 1 + contiguous / (title.length + 1);

  for (const keyword of command.keywords) {
    const lower = keyword.toLowerCase();
    if (lower.startsWith(query)) return 2;
    if (lower.includes(query)) return 3;
  }

  const scattered = subsequenceStart(title, query);
  if (scattered !== -1) return 4 + scattered / (title.length + 1);

  for (const keyword of command.keywords) {
    if (subsequenceStart(keyword.toLowerCase(), query) !== -1) return 5;
  }

  return null;
}

export function filterCommands(
  commands: PaletteCommand[],
  query: string,
): PaletteCommand[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return commands.filter((command) => !command.secret && !command.hidden);

  return commands
    .map((command, order) => ({ command, order, score: score(command, trimmed) }))
    .filter((entry) => entry.score !== null)
    // `order` breaks ties, keeping the author's ordering meaningful — Array.sort
    // is stable in practice, but the ranking above is too coarse to rely on it.
    .sort((a, b) => a.score! - b.score! || a.order - b.order)
    .map((entry) => entry.command);
}

/** The `ls` output, so adding a secret command lists itself without a second edit. */
export function secretTitles(commands: PaletteCommand[]): string[] {
  return commands
    .filter((command) => command.secret)
    .map((command) => command.title)
    .sort();
}

/**
 * Wraps at both ends. An out-of-range `current` — the list refiltered under a
 * selection that no longer exists — snaps to whichever end you're heading for,
 * rather than carrying the stale offset through the modulo.
 */
export function nextIndex(current: number, length: number, delta: number): number {
  if (length <= 0) return 0;
  if (current < 0 || current >= length) return delta < 0 ? length - 1 : 0;
  return (((current + delta) % length) + length) % length;
}
