# Remote MCP Servers

A monorepo of Model Context Protocol (MCP) servers deployed on Railway. This project provides scalable, cloud-hosted MCP capabilities for AI assistants and tools.

## Overview

This repository contains multiple MCP servers, each providing specific integrations:

- **Railway MCP Server** - Interact with Railway platform APIs
- **Notion MCP Server** - Integrate with Notion workspaces and databases
- **Airtable MCP Server** - Access and manipulate Airtable bases
- **Linear MCP Server** - Manage Linear issues and projects

All servers follow strict compliance with **Global Invariants** to ensure reliability and Railway compatibility.

## Global Invariants

Every MCP server in this repository MUST satisfy these requirements:

✅ **MCP transport is Streamable HTTP** (stdio + HTTP health endpoint)
✅ **Server listens on `0.0.0.0:$PORT`**
✅ **`/health` endpoint exists and returns `{ "ok": true }`**
✅ **Dockerfile builds without modification**
✅ **No secrets exist in code or files** (all via environment variables)
✅ **Tools are versioned** (`tools.v1.*`)
✅ **At least one tool is callable** (`tools.v1.ping`)

## Project Structure

```
remote-mcp-servers/
├── packages/
│   ├── template-mcp-server/    # Template for creating new servers
│   ├── railway-mcp-server/     # Railway platform integration
│   ├── notion-mcp-server/      # Notion API integration
│   ├── airtable-mcp-server/    # Airtable API integration
│   └── linear-mcp-server/      # Linear API integration
├── openspec/                   # OpenSpec specifications
├── railway.json                # Railway deployment configuration
├── tsconfig.json               # Shared TypeScript configuration
├── .eslintrc.json              # Shared ESLint configuration
├── .prettierrc.json            # Shared Prettier configuration
└── package.json                # Root workspace configuration
```

## Quick Start

### Prerequisites

- Node.js 20+
- npm 9+
- Railway account (for deployment)
- API keys for the services you want to integrate

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd remote-mcp-servers
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables for each server you want to run (see individual server READMEs)

### Development

#### Run a specific server locally:

```bash
# Navigate to the server package
cd packages/railway-mcp-server

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your actual values

# Run in development mode
npm run dev
```

#### Build all servers:

```bash
npm run build
```

#### Lint all code:

```bash
npm run lint
```

#### Format all code:

```bash
npm run format
```

## MCP Servers

### Railway MCP Server

Provides tools to interact with Railway platform.

**API**: Railway GraphQL API
**Key Tools**: Deployments, services, projects, environment variables
**Setup**: See [packages/railway-mcp-server/README.md](packages/railway-mcp-server/README.md)

### Notion MCP Server

Provides tools to interact with Notion workspaces.

**API**: Notion API v1
**Key Tools**: Pages, databases, blocks
**Setup**: See [packages/notion-mcp-server/README.md](packages/notion-mcp-server/README.md)

### Airtable MCP Server

Provides tools to interact with Airtable bases.

**API**: Airtable API v0
**Key Tools**: Records, tables, bases
**Setup**: See [packages/airtable-mcp-server/README.md](packages/airtable-mcp-server/README.md)

### Linear MCP Server

Provides tools to interact with Linear projects.

**API**: Linear GraphQL API
**Key Tools**: Issues, projects, teams
**Setup**: See [packages/linear-mcp-server/README.md](packages/linear-mcp-server/README.md)

## Standard Tools

Every MCP server includes these standard tools:

- `tools.v1.ping` - Health check and server validation
- `tools.v1.api_get` - Make GET requests to the API
- `tools.v1.api_post` - Make POST requests to the API
- `tools.v1.api_patch` - Make PATCH requests to the API
- `tools.v1.api_delete` - Make DELETE requests to the API
- `tools.v1.api_request` - Generic HTTP request tool

## Deployment to Railway

### Prerequisites

1. Create a Railway account at [railway.app](https://railway.app)
2. Create a new project named "Remote MCP Servers"
3. Connect your GitHub repository

### Service Configuration

Each MCP server deploys as a separate Railway service. See [RAILWAY_SETUP.md](RAILWAY_SETUP.md) for detailed instructions.

**Quick deployment steps:**

1. Create a service in Railway for each server
2. Set the root directory to `packages/<server-name>`
3. Configure environment variables in Railway UI
4. Push to `main` branch to trigger deployment

### Validation Checklist

**Pre-Deploy:**
- [ ] Dockerfile builds locally
- [ ] TypeScript compiles without errors
- [ ] No secrets in code
- [ ] All env vars defined in `.env.example`

**Post-Deploy:**
- [ ] Service responds on public URL
- [ ] `/health` returns 200
- [ ] `tools.v1.ping` succeeds

## Testing with MCP Inspector

[MCP Inspector](https://github.com/modelcontextprotocol/inspector) is the official tool for testing MCP servers.

1. Install MCP Inspector
2. Start your MCP server locally
3. Connect MCP Inspector to the server via stdio
4. Test tools, resources, and prompts

## Creating a New MCP Server

1. **Copy the template:**
   ```bash
   cp -r packages/template-mcp-server packages/my-new-server
   ```

2. **Update `package.json`:**
   ```json
   {
     "name": "@remote-mcp/my-new-server",
     "description": "MCP server for My Service"
   }
   ```

3. **Customize `.env.example`:**
   ```env
   API_BASE_URL=https://api.myservice.com
   API_KEY=your-api-key-here
   MCP_SERVER_NAME=my-new-server
   ```

4. **Implement custom logic in `src/index.ts`:**
   - Add service-specific tools
   - Add resources and prompts
   - Follow global invariants

5. **Test locally with MCP Inspector**

6. **Add to Railway:**
   - Create new service in Railway
   - Set root directory to `packages/my-new-server`
   - Configure environment variables
   - Deploy

## Architecture

### Monorepo with npm Workspaces

- Each MCP server is an independent package
- Shared tooling (TypeScript, ESLint, Prettier) at root level
- Independent deployments to Railway

### MCP Protocol Compliance

All servers use the official `@modelcontextprotocol/sdk` and implement:

- **Tools**: Callable functions with strict schemas
- **Resources**: URI-addressable data
- **Prompts**: Reusable prompt templates

### Railway Deployment

- **Builder**: Nixpacks (automatic detection)
- **Health Checks**: `/health` endpoint monitored every 30s
- **Auto-deployment**: Pushes to `main` trigger deployments
- **Environment Variables**: Configured in Railway UI

## Documentation

- **Railway Setup**: [RAILWAY_SETUP.md](RAILWAY_SETUP.md)
- **OpenSpec Workflow**: [openspec/AGENTS.md](openspec/AGENTS.md)
- **Project Context**: [openspec/project.md](openspec/project.md)
- **Template Server**: [packages/template-mcp-server/README.md](packages/template-mcp-server/README.md)

## Tech Stack

- **Runtime**: Node.js 20 / TypeScript 5
- **Framework**: @modelcontextprotocol/sdk
- **Transport**: Stdio (MCP) + HTTP (health checks)
- **Build**: TypeScript compiler
- **Linting**: ESLint + Prettier
- **Deployment**: Railway
- **Testing**: MCP Inspector

## Development Workflow

1. **Create spec** - Use OpenSpec to plan changes
2. **Implement** - Follow global invariants and conventions
3. **Test locally** - Use MCP Inspector
4. **Validate** - Run pre-deploy checks
5. **Deploy** - Push to main, Railway auto-deploys
6. **Verify** - Run post-deploy validation

## Contributing

1. Follow the OpenSpec workflow (see [openspec/AGENTS.md](openspec/AGENTS.md))
2. Ensure all global invariants are met
3. Test with MCP Inspector before deploying
4. Use conventional commits
5. Ensure TypeScript compiles with no errors
6. Run linting and formatting

## Troubleshooting

### Server won't start
- Check all required environment variables are set
- Verify `PORT` is being read from environment
- Check logs for startup errors

### Health check failing
- Verify `/health` endpoint is accessible
- Ensure server binds to `0.0.0.0:$PORT`
- Check timeout settings (< 10s response)

### Build failures
- Run `npm run build` locally to see errors
- Check TypeScript compilation errors
- Verify all dependencies are installed

### Railway deployment issues
- See [RAILWAY_SETUP.md](RAILWAY_SETUP.md) troubleshooting section
- Check Railway logs for detailed errors
- Verify environment variables in Railway UI

## License

ISC

## Support

- **MCP Documentation**: https://modelcontextprotocol.io
- **Railway Documentation**: https://docs.railway.app
- **OpenSpec**: https://github.com/Fission-AI/OpenSpec
