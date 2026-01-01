---
title: "SDK-style Projects for your Visual Studio Extensions!"
date: "2026-01-01T12:00:00-05:00"
categories: [dotnet, csharp, vsix]
description: "Remember that MSBuild SDK post from last week? Well, I actually built something with it - an SDK that brings modern project files to Visual Studio extension development."
---

Remember [that post I wrote last week](https://www.codingwithcalvin.net/creating-your-own-msbuild-sdk-it-s-easier-than-you-think) about creating MSBuild SDKs? Well, I wasn't just writing that for fun - I was actually building something with all that knowledge.

I've released [CodingWithCalvin.VsixSdk](https://www.nuget.org/packages/CodingWithCalvin.VsixSdk/), an MSBuild SDK that brings modern SDK-style `.csproj` files to Visual Studio extension development. No more XML soup!

## The Problem

If you've ever created a Visual Studio extension, you know the pain. The `.csproj` file looks like it was written in 2008 (because it basically was). Hundreds of lines of XML, explicit file includes for everything, and don't even get me started on trying to understand what half of those properties do.

Sure, you could migrate from `packages.config` to `PackageReference` in the old format - Visual Studio has supported that for years - but you'd still be stuck with all that verbose XML and manual file management.

And here's the kicker - without an SDK-style project, you can't use `dotnet build` from the command line. You're stuck invoking MSBuild directly, like some kind of caveman. Meanwhile, every other .NET project gets to use the nice, clean SDK-style format and the dotnet CLI:

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
  </PropertyGroup>
</Project>
```

Why should VSIX projects be stuck in the past?

## The Solution

With my new SDK, your VSIX project can look like this:

```xml
<Project Sdk="CodingWithCalvin.VsixSdk/0.3.0">
  <PropertyGroup>
    <TargetFramework>net48</TargetFramework>
    <RootNamespace>MyAwesomeExtension</RootNamespace>
    <AssemblyName>MyAwesomeExtension</AssemblyName>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.VisualStudio.SDK" Version="17.*" />
  </ItemGroup>
</Project>
```

That's it. That's the whole thing. The SDK handles all the VSSDK build tools, the manifest processing, the VSCT compilation - everything that used to require dozens of lines of cryptic XML. And yes, you can now just run `dotnet build` like everybody else!

## Getting Started

The easiest way to get started is with the dotnet template:

```bash
# Install the template
dotnet new install CodingWithCalvin.VsixSdk.Templates

# Create a new extension
dotnet new vsix -n MyExtension --publisher "Your Name" --description "My awesome extension"

# Build it
cd MyExtension
dotnet build
```

The template sets up everything you need - the project file, the manifest, the whole nine yards.

## What You Get

Beyond the clean project file, the SDK includes some features I'm pretty proud of:

### Source Generators

The SDK automatically generates a `VsixInfo` class from your manifest:

```csharp
// Auto-generated - use these anywhere in your code
public static class VsixInfo
{
  public const string Id = "MyExtension.a1b2c3d4-...";
  public const string Version = "1.0.0";
  public const string Publisher = "Your Name";
  public const string DisplayName = "My Extension";
  // ... and more
}
```

No more hardcoding strings that get out of sync with your manifest. Just use `VsixInfo.Version` and you're done.

If you have `.vsct` files, you get generated constants for those too - GUIDs, command IDs, menu groups, all as strongly-typed constants.

### Version Override at Build Time

If you've ever tried to automate versioning a VSIX in CI/CD, you know how painful it is. You'd typically have to run some kind of `sed` or PowerShell regex to find and replace the version in the manifest XML, then trigger a separate build step, and hope you didn't break the XML formatting in the process. It's fragile and annoying.

With this SDK, it's just:

```bash
dotnet build -p:SetVsixVersion=2.0.0
```

One command. The SDK updates the manifest, regenerates the constants, and builds the VSIX with the correct version everywhere. Perfect for GitHub Actions where you want to version based on tags or run numbers:

```yaml
- name: Build Release
  run: dotnet build -c Release -p:SetVsixVersion=${{ github.ref_name }}
```

No more grep/sed gymnastics.

### Auto-Inclusion

The SDK automatically includes common VSIX files like `.vsct` files and `VSPackage.resx`. You don't have to explicitly list them anymore - they just work.

## A Real-World Example

I've already migrated my [Open in Notepad++](https://github.com/CodingWithCalvin/VS-OpenInNotepadPlusPlus) extension to use this SDK. Here's what the project file looks like now:

```xml
<Project Sdk="CodingWithCalvin.VsixSdk/0.3.0">
  <PropertyGroup>
    <TargetFramework>net48</TargetFramework>
    <RootNamespace>CodingWithCalvin.OpenInNotepadPlusPlus</RootNamespace>
    <AssemblyName>CodingWithCalvin.OpenInNotepadPlusPlus</AssemblyName>
    <LangVersion>latest</LangVersion>
  </PropertyGroup>

  <PropertyGroup Condition="'$(Configuration)' == 'Debug'">
    <DeployExtension>True</DeployExtension>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.VisualStudio.SDK" Version="17.14.40265" />
  </ItemGroup>

  <ItemGroup>
    <Content Include="..\..\resources\icon.png" Link="resources\icon.png">
      <IncludeInVSIX>true</IncludeInVSIX>
    </Content>
    <Content Include="..\..\LICENSE" Link="resources\LICENSE">
      <IncludeInVSIX>true</IncludeInVSIX>
    </Content>
  </ItemGroup>
</Project>
```

Compare that to the hundreds of lines it used to be. F5 debugging works, the VSIX builds correctly, deploys to the experimental instance - everything just works.

## Migrating an Existing Project

If you have an existing extension you want to migrate, the process is pretty straightforward:

1. **Back up your project** - Always a good idea before major changes
2. **Replace the `.csproj` content** - Swap out all that legacy XML for the SDK-style format
3. **Update the manifest** - Remove support for versions prior to VS 2022, and add support for VS 2026 (version range `[17.0, 19.0)`). While you're in there, it's a good time to add arm64 support too.
4. **Add your PackageReferences** - If you were already using PackageReference, just move them over. If not, convert your package references now.
5. **Delete the cruft** - Remove `packages.config` (since you've migrated to PackageReference in the previous step), `Properties/AssemblyInfo.cs`, and any explicit file includes
6. **Build and test** - Run `dotnet build` and fix any issues

The [README on GitHub](https://github.com/CodingWithCalvin/VsixSdk) has a detailed migration guide with before/after examples and a checklist.

## Requirements

- Visual Studio 2022 or later
- .NET Framework 4.7.2+ target framework

The SDK is specifically for VS 2022+ extensions. If you're still supporting older versions of Visual Studio, you'll need to stick with the legacy project format for now.

## Wrapping Up

I built this SDK because I got tired of fighting with legacy project files every time I wanted to create or update an extension. If you're building Visual Studio extensions and want a cleaner development experience, give it a try.

The SDK is [available on NuGet](https://www.nuget.org/packages/CodingWithCalvin.VsixSdk/) and the source is [on GitHub](https://github.com/CodingWithCalvin/VsixSdk). If you run into issues or have ideas for improvements, let me know - I'm always looking to make this thing better.
