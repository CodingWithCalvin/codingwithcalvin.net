---
title: "Introducing the Visual Studio Code MCP Server!"
date: "2026-01-15T12:00:00-05:00"
categories: [typescript, extensibility, vscode, ai, mcp]
description: "VS Code has incredible language intelligence - IntelliSense, Go to Definition, Find References - but it's locked inside the IDE. This extension bridges that gap, exposing VS Code's language server capabilities through MCP so your AI tools can tap into the same semantic understanding."
subtitle: "Giving AI access to VS Code's language intelligence!"
blueskyPostId: "3mci66mistd2p"
---

Yesterday I [introduced the Visual Studio MCP Server](https://www.codingwithcalvin.net/introducing-the-visual-studio-mcp-server/). Today, it's VS Code's turn.

## VSC MCP Server

**VSC MCP Server** exposes VS Code's language intelligence features as [MCP](https://modelcontextprotocol.io/) tools. Once connected, an AI assistant can:

- Get symbols from documents and workspaces
- Navigate to definitions and find references
- Get IntelliSense completions and signature help
- Run diagnostics, format code, and rename symbols
- Search files and text across the entire workspace

All the things you take for granted when coding in VS Code — now available to your AI tools.

## What's Under the Hood

VS Code has incredibly powerful language features built in. IntelliSense, Go to Definition, Find All References, hover info, call hierarchies — these aren't just UI conveniences. They're backed by language servers that deeply understand your code.

The problem is that this intelligence is locked inside VS Code. An AI tool running alongside the IDE can't tap into any of it. It has to rely on its own understanding of your codebase, which means re-parsing files, guessing at types, and missing context that VS Code already has.

This extension bridges that gap. It wraps VS Code's language server commands and exposes them through MCP, giving AI assistants access to the same semantic understanding that powers your daily coding experience.

## The Tools

The extension exposes 30 MCP tools organized into categories:

**Code Navigation & Analysis**
- `document_symbols` — Get all symbols in a file (functions, classes, variables)
- `workspace_symbols` — Search symbols across the entire workspace
- `go_to_definition` — Find where a symbol is defined
- `find_references` — Find all usages of a symbol
- `hover_info` — Get type information and documentation at a position
- `call_hierarchy` — Get incoming and outgoing function calls
- `type_hierarchy` — Get type inheritance chains

**Completions & Suggestions**
- `get_completions` — Get IntelliSense code completions
- `get_signature_help` — Get function signature and parameter info
- `get_code_actions` — Get available quick fixes and refactorings

**Formatting & Refactoring**
- `format_document` — Format an entire document
- `format_range` — Format a specific range
- `organize_imports` — Sort and organize imports
- `rename_symbol` — Rename a symbol across all references

**Diagnostics & Workspace**
- `diagnostics` — Get errors and warnings for files or the workspace
- `search_workspace_files` — Search for files using glob patterns
- `search_workspace_text` — Search text across the entire workspace

Write operations support dry-run mode, so the AI can preview changes before applying them.

## Getting Started

Install the extension from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=CodingWithCalvin.VSC-MCPServer), or search for "VSC as MCP" in the Extensions view.

The MCP server starts automatically when VS Code launches. By default, it listens on port 4000. Configure your MCP client to connect to:

```json
{
  "mcpServers": {
    "vscode": {
      "url": "http://localhost:4000/mcp"
    }
  }
}
```

That's it. Your AI assistant can now query VS Code's language intelligence directly.

### Configuration

If you need to change the defaults, head to **Settings** and search for `codingwithcalvin.mcp`:

| Setting | Default | Description |
|---------|---------|-------------|
| `autoStart` | `true` | Start the server when VS Code launches |
| `port` | `4000` | Port for the MCP server |
| `bindAddress` | `127.0.0.1` | Bind address (localhost only for security) |

You can also control the server from the Command Palette:

- **MCP Server: Start** — Start the server
- **MCP Server: Stop** — Stop the server
- **MCP Server: Restart** — Restart the server
- **MCP Server: Show Available Tools** — View all available tools

## Security

The server only binds to localhost by default. It validates the Host header to prevent DNS rebinding attacks and restricts CORS to localhost origins. No authentication is required since it assumes same-machine local access is trusted.

## What's Next

This is v0.1.0. The tool coverage is solid, but there's always room for more. I'm looking at exposing debugging capabilities, terminal integration, and task execution. If there's something you'd find useful, let me know.

## Wrapping Up

The source is on [GitHub](https://github.com/CodingWithCalvin/VSC-MCPServer). If you run into issues or have ideas for additional tools, open an issue or send a PR.

Thanks for reading!
