# Project Context

## Purpose
Remote MCP Servers is a monorepo of Model Context Protocol (MCP) servers deployed on Railway. The project enables remote MCP server instances that can be accessed by AI assistants and tools, providing scalable, cloud-hosted MCP capabilities.

## Tech Stack
- **Runtime**: Node.js / TypeScript
- **Framework**: FastMCP (for rapid MCP server development)
- **Development Tools**:
  - MCP Inspector (for testing and debugging MCP servers)
  - Postman MCP Generator (for generating MCP server code from API specs)
  - @modelcontextprotocol/sdk (official MCP SDK)
- **Deployment**: Railway (monorepo with multiple services)
- **Package Manager**: npm
- **Monorepo Structure**: Workspace-based (npm workspaces or similar)

## Project Conventions

### Code Style
- TypeScript strict mode enabled
- ESLint + Prettier for consistent formatting
- Naming: kebab-case for files/folders, camelCase for variables/functions, PascalCase for classes/types
- Each MCP server is a separate package in the monorepo

### Architecture Patterns
- **Monorepo Pattern**: Each MCP server is an independent package/service
- **Railway Services**: Each MCP server maps to a Railway service
- **Vibe Coding Techniques**: Leverage FastMCP for rapid development, use modern TypeScript features
- **Separation of Concerns**: Each server handles a specific domain/capability
- **Configuration**: Environment variables for Railway deployment settings

### Testing Strategy
- Use MCP Inspector for manual testing and validation
- Unit tests for business logic
- Integration tests for MCP protocol compliance
- Each server must be testable independently

### Git Workflow
- Main branch for production deployments
- Feature branches for new servers or capabilities
- Conventional commits for clear history
- Each Railway service auto-deploys from main branch

## Domain Context
**Model Context Protocol (MCP)**: A protocol for providing context to AI models. MCP servers expose resources, tools, and prompts that AI assistants can use.

**FastMCP**: A framework for building MCP servers quickly with minimal boilerplate.

**Railway Deployment**: Railway supports monorepos with multiple services. Each service needs:
- A start command
- Environment variables
- Port configuration
- Build configuration

## Important Constraints
- All servers must be deployable to Railway
- Each server must be independently buildable and runnable
- Must follow MCP protocol specifications
- Railway project name: "Remote MCP Servers"
- Railway requires proper service configuration for monorepo support

## External Dependencies
- Railway platform (deployment infrastructure)
- MCP protocol specification
- FastMCP framework
- Postman API definitions (for MCP generation)
