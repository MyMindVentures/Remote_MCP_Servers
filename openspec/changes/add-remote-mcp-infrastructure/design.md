# Design: Remote MCP Infrastructure

## Context
Building a monorepo for hosting multiple Model Context Protocol (MCP) servers on Railway. Each MCP server provides specific capabilities (tools, resources, prompts) to AI assistants. Railway deployment requires specific configuration for monorepo support, where each server is deployed as an independent service.

### Stakeholders
- Developers creating new MCP servers
- AI assistants consuming MCP servers
- DevOps/platform team managing Railway deployments

### Constraints
- Railway's monorepo service detection requires specific configuration
- Each MCP server must be independently deployable and scalable
- MCP protocol compliance is mandatory
- Must support rapid development (vibe coding with FastMCP)

## Goals / Non-Goals

### Goals
- Monorepo structure supporting multiple independent MCP servers
- Railway deployment with automatic service detection and configuration
- Rapid development using FastMCP and modern TypeScript
- Development tools (MCP Inspector, Postman MCP Generator) integration
- Clear template for creating new MCP servers
- Independent build, test, and deployment per server

### Non-Goals
- Client-side MCP implementations (focus is server-side only)
- Custom MCP protocol extensions (follow standard MCP spec)
- Multi-cloud deployment (Railway only for now)
- Real-time collaboration features between servers

## Decisions

### Decision 1: Monorepo with npm Workspaces
**What**: Use npm workspaces for monorepo management instead of Lerna, Turborepo, or nx.

**Why**:
- Native to npm, no additional tools required
- Sufficient for our use case (shared dependencies, independent builds)
- Railway compatible
- Simpler than alternatives for this project scale

**Alternatives considered**:
- Lerna: Deprecated, legacy tool
- Turborepo: Overkill for our current needs, adds complexity
- Nx: Too opinionated and heavyweight
- Yarn/pnpm workspaces: Prefer npm for Railway compatibility

### Decision 2: FastMCP as Primary Framework
**What**: Use FastMCP as the primary framework for building MCP servers.

**Why**:
- Reduces boilerplate significantly
- Designed for rapid development (vibe coding)
- Built on @modelcontextprotocol/sdk (official SDK)
- Simplifies tool, resource, and prompt definitions
- Good TypeScript support

**Alternatives considered**:
- Raw @modelcontextprotocol/sdk: Too much boilerplate, slower development
- Custom framework: Unnecessary reinvention
- Other MCP frameworks: FastMCP is most mature and actively maintained

### Decision 3: Railway Service Configuration
**What**: Each MCP server package maps to one Railway service, configured via railway.json or service-specific settings.

**Why**:
- Independent scaling per MCP server
- Isolated deployments (one server failing doesn't affect others)
- Clear service boundaries
- Railway's monorepo support works with this pattern

**Configuration approach**:
- Root-level `railway.json` or `railway.toml` with service definitions
- Each service specifies:
  - `root` directory (e.g., `packages/server-name`)
  - `buildCommand` (TypeScript compilation)
  - `startCommand` (Node.js execution)
  - Environment variables
  - Port configuration

### Decision 4: TypeScript Strict Mode
**What**: Enable strict mode TypeScript across all packages.

**Why**:
- Better type safety
- Catches errors at compile time
- Improves code quality
- Industry best practice for production code

**Configuration**:
- Shared root `tsconfig.json` with strict: true
- Package-specific tsconfig.json extending root
- Target ES2022 for modern Node.js features

### Decision 5: Shared Tooling Configuration
**What**: Share ESLint, Prettier, and TypeScript configs at root level.

**Why**:
- Consistent code style across all MCP servers
- Single source of truth for linting rules
- Easier maintenance
- Enforces conventions defined in project.md

**Files**:
- `.eslintrc.json` (root)
- `.prettierrc.json` (root)
- `tsconfig.json` (root, extended by packages)

### Decision 6: MCP Inspector for Testing
**What**: Document MCP Inspector as the primary testing tool for MCP servers.

**Why**:
- Official tool from MCP ecosystem
- Provides UI for testing tools, resources, prompts
- Validates MCP protocol compliance
- Simplifies debugging

**Usage**: Developers run MCP Inspector locally pointing to `http://localhost:<port>` of their server.

### Decision 7: Environment-Based Configuration
**What**: Use environment variables for all configuration, with `.env.example` files in each package.

**Why**:
- Railway deployment model (environment variables in Railway UI)
- 12-factor app principles
- Security (no secrets in code)
- Environment-specific settings (dev vs prod)

**Pattern**:
```
PORT=3000
MCP_SERVER_NAME=example-server
API_KEY=your-api-key-here
```

## Architecture

### Directory Structure
```
remote-mcp-servers/
├── package.json              # Root package with workspaces
├── tsconfig.json             # Shared TypeScript config
├── .eslintrc.json            # Shared ESLint config
├── .prettierrc.json          # Shared Prettier config
├── railway.json              # Railway services configuration
├── .gitignore
├── README.md
├── openspec/                 # OpenSpec files
└── packages/
    ├── template-mcp-server/  # Template for new servers
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── src/
    │   │   └── index.ts      # FastMCP server implementation
    │   ├── .env.example
    │   └── README.md
    └── example-mcp-server/   # Example server
        ├── package.json
        ├── tsconfig.json
        ├── src/
        │   └── index.ts
        ├── .env.example
        └── README.md
```

### MCP Server Package Structure
Each server package follows this structure:
```
packages/server-name/
├── package.json          # name, version, scripts, dependencies
├── tsconfig.json         # extends root config
├── src/
│   ├── index.ts          # Server entry point (FastMCP)
│   ├── tools/            # Tool implementations (optional)
│   ├── resources/        # Resource implementations (optional)
│   └── prompts/          # Prompt implementations (optional)
├── dist/                 # TypeScript build output
├── .env.example          # Environment variable template
└── README.md             # Server-specific documentation
```

### Railway Service Configuration Example
`railway.json`:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "services": [
    {
      "name": "example-mcp-server",
      "rootDirectory": "packages/example-mcp-server",
      "buildCommand": "npm run build",
      "startCommand": "npm start",
      "variables": {
        "PORT": "3000",
        "NODE_ENV": "production"
      }
    }
  ]
}
```

### FastMCP Server Template (TypeScript)
```typescript
import FastMCP from 'fastmcp';

const server = new FastMCP({
  name: 'example-mcp-server',
  version: '1.0.0',
});

// Add tools
server.addTool({
  name: 'echo',
  description: 'Echoes back the input',
  parameters: {
    message: { type: 'string', description: 'Message to echo' },
  },
  handler: async (params) => {
    return { content: [{ type: 'text', text: params.message }] };
  },
});

// Add resources
server.addResource({
  uri: 'config://settings',
  name: 'Server Settings',
  description: 'Configuration settings for this server',
  handler: async () => {
    return {
      content: [{ type: 'text', text: JSON.stringify({ version: '1.0.0' }) }],
    };
  },
});

// Add prompts
server.addPrompt({
  name: 'greeting',
  description: 'Generate a friendly greeting',
  handler: async (params) => {
    return {
      messages: [
        { role: 'user', content: { type: 'text', text: 'Say hello!' } },
      ],
    };
  },
});

const PORT = process.env.PORT || 3000;
server.listen(PORT);
```

## Risks / Trade-offs

### Risk: Railway Monorepo Configuration Complexity
- **Impact**: Incorrect configuration could prevent services from deploying
- **Mitigation**:
  - Document Railway setup thoroughly
  - Provide tested railway.json template
  - Include troubleshooting guide
  - Test with example server before scaling

### Risk: FastMCP Framework Changes
- **Impact**: Breaking changes in FastMCP could affect all servers
- **Mitigation**:
  - Pin FastMCP versions in package.json
  - Test updates in example server first
  - Document migration steps

### Risk: MCP Protocol Evolution
- **Impact**: Protocol changes could require server updates
- **Mitigation**:
  - Use official @modelcontextprotocol/sdk
  - Monitor MCP spec updates
  - Version MCP servers appropriately

### Trade-off: Monorepo vs Multi-Repo
- **Choice**: Monorepo
- **Pro**: Shared tooling, easier development, single deployment pipeline
- **Con**: All code in one repository, potential for tighter coupling
- **Rationale**: Benefits outweigh drawbacks for this use case

### Trade-off: FastMCP vs Raw SDK
- **Choice**: FastMCP
- **Pro**: Faster development, less boilerplate, modern patterns
- **Con**: Abstraction layer, framework dependency
- **Rationale**: Vibe coding requirement favors FastMCP

## Migration Plan

### Phase 1: Foundation Setup
1. Initialize npm workspace structure
2. Set up shared tooling (TypeScript, ESLint, Prettier)
3. Create template MCP server package
4. Document setup process

### Phase 2: Railway Configuration
1. Create Railway project "Remote MCP Servers"
2. Configure railway.json with example service
3. Test deployment with example server
4. Document Railway setup steps

### Phase 3: Development Tooling
1. Document MCP Inspector usage
2. Document Postman MCP Generator integration
3. Create development workflow documentation
4. Add troubleshooting guides

### Phase 4: Example Implementation
1. Build example MCP server with tools, resources, prompts
2. Test locally with MCP Inspector
3. Deploy to Railway
4. Validate end-to-end functionality

### Rollback Plan
If Railway deployment fails:
1. Servers can run locally for development
2. Alternative deployment (Render, Fly.io) can be considered
3. Each package is independent, partial rollback possible

## Open Questions

1. **How many initial MCP servers should we create?**
   - Recommendation: Start with 1 example server, add more as needed

2. **Should we use railway.json or railway.toml?**
   - Recommendation: railway.json (better IDE support, standard JSON tooling)

3. **Should each server have its own database/persistence?**
   - Recommendation: Start stateless, add persistence per-server as needed

4. **Do we need CI/CD beyond Railway auto-deploy?**
   - Recommendation: Railway auto-deploy sufficient initially, add GitHub Actions if needed for testing

5. **Should we create a shared package for common MCP utilities?**
   - Recommendation: Start without, extract common code into shared package if duplication emerges

6. **Authentication/authorization for MCP servers?**
   - Recommendation: Start without, add per-server if required (API keys via env vars)
