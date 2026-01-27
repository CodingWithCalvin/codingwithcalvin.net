---
title: 'Introducing the "Visual Studio Marketplace Publisher" GitHub Action'
date: "2023-04-04T12:00:00-05:00"
categories: [dotnet, csharp, extensibility, devops]
description: "You've got your own Visual Studio extension, open source on GitHub, but you need to figure out HOW to publish it to the Visual Studio marketplace - this new GitHub Action can help!"
subtitle: "Automate your VSIX deployments!"
---

Introducing "[Visual Studio Marketplace Publisher](https://github.com/marketplace/actions/visual-studio-marketplace-publisher)", a GitHub Action that assists you in publishing your Visual Studio extensions to the marketplace through a workflow on GitHub!

Imagine you have a workflow in GitHub that builds your extension and posts the resulting VSIX file as an artifact to the run that you then upload to the marketplace _MANUALLY_. Swap out the artifact upload with this new extension, and automate the whole thing. Its as easy as referencing the new Action in your workflow -

```yaml
- name: Visual Studio Marketplace Publisher
    uses: CodingWithCalvin/GHA-VSMarketplacePublisher@v1
    with:
    # REQUIRED
    marketplace-pat: ${{ secrets.vs_pat }}
    publish-manifest-path: ./src/vsixManifest.json
    vsix-path: ./src/outputFolder/Extension.vsix
```

Provide your secret PAT, your deployment manifest, and where the extension output file is - then sit back and relax while all the magic happens for you. Note there are a couple other optional parameters to control which version of the Visual Studio SDK tooling gets used under the hood, but by default, you'll utilize the latest version available on the images. For real world examples of its usage, I utilize it in 4 separate Visual Studio extension workflows on GitHub, so check out my repos there for more help!

Of course, [its open source](https://github.com/CodingWithCalvin/GHA-VSMarketplacePublisher), so feel free to peruse the source code, create issues, and have discussions on ways we can make this tool even better!
