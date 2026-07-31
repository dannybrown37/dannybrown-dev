# TODO

## Ship it (blocking, manual — not done by an agent)

- [ ] `gh auth login` — current token is invalid, needed before creating the remote repo.
- [ ] Create a **public** GitHub repo (e.g. `dannybrown-dev`), push `main`.
- [ ] Repo Settings → Pages → set source to **GitHub Actions** (workflow already at
      `.github/workflows/deploy.yml`; it runs `npm test` before building, then deploys `dist/`).
- [ ] Porkbun DNS: add an `A` record for the apex domain pointing at GitHub Pages:
      `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
      Optional: `CNAME` for `www` → `<github-username>.github.io` if you want `www.dannybrown.dev`
      too. `public/CNAME` already contains `dannybrown.dev` so Pages knows the custom domain.
- [ ] `dannycbrown.com` — let it expire in March (decided, no action needed before then).

## Content

- [ ] Real About page copy (currently placeholder text).
- [ ] Real Projects list — currently only lists `dotfiles`; pull in `gtd`, `skill-tree`, others
      worth showing.
- [ ] Replace/expand the "Hello, world" placeholder post.
- [ ] Blog index page doesn't show post dates yet — only title + description
      (`src/pages/blog/index.astro`). Add `formatDate`/reading time there too if wanted.

## Design

- [ ] Current styling is bare Tailwind defaults — explicitly a placeholder, not a design pass.
      Needs an actual visual direction before this is "done."

## Notes for next session

- Stack: Astro (static), Tailwind v4 + typography plugin, Vitest, TS strict. Conventions in
  `AGENTS.md`/`CLAUDE.md` (symlinked).
- Everything is currently `git add`-staged but **not committed** — first commit is still manual.
- Backlog item tagged `[dannybrown-dev]` in the shared backlog (was
  `[greenfield] Doing something with dannycbrown.com / dannybrown.dev`), currently
  `[in-progress]` — mark complete via the `backlog` skill once this reaches a stable v1, or
  keep working it if picking this repo back up.
