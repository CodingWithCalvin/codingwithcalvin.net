---
title: "Introducing the 'Open Bin Folder' Visual Studio extension!"
date: "2023-04-02T12:00:00-05:00"
categories: [dotnet, csharp, extensibility, visualstudio]
description: "I released a new extension for Visual Studio, and I want you to know about it!"
subtitle: "Quick access to your output directory!"
---

One week ago, I [stumbled across a post on the Visual Studio developer community](https://developercommunity.visualstudio.com/t/Please-add-an-Open-Current-Bin-command/10248475), asking Microsoft to add a button / context menu item that could open the current projects bin folder with a single click.

I decided to pick up the task and write an extension for it! Introducing "[Open Bin Folder](https://marketplace.visualstudio.com/items?itemName=coding-with-calvin.OpenBinFolder22)" - catchy name right? It does what the poster of the original request wants it do, but tries to a bit smarter, in that it uses the currently active configuration to "figure out" which the Output Path setting is, builds up a URI to the folder, and opens it directly in Windows File Explorer. It only supports Visual Studio 2022 (and up, when that happens).

Feel free to check it out, and let me know if you have any suggestions for it - I realize it could seem like its "done", but you never know what ideas folks might have! PRs accepted, too, if you're into that sort of thing 😉.
