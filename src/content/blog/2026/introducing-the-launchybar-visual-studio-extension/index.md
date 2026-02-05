---
title: 'Introducing the "LaunchyBar" Visual Studio extension!'
date: "2026-02-05T12:00:00-05:00"
categories: [dotnet, csharp, extensibility, visualstudio]
description: "Miss VS Code's Activity Bar? LaunchyBar brings that same quick-access toolbar experience to Visual Studio!"
subtitle: "Quick access to your favorite tools!"
---

Introducing "[LaunchyBar](https://marketplace.visualstudio.com/items?itemName=CodingWithCalvin.VS-LaunchyBar)", an extension for Visual Studio 2022 (and 2026!) that brings the beloved Activity Bar concept from VS Code and JetBrains IDEs right into your Visual Studio workflow.

If you've spent any time in VS Code, you're probably familiar with that narrow vertical strip of icons on the left side - the Activity Bar. It gives you quick, single-click access to common tools like the file explorer, search, source control, and more. I always missed that when switching back to Visual Studio, so I decided to build it myself.

## A Word of Warning

Before you get too excited, I need to be upfront: **this extension is entirely experimental**. I'm doing some things that aren't exactly "supported" by the Visual Studio extensibility APIs - specifically, injecting the toolbar into Visual Studio's main window shell. It works, but it's definitely pushing the boundaries of what extensions are supposed to do.

What does that mean for you? It means this extension could break at any moment - a Visual Studio update, a theme change, or just the stars aligning wrong could cause issues. If you're okay with that and want to live on the edge, keep reading!

## What Does It Do?

LaunchyBar docks to the left side of Visual Studio and gives you instant access to frequently used tools and commands. Out of the box, it comes pre-configured with some essentials:

- **Solution Explorer** - Jump straight to your project structure
- **Find in Files** - Quick search access
- **Git Changes** - Check your source control status
- **Debug** - Start or stop debugging with a single click (it even changes the icon based on the current debugger state!)
- **Terminal** - Pop open the integrated terminal
- **Settings** - Jump into Visual Studio settings

The best part? Tool windows like Solution Explorer and Terminal toggle on each click - click once to show, click again to hide. No more hunting through menus.

![LaunchyBar in action](https://raw.githubusercontent.com/CodingWithCalvin/VS-LaunchyBar/main/resources/1-launchy-bar.png)

Feel free to check it out, and let me know if you have any suggestions for it - I have some ideas for making the bar customizable in the future, but I'd love to hear what features you'd find useful!

And, of course, [it's open source](https://github.com/CodingWithCalvin/VS-LaunchyBar) and issues / PRs are happily accepted, if you're into that sort of thing.
