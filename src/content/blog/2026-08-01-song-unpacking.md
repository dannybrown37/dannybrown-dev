---
title: "Frivolous-yet-absolutely-critical Spotify tooling"
description: "Combining my loves of automation and music into some silly yet indispensable tools"
pubDate: 2026-08-01
tags: ["music", "tooling", "autohotkey", "bash", "spotify_player", "spotify", "vscode", "tmux"]
---

My excitement was high when I discovered the [Spotify Player TUI](https://github.com/aome510/spotify-player) yesterday. I'm always working to spend more time in the terminal and less time with a mouse, so I quickly installed it and started playing around.

I quickly realized the issue – to use this program I must:

1. Have an open terminal prompt (easier said than done, I'm usually running *something*)
2. Type the command to open the player

This doesn't seem like all that much overhead, but when I'm trying to quickly change tunes, I truly must insist on *immediate* access.

Some notes on my system setup:

1. I use VSCode
2. On WSL2/Debian
3. With the built-in VSCode terminal
4. With tmux
5. AutoHotKey and Komorebi available to leverage

I started with a [function](https://github.com/dannybrown37/dotfiles/blob/main/bin/spotify.sh#L49), `spotify_player_jump`, that I can run from any terminal to shift focus to the TMUX window currently playing Spotify. (Since my TMUX windows are labeled with their open folders, it won't always be obvious where I'm running this.)

This was a nice start, but still requires that open terminal window, potentially *several* steps to get there from any current context.

What I really wanted was a *global* keyboard shortcut: what key-combo can I press to focus my Spotify TUI from *anywhere*?

This is where AutoHotKey comes in. First I had to override a VSCode keybinding:

```vscode keybindings.json
{
    "key": "ctrl+shift+alt+f9",
    "command": "workbench.action.terminal.focus"
}
```

Then added this little snippet to my AHK config:

```autohotkey
!s::
    RunWait, komorebic.exe focus-workspace 0,, Hide
    RunWait, wsl.exe bash -l -i -c "source ~/.bashrc; spotify_player_jump",, Hide
    WinActivate, ahk_exe Code.exe
    WinWaitActive, ahk_exe Code.exe,, 2

    KeyWait, s
    KeyWait, Alt
    Sleep, 150
    SetKeyDelay, 30, 30
    SendEvent, ^+!{F9}
    Sleep, 120
    SendEvent, ^+!{F9}
return
```

The hard part here (and the reason the VSCode keybinding was required) is getting the *focus* on the Spotify Player window after opening it. When I used `alt+s` from my browser, it worked as intended. But if I was typing in a VSCode text file, the terminal window would open, but the focus would stay on the cursor in the file, requiring another motion to switch focus. The keybinding above resolved this beautifully.

Unsatisfied, I decided to take this further. Yesterday, in my first blog post on this site, I signaled my music nerdasity by including a "Song On Right Now" section at the bottom of the post. I'm the kind of guy who thinks it will be fun make a habit of this, but think of the *process*:

1. Go to Spotify
2. Copy the link
3. Consider my *extreme consideration*: posting a Spotify link leaves out people who use other services. What I *really* want is a service-agnostic link, so I run this through the Music Link service to provide that. If I'm doing manually every time, that means opening the browser, pasting the link, and copying the result.
4. Then I need to come over to my post, write the markdown to label the song and artist, check for typos, et al.

I don't want to do all that! The best developers are lazy, after all.

I discovered another very cool thing about `spotify_player` that really unlocked all of this.

```bash
spotify_player get key playback
```

That command right there gives us a pretty strong set of metadata for the system's *currently playing song*.

This unlocked a [couple new Bash functions/aliases](https://github.com/dannybrown37/dotfiles/blob/main/bin/spotify.sh) for me:

```bash
song
>>> https://song.link/s/1BRwuvjhkgezmv1gcI6lT6
sorn
>>> Song On Right Now: "[Die Young](https://song.link/s/1BRwuvjhkgezmv1gcI6lT6)" by Sylvan Esso
```

That's *very* neat, but it's still a multi-step process:

1. Open a terminal window
2. Run the command
3. Copy the output into the desired place

*What if*, I thought, *I could run these commands from **anywhere***?

Again, AutoHotKey comes in for the win:

```autohotkey
InsertSpotifyOutput(bashFunction) {
    outFile := "/tmp/spotify_hotstring_output.txt"
    RunWait, % "wsl.exe bash -l -i -c ""source ~/.bashrc; " . bashFunction . " >" . outFile . """", , Hide
    if (ErrorLevel) {
        MsgBox, % bashFunction . " failed (exit " . ErrorLevel . ") -- is a track playing?"
        return
    }
    ; Update this path if your WSL distro isn't Debian.
    FileRead, OutputVar, \\wsl$\Debian\tmp\spotify_hotstring_output.txt
    SendRaw, % Trim(OutputVar, "`r`n")
}

; @doc song: ,,song -- insert a service-agnostic musiclink for the currently playing track
::,,song::
InsertSpotifyOutput("spotify_copy_playing_link -m")
return

; @doc sorn: ,,sorn -- insert "Song On Right Now" markdown for the currently playing track
::,,sorn::
InsertSpotifyOutput("spotify_now_playing_markdown")
return
```

Now, here in my editor where I'm writing this blog post, I can just type `,,sorn` followed with a space, and it will unpack to just what I want—in exactly one step.

It's not the most world-shaking tooling ever, but it makes me more excited to work on my computer, and that's how Happy Developers are made.

> Song On Right Now: "[My Name Is Human](https://song.link/s/1euszbbvkUzQzIhZUWFmXG)" by Highly Suspect

<video src="/sorn-song-demo.mp4" autoplay muted loop playsinline class="w-full rounded-lg">
  Demo of the sorn and song scripts.
</video>
