#!/usr/bin/env node
// Regenerates the homepage garden from local Claude Code history, rounds the
// coordinates down to display precision, and stages it.
//
// The session logs live only in ~/.claude on Danny's machine -- GitHub Actions
// can never build this -- so it has to be produced here at commit time.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

import { ccgardenPoster } from "../src/lib/ccgarden-poster.ts";
import { roundSvgPrecision } from "../src/lib/round-svg-precision.ts";

const SOURCE = join(homedir(), ".claude", "ccgarden.svg");
const TARGET = join(import.meta.dirname, "..", "public", "ccgarden.svg");
// The still frame the homepage actually ships; see src/lib/ccgarden-poster.ts.
const POSTER = join(import.meta.dirname, "..", "public", "ccgarden-poster.svg");

const force = process.argv.includes("--force");

// Each regeneration is a fresh ~88KB blob that git cannot delta against the
// previous day's, so cap it at one per day. The tree's rings are per-day
// anyway; intraday leaves land on tomorrow's first commit.
function alreadyFreshToday() {
  if (!existsSync(TARGET)) return false;
  const modified = statSync(TARGET).mtime.toDateString();
  return modified === new Date().toDateString();
}

function run() {
  if (!force && alreadyFreshToday()) {
    console.log("ccgarden: already regenerated today, skipping");
    return;
  }

  try {
    execFileSync("ccgarden", ["--no-open"], { stdio: "ignore" });
  } catch (error) {
    // Never block a commit over this -- a missing ccgarden, an unreadable
    // ~/.claude, or a machine that simply isn't Danny's just keeps the
    // currently committed SVG.
    console.warn(`ccgarden: skipped (${error.message})`);
    return;
  }

  const rounded = roundSvgPrecision(readFileSync(SOURCE, "utf8"));
  // Newline-terminated, or end-of-file-fixer rewrites it on every commit.
  const poster = `${ccgardenPoster(rounded).trimEnd()}\n`;
  writeFileSync(TARGET, rounded);
  writeFileSync(POSTER, poster);
  execFileSync("git", ["add", TARGET, POSTER]);

  const kb = (bytes) => (Buffer.byteLength(bytes) / 1024).toFixed(0);
  console.log(
    `ccgarden: refreshed public/ccgarden.svg (${kb(rounded)}KB) and ` +
      `public/ccgarden-poster.svg (${kb(poster)}KB), and staged them`,
  );
}

run();
