# Claude Code SDK Chat App

A simple chat application built with the Claude Code SDK that provides a minimalistic interface for interacting with Claude while maintaining full access to development tools and MCP integrations.

## Features

- 🔧 **Full Tool Access**: File operations, command execution, web search
- 🏗️ **MCP Integration**: Direct access to Pulumi tools and other MCP servers
- 💬 **Conversation History**: Maintains context across the chat session
- 🚀 **Permissive Mode**: All tools enabled without permission prompts
- 📱 **Clean Interface**: Minimalistic `>` prompt

## Installation

```bash
npm install
npm run build
```

## Usage

```bash
npm run chat
```

You'll see a simple prompt:
```
Chat started. Type "q" to quit.

> 
```

Type your questions or requests at the `>` prompt. Type `q` to quit.

## Tool Capabilities

### File Operations
```
> what files are in the current directory?
> read the contents of package.json  
> create a new file called test.txt with "Hello World"
> search for "import" in all TypeScript files
```

### Command Execution
```
> run ls -la to show detailed file listing
> execute npm install in the current directory
> check the git status
```

### Pulumi Operations
```
> run pulumi preview on /path/to/pulumi/project
> what would happen if I deploy the stack in /Users/arturl/test/static-site?
> deploy the Pulumi stack in /path/to/project
> show me the outputs of the Pulumi stack
```

## Configuration

The app runs with `bypassPermissions` mode for maximum tool access and automatically reads `CLAUDE.md` files for project context.

## Security Warning

⚠️ The app can create/modify files, execute commands, and deploy cloud infrastructure. Use in trusted environments only.

## Development

```bash
npm run build      # Build TypeScript
npm run chat       # Start chat app
npm run start-chat # Start compiled version
```