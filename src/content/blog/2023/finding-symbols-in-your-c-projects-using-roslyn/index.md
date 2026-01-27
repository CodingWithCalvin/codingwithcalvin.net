---
title: "Finding Symbols in Your C# Projects Using Roslyn"
date: "2023-06-30T12:00:00-05:00"
categories: [dotnet, csharp, vsix]
description: "From a Visual Studio extension, learn how to search and navigate to, a symbol in the currently loaded solution using Roslyn."
---

Recently, I needed to introduce symbol navigation through a Visual Studio extension, using the already loaded solution.

This task is easy to accomplish in a Visual Studio Code extension, by relying on the C# extension being installed and using some built in APIs that harness the Langaue Server that the C# extension brings in. In the past, this has been OmniSharp, though that will be changing with newer releases of the C# extension and the C# Dev Kit extension.

For example, in VSCode with a C# solution loaded up, if you have a fully qualified method name (and by fully qualified, I mean namespace, class name, and method name, something like `CodingWithCalvin.OpenBinFolder.Vsix.Commands.OpenBinFolderCommand.OpenPath`, where `CodingWithCalvin.OpenBinFolder.Vsix.Commands` is the namespace, `OpenBinFolderCommand` is the class name, and `OpenPath` is the method name), you can execute a command to search for matching symbols in the workspace -

```typescript
const symbols = await commands.executeCommand<SymbolInformation[]>("vscode.executeWorkspaceSymbolProvider", `CodingWithCalvin.OpenBinFolder.Vsix.Commands.OpenBinFolderCommand.OpenPath`);
```

That will return a list of matching symbols. In the example above, there would only ever be one matching symbol, but there could be more. In the case of a single symbol, we can tell VSCode to open the corresponding file and navigate right to the symbol (the method in this case).

And, as an extensibility enthusiast, that methodology is nice and succint. But, I needed to do this in a Visual Studio extension, and those types of commands and APIs don't exist in Visual Studio.

I'll be honest, I struggled with this for quite a bit and eventually plead for help on Twitter. Luckily, [Gérald Barré](https://twitter.com/meziantou) came to the rescue on Twitter and pointed me in the right direction by writing a blog post to answer my question!

> [Heres his blog post, go check it out!](https://www.meziantou.net/finding-symbols-in-your-c-projects-using-roslyn.htm)

Now, his example was attempting to find a type, but I was trying to find a symbol (in this case, a method). So, I had to make some changes to his code, but the overall idea is the same.

1. Use the `VisualStudioWorkspace` to get the current solution
   i. This is available in the `Microsoft.VisualStudio.LanguageServices` NuGet package
1. Use the `CurrentSolution` to get the `Compilation` for the solution loaded in the IDE
1. Loop over the `Projects` in the `CurrentSolution`
   i. Make sure to check if the project supports compliation, as not all projects do
1. Use the `SymbolFinder` class to perform the search against the current project (of the loop)
   i. This is available in the `Microsoft.CodeAnalysis` NuGet package
   i. One caveat here is that you need to search for the method name and can't just use the fully qualified method name (that includes namespace and class name), so we'll need to perform an additional check to make sure we have the correct method
1. If we get to this point with a single symbol, then we can utilize the `Workspace` again to try and navigate to the symbol

Here is the final code I ended up with -

```csharp
private readonly VisualStudioWorkspace _workspace;

[ImportingConstructor]
public SymbolService(VisualStudioWorkspace workspace)
{
    _workspace = workspace;
}

if (_workspace?.CurrentSolution != null)
{
    foreach (var project in _workspace.CurrentSolution.Projects)
    {
        if (project.SupportsCompilation)
        {
            var symbols = (await SymbolFinder
                .FindDeclarationsAsync(project, "OpenPath", true)) // Just the method name here (true is to make the search  case-insensitive)
                .Where(x => x.ToDisplayString().EqualsIgnoreCase($"CodingWithCalvin.OpenBinFolder.Vsix.Commands.OpenBinFolderCommand.OpenPath()")); // Note that ToDisplayString() includes the parenthesis at the end of the method name, hence why they are in the equals check

            if (symbols != null && symbols.Any())
            {
                var symbol = symbols.FirstOrDefault();
                await _workspace.TryGoToDefinitionAsync(symbol, project, cancellationToken);
                break;
            }
        }
    }
}
```

And that's it! Now, I can search for a symbol in the currently loaded solution and navigate my developer friend directly to it. Yes, its a little more involved than VSCode, but after finally figuring it out, its not THAT terrible.

Huge thanks to Gérald for pointing me in the right direction!
