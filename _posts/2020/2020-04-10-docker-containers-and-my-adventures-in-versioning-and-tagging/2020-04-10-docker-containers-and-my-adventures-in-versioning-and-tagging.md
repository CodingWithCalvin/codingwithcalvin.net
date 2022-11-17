---
title: "Docker Containers and my Adventures in Versioning and Tagging"
categories: [csharp,dotnet,devops,docker]
description: "What's the best way to version, and tag, your code and containers so you know which commits actually make it to production?"
---

Part I of II.....

For a while, I've been running a little blind on answering the question, "is that fix in production?".  I could roughly gauge that it was or wasn't by digging into the build and deployment logs, and backtracking into commit SHAs.  Gotta be honest, it was painful and sucked.  I got tired of doing that, so I set out on an adventure to answer that question as quickly as possible.  My problem was, I don't have extensive experience with Docker containers, and that added a layer of complexity to my situation, which I'll explain as we dig in.

I'm going to go through two different things I did to help myself, starting with versioning.

When I first started this new job, our website code (.NET Core MVC, 2x .NET Core APIs) didn't even have a versioning scheme, and I don't know about you, but I like having versions that I can reason about.

Now, all three of those projects were built and deployed using docker containers, and eventually we had all of that going through Azure DevOps (so that's what I'll use to explain, though the concepts should apply anywhere).

First - how to version the *assemblies* into something that makes sense?  I have never used, but had heard, that I could likely accomplish this was a `Directory.Build.props` file that would reside next to my solution file.  I ultimately ended up with something that looks like this:

```xml
<Project>
  <PropertyGroup>
    <BuildId>#{Build.BuildId}#</BuildId>
  </PropertyGroup>
  
  <PropertyGroup>
    <SLCVersion>1.40.0</SLCVersion>
    <SLCBuild Condition="$(BuildId.Contains('#'))">1</SLCBuild>
    <SLCBuild Condition="!$(BuildId.Contains('#'))">$(BuildId)</SLCBuild>
  </PropertyGroup>
  
  <PropertyGroup>
    <AssemblyVersion>$(SLCVersion).$(SLCBuild)</AssemblyVersion>
    <FileVersion>$(SLCVersion).$(SLCBuild)</FileVersion>
  </PropertyGroup>
</Project>
```

Let's take about each piece, because it took me multiple tries to get this figured out and working - both locally, and in AzureDevOps.

In the first `PropertyGroup` - 

```xml
<PropertyGroup>
  <BuildId>#{Build.BuildId}#</BuildId>
</PropertyGroup>
```

I'm declaring my `BuildId` variable (MSBuild is involved which allows us to do this).  First thing you'll notice is that weird string in there - `#{Build.BuildId}#`.  That is a token that will get replaced during my Azure DevOps Pipeline with the environment variable of the same name.

In the second `PropertyGroup` -

```xml
<PropertyGroup>
  <SLCVersion>1.40.0</SLCVersion>
  <SLCBuild Condition="$(BuildId.Contains('#'))">1</SLCBuild>
  <SLCBuild Condition="!$(BuildId.Contains('#'))">$(BuildId)</SLCBuild>
</PropertyGroup>
```
I'm declaring two more variables - `SLCVersion` and `SLCBuild` (which is duplicated because of the conditions).  When I actually want to increment the version, I would manually change the `SLCVersion`.  Then, my `SLCBuild` is set to `1` if the `BuildId` variable still has the tokens in it.  This indicates that the application is being built locally.  If the tokens are gone, then it means we're in the midst of a pipeline build, so let's use that number instead.

Finally, the last `PropertyGroup` -

```xml
<PropertyGroup>
  <AssemblyVersion>$(SLCVersion).$(SLCBuild)</AssemblyVersion>
  <FileVersion>$(SLCVersion).$(SLCBuild)</FileVersion>
</PropertyGroup>
```

Sets the `AssemblyVersion` and `FileVersion` for all the assemblies in the solution (about 10 or so).  And, again, that part works because we are doing this in a `Directory.Build.props` which resides next to our solution file. [Check out the docs for more info on this part](https://docs.microsoft.com/en-us/visualstudio/msbuild/customize-your-build?view=vs-2019)

That file, along with my AzureDevOps pipeline files (we have three - one for each container) are checked into the repository.  Inside of each container pipeline, [I used the "Replace Tokens" extension/task from the marketplace](https://marketplace.visualstudio.com/items?itemName=qetza.replacetokens&targetId=bfa7a2f0-85f0-4eb9-8268-cfab30419ce8&utm_source=vstsproduct&utm_medium=ExtHubManageList) to push the `$(Build.BuildId)` into the token we saw previously.

```yaml
- task: replacetokens@3
  displayName: 'Replacing Tokens in Directory.Build.prop...'
  inputs:
    targetFiles: '**/Directory.Build.props'
    encoding: 'auto'
    writeBOM: true
    actionOnMissing: 'warn'
    keepToken: false
    tokenPrefix: '#{'
    tokenSuffix: '}#'
```

Finally, in my application code, I can pull the version information and display it, using code like:

```csharp
var version = typeof(BaseController).Assembly.GetName().Version;
```

For the UI, its available on the login screen, and the APIs return it via JSON from our HealthCheck endpoints.

One downside to all of this - each container COULD have the *same exact code*, same exact `major.minor.revision`, but a completely different `BuildId`.  I am (currently) okay with that trade-off, since it means I have *something* to reference instead of *nothing*.

This got pretty long winded, but that's how I get all the assemblies versioned, while the containers are being built (via docker files) in our AzureDevOps pipelines.

In the next post, we'll talk about Git Tags and Docker Container Tags, which makes up the other have of this endeavor.

Until next time, dear reader!

---

This post, "Docker Containers and my Adventures in Tagging", first appeared on [https://www.codingwithcalvin.net/docker-containers-and-my-adventures-in-tagging](https://www.codingwithcalvin.net/docker-containers-and-my-adventures-in-tagging)
