---
title: "Git Tag Based Released Process Using GitHub Actions"
date: "2020-05-08T12:00:00-05:00"
categories: [csharp,git,github]
description: "In this post, we're going to take a look at using Git Tags and Conditional Steps in GitHub Actions to create a release process."
subtitle: "Automating releases with git tags!"
---

In a [previous post](https://www.codingwithcalvin.net/building-net-framework-applications-with-github-actions), I discussed how I was able to get a .NET Framework application built using GitHub actions.  Go check out that post for the full YAML'y goodness.

In this post, however, I want to explain how I modified that original GitHub Action to take advantage of git tags to automate the release (of that application).

To accomplish this, we're going to add TWO items to our yaml file:

1. Run the action when a git tag is pushed (some extra coolness here)
2. Apply Conditionals to Deployment Steps

## Part 1 - Run the Action when a git tag is pushed

Here's our original YAML for triggering our action:

```yaml
on:
  push:
    branches: master
```

Right beneath `push:`, but before `branches: master`, we're going to add our tag line:

```yaml
on:
  push:
    tags: releases/[1-9]+.[0-9]+.[0-9]+
    branches: master
```

Woah, is that...is that a regex in there?!  Why yes it is!  Let me explain....

I don't necessarilly want any random tag pushed to the repo to trigger this event, so you have to be pretty specific.  First, you need to prefix your tag with `releases/`, and then it must also confirm to the remaining regex - which enforces a "version number".

Here are a couple example tags -

* releases/1.2.0 = action RUNS
* bob/tag123 = action does NOT run
* v1.2.0 = action does NOT run
* releases/v1.2.0 = action does NOT run
* releases/12.5.12 = action RUNS

Alright.  Given that we push the "correct" tag, we'll trigger the action.  How do we take that and actually deploy the application?  ONWARD! (that's a good movie, btw)...

## Part 2 - Apply Conditionals to Deployment Steps

In our original action, we were already logging into Azure and deploying our application.  For reference, that looks like this:

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

The problem is, as listed, these steps will ALWAYS run, and I only want them to when I've pushed a tag that (successfully) triggers the action.  How do we do that?  

We use a conditional on the two steps, and a built-in function from GitHub -

```yaml
- name: Login to Azure
  if: startsWith( github.ref, 'refs/tags/releases/')
  uses: azure/login@v1
  with:
    creds: ${{ secrets.AZURE_CREDENTIALS }}

- name: Publish Artifacts to Azure
  if: startsWith( github.ref, 'refs/tags/releases/')
  uses: Azure/webapps-deploy@v2
  with:
    app-name: ezrep
    package: "./_build"
    slot-name: production
```

Breaking this down a bit, you'll notice we added the `if` line to both actions.  Within that, we utilize the `startsWith` function to see if the `github.ref` that triggered the build "starts with", `refs/tags/releases/`.  If that's true, run the step.  Now, `github.ref` is part of the data that we have access to during an action, and `refs/tags/releases/` is a hard-coded string.

Why does this work?  Well, our build will only get triggered if we push a new git tag that follows our standard at the top of the action, so by the time we get to this step, we've either:

* pushed to master, but that "ref" would be `refs/master`
* created a pull request against master (ref doesn't match)
* OR, pushed a tag (`releases/1.2.5`), which would have a "ref" of `refs/tags/releases/1.2.5` and THAT matches our "starts with" conditional

To recap, if we push to `master`, we'll get a build, but no deployment.  If we create a pull request to `master`, we'll get a build of the PR, but no deployment.  If we push a non-standard tag, we get nothing.  Finally, if we push the "correct" tag, we'll get a build AND a deployment to Azure.

I'll be honest, it took my a lot longer to piece this together than I care to admit (but I'm admitting it anyway).  The documentation, quite honestly, left a bit to be desired around how to utilize these things *together*, so I have about 40 failed builds from various attempts before getting this right.

I think there will be one more post, at some point, about parsing that version number from the tag name, and automatically applying that to all the assemblies as the *actual* version of the software.  Right now, this application isn't "versioned", and it should be. I'm still trying to piece together the right steps, since its a .NET Framework application.

Thanks again, dear reader.  I hope this is useful!

*[If you need a full yaml reference, please check out this gist](https://gist.github.com/CalvinAllen/efdc537796039ef624d4966396e33391)
