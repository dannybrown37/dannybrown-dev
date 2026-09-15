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

import { roundSvgPrecision } from "../src/lib/round-svg-precision.ts";

const SOURCE = join(homedir(), ".claude", "ccgarden.svg");
const TARGET = join(import.meta.dirname, "..", "public", "ccgarden.svg");
const WEB_SOURCE = join(homedir(), ".claude", "ccgarden-web.svg");
const WEB_TARGET = join(import.meta.dirname, "..", "public", "ccgarden-web.svg");

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
    execFileSync(
      "ccgarden",
      ["--web", "--no-open", "--output", WEB_SOURCE],
      { stdio: "ignore" },
    );
  } catch (error) {
    console.warn(`ccgarden: skipped (${error.message})`);
    return;
  }

  const rounded = roundSvgPrecision(readFileSync(SOURCE, "utf8"));
  const web = roundSvgPrecision(readFileSync(WEB_SOURCE, "utf8"));
  writeFileSync(TARGET, rounded);
  writeFileSync(WEB_TARGET, web);
  execFileSync("git", ["add", TARGET, WEB_TARGET]);

  const kb = (bytes) => (Buffer.byteLength(bytes) / 1024).toFixed(0);
  console.log(
    `ccgarden: refreshed public/ccgarden.svg (${kb(rounded)}KB) and ` +
      `public/ccgarden-web.svg (${kb(web)}KB), and staged them`,
  );
}

run();
