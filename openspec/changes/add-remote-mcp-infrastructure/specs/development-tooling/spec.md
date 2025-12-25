# Development Tooling Specification

## ADDED Requirements

### Requirement: MCP Inspector Integration
The project MUST support MCP Inspector for testing and debugging MCP servers locally.

#### Scenario: Local server testing
- **WHEN** a developer runs an MCP server locally
- **THEN** they MUST be able to connect MCP Inspector to http://localhost:<port>
- **AND** MCP Inspector MUST discover all tools, resources, and prompts
- **AND** developers MUST be able to test tool execution

#### Scenario: Tool testing with MCP Inspector
- **WHEN** testing a tool via MCP Inspector
- **THEN** developers MUST see tool parameters and schemas
- **AND** they MUST be able to invoke the tool with test inputs
- **AND** they MUST see the tool response

#### Scenario: MCP Inspector documentation
- **WHEN** setting up MCP Inspector
- **THEN** documentation MUST explain installation steps
- **AND** it MUST explain how to connect to local servers
- **AND** it MUST provide troubleshooting guidance

### Requirement: Postman MCP Generator Integration
The project MUST support generating MCP servers from Postman API specifications.

#### Scenario: Postman collection import
- **WHEN** a developer has a Postman collection
- **THEN** they MUST be able to generate an MCP server from it using Postman MCP Generator
- **AND** generated server MUST follow the MCP server template
- **AND** generated tools MUST map to API endpoints

#### Scenario: Generated server validation
- **WHEN** an MCP server is generated from Postman
- **THEN** it MUST pass all global invariants
- **AND** it MUST include required tools (ping, api_request, etc.)
- **AND** it MUST be deployable to Railway without modification

#### Scenario: Postman MCP Generator documentation
- **WHEN** using Postman MCP Generator
- **THEN** documentation MUST explain the generation process
- **AND** it MUST explain how to customize generated servers
- **AND** it MUST list limitations and constraints

### Requirement: TypeScript Configuration
The project MUST use TypeScript with strict mode for all MCP servers.

#### Scenario: Strict mode enforcement
- **WHEN** TypeScript is compiled
- **THEN** strict mode MUST be enabled
- **AND** no implicit any types are allowed
- **AND** null checks MUST be enforced

#### Scenario: Shared tsconfig.json
- **WHEN** a package compiles TypeScript
- **THEN** it MUST extend the root tsconfig.json
- **AND** package-specific overrides MUST be minimal
- **AND** consistent compiler options MUST be enforced

#### Scenario: TypeScript compilation validation
- **WHEN** TypeScript is compiled
- **THEN** there MUST be no type errors
- **AND** output MUST be in dist/ directory
- **AND** source maps MUST be generated

### Requirement: ESLint Configuration
The project MUST use ESLint for code quality and consistency.

#### Scenario: ESLint rules enforcement
- **WHEN** code is linted
- **THEN** root .eslintrc.json rules MUST apply
- **AND** TypeScript-specific rules MUST be active
- **AND** no unused variables or imports are allowed

#### Scenario: Pre-commit linting
- **WHEN** code is committed
- **THEN** linting MUST run automatically (if pre-commit hooks enabled)
- **AND** commits with lint errors MUST be blocked
- **AND** developers MUST fix lint errors before committing

#### Scenario: ESLint IDE integration
- **WHEN** developers use VS Code or other IDEs
- **THEN** ESLint MUST provide real-time feedback
- **AND** auto-fix MUST be available
- **AND** configuration MUST be recognized by IDE

### Requirement: Prettier Configuration
The project MUST use Prettier for consistent code formatting.

#### Scenario: Prettier formatting
- **WHEN** code is formatted
- **THEN** root .prettierrc.json rules MUST apply
- **AND** consistent indentation, quotes, and spacing MUST be enforced
- **AND** all code MUST follow the same style

#### Scenario: Format on save
- **WHEN** developers save files in their IDE
- **THEN** Prettier SHOULD auto-format the file
- **AND** formatting MUST be consistent across all developers
- **AND** no manual formatting is required

#### Scenario: Prettier integration with ESLint
- **WHEN** both Prettier and ESLint are active
- **THEN** they MUST not conflict
- **AND** Prettier MUST handle formatting rules
- **AND** ESLint MUST handle code quality rules

### Requirement: FastMCP Framework
The project MUST use FastMCP for rapid MCP server development.

#### Scenario: FastMCP installation
- **WHEN** setting up a new MCP server
- **THEN** FastMCP MUST be installed as a dependency
- **AND** version MUST be pinned in package.json
- **AND** it MUST be compatible with @modelcontextprotocol/sdk

#### Scenario: FastMCP server creation
- **WHEN** creating a server with FastMCP
- **THEN** boilerplate MUST be minimal
- **AND** server MUST initialize with name and version
- **AND** transport MUST be Streamable HTTP

#### Scenario: FastMCP tool definition
- **WHEN** defining tools with FastMCP
- **THEN** syntax MUST be concise and declarative
- **AND** type safety MUST be maintained
- **AND** tools MUST be versioned (tools.v1.*)

### Requirement: MCP SDK Integration
The project MUST use the official @modelcontextprotocol/sdk.

#### Scenario: SDK installation
- **WHEN** an MCP server is created
- **THEN** @modelcontextprotocol/sdk MUST be installed
- **AND** version MUST be pinned
- **AND** it MUST be used by FastMCP or directly

#### Scenario: MCP protocol compliance
- **WHEN** using the SDK
- **THEN** all MCP protocol methods MUST be supported
- **AND** protocol versioning MUST be handled
- **AND** servers MUST comply with MCP specification

#### Scenario: SDK type definitions
- **WHEN** developing with TypeScript
- **THEN** SDK type definitions MUST be available
- **AND** TypeScript MUST validate MCP message types
- **AND** IDE autocomplete MUST work

### Requirement: Development Scripts
Each MCP server package MUST have standard development scripts.

#### Scenario: npm run dev script
- **WHEN** running npm run dev
- **THEN** server MUST start in development mode
- **AND** it MUST watch for file changes and reload
- **AND** it MUST use .env file for environment variables

#### Scenario: npm run build script
- **WHEN** running npm run build
- **THEN** TypeScript MUST be compiled to JavaScript
- **AND** output MUST be in dist/ directory
- **AND** build MUST fail on type errors

#### Scenario: npm start script
- **WHEN** running npm start
- **THEN** server MUST start in production mode
- **AND** it MUST use compiled JavaScript from dist/
- **AND** it MUST read environment variables from Railway or .env

#### Scenario: npm test script
- **WHEN** running npm test
- **THEN** tests MUST execute
- **AND** test results MUST be reported
- **AND** tests MUST pass before deployment

### Requirement: Environment Variable Management
The project MUST provide clear environment variable management.

#### Scenario: .env.example file
- **WHEN** a new MCP server is created
- **THEN** it MUST include .env.example file
- **AND** it MUST list all required environment variables
- **AND** it MUST use placeholder values (no real secrets)

#### Scenario: .env file for local development
- **WHEN** developers work locally
- **THEN** they MUST copy .env.example to .env
- **AND** they MUST fill in real values
- **AND** .env MUST be gitignored

#### Scenario: Environment variable validation
- **WHEN** server starts
- **THEN** it MUST validate all required env vars are present
- **AND** it MUST fail with clear error if any are missing
- **AND** it MUST not use silent defaults

### Requirement: Documentation Standards
The project MUST maintain comprehensive documentation for development tooling.

#### Scenario: Setup documentation
- **WHEN** a new developer joins the project
- **THEN** setup documentation MUST guide them through tooling installation
- **AND** it MUST explain how to run servers locally
- **AND** it MUST explain how to test with MCP Inspector

#### Scenario: Tooling reference
- **WHEN** developers need tooling information
- **THEN** documentation MUST explain each tool's purpose
- **AND** it MUST provide configuration examples
- **AND** it MUST include troubleshooting tips

#### Scenario: Workflow documentation
- **WHEN** developers create or modify MCP servers
- **THEN** documentation MUST explain the development workflow
- **AND** it MUST explain testing and validation steps
- **AND** it MUST explain deployment process
