---
title: "Introducing the 'Super Clean' Visual Studio - for Mac - extension!"
date: "2023-04-19T16:57:55-04:00"
categories: [dotnet, csharp, extensibility, vsmac]
description: "Visual Studio for Mac gets left out of the loop sometimes when we talk about extensibility, unfortunately. I decided to learn how, and this is my story!"
image: ./cover.png
---

You don't hear a lot about Visual Studio for Mac in the extensibility space. One, because extensibility was shelved for a while in the product, and two - its hard! Harder than Visual Studio? Maybe - the documentation is lacking even more than Visual Studio extensibility and sample projects are hard to come by.

I steered clear of it for a long time, but I've decided to rectify this problem and start building Visual Studio for Mac extensions.

Today, I started with a small sampling by taking the ["Super Clean" extension I made for Visual Studio](https://www.codingwithcalvin.net/introducing-the-super-clean-visual-studio-extension/), and port it to Visual Studio for Mac. I'm not going into detail about this project, as I'm just getting my feet wet, but if you're interested (and as always) [its open-source on GitHub](https://github.com/CodingWithCalvin/VS4Mac-SuperClean).

Without further ado, introducing the "Super Clean" extension for Visual Studio for Mac! This one works a bit differently from its Windows counter-part, but only slightly. Instead of being an available right-click context menu command on the Solution and Project nodes of the Solution Explorer, this version has a single command, 'Super Clean Solution', nested inside of the 'Build' menu from the main toolbar. Why? Well, simply, I found examples on how to do that, but not for context menus. Triggering it does a "Super Clean" on every project in the active solution. "Super Clean", here, being defined as a recursive delete of the `bin` and `obj` folders inside of each project folder. There is a small caveat, in that, if you've moved the output directory somewhere other than `bin`, this extension isn't going to work. Perhaps in the next version!

To install (for now, until I can get it listed), is to grab the `.mpack` file directly from the most recent release on GitHub, and install it using the "Install from file" command from the Extensions dialog from within Visual Studio for Mac.

Feel free to check it out, and let me know if you have any suggestions for it - PRs accepted, too, if you’re into that sort of thing 😉.
