# MCP Server Template Specification

## ADDED Requirements

### Requirement: MCP Server Global Invariants
Every generated MCP server MUST satisfy these invariants before deployment.

#### Scenario: Streamable HTTP transport validation
- **WHEN** an MCP server is generated
- **THEN** it MUST use Streamable HTTP transport (not SSE-only)
- **AND** it MUST expose the /mcp endpoint for MCP protocol
- **AND** SSE-only servers MUST be rejected

#### Scenario: Network binding validation
- **WHEN** an MCP server starts
- **THEN** it MUST listen on 0.0.0.0:$PORT
- **AND** $PORT MUST be configurable via environment variable
- **AND** no hardcoded ports are allowed

#### Scenario: Health endpoint validation
- **WHEN** the server is running
- **THEN** a /health endpoint MUST exist
- **AND** it MUST return HTTP 200 with { "ok": true }
- **AND** it MUST respond within 5 seconds

#### Scenario: Docker build validation
- **WHEN** the Dockerfile is generated
- **THEN** it MUST build without modification
- **AND** it MUST use official base images only (python:3.12-slim or node:20-alpine)
- **AND** it MUST be Railway-compatible without changes

#### Scenario: Secrets protection validation
- **WHEN** code or files are generated
- **THEN** no secrets MUST exist in code or files
- **AND** all secrets MUST be environment variables
- **AND** .env files MUST be gitignored

#### Scenario: Tool versioning validation
- **WHEN** MCP tools are defined
- **THEN** all tools MUST be versioned (tools.v1.*)
- **AND** at least one tool MUST be callable (ping or equivalent)
- **AND** non-versioned tools MUST be rejected

### Requirement: Required File Structure
Every MCP server package MUST contain exactly these core files.

#### Scenario: Core files presence
- **WHEN** an MCP server package is created
- **THEN** it MUST contain: Dockerfile, requirements.txt (or package.json), server.py (or server.js)
- **AND** it MAY contain README.md
- **AND** no extra build files unless explicitly requested

#### Scenario: Python server structure
- **WHEN** creating a Python-based MCP server
- **THEN** it MUST have: Dockerfile, requirements.txt, server.py
- **AND** requirements.txt MUST pin all dependency versions
- **AND** server.py MUST be executable

#### Scenario: Node.js server structure
- **WHEN** creating a Node.js-based MCP server
- **THEN** it MUST have: Dockerfile, package.json, server.js (or TypeScript equivalent)
- **AND** package.json MUST lock dependency versions
- **AND** server.js MUST be executable

### Requirement: Dockerfile Specification
The Dockerfile MUST follow strict Railway-compatible patterns.

#### Scenario: Base image requirement
- **WHEN** Dockerfile is generated
- **THEN** it MUST use python:3.12-slim for Python or node:20-alpine for Node.js
- **AND** no other base images are allowed
- **AND** multi-stage builds are forbidden

#### Scenario: Build layer optimization
- **WHEN** Dockerfile is generated
- **THEN** dependencies MUST be copied and installed first
- **AND** source code MUST be copied after dependencies
- **AND** this enables layer caching

#### Scenario: Port exposure
- **WHEN** Dockerfile is generated
- **THEN** it MUST EXPOSE $PORT
- **AND** $PORT MUST be read from environment at runtime
- **AND** no hardcoded port values

#### Scenario: Startup command
- **WHEN** Dockerfile is generated
- **THEN** it MUST start server via CMD instruction
- **AND** CMD MUST reference the server entry point
- **AND** no shell wrappers or scripts

#### Scenario: Railway compatibility
- **WHEN** Dockerfile is built on Railway
- **THEN** it MUST succeed without modification
- **AND** no OS-specific tooling is allowed
- **AND** no platform-specific hacks

### Requirement: MCP Protocol Endpoints
The MCP server MUST implement required protocol endpoints.

#### Scenario: MCP protocol endpoint
- **WHEN** MCP server is running
- **THEN** /mcp endpoint MUST be available
- **AND** it MUST handle MCP protocol requests (initialize, tools/list, tools/call, etc.)
- **AND** it MUST use Streamable HTTP transport

#### Scenario: Health check endpoint
- **WHEN** MCP server is running
- **THEN** /health endpoint MUST return { "ok": true }
- **AND** it MUST return HTTP 200 status
- **AND** it MUST respond in under 5 seconds

### Requirement: Standard MCP Tools
Every MCP server MUST implement a standard set of versioned tools.

#### Scenario: Required tools presence
- **WHEN** MCP server tools are listed
- **THEN** it MUST include: tools.v1.ping, tools.v1.api_request, tools.v1.api_get, tools.v1.api_post, tools.v1.api_patch, tools.v1.api_delete
- **AND** all tools MUST follow tools.v1.* naming convention
- **AND** at least tools.v1.ping MUST be callable

#### Scenario: Ping tool validation
- **WHEN** tools.v1.ping is called
- **THEN** it MUST return a successful response
- **AND** it MUST complete within 5 seconds
- **AND** it MUST validate server health

#### Scenario: API request tool validation
- **WHEN** tools.v1.api_request is called
- **THEN** it MUST have strict input schemas
- **AND** it MUST validate all parameters
- **AND** it MUST not allow free-text execution

#### Scenario: Tool safety constraints
- **WHEN** any tool is executed
- **THEN** no dynamic eval is allowed
- **AND** no arbitrary filesystem access is allowed
- **AND** all inputs MUST be validated against schemas

### Requirement: Environment Variable Contract
The MCP server MUST define and validate required environment variables.

#### Scenario: Required environment variables
- **WHEN** MCP server starts
- **THEN** it MUST define: API_BASE_URL, API_KEY, API_AUTH_HEADER, API_AUTH_PREFIX, API_DEFAULT_HEADERS_JSON, API_TIMEOUT_S, API_ALLOW_ABSOLUTE_URLS, PORT
- **AND** all MUST have placeholder values in .env.example
- **AND** secrets MUST be marked as such

#### Scenario: Environment variable validation
- **WHEN** MCP server starts with missing env vars
- **THEN** it MUST fail with explicit error message
- **AND** it MUST list all missing variables
- **AND** it MUST not use implicit defaults that hide misconfiguration

#### Scenario: Secret handling
- **WHEN** environment variables contain secrets
- **THEN** they MUST never appear in code or files
- **AND** they MUST only be in .env (gitignored)
- **AND** .env.example MUST use placeholder values

### Requirement: Pre-Deploy Validation
The MCP server MUST pass pre-deployment validation checks.

#### Scenario: Dockerfile syntax validation
- **WHEN** pre-deploy validation runs
- **THEN** Dockerfile syntax MUST be valid
- **AND** it MUST parse without errors
- **AND** it MUST follow Dockerfile best practices

#### Scenario: Dependency resolution validation
- **WHEN** pre-deploy validation runs
- **THEN** Python imports or JS requires MUST resolve
- **AND** all dependencies MUST be installable
- **AND** no missing dependencies are allowed

#### Scenario: Local server startup validation
- **WHEN** pre-deploy validation runs
- **THEN** MCP server MUST start locally
- **AND** /health endpoint MUST return 200
- **AND** server MUST bind to correct port

### Requirement: Post-Deploy Validation
The deployed MCP server MUST pass post-deployment validation checks.

#### Scenario: Public URL validation
- **WHEN** post-deploy validation runs
- **THEN** service MUST respond on public URL
- **AND** /health endpoint MUST return 200
- **AND** response time MUST be under 10 seconds

#### Scenario: MCP discovery validation
- **WHEN** MCP discovery is performed
- **THEN** it MUST return list of tools
- **AND** tools MUST include at least tools.v1.ping
- **AND** tool schemas MUST be valid

#### Scenario: Tool execution validation
- **WHEN** post-deploy validation runs
- **THEN** at least one tool call MUST succeed
- **AND** tools.v1.ping MUST return success
- **AND** response MUST match expected schema

### Requirement: Error Handling and Recovery
The MCP server MUST handle errors explicitly and predictably.

#### Scenario: Missing environment variables
- **WHEN** required env vars are missing
- **THEN** server MUST fail to start
- **AND** explicit error message MUST be logged
- **AND** no silent defaults are used

#### Scenario: Port mismatch
- **WHEN** PORT environment variable conflicts with binding
- **THEN** server MUST fail with clear error
- **AND** error MUST indicate the conflict
- **AND** server MUST not attempt to bind to fallback port

#### Scenario: Dependency conflicts
- **WHEN** dependencies cannot be installed
- **THEN** build MUST fail explicitly
- **AND** error MUST identify conflicting dependencies
- **AND** no partial installation is allowed

#### Scenario: MCP endpoint unreachable
- **WHEN** /mcp endpoint is not reachable
- **THEN** health check MUST fail
- **AND** explicit error MUST be surfaced
- **AND** server MUST not report healthy

#### Scenario: Error recovery rule
- **WHEN** any error occurs
- **THEN** server MUST never "patch forward" silently
- **AND** server MUST never guess secrets
- **AND** failures MUST be surfaced explicitly

### Requirement: FastMCP Integration
The MCP server template MUST use FastMCP framework for rapid development.

#### Scenario: FastMCP server initialization
- **WHEN** creating an MCP server with FastMCP
- **THEN** it MUST initialize with name and version
- **AND** it MUST configure Streamable HTTP transport
- **AND** it MUST bind to 0.0.0.0:$PORT

#### Scenario: Tool registration
- **WHEN** registering tools with FastMCP
- **THEN** tools MUST be versioned (tools.v1.*)
- **AND** tools MUST have strict parameter schemas
- **AND** tools MUST have handler functions

#### Scenario: Resource registration
- **WHEN** registering resources with FastMCP
- **THEN** resources MUST have URI patterns
- **AND** resources MUST have handler functions
- **AND** resources MUST return valid MCP content

#### Scenario: Prompt registration
- **WHEN** registering prompts with FastMCP
- **THEN** prompts MUST have unique names
- **AND** prompts MUST have descriptions
- **AND** prompts MUST return valid message arrays
