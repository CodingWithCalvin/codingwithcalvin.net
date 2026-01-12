---
title: "Introducing rnr - A Zero-Dependency Task Runner"
date: "2026-01-12T12:00:00-05:00"
categories: [rust, oss, cli]
description: "Meet rnr (pronounced 'runner') - a cross-platform task runner that lives inside your repo. Contributors clone and run, zero friction."
---

Have you ever cloned a repository, ready to contribute, only to discover you need to install Node.js, Python, Make, or some other global dependency just to run the build? I have. Many times. And honestly, it's frustrating.

I wanted something simpler. Something where contributors could clone a repo and immediately run tasks without any setup. No "first, install this runtime" steps. No version mismatches. Just clone and go.

So I built **rnr** (pronounced "runner").

## What is rnr?

rnr is a cross-platform task runner with one key differentiator: **the binaries live inside your repository**. When a contributor clones your project, they already have everything they need to run your build tasks. Zero friction.

It's written in Rust, compiles to native binaries for all major platforms, and uses a simple YAML configuration file to define your tasks.

## The Problem

Most task runners require contributors to have something installed globally:

- **npm scripts** require Node.js
- **Makefiles** require Make (and good luck on Windows)
- **Just** requires installing just
- **Task** requires installing task

For maintainers, this is fine. But for contributors—especially those making quick documentation fixes or small improvements—asking them to install a runtime just to run a build is a barrier.

## The Solution

With rnr, you initialize once as a maintainer:

```bash
# Linux
curl -fsSL https://github.com/CodingWithCalvin/rnr.cli/releases/latest/download/rnr-linux-amd64 -o rnr
chmod +x rnr
./rnr init

# macOS (Apple Silicon)
curl -fsSL https://github.com/CodingWithCalvin/rnr.cli/releases/latest/download/rnr-macos-arm64 -o rnr
chmod +x rnr
./rnr init

# Windows (PowerShell)
Invoke-WebRequest -Uri "https://github.com/CodingWithCalvin/rnr.cli/releases/latest/download/rnr-windows-amd64.exe" -OutFile "rnr.exe"
.\rnr.exe init
```

The `init` command presents an interactive selector where you choose which platforms your contributors might use:

```
Which platforms should this project support?

  [x] linux-amd64      (760 KB)
  [ ] macos-amd64      (662 KB)
  [x] macos-arm64      (608 KB)  <- current
  [x] windows-amd64    (584 KB)
  [ ] windows-arm64    (528 KB)

  Selected: 1.95 MB total
```

Once you confirm, rnr downloads the appropriate binaries and sets up wrapper scripts. Here's what gets created:

```
your-repo/
├── .rnr/
│   ├── config.yaml    # Tracks configured platforms
│   └── bin/           # Platform binaries (only selected ones)
├── rnr                # Unix wrapper script (auto-detects platform)
├── rnr.cmd            # Windows wrapper script
└── rnr.yaml           # Your task definitions
```

The wrapper scripts automatically detect the current platform and architecture, then run the correct binary from `.rnr/bin/`. Commit all of this to your repo.

After that, contributors simply run:

```bash
./rnr build    # Run your build task
./rnr test     # Run your tests
./rnr --list   # See all available tasks
```

That's it. No installation required on their end.

## Defining Tasks

Tasks are defined in an `rnr.yaml` file at the root of your repository. The syntax is intentionally simple.

**Simple one-liners:**

```yaml
build: cargo build --release
test: cargo test
lint: cargo clippy
```

**Full task definitions** with descriptions, working directories, and environment variables:

```yaml
build:
  description: Build for production
  dir: src/backend
  env:
    NODE_ENV: production
  cmd: npm run build
```

**Sequential steps** that reference other tasks:

```yaml
ci:
  description: Run CI pipeline
  steps:
    - task: lint
    - task: test
    - task: build
```

**Parallel execution** for speeding up independent operations:

```yaml
build-all:
  description: Build all services
  steps:
    - cmd: echo "Starting builds..."
    - parallel:
        - task: build-api
        - task: build-web
    - cmd: echo "All done!"
```

**Nested task files** for monorepos—subdirectories can have their own `rnr.yaml`:

```yaml
# Root rnr.yaml
api:build:
  dir: services/api
  task: build    # Runs 'build' from services/api/rnr.yaml
```

## Built-in Commands

rnr ships with a few built-in commands:

- `rnr <task>` — Execute a task from your `rnr.yaml`
- `rnr init` — Initialize rnr in the current directory
- `rnr upgrade` — Update to the latest rnr binaries
- `rnr --list` — View all available tasks
- `rnr --version` — Display the current version
- `rnr --help` — Show help information

## Why Rust?

I chose Rust for a few reasons:

1. **Single binary** — No runtime dependencies, just a native executable
2. **Cross-platform** — Compiles cleanly to Windows, macOS, and Linux
3. **Performance** — Fast startup, minimal overhead
4. **I wanted to learn more Rust** — Let's be honest, this was a big motivator

## Get Started

If you maintain an open source project and want to reduce friction for contributors, give rnr a try:

1. Download the binary for your platform from the [releases page](https://github.com/CodingWithCalvin/rnr.cli/releases)
2. Run `./rnr init` and select your target platforms
3. Create your `rnr.yaml` with your tasks
4. Commit the binaries and config to your repo

Your contributors will thank you.

I'm already using rnr on a couple of my own projects—[dtvem.cli](https://github.com/CodingWithCalvin/dtvem.cli) and [rnr.cli itself](https://github.com/CodingWithCalvin/rnr.cli). Yes, rnr builds rnr. Dogfooding at its finest.

## What's Next?

This is v0.1.0, so there's plenty more I want to add:

- Task dependencies (`depends: [build, test]`)
- Conditional execution (`if: ${{ env.CI }}`)
- Watch mode (`watch: [src/**/*.rs]`)
- Variable interpolation (`${{ vars.version }}`)
- Caching and incremental builds
- Interactive task picker

If any of these would be useful for your workflow, let me know—or better yet, open an issue on GitHub.

## It's Open Source

rnr is MIT licensed and available on GitHub at [CodingWithCalvin/rnr.cli](https://github.com/CodingWithCalvin/rnr.cli). If you find bugs, have feature requests, or want to contribute, PRs are absolutely welcome.

I'd love to hear what you think. Let me know if you try it out!
