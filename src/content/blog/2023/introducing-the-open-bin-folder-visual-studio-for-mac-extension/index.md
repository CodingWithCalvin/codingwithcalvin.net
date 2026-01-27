---
title: "Introducing the 'Open Bin Folder' Visual Studio - for Mac - extension!"
date: "2023-07-03T12:00:00-05:00"
categories: [dotnet, csharp, extensibility, vsmac]
description: "I decided to port another of my Visual Studio (for Windows) extensions over to Visual Studio for Mac!"
subtitle: "Quick access to output on Mac!"
---

Introducing the "Open Bin Folder" extension for Visual Studio for Mac! This one works exactly the same as its Visual Studio (for Windows) counter-part.

Each project of your solution will have a new menu option in the right-click context menu, "Open Bin Folder". Clicking it will invoke Finder to the output directory for that project, based on your active configuration (Debug, Release, etc.)

To install (for now, until I can get it listed), is to grab the `.mpack` file directly from the most recent release on GitHub, and install it using the "Install from file" command from the Extensions dialog from within Visual Studio for Mac.

Feel free to check it out, and let me know if you have any suggestions for it - PRs accepted, too, if you’re into that sort of thing 😉.
