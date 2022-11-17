---
title: "Building .NET Framework Applications with Github Actions"
categories: [github,azure,dotnet]
description: "After spending way too much time figuring it all out, I now have a Github Action that can build my .NET Framework web application - and deploy it to Azure!"
---

In this post, I'm going to show you how I finally managed to configure a Github action to build my .NET Framework web application and then deploy it to Azure.  It took way too long, so I hope this helps somebody else out there save some time.

<!--more-->

To get started, I didn't know how to get started.  I couldn't find an action template to do this, like you can for .NET Core.  Luckily, I put out a tweet and got a response:

<blockquote class="twitter-tweet" data-partner="tweetdeck"><p lang="en" dir="ltr">Just use (windows-latest) instead of (linux-latest) as the runner.<br>There is no need to install .net framework. That has all of the versions insides.<br>Thus you can build applications that either targets netapp[xx] or netcoreapp[x.x]<a href="https://t.co/SDiESG5Ye6">https://t.co/SDiESG5Ye6</a><a href="https://t.co/1Ssd2dwyUB">https://t.co/1Ssd2dwyUB</a></p>&mdash; Mohammad Javad Ebrahimi (@mjebrahimi72) <a href="https://twitter.com/mjebrahimi72/status/1252216773811875842?ref_src=twsrc%5Etfw">April 20, 2020</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

As soon as he said use "windows-latest"..."no need to install .NET Framework, its already there" (paraphrasing), it clicked.

Okay, fantastic, but what steps will we ultimately need to get this thing built and subsequently deployed?  That part took a little longer, unfortunately.

Let's start with the "basics" of the action -

```yaml
name: EZRep Build

on:
  push:
    branches: master

jobs:
  build:
    runs-on: windows-latest

    steps:
    - uses: actions/checkout@v2
```

We're calling this the "EZRep Build", run when we push to master, use the latest Windows image/runner, and checkout the repository.  Great, so we have our code checked out, now what do we do?

Since this is a .NET Framework application (that still uses packages.config, I might add), I needed two more steps to get going -

```yaml
- name: Setup MSBuild
  uses: microsoft/setup-msbuild@v1

- name: Setup NuGet
  uses: NuGet/setup-nuget@v1.0.2
```

These steps get MSBuild and NuGet setup and added to the `PATH` variable (since we're on Windows).

This next part is where I struggled a bit, trying to get the various steps to use environment variables, so there may very well be a better way, but I'll show ya anyway -

```yaml
- name: Navigate to Workspace
  run: cd $GITHUB_WORKSPACE

- name: Create Build Directory
  run: mkdir _build
```

Everytime I tried to call MSBuild (which I'll show in a second), I was never in the right working directory.  I tried calling it with `$GITHUB_WORKSPACE/EZRep.sln` (my solution file), but it never worked.  Finally, after quite a few attempts, I just added a step to change the directory, and this solved all my problems.

My MSBuild step actually creates a package for deploying to Azure, and I later learned that it wouldn't automatically create the directory I wanted to use, so that's why there is the `mkdir` step in there.  You may or may not need that at all, depending on how you package and deploy your code.

It's finally time to *actually* build the solution -

```yaml
- name: Restore Packages
  run: nuget restore EzRep.sln

- name: Build Solution
  run: |
    msbuild.exe EzRep.sln /nologo /nr:false /p:DeployOnBuild=true /p:DeployDefaultTarget=WebPublish /p:WebPublishMethod=FileSystem /p:DeleteExistingFiles=True /p:platform="Any CPU" /p:configuration="Release" /p:PublishUrl="../_build"
```

A little long winded there, but first thing is to restore the packages.  I've got a weird setup right now that I didn't even realize until all of this, that I need to go back and research / fix.  It seems like my solution is part way migrated from the old `packages.config` construct and the MSBuild construct, but not entirely.  You may not need this step, specifically, but you might need the `-t:restore` flag for your MSBuild step.  You'll notice we're using that `_build` directory we created earlier for our `PackageLocation`, except its back one directory from the default location, hence the double dot relative directory path - `../_build`

Here we are, the *actual* build step.  There are a *lot* of parameters/flags going on in there, but most of those are because of the packaging routine.  You could easily get by with a simpler version, such as this -

```yaml
- name: Build Solution
  run: |
    msbuild.exe EzRep.sln /p:platform="Any CPU" /p:configuration="Release"
```

Substitute your actual solution filename in there, of course :)

I also chose to upload the artifacts before deploying them, so they would exist alongside the build in Github -

```yaml
- name: Upload artifact
  uses: actions/upload-artifact@v1.0.0
  with:
    name: EZRepBundle
    path: "./_build"
```

Again, using that `_build` directory (we're back to our default working directory from our `cd $GITHUB_WORKSPACE` step earlier in the file).  Give it a name.  I chose EZRepBundle, but you can call this whatever you like / makes the most sense for your application.  Now this step just stores those artifacts for us.  It doesn't do anything else, so we still need to *deploy* our application to Azure.

That looks like this - 

```yaml
- name: Login to Azure
  uses: azure/login@v1
  with:
    creds: ${{ secrets.AZURE_CREDENTIALS }}
    
- name: Publish Artifacts to Azure
  uses: Azure/webapps-deploy@v2
  with:
    app-name: ezrep
    package: "./_build"
    slot-name: production
```

First you'll notice the "Login to Azure" step.  There is a little bit of setup you have to do before this will work, that requires using the Azure CLI to create the necessary credentials, which you then store in the secrets area of the project so Github can access them when logging in. [Check out this post to learn more about HOW to do that](https://github.com/marketplace/actions/azure-login#configure-azure-credentials).  If you're using Azure, and comfortable at the commandline, you should have no problem here.  If you do run into issues, [ping me on Twitter](https://www.twitter.com/_CalvinAllen), I'd be glad to help.

Now that we're "logged in" to Azure, we can publish our `_build` package we created earlier.  Give it the Azure WebApp name you want to deploy to, the local directory to find the package (`_build` for us), and the slot to deploy to.  The slot is optional and defaults to 'production' anyway, but I like having it there as a reminder.

Hopefully, with any luck, you'll have this thing working on the first try - unlike my 40-50 failed attempts :).

I am going to call this post, "version 1", because I am also working on a versioning and release process using a few more steps, git tags, and step conditionals (You can have an `if` statement on a step in Github Actions!)

Since my complete file is in a private repo, [you can get the full v1 file in this public gist](https://gist.github.com/CalvinAllen/701695399e5966845a206954820c329e)

Thanks for reading!

---

> This post, "Building .NET Framework Applications with Github Actions", first appeared on [https://www.codingwithcalvin.net/building-net-framework-applications-with-github-actions](https://www.codingwithcalvin.net/building-net-framework-applications-with-github-actions)

