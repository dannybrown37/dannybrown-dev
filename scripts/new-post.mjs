#!/usr/bin/env node
// Scaffolds a blog post and opens it for writing:
//   npm run blog -- "My Post Title" [--slug custom-slug] [--no-open]
import { spawn } from "node:child_process";
import { existsSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { join } from "node:path";

import { postFilename, postFrontmatter } from "../src/lib/new-post.ts";

const BLOG_DIR = join(import.meta.dirname, "..", "src", "content", "blog");

function parseArgs(argv) {
  const args = { open: true };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--no-open") args.open = false;
    else if (argv[i] === "--slug") args.slug = argv[++i];
    else rest.push(argv[i]);
  }
  args.title = rest.join(" ").trim();
  return args;
}

async function promptForTitle() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    return (await rl.question("Post title: ")).trim();
  } finally {
    rl.close();
  }
}

// The vscode-server `code` shim only reaches an editor window through this
// socket, which is set inside VSCode's integrated terminal and nowhere else --
// so its absence means a bare shell, where $EDITOR is the honest choice.
function openInEditor(path) {
  const [command, ...args] = process.env.VSCODE_IPC_HOOK_CLI
    ? ["code", path]
    : [process.env.VISUAL || process.env.EDITOR || "vi", path];

  const child = spawn(command, args, { stdio: "inherit" });
  child.on("error", () => {
    console.warn(`Could not launch ${command}. The post is at ${path}`);
  });
}

const args = parseArgs(process.argv.slice(2));
const title = args.title || (await promptForTitle());
if (!title) {
  console.error("A title is required.");
  process.exit(1);
}

const pubDate = new Date();
let path;
try {
  path = join(BLOG_DIR, postFilename(pubDate, title, args.slug));
} catch (error) {
  console.error(`${error.message} -- pass one explicitly with --slug`);
  process.exit(1);
}

if (existsSync(path)) {
  console.error(`${path} already exists.`);
  process.exit(1);
}

writeFileSync(path, postFrontmatter({ title, pubDate }));
console.log(`Created ${path}`);

// The dev server caches the content-collection glob, so a running one will not
// see this file until it restarts.
if (args.open) openInEditor(path);
