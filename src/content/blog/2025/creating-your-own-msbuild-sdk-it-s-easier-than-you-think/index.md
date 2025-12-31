---
title: "Creating Your Own MSBuild SDK - It's Easier Than You Think!"
date: "2025-12-25T21:58:58-05:00"
categories: [msbuild, dotnet]
description: "An MSBuild SDK is basically a NuGet package that automatically imports .props and .targets files into your project. That's it. That's the whole thing."
---

> This post is part of the 2025 C# Advent Calendar.
> 
> [Check it out here, for other AWESOME posts.](https://csadvent.christmas)

I'll be honest - I put off learning how MSBuild SDKs work for way too long. Every time I saw that `Sdk="Microsoft.NET.Sdk"` attribute at the top of a `.csproj` file, I just accepted it as magic and moved on. But recently I needed to create a custom SDK, and after banging my head against the wall for a bit, I finally figured it out.

Spoiler: it's not nearly as scary as I thought.

## What Even Is an MSBuild SDK?

Before we dive in, let's clear up what we're actually talking about. An MSBuild SDK is basically a NuGet package that automatically imports `.props` and `.targets` files into your project. That's it. That's the whole thing.

When you write:

```xml
<Project Sdk="MyAwesome.Sdk/1.0.0">
```

MSBuild goes "oh, you want that SDK?" and then imports `Sdk.props` at the very beginning and `Sdk.targets` at the very end of your project. Everything in between is your actual project content.

## The Folder Structure

Here's what your SDK package needs to look like:

```
MyAwesome.Sdk/
├── Sdk/
│   ├── Sdk.props      ← Imported first
│   └── Sdk.targets    ← Imported last
└── MyAwesome.Sdk.csproj
```

The `Sdk/` folder is the magic folder. MSBuild looks there specifically.

## Creating the Props File

The `.props` file runs before anything else in the project. This is where you set up defaults:

```xml
<Project>
  <PropertyGroup>
    <!-- Set defaults that users can override -->
    <TargetFramework Condition="'$(TargetFramework)' == ''">net8.0</TargetFramework>
    <ImplicitUsings Condition="'$(ImplicitUsings)' == ''">enable</ImplicitUsings>

    <!-- Properties you always want set -->
    <MyCustomProperty>true</MyCustomProperty>
  </PropertyGroup>
</Project>
```

See those `Condition` attributes? That's the key pattern. You're saying "only set this if the user hasn't already set it." This lets your SDK provide sensible defaults while still allowing customization.

## Creating the Targets File

The `.targets` file runs after the project content. This is where you do the real work:

```xml
<Project>
  <!-- Auto-include certain files -->
  <ItemGroup Condition="'$(EnableDefaultMyItems)' != 'false'">
    <None Include="**/*.config" />
  </ItemGroup>

  <!-- Add custom build targets -->
  <Target Name="MyCustomTarget" BeforeTargets="Build">
    <Message Importance="high" Text="Look ma, I'm in a custom SDK!" />
  </Target>

  <!-- Validate configuration -->
  <Target Name="ValidateStuff" BeforeTargets="BeforeBuild">
    <Warning Condition="'$(SomeProperty)' == ''"
             Text="Hey, you probably want to set SomeProperty." />
  </Target>
</Project>
```

## Wrapping Other SDKs

Here's where it gets interesting. You probably don't want to recreate everything from scratch - you want to build *on top of* the existing .NET SDK. The pattern looks like this:

**Sdk.props:**

```xml
<Project>
  <!-- Import the base SDK props first -->
  <Import Project="Sdk.props" Sdk="Microsoft.NET.Sdk" />

  <!-- Then add your customizations -->
  <PropertyGroup>
    <MyCustomDefault>true</MyCustomDefault>
  </PropertyGroup>
</Project>
```

**Sdk.targets:**

```xml
<Project>
  <!-- Your custom logic first -->
  <ItemGroup>
    <None Include="**/*.special" />
  </ItemGroup>

  <!-- Then import base SDK targets -->
  <Import Project="Sdk.targets" Sdk="Microsoft.NET.Sdk" />
</Project>
```

The order matters here. Props imports happen outside-in (base first, then yours), and targets happen inside-out (yours first, then base). At least, that's what made sense for my use case - your mileage may vary.

## The .csproj for Your SDK Package

Your SDK project itself is pretty minimal:

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>netstandard2.0</TargetFramework>
    <PackageId>MyAwesome.Sdk</PackageId>
    <Version>1.0.0</Version>
    <PackageType>MSBuildSdk</PackageType>
    <IncludeBuildOutput>false</IncludeBuildOutput>
    <SuppressDependenciesWhenPacking>true</SuppressDependenciesWhenPacking>
  </PropertyGroup>

  <ItemGroup>
    <None Include="Sdk\**" Pack="true" PackagePath="Sdk" />
  </ItemGroup>
</Project>
```

The important bits:

- `PackageType>MSBuildSdk` - tells NuGet this is an SDK package
- `IncludeBuildOutput>false` - you're not shipping a DLL, just the props/targets
- That `ItemGroup` makes sure your `Sdk/` folder ends up in the right place in the package

## Testing Locally (The Part I Struggled With)

This is where I wasted the most time. You can't just `dotnet build` and expect Visual Studio to find your SDK. Here's what actually works:

1. Build your SDK package: `dotnet pack -c Release`
2. Add your output folder as a local NuGet source
3. Reference the exact version in your test project

Or, the sneaky way - during development, just use `Microsoft.NET.Sdk` in your test project and manually import your props/targets:

**Directory.Build.props:**

```xml
<Project>
  <Import Project="../src/MyAwesome.Sdk/Sdk/Sdk.props" />
</Project>
```

**Directory.Build.targets:**

```xml
<Project>
  <Import Project="../src/MyAwesome.Sdk/Sdk/Sdk.targets" />
</Project>
```

This way you can iterate without constantly rebuilding packages. Just switch to the real `Sdk="..."` reference when you're ready to ship.

## Common Gotchas

A few things that tripped me up:

1. **Props vs Targets confusion** - If your defaults aren't working, you probably put them in targets instead of props. Properties need to be set before the project content, not after.

2. **Condition syntax** - It's `Condition="'$(Prop)' == ''"` with single quotes inside double quotes. I mess this up constantly.

3. **Import order matters** - Some properties from other SDKs or build tools need to be set super early in props, before they get evaluated. If something isn't working, try moving it earlier in the import chain.

4. **The casing matters** - The folder must be `Sdk/` with a capital S. Lowercase won't work on case-sensitive file systems.

5. **NuGet caching will drive you insane** - When testing locally, NuGet aggressively caches packages. Either bump your version number every time, or clear the cache with `dotnet nuget locals all --clear`. Trust me on this one.

## Wrapping Up

Creating an MSBuild SDK isn't rocket science - it's really just packaging up props and targets files in a specific folder structure. The hardest part is figuring out which properties go where and what order to import things.

If you're building something that needs consistent project configuration across multiple projects, or you're wrapping complex build tooling behind a simpler interface, an SDK is a great way to go.

If you have questions or run into issues I didn't cover, let me know - I'm still learning this stuff myself and always happy to compare notes.
