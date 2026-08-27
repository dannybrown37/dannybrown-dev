---
title: "One Month of Claude Pro"
description: "I've used LLMs for my day job for some time, but held off until recently on paying for AI tooling for personal use. Reviewing the output and value proposition of my first month."
pubDate: 2026-08-27
tags: ["ai"]
---

LLMs are a key part of my workflow as a software engineer, but for whatever reason, I'd been hesitant to pull the trigger on paying for LLM services for my side projects.

Then last month, I was feeling extra ambitious about building a couple things, and after comparing different products I decided, "Why not just try and see if the $20 Claude Pro plan is sufficient?" In contrast to all the naysayers online saying it's basically a paid trial that provides minimal value, I am kind of blown away by how much I was able to get done this month.

One of the very first things I decided to build was an analysis tool for tracking my usage of Claude Code over time. This is done with a command, `ccstats`, that analyzes logs, dumps everything to SQLite, and calculates a nice summary of various statistics around usage. Here's mine for the last month:

```console

  ╭─ Claude Code usage ──────────────────────────────────────────────────────╮
  │ 2026-07-26 → 2026-08-27   ·   31 active days                             │
  ╰──────────────────────────────────────────────────────────────────────────╯

  sessions                        758      tokens out                    26.5M
  prompts                       3,268      tokens in                    294.6K
  replies                      45,361      cache read                     3.3B
  thinking blocks              10,909      cache written                102.3M
  subagent runs                    28
  lines added                  62,673
  lines removed                20,878

  daily output tokens   peak 3.1M/day
    ▁▅█▆▄▄▄▄▃▂▁▂▁▁▁▃▄▄▃▂▄▂▃▃▁▂▃▂▂▁▁▁▁
    2026-07-26             2026-08-27

  by repo
                                          spend   tokens            lines  sess
    dotfiles         ███░░░░░░░░░░░  $   481.31     6.8M   +10,138/-3,419   159
    skill-tree       ██░░░░░░░░░░░░  $   254.04     3.4M    +4,770/-2,327   106
    gtd              ██░░░░░░░░░░░░  $   327.31     3.2M    +7,690/-2,641   105
    ccgarden         ██░░░░░░░░░░░░  $   239.37     3.1M   +10,515/-1,747    69
    gfunk            ██░░░░░░░░░░░░  $   264.84     2.7M   +13,360/-4,803    99
    hamilhamilhamil  █░░░░░░░░░░░░░  $   206.38     2.4M    +4,774/-1,815    67
    dannybrown-dev   █░░░░░░░░░░░░░  $   196.65     2.4M    +4,320/-1,674    89
    git-a-grip       █░░░░░░░░░░░░░  $   111.72     1.1M    +2,699/-1,117    32
    compound         █░░░░░░░░░░░░░  $    85.77   809.8K      +2,798/-725    11
    deluge           ░░░░░░░░░░░░░░  $    29.41   226.7K      +1,016/-385     6
    canary           ░░░░░░░░░░░░░░  $    12.79   216.6K        +593/-225     9
    fast-pr          ░░░░░░░░░░░░░░  $     1.19    19.4K            +0/-0     1
    (unknown)        ░░░░░░░░░░░░░░  $     0.02       78            +0/-0     5

  caching
    cache hit ratio          100.0%
    cache efficiency          31.8x

  turn duration
                                         p50       p95   turns
    model time                         40.8s    310.7s   2,001
    wall clock                         54.0s    414.8s   2,052
    claude-opus-5                      53.4s    339.7s     948
    claude-sonnet-5                    40.5s    288.3s     623
    claude-opus-4-6                    24.2s    182.6s     366
    claude-haiku-4-5-20251001          13.6s     95.3s      47
    <synthetic>                         0.6s      1.2s      17

  estimated spend
    total                                     $   2210.81
    output               ███░░░░░░░░░  22.9%  $    506.61
    input (uncached)     ░░░░░░░░░░░░   0.1%  $      1.23
    cache read           ███████░░░░░  54.3%  $   1200.95
    cache write          ███░░░░░░░░░  22.7%  $    502.02
    (excluded, no pricing on file: <synthetic>)

  cartoon (--since 7d)
    calls                         2
    tokens saved                  0
    passthrough             2 calls         0 saved

  model mix
    claude-opus-5            ████████████ 51.0%  23,154
    claude-sonnet-5          ████████░░░░ 34.7%  15,738
    claude-opus-4-6          ███░░░░░░░░░ 12.1%   5,482
    claude-haiku-4-5-202510… ░░░░░░░░░░░░  2.0%     917
    <synthetic>              ░░░░░░░░░░░░  0.2%      70

  effort mix
    low                      ████████████ 52.3%  23,222
    high                     ███████░░░░░ 31.0%  13,759
    medium                   ████░░░░░░░░ 16.2%   7,173
    xhigh                    ░░░░░░░░░░░░  0.5%     220

  model x effort mix
    claude-opus-5 (low)      ████████████ 33.6%  15,262
    claude-sonnet-5 (high)   ████████░░░░ 21.4%   9,688
    claude-opus-4-6 (low)    ████░░░░░░░░ 12.1%   5,482
    claude-opus-5 (high)     ███░░░░░░░░░  9.0%   4,071
    claude-opus-5 (medium)   ███░░░░░░░░░  7.9%   3,601
    claude-sonnet-5 (medium) ███░░░░░░░░░  7.9%   3,572
    claude-sonnet-5 (low)    ██░░░░░░░░░░  5.5%   2,478
    claude-haiku-4-5-202510… █░░░░░░░░░░░  2.0%     917
    claude-opus-5 (xhigh)    ░░░░░░░░░░░░  0.5%     220
    <synthetic>              ░░░░░░░░░░░░  0.2%      70

  top tools
    Bash                     ████████████ 56.7%  14,229
    Edit                     ████░░░░░░░░ 21.1%   5,309
    Read                     ███░░░░░░░░░ 14.8%   3,714
    Write                    █░░░░░░░░░░░  3.7%     931
    AskUserQuestion          ░░░░░░░░░░░░  1.4%     363
    Skill                    ░░░░░░░░░░░░  0.5%     117
    TaskUpdate               ░░░░░░░░░░░░  0.4%     113
    WebFetch                 ░░░░░░░░░░░░  0.4%      93
    TaskCreate               ░░░░░░░░░░░░  0.3%      76
    ToolSearch               ░░░░░░░░░░░░  0.3%      73

  longest prompt: 33,792 chars

  (--explain for metric definitions)
```

(You can look at my [projects](/projects) page to see more details of what I've been working on.)

I'm going to go so far as to say that this output is *neat*. Note that the dollar values of the spend are based on live API prices pulled down by the script and are purely notional. That $2200+ of "spend" reflected above was covered by my $20 account. That's some "trial!"

It took me a bit to realize I wasn't limited among Opus model to only 5, which I found to be overly verbose and jargony. Once I realized I could select Opus 4.6, that became my model of choice for the month. An Opus model on low effort seems to offer a good balance of token churn vs quality of output, and that's become pretty much my default these days. I've experimented with planning with Opus and building with Sonnet or Haiku, but in practice, I haven't found that to reflect much in savings, be it in time or tokens.

There's definitely a "tokenmaxxing" psychology that comes into it for me: I feel drawn to prompt Claude as frequently as possible in an attempt to hit that 100% usage each week (preferably the day before it resets!). There's a weird mix of satisfaction and disappointment whenever I hit the 5-hour window 100% limit; like, it's both a good *and* bad thing that I simply can't use this tool for a while. I used 100% of my allotment during the first three weeks, but only hit 70-something in week 4, and that kind of bums me out.

This represents a new, exciting problem to solve for me. Tokenmaxxing isn't a thing I need to worry about for my day job, but for this personal account, I'm working on ways I can have agents running autonomously without the need for my involvement, balanced with 1) my desire to control and understand the software being built, 2) not wanting this to go so far afield that I don't have tokens available when I need them.

Back to `ccstats`. I wanted to to build a visualization of my usage, so I pushed past just the stats dashboard and into the realm of generative art:

<div id="garden-frame" style="position:relative;width:100%;contain:paint">
  <img
    id="ccgarden-poster"
    src="/images/ccgarden-2026-08-27-poster.svg"
    width="800"
    height="966"
    decoding="async"
    style="width:100%;height:auto;transition:opacity .5s"
    alt="My Claude Code Garden as of August 27, 2026"
  />
  <object
    id="ccgarden"
    type="image/svg+xml"
    data-src="/images/ccgarden-2026-08-27.svg"
    aria-label="The same garden, growing from bare ground to today"
    style="pointer-events:none;position:absolute;inset:0;width:100%;height:100%;opacity:0;transition:opacity .5s"
  ></object>
  <button
    id="garden-play"
    type="button"
    style="display:none;position:absolute;top:.75rem;left:.75rem;align-items:center;gap:.5rem;border-radius:9999px;border:1px solid #d1d5db;padding:.5rem .875rem;font-family:monospace;font-size:.75rem;backdrop-filter:blur(8px);background:rgba(255,255,255,.85);color:#1a1a1a;cursor:pointer;transition:border-color .2s"
  >
    <svg style="width:.75rem;height:.75rem" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z"></path>
    </svg>
    <span id="garden-play-label">Watch it grow</span>
  </button>
</div>

<script>
(function () {
  const GROWN = 60;
  const object = document.getElementById("ccgarden");
  const poster = document.getElementById("ccgarden-poster");
  const play = document.getElementById("garden-play");
  const label = document.getElementById("garden-play-label");
  if (!(object instanceof HTMLObjectElement) || !(play instanceof HTMLButtonElement)) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  play.style.display = "inline-flex";
  if (label) label.textContent = reduced ? "Explore it" : "Watch it grow";

  let replay = null;

  const reveal = () => {
    object.style.opacity = "1";
    object.style.pointerEvents = "auto";
    if (poster) poster.style.opacity = "0";
    if (label) label.textContent = reduced ? "Explore it" : "Replay";
  };

  const attach = () => {
    const svg = object.contentDocument?.documentElement;
    if (typeof svg?.pauseAnimations !== "function") return;

    if (reduced) {
      svg.setCurrentTime(GROWN);
      svg.pauseAnimations();
      reveal();
      return;
    }

    let onScreen = true;
    const halt = svg.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "style");
    halt.textContent = "*{animation-play-state:paused !important}";

    const sync = () => {
      if (onScreen) { svg.unpauseAnimations(); halt.remove(); }
      else { svg.pauseAnimations(); svg.append(halt); }
    };

    replay = () => { svg.setCurrentTime(0); onScreen = true; sync(); };

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    }, { threshold: 0 });
    observer.observe(object);

    svg.setCurrentTime(0);
    svg.unpauseAnimations();
    reveal();
  };

  play.addEventListener("click", () => {
    if (replay) { replay(); return; }
    if (object.data) return;
    if (label) label.textContent = "Loading…";
    object.addEventListener("load", attach, { once: true });
    object.data = object.dataset.src ?? "";
    if (object.contentDocument?.readyState === "complete") attach();
  });
})();
</script>

`ccgarden` generates a SVG based on the usage, with tooltips explaining what everything *means*. If you've been using Claude Code, you can generate your own:

```console
uv tool install ccgarden
ccgarden --since yyyy-mm-dd
```

If you run it and have thoughts, [please share](mailto:tinker@dannybrown.dev)!

Song On Right Now: "[Two Thousand and Seventeen](https://open.spotify.com/track/2ZIaH69kaz55RM4Pjx6KXl)" by Four Tet
