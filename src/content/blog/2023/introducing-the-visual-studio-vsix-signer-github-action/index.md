---
title: "Introducing the 'Visual Studio VSIX Signer' GitHub Action"
date: "2023-04-06T12:09:57-04:00"
categories: [dotnet, csharp, extensibility, devops]
description: "Before you deploy that Visual Studio extension, you may want to sign it so folks know you're legit. This GitHub Action can help!"
image: ./cover.png
---

Introducing "[Visual Studio VSIX Signer](https://github.com/marketplace/actions/visual-studio-vsix-signer)", a GitHub Action that assists you in signing your Visual Studio extensions through a workflow on GitHub!

Imagine you have a workflow in GitHub that builds your extension and posts the resulting VSIX file as an artifact to the run that you then have to download, sign, and then upload to the marketplace _MANUALLY_. Before you post the artifact, just drop in this new GitHub Action to sign that VSIX file!

```yaml
steps:
  - name: Visual Studio VSIX Signer
    uses: CodingWithCalvin/GHA-VSVsixSigner@v1
    with:
      # REQUIRED
      sign-certificate-path: ./src/SigningCert.snk
      vsix-path: ./src/outputFolder/Extension.vsix
      sign-password: ${{ secrets.signpassword }}

      # OPTIONAL
      vs-version: latest
      vs-prerelease: false
```

Provide the path to your certificate, the path to the VSIX, and your signing password and violá - sit back and relax while all the magic happens for you. Note there are a couple other optional parameters to control which version of the Visual Studio SDK tooling gets used under the hood, but by default, you'll utilize the latest version available on the images. I could use some additional help testing this, though, as I don't sign any of my own extensions (maybe I'll start now!).

Of course, [its open source](https://github.com/CodingWithCalvin/GHA-VSVsixSigner), so feel free to peruse the source code, create issues, and have discussions on ways we can make this tool even better!
