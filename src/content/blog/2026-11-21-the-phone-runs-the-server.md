---
title: "The phone runs the server"
description: "Tarn's phone app now runs the same API code as the server, in a Web Worker on WASM SQLite. Offline works properly, and online reads got faster."
pubDate: 2026-11-21
tags: ["tarn", "local-first", "sqlite", "wasm", "typescript"]
---

[Tarn](https://tarn.dannybrown.dev/#/today) is my local-first notes and GTD app. The source of truth is a folder of markdown files on my computer. A Node server indexes them into SQLite and serves a JSON API, and a React app talks to that API. On my phone, the same React app runs as a PWA.

The phone was always the weak spot. It kept a copy of my notes in IndexedDB so I could read them offline, but anything that needed the index (database views, GTD lists, backlinks, the graph, search) was either missing or stale. Worse, the offline search and link-resolving code was a *second copy* of the server's logic, written for the browser. Two copies of the same logic drift apart. It's only a question of when.

## The idea: don't port the server, run it

Tarn has a public demo, and the demo has no backend. It runs `server/api.ts` in a Web Worker on top of [WASM SQLite](https://sqlite.org/wasm), with a few Node shims so the server code doesn't notice it's in a browser. So the code to run the real API on a phone already existed. I just wasn't using it on the phone.

So now the phone does this:

```
 page ── api.get ──► online, not a vault read ──────────► real server
             │
             └── offline, or a vault read ──► phone worker
                                                same server/api.ts
                                                vault = notes copy (IndexedDB)
                                                index = WASM SQLite (saved in OPFS)

 writes ── real server, or the outbox when offline
           └─► server reply ─► worker reindexes that one file
```

The worker gets exactly what the phone already had: the markdown files. No secrets, no calendar or mail or finance integrations. Those routes just 404 in the worker, so it fails closed. When I unpair the phone, the worker is terminated and its saved index is deleted.

The one real cost was the Content Security Policy. Compiling WebAssembly needs `'wasm-unsafe-eval'` in `script-src`. Despite the name, it doesn't allow JavaScript `eval` or inline scripts, just WASM compilation. I turned it on only for the listener the phone uses.

## Offline first, then fast online

Step one was offline: when `fetch` fails, ask the worker instead. That alone meant database views, GTD Next Steps and backlinks all work offline, and I got to delete the browser-only copies of search and link resolving.

Step two was more fun. If the phone can answer a read, why wait for the network at all? My first plan was "phone answers first, network refreshes in the background." What I built instead was a race:

```
 vault read, copy in step, worker warm ─┬─► ask phone ─┐ first answer
                                        └─► fetch ─────┘ is shown
 phone won ─► network answer arrives ─► same JSON? done
                                        └ differs ─► resync + refetch
 2nd mismatch on a route ─► that route goes network only
```

A simplified version of the shape:

```ts
async function read(path: string): Promise<unknown> {
  const net = fetchJson(path);
  if (!phoneReady()) return net;

  const phone = askPhone(path);
  const first = await Promise.any([phone, net]);

  net.then((fresh) => {
    if (!sameJson(fresh, first)) resyncAndRefetch(path);
  });
  return first;
}
```

The race means it's never slower than before. On a good connection the network sometimes wins, and that's fine. On a bad one, the phone wins and the screen fills in right away.

"In step" matters. On startup the phone sends a digest of what it holds to `/api/sync/manifest`. If the server agrees, the answer is tiny and the phone knows its copy matches. Any file change event marks it out of step until the next sync. If the phone answered and the server later disagrees, the phone resyncs and refetches. If the same route disagrees twice, that route goes network-only, so a bug in the worker can't keep showing me wrong data.

A few things stay network-first on purpose. Resolving a link that doesn't exist yet creates a note, and I don't want a phone answer to decide that.

## Saving the index: 23 s to 1.5 s

The first version kept the worker's SQLite database in memory. Every time the app started, it re-indexed every note. On a big vault that's slow, and a phone CPU makes it slower.

The fix was to keep the database file in the [Origin Private File System](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system) using sqlite-wasm's `opfs-sahpool` VFS. The worker also records which version of each file it has indexed. On boot, it tells the page what it holds, the page works out which files changed, and only those get fed back in, in one transaction:

```
 worker boot ─► open OPFS index.db ─► hello { held }
 page: planFeed(held, copy) ─► only changed files
   ─► reindex + record them, in one transaction
 schema bump ─► db rebuilt empty ─► full feed
```

I benched a 10,000-note vault with the CPU throttled 4× to stand in for a phone:

| Start | Time |
| --- | --- |
| First start (empty index) | 23.3 s |
| Restart, nothing changed | 1.5 s |
| Restart, one note changed | 1.8 s |

The first start is still slow, but it only happens once.

## Writing offline: the outbox

Reads are the easy half. Writes made offline have to reach the server later, and the server may have moved on by then.

Edits made offline go into an outbox. Only edits that make sense to apply later are queueable: saving a note, changing properties, toggling a task, GTD capture and triage. Renames and deletes need a live server. The UI gets a synthetic reply so it carries on as if the save worked.

Typing produces a lot of saves of the same note, so repeated saves collapse into one, keeping the *original* base hash:

```ts
export function enqueue(queue: OutboxEntry[], e: OutboxEntry): OutboxEntry[] {
  const last = queue.at(-1);
  if (last && isBodySave(last) && isBodySave(e) && last.body?.path === e.body?.path) {
    const merged = { ...last, body: { ...e.body, baseHash: last.body?.baseHash } };
    return [...queue.slice(0, -1), merged];
  }
  return [...queue, e];
}
```

On reconnect, the outbox replays in order:

```
 reconnect ─► replay in order
   ├─ 2xx ──────────────► done
   ├─ 409 on a note ───► server has same text? drop : conflict copy
   ├─ other 4xx ───────► drop + toast
   └─ offline/5xx/401 ─► stop, retry later
```

## Stale saves: a three-way merge

The interesting case is a stale save. I edited a note on the phone on a plane; meanwhile I'd added a line to the same note on my laptop. The phone's save arrives with a base hash that's no longer current.

Rejecting it would be safe and annoying. Instead the server keeps recent versions of each file, finds the one the phone started from, and does a three-way line merge of base, mine and theirs:

```
 base ──► mine     (phone's edit)
      └─► theirs   (what's on disk now)

 hunks that don't overlap      → apply both
 overlapping, same result      → apply once
 both inserted at the same spot → theirs, then mine
 anything else                 → 409, keep both copies
```

The "both inserted at the same spot" rule is for the most common case I have: two devices appending to the same daily note. Neither edit is lost; you get both lines.

Unlike git, edits to *neighbouring* lines merge. Notes are prose, not code, and a conflict because I fixed a typo on line 4 while adding line 5 elsewhere would be silly.

```ts
merge3(
  "Groceries\n- milk\n- eggs",
  "Groceries\n- milk\n- eggs\n- bread",  // phone added bread
  "Groceries\n- oat milk\n- eggs",       // laptop changed milk
);
// { ok: true, text: "Groceries\n- oat milk\n- eggs\n- bread" }
```

When the merge really can't decide, the server returns 409. The outbox then checks whether the server already has exactly my text (common after a retry) and drops the save if so. Otherwise it writes my version as a new note titled `<name> (conflict <date time>)`, so nothing I typed is ever thrown away.

One subtle bit: after a merge, the server returns the hash of *my* text as the base for the next queued save, not the hash of the merged result. Later saves in the queue were typed on top of my text, so that's the right base to diff against.

## What I'd tell myself at the start

- If you have the same logic in two places, look for a way to run one of them in both places before writing a third.
- Racing beats "local first, network later" when you aren't sure the local copy is right. You get speed without ever being slower.
- Make the phone's copy prove it's in step before trusting it, and stop trusting it on a route that's been wrong twice.
- For notes, merge generously. A conflict copy is a fine last resort, as long as it's the *last* one.
