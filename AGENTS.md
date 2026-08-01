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

**Never touch a dev server the user is running.** Don't stop, restart, or kill a process on
port 4321 — it's theirs, and it may be mid-use. Check first: `astro dev status`, or
`ss -ltnp | grep 4321`.

Starting your own to check work is fine, with both conditions met:

1. **Nothing is already running.** If there is, use it read-only (`curl localhost:4321/...`)
   or just build instead. Never clear the port.
2. **You shut it down in the same turn**, once you've got what you needed — `astro dev stop`.
   Never leave one running for the user to trip over; they'll go to start their own and hit a
   port conflict. Shut it down even if the task failed or you got interrupted.

Start it with `astro dev --background`; also `astro dev status`, `astro dev logs`. If the
user explicitly asks for a server, leave it up — that one's for them, not for verification.

Prefer `npm run build` + `npm test` when they'd answer the question; reading compiled CSS or
HTML out of `dist/` beats booting a server. But a server is the honest check for anything
that only exists at render time, and "looks right" always needs the user's eyes regardless.

Note: the dev server caches the content-collection glob. Adding or deleting a file in
`src/content/blog/` may not show up until it restarts — worth mentioning to the user if a
new post seems missing, rather than restarting it yourself.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
