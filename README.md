# dannybrown.dev

Personal portfolio + blog. Astro (static), Tailwind v4, TypeScript, Vitest, Biome.
Deployed to GitHub Pages on push to `main`.

## Setup

Node ≥ 22.12.

```sh
npm install
pre-commit install   # or: prek install
```

## Commands

| Command                           | What                                              |
| :-------------------------------- | :------------------------------------------------ |
| `npm run dev`                     | Dev server at `localhost:4321`                    |
| `npm run build`                   | Build to `dist/` (also validates post frontmatter) |
| `npm run preview`                 | Serve the built `dist/`                           |
| `npm test`                        | Vitest                                            |
| `npm run blog -- "Title"`         | Scaffold a post; opens in VS Code or `$EDITOR`   |
| `npm run ccgarden:sync`           | Regenerate the homepage garden SVG (see below)    |
| `npx biome check --write .`       | Lint + format                                     |
| `npx tsc --noEmit`                | Type check                                        |

## Layout

```text
src/
  pages/            routes (index, projects, blog/, og/, rss.xml.ts, 404)
  layouts/          Layout.astro — shared chrome
  components/       .astro components
  content/blog/     posts (markdown)
  content.config.ts post frontmatter schema
  lib/              pure logic + *.test.ts beside each file
  styles/           global.css (Tailwind)
public/             static assets, CNAME, ccgarden SVGs
scripts/            new-post, sync-ccgarden
```

## Writing a post

`npm run blog -- "My Title"` creates `src/content/blog/<slug>.md`. Frontmatter:
`title`, `description`, `pubDate` required; `updatedDate`, `tags` optional.
Bad frontmatter fails `npm run build`, not `npm test`.

New post not showing in dev? Restart the dev server — it caches the content glob.

## Gotchas

- **Dates:** always use `formatDate` (`src/lib/format-date.ts`). It pins UTC; local-timezone
  formatting renders date-only frontmatter a day off.
- **Logic goes in `src/lib/`**, not inline in `.astro`, so it's testable.
- **ccgarden:** `public/ccgarden-plot.svg` is generated from `~/.claude` on my machine only
  (CI can't). The pre-commit hook refreshes it at most once a day; `ccgarden:sync` forces it.
- **Pre-commit** also runs gitleaks, a private-terms blocker, biome, vitest, tsc, and zizmor.
  This repo is public — don't commit secrets or personal info.

## Deploy

`.github/workflows/deploy.yml`: test → build → deploy to Pages. PRs run test + build only.
