# dannybrown.dev

Developer portfolio + blog. Astro (static output), Tailwind v4, Vitest, TypeScript strict.
**Public repo** — nothing committed here is private; never commit secrets or personal info you
wouldn't want indexed.

## Stack

- Pages: `src/pages/**/*.astro`, shared chrome in `src/layouts/Layout.astro`.
- Blog posts: markdown in `src/content/blog/`, schema in `src/content.config.ts` (Zod-validated
  frontmatter: `title`, `description`, `pubDate`, optional `updatedDate`, `tags`).
- Pure logic (date/reading-time/etc.) lives in `src/lib/*.ts`, not inline in `.astro` files —
  keeps it unit-testable outside the Astro render pipeline.
- Dates: always format with `formatDate` (`src/lib/format-date.ts`), which pins `timeZone: "UTC"`.
  Frontmatter dates are date-only; letting `Intl`/`Date` use the local timezone will render the
  wrong day for anyone not in UTC — this bit us once already.

## Conventions

- TDD: write the failing test in `src/lib/*.test.ts` before the implementation. Use
  `it.each` for parametrized cases.
- `npm test` (Vitest), `npm run build` (must pass — catches content-schema errors Vitest won't).
- No comments unless explaining a non-obvious "why" (see the timezone note above for the bar).
- Don't add, commit, or push — the user does that manually.
- Discrete, reviewable steps; pause for feedback between them rather than building the whole
  site in one pass.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
