---
title: "Introducing vscwhere!"
date: "2026-01-08T12:00:00-05:00"
categories: [rust, cli, vscode]
description: "A CLI tool for locating Visual Studio Code installations on Windows, inspired by Microsoft's vswhere"
blueskyPostId: 3mbwhet7cbl24
---

If you've ever used Microsoft's [vswhere](https://github.com/microsoft/vswhere), you know how handy it is. Need to find where Visual Studio is installed? Run `vswhere`. Need the path for a CI/CD script? `vswhere -latest -property installationPath`. It just works.

But what if you need to find Visual Studio *Code* instead?

So I built it.

## Introducing vscwhere

**vscwhere** is a CLI tool that locates Visual Studio Code installations on Windows. Think of it as vswhere's little sibling — same idea, same familiar interface, just for VS Code instead of Visual Studio.

Need to find all your VS Code installations? Just run:

```bash
vscwhere
```

That's it. You'll get a list of all the VS Code installations on your machine — Stable and Insiders builds alike.

## The Options

If you're familiar with vswhere, you'll feel right at home:

```
Options:
  -all            Find all instances (default)
  -prerelease     Include prerelease (Insiders) builds
  -latest         Return only the latest version
  -format <type>  Output format: text (default), json
  -property <name> Return value of specified property
  -nologo         Suppress version banner
  -sort           Sort instances by version (descending)
  -help, -?       Display this help message
```

Need JSON for your build scripts? `-format json`. Just want the latest stable version's path? `-latest -property installationPath`. Need to include Insiders builds? `-prerelease`.

## Example Output

Here's what it looks like in action. Running `vscwhere` with no arguments:

```
> vscwhere
VSCWhere version 0.1.0

installationPath: C:\Users\calvin.allen\AppData\Local\Programs\Microsoft VS Code\
installationVersion: 1.107.1
productPath: C:\Users\calvin.allen\AppData\Local\Programs\Microsoft VS Code\Code.exe
productId: stable
isPrerelease: false
displayName: Visual Studio Code
extensionsPath: C:\Users\calvin.allen\.vscode\extensions
userDataPath: C:\Users\calvin.allen\AppData\Roaming\Code
```

And with `-format json`:

```
> vscwhere -format json
VSCWhere version 0.1.0

[
  {
    "installationPath": "C:\\Users\\calvin.allen\\AppData\\Local\\Programs\\Microsoft VS Code\\",
    "installationVersion": "1.107.1",
    "productPath": "C:\\Users\\calvin.allen\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe",
    "productId": "stable",
    "isPrerelease": false,
    "displayName": "Visual Studio Code",
    "extensionsPath": "C:\\Users\\calvin.allen\\.vscode\\extensions",
    "userDataPath": "C:\\Users\\calvin.allen\\AppData\\Roaming\\Code"
  }
]
```

Also, the most important for workflows, `-nologo` (and combine it with JSON output):

```
> vscwhere -nologo -format json
[
  {
    "installationPath": "C:\\Users\\calvin.allen\\AppData\\Local\\Programs\\Microsoft VS Code\\",
    "installationVersion": "1.107.1",
    "productPath": "C:\\Users\\calvin.allen\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe",
    "productId": "stable",
    "isPrerelease": false,
    "displayName": "Visual Studio Code",
    "extensionsPath": "C:\\Users\\calvin.allen\\.vscode\\extensions",
    "userDataPath": "C:\\Users\\calvin.allen\\AppData\\Roaming\\Code"
  }
]
```

## How Does It Work?

Here's where it gets a little unusual. VS Code doesn't write any special registry keys when it's installed — there's no convenient "here's where I live" entry to read. The *only* registry presence VS Code has is its uninstall entries.

So that's what vscwhere uses. It finds the uninstall entries in the Windows Registry and works backwards to determine the actual installation directory. It's a reliable way to find installations regardless of where the user chose to install them — and really, it's the only way without resorting to scanning the entire filesystem.

## Why Rust?

Executable size. That's it. A .NET trimmed, single-file binary clocked in at 12MB. The Rust version? Under 1MB. For a simple CLI tool that finds VS Code installations, 12MB felt absurd. Rust gives me a tiny, dependency-free binary that's fast and easy to distribute. No runtime dependencies, no installers — just download the executable and run it.

## Current Limitations

A few things to note:

- **Windows only** — macOS and Linux support may come later, but for now it's Windows-focused
- **No portable installations** — it finds Stable and Insiders builds installed the normal way, but won't detect portable VS Code installations

## Get It

vscwhere is available from GitHub releases. Grab the latest binary and drop it somewhere in your PATH:

[github.com/CodingWithCalvin/vscwhere](https://github.com/CodingWithCalvin/vscwhere)

This is an early release — version 0.1.0 — so there's plenty of room for improvement. If you've got ideas or run into issues, let me know!

As always, I accept pull requests :)
