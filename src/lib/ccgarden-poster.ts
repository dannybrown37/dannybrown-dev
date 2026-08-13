// A still frame of the garden, for the homepage.
//
// The live SVG is ~3MB and carries 5,000-odd SMIL elements plus its own
// scripts; parsing it is what made the page feel like wading. Nothing about
// the first impression needs any of that, so the poster freezes every
// animation at its final value and drops the machinery. It renders through an
// <img>, which the browser rasterizes once and never touches again — the live
// document is fetched only when someone asks to watch it grow.

const ANIMATION_TAGS = new Set(["animate", "animateTransform"]);
const STILL_MARKER = "ccg-poster-still";
const STILL_RULE = `/* ${STILL_MARKER} */*{animation:none!important;will-change:auto!important}`;

interface OpenTag {
  name: string;
  start: number;
}

interface Patch {
  attribute: string;
  value: string;
}

function attributeOf(tag: string, name: string): string | undefined {
  const match = tag.match(new RegExp(`\\s${name}="([^"]*)"`));
  return match?.[1];
}

/** Final keyframe of an `<animate>`/`<animateTransform>`, as an attribute value. */
function frozenValue(tag: string): Patch | undefined {
  const attribute = attributeOf(tag, "attributeName");
  const values = attributeOf(tag, "values");
  if (!attribute || values === undefined) return undefined;

  const last = values.split(";").at(-1)?.trim();
  if (!last) return undefined;

  const type = attributeOf(tag, "type");
  return { attribute, value: type ? `${type}(${last})` : last };
}

function withAttribute(tag: string, { attribute, value }: Patch): string {
  const existing = new RegExp(`(\\s${attribute}=")[^"]*(")`);
  if (existing.test(tag)) return tag.replace(existing, `$1${value}$2`);
  const selfClosing = tag.endsWith("/>");
  return `${tag.slice(0, selfClosing ? -2 : -1)} ${attribute}="${value}"${
    selfClosing ? "/>" : ">"
  }`;
}

/**
 * Strips the interactive/animated layer out of a ccgarden SVG, leaving the
 * grown tree exactly as the animation would have ended.
 */
export function ccgardenPoster(source: string): string {
  const stripped = source
    .replace(/<script\b[\s\S]*?<\/script>/g, "")
    // Tooltip copy, one 20-entry JSON array per element, read only by the
    // script that was just removed.
    .replace(/\sdata-tt=('[^']*'|"[^"]*")/g, "")
    // <title> is the browser's own tooltip; on a poster it turns every hover
    // into a phantom of the interaction that isn't there.
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/g, "");

  // A stack walk rather than a regex pairing: an animation freezes onto the
  // element that *encloses* it, which the preceding tag is not — a closed
  // sibling sits between them often enough to matter.
  const open: OpenTag[] = [];
  const patches = new Map<number, Patch[]>();
  const cuts: [start: number, end: number][] = [];

  const tags = /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<[^>]*>/g;
  for (let match = tags.exec(stripped); match; match = tags.exec(stripped)) {
    const tag = match[0];
    if (!tag.startsWith("<") || tag.startsWith("<!") || tag.startsWith("<?")) continue;

    const name = tag.match(/^<\/?\s*([\w:-]+)/)?.[1];
    if (!name) continue;

    if (tag.startsWith("</")) {
      if (!ANIMATION_TAGS.has(name)) open.pop();
      continue;
    }

    if (ANIMATION_TAGS.has(name)) {
      cuts.push([match.index, match.index + tag.length]);
      const parent = open.at(-1);
      const patch = frozenValue(tag);
      if (parent && patch) {
        patches.set(parent.start, [...(patches.get(parent.start) ?? []), patch]);
      }
      continue;
    }

    if (!tag.endsWith("/>")) {
      open.push({ name, start: match.index });
    }
  }

  const edits = [
    ...cuts.map(([start, end]) => ({ start, end, text: "" })),
    ...[...patches].map(([start, list]) => {
      const tag = stripped.slice(start, stripped.indexOf(">", start) + 1);
      return {
        start,
        end: start + tag.length,
        text: list.reduce(withAttribute, tag),
      };
    }),
  ].sort((a, b) => a.start - b.start);

  let out = "";
  let cursor = 0;
  for (const edit of edits) {
    out += stripped.slice(cursor, edit.start) + edit.text;
    cursor = edit.end;
  }
  out += stripped.slice(cursor);

  if (out.includes(STILL_MARKER)) return out;
  // The idle motion — sway, drift, rain, twinkle — is CSS keyframes on
  // thousands of `will-change: transform` elements, so it repaints forever
  // whether or not anyone is looking. A poster holds still.
  // The trailing newline is captured and put back rather than swallowed:
  // without it end-of-file-fixer rewrites the generated file on every commit.
  return out.replace(/<\/svg>(\s*)$/, `<style>${STILL_RULE}</style></svg>$1`);
}
