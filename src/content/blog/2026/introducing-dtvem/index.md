---
title: "Introducing the Developer Tools Virtual Environment Manager!"
date: "2026-01-05T12:00:00-05:00"
categories: [golang, cli, python, node, ruby]
description: "A unified, cross-platform runtime version manager that actually works on Windows"
blueskyPostId: 3mbpawpkn4z26
---

If you've ever tried to manage multiple versions of Python, Node.js, or Ruby on Windows, you know the pain. Tools like `nvm`, `pyenv`, and `rbenv` work great on macOS and Linux, but Windows support ranges from "hacky workarounds" to "just use WSL." And even on Unix systems, you're juggling three different tools with three different configurations.

So I built something better.

## Introducing dtvem

**dtvem** (Developer Tools Virtual Environment Manager) is a unified, cross-platform runtime version manager written in Go. One tool to manage Python, Node.js, and Ruby — and it works identically on Windows, macOS, and Linux.

No shell hooks. No `.bashrc` modifications. No WSL required. Just install it and go.

## Why Another Version Manager?

The existing tools are great, but they all have the same problem: Windows is an afterthought. And if you work across multiple runtimes, you're maintaining separate tools with separate configurations.

dtvem takes a different approach:

- **Windows is a first-class citizen** — not an afterthought or "community port"
- **Shim-based architecture** — works in cmd.exe, PowerShell, bash, zsh, fish, whatever
- **One tool for multiple runtimes** — Python, Node.js, and Ruby today, with Go, Rust, and Java on the roadmap
- **Project-local versions** — drop a config file in your project and the right versions activate automatically

## How It Works

dtvem uses shims instead of shell integration. When you run `python` or `node`, it intercepts the command and routes it to the correct version based on your configuration.

The resolution order is simple:

1. **Local config** — `.dtvem/runtimes.json` in your project (or any parent directory)
2. **Global config** — `~/.dtvem/config/runtimes.json` for system-wide defaults
3. **System PATH** — falls back to whatever's installed on your system

No magic. No shell hooks. It just works.

## Getting Started

Installation is a one-liner.

**Windows (PowerShell):**

```powershell
irm dtvem.io/install.ps1 | iex
```

**macOS / Linux:**

```bash
curl -fsSL dtvem.io/install.sh | bash
```

Once installed, the workflow is straightforward:

```bash
# Install a runtime version
dtvem install python 3.12.0
dtvem install node 22.0.0

# Set global defaults
dtvem global python 3.12.0
dtvem global node 22.0.0

# Set project-specific versions
cd my-project
dtvem local python 3.10.0
dtvem local node 18.20.0

# Check what's active
dtvem current
```

That's it. Navigate into `my-project` and Python 3.10.0 and Node 18.20.0 are automatically active. Navigate out and your global versions take over.

## Migrating from Existing Tools

Already using nvm, pyenv, or rbenv? dtvem can import your existing installations:

```bash
dtvem migrate node    # Import from nvm or fnm
dtvem migrate python  # Import from pyenv
dtvem migrate ruby    # Import from rbenv, rvm, chruby, or uru
```

It detects your existing version managers, copies the installed versions, preserves your globally installed packages, and optionally cleans up the old installations. You can run both tools side-by-side during the transition if you want a gradual migration.

## The Website

All the details live at [dtvem.io](https://dtvem.io). You'll find:

- **Getting Started guide** — installation and basic workflow
- **Command reference** — all 18 commands documented
- **Runtime guides** — specifics for Python, Node.js, and Ruby
- **Migration guide** — step-by-step for switching from other tools
- **Comparison page** — how dtvem stacks up against nvm, pyenv, rbenv, asdf, and mise

The install scripts are served directly from the domain, so the one-liner installations just work.

## Get It / Contribute

dtvem is pre-1.0 but fully functional. The core runtimes are stable, and I'm working on adding Go, Rust, and Java.

Both projects are open source under the MIT license:

- CLI: [github.com/CodingWithCalvin/dtvem.cli](https://github.com/CodingWithCalvin/dtvem.cli)
- Website: [github.com/CodingWithCalvin/dtvem.io](https://github.com/CodingWithCalvin/dtvem.io)

If you're tired of juggling multiple version managers — or you've been stuck on Windows without good options — give dtvem a try.

As always, I accept pull requests :)

