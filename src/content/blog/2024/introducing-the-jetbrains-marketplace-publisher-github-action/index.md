---
title: 'Introducing the "JetBrains Marketplace Publisher" GitHub Action'
date: "2024-09-24T12:00:00-05:00"
categories: [jetbrains, extensibility, devops]
description: "You've got your own JetBrains extension, open source on GitHub, but you need to figure out HOW to publish it to the JetBrains marketplace - this new GitHub Action can help!"
subtitle: "Automate your JetBrains deployments!"
---

Introducing "[JetBrains Marketplace Publisher](https://github.com/marketplace/actions/visual-studio-marketplace-publisher)", a GitHub Action that assists you in publishing your Visual Studio extensions to the marketplace through a workflow on GitHub!

Imagine you have a workflow in GitHub that builds your extension and posts the resulting ZIP file as an artifact to the run and then you have to download that artifact and upload to the marketplace _MANUALLY_. Swap out the artifact upload with this new extension, and automate the whole thing. Its as easy as referencing the new Action in your workflow -

```yaml
 - name: JetBrains Marketplace Publisher
    uses: CodingWithCalvin/GHA-JBMarketplacePublisher@v1
    with:
      # REQUIRED
      marketplace-pat: ${{ secrets.marketplace_pat }}
      archive-path: ./src/outputFolder/extension.zip

      # ONE OF THE FOLLOWING IS REQUIRED, BUT NOT BOTH
      plugin-id: 1000
      plugin-xml-id: "1001"

      # OPTIONAL
      channel: stable
      is-hidden: false
```

Provide your secret PAT, your archive, and one of plugin-id or plugin-xml-id - then sit back and relax while all the magic happens for you. Note there are a couple other optional parameters to control which channel your plugin is released to and whether to keep it hidden after approval.

Of course, [its open source](https://github.com/CodingWithCalvin/GHA-JBMarketplacePublisher), so feel free to peruse the source code, create issues, and have discussions on ways we can make this tool even better!
