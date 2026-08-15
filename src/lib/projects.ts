export interface Project {
  name: string;
  description: string;
  url: string;
  tech: string[];
  /** Links to a running site rather than to source. */
  live?: boolean;
  /** Only for projects installable from a public index — not `git+https://…` fallbacks. */
  install?: string;
  /** SPDX id of the repo's LICENSE file. Omit when the repo has none. */
  license?: string;
  /** Shown on the home page. The rest live on /projects. */
  featured?: boolean;
  /** One-line stand-in for `description` where the card has to fit a phone screen. */
  blurb?: string;
}

export const projects: Project[] = [
  {
    name: "gtd",
    description:
      "A TUI, CLI, API, and self-hosted PWA for personal productivity built around Getting Things Done. Capture to an inbox, triage into projects with contexts and next actions, auto-reschedule recurring items, and run reviews grouped by Area of Focus.",
    url: "https://github.com/dannybrown37/gtd",
    tech: [
      "Textual",
      "Vanilla JS",
      "Flask",
      "Tailscale",
      "Oracle Cloud",
      "Python",
    ],
    blurb: "Getting Things Done as a TUI, CLI, API, and self-hosted PWA: capture, triage, review.",
    install: "uv tool install gtd-tui",
    license: "MIT",
    featured: true,
  },
  {
    name: "hamilhamilhamil",
    description:
      "CamelCamelCamel for Broadway: daily price and discount history from the TKTS board. Python scraper on a GitHub Actions cron, Next.js frontend on Vercel, Postgres in between.",
    url: "https://hamilhamilhamil.com",
    blurb:
      "CamelCamelCamel for Broadway: daily price and discount history from the TKTS board.",
    tech: [
      "TypeScript",
      "Next.js",
      "PostgreSQL",
      "GitHub Actions",
      "Python",
    ],
    live: true,
    featured: true,
  },
  {
    name: "git-a-grip",
    description:
    "A curated collection of pre-commit hooks plus a CLI for global pre-commit management.",
    url: "https://github.com/dannybrown37/git-a-grip",
    tech: ["Pre-Commit", "Commitizen", "Ruff", "ESLint", "Bash", "Python"],
    blurb: "A curated collection of pre-commit hooks plus a CLI for global pre-commit management.",
    install:
    "# .pre-commit-config.yaml:\nrepos:\n  - repo: https://github.com/dannybrown37/git-a-grip\n    rev: v0.y.z\n    hooks:\n      - id: choose-your-hooks\n\n# For pre-commit tooling:\nuv tool install git-a-grip",
    license: "MIT",
    featured: true,
  },
  {
    name: "skill-tree",
    description:
      "A shared home for reusable Claude Code/Copilot skills, including the tooling behind each skill. Portable across repos and machines, packaged as a single installable plugin.",
    url: "https://github.com/dannybrown37/skill-tree",
    blurb: "Reusable agentic LLM skills, packaged as one installable plugin.",
    tech: ["Claude Code", "Copilot", "Bash", "Python"],
    install: `/plugin marketplace add dannybrown37/skill-tree\n/plugin install skill-tree@skill-tree\n`,
    license: "MIT",
  },
  {
    name: "dotfiles",
    description:
      "Shell config and global dev tooling. And also the sandbox where most of my projects start.",
    url: "https://github.com/dannybrown37/dotfiles",
    tech: ["Bash", "Neovim", "TMUX", "WSL", "AutoHotKey", "Pre-Commit", "Python"],
  },
  {
    name: "ccgarden",
    description:
      "Grows a tree from your Claude Code session history: each item represents a statistic. The tree on my home page is one of them.",
    url: "https://github.com/dannybrown37/ccgarden",
    tech: ["SVG", "SMIL", "SQLite", "Claude Code", "Python"],
    install: "uv tool install ccgarden",
    license: "MIT",
  },
  {
    name: "dannybrown.dev",
    description: "This site.",
    url: "https://www.dannybrown.dev",
    tech: ["Astro", "Tailwind", "TypeScript"],
    live: true,
  },
];

export function featuredProjects(all: Project[] = projects): Project[] {
  return all.filter((project) => project.featured);
}
