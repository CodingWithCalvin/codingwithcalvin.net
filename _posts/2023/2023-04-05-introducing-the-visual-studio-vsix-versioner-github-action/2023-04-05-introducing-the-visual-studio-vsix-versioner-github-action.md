---
title: "Introducing the 'Visual Studio VSIX Versioner' GitHub Action"
date: "2023-04-05T12:00:45-04:00"
categories: [dotnet, csharp, extensibility, devops]
description: "Having problems versioning that Visual Studio extension you're trying to publish through a GitHub workflow? I gotchu."
---

Introducing "[Visual Studio VSIX Versioner](https://github.com/marketplace/actions/visual-studio-vsix-versioner)", a GitHub Action that assists you in versioning your Visual Studio extensions before you publish to the marketplace through a workflow on GitHub!

A small caveat to this one, however, is that it currently does things "the Calvin way", and that may not apply to everyone. I plan to add more possibilities to this as time goes on, but for now, let me explain how this works.

First, you need to be using the [VSIX Synchronizer](https://marketplace.visualstudio.com/items?itemName=MadsKristensen.VsixSynchronizer64) extension from Mads Kristensen during the development of your extension. This will produce a code-behind file that maps all the values from the VSIX manifest into a C# source code file, so you can utilize these values elsewhere in your application. Once you do that, and have those constants available, update your `AssemblyInfo.cs` to utilize them (best done through the source view, and not the property designer page).

You should end up with something like this (of course, referencing your own namespaces)

```csharp
sing System.Reflection;
using System.Runtime.InteropServices;
using CodingWithCalvin.OpenBinFolder.Vsix;

[assembly: AssemblyTitle(Vsix.Name)]
[assembly: AssemblyDescription(Vsix.Description)]
[assembly: AssemblyConfiguration("")]
[assembly: AssemblyCompany(Vsix.Author)]
[assembly: AssemblyProduct(Vsix.Name)]
[assembly: AssemblyCopyright("")]
[assembly: AssemblyTrademark("")]
[assembly: AssemblyCulture("")]
[assembly: ComVisible(false)]
[assembly: AssemblyVersion(Vsix.Version)]
[assembly: AssemblyFileVersion(Vsix.Version)]
```

Notice how we just replaced the string constants here, for the string constants generated from the manifest file. This is helpful if you have more than once project / `AssemblyInfo.cs` / etc.

Now, when we want to uptick our version number during a release, we only have to update the VSIX manifest, and the generated constants file, and you can do that with my new GitHub Action, like so -

```yaml
steps:
  - name: Visual Studio VSIX Versioner
    uses: CodingWithCalvin/GHA-VSVsixVersioner@v1
    with:
      extension-manifest-file: "./src/CodingWithCalvin.OpenBinFolder.Vsix/source.extension.vsixmanifest"
      extension-source-file: "./src/CodingWithCalvin.OpenBinFolder.Vsix/source.extension.cs"
```

Remember we talked about "the Calvin way"? Well, the action creates a new version using the current date, and the GitHub run number. There are no options (right now!) to apply any different versioning scheme, etc., but those are coming!

For example, if my workflow has ran 75 times already and today is 2023-04-05, then when we run this action, we'll get a version number of `2023.04.05.76`. I know date versioning isn't everybodys' cup of tea, but it works for me for the few extensions I have. One thing to note, is the Date is calculated at UTC, so it may end up being "slightly off" on the specific day if you're in a different timezone.

Thanks for reading, and if you're wondering....of course, [its open source](https://github.com/CodingWithCalvin/GHA-VSVsixVersioner)! Feel free to peruse the source code, create issues, and have discussions on ways we can make this tool even better - including other versioning schemes!
