# Monorepo Structure Specification

## ADDED Requirements

### Requirement: npm Workspaces Configuration
The project SHALL use npm workspaces to manage multiple MCP server packages in a monorepo structure.

#### Scenario: Workspace package installation
- **WHEN** a developer runs `npm install` at the root
- **THEN** all workspace dependencies are installed and linked correctly
- **AND** shared dependencies are hoisted to the root node_modules

#### Scenario: Cross-package dependencies
- **WHEN** one MCP server package depends on a shared utility package
- **THEN** npm workspaces automatically links the packages
- **AND** changes in the shared package are immediately available

### Requirement: Package Directory Structure
The project SHALL organize MCP servers under a `packages/` directory with each server as an independent package.

#### Scenario: New MCP server creation
- **WHEN** a developer creates a new MCP server
- **THEN** it is placed in `packages/<server-name>/` directory
- **AND** the server has its own package.json, src/, and configuration files

#### Scenario: Server independence
- **WHEN** working on one MCP server
- **THEN** developers can build, test, and run it independently
- **AND** it does not require building other servers

### Requirement: Shared Configuration Files
The project SHALL maintain shared TypeScript, ESLint, and Prettier configurations at the root level.

#### Scenario: TypeScript compilation
- **WHEN** a package compiles TypeScript
- **THEN** it extends the root tsconfig.json
- **AND** strict mode and common settings are enforced

#### Scenario: Code linting
- **WHEN** a developer runs linting on any package
- **THEN** it uses the root .eslintrc.json configuration
- **AND** consistent code style rules are applied

#### Scenario: Code formatting
- **WHEN** code is formatted with Prettier
- **THEN** it uses the root .prettierrc.json configuration
- **AND** consistent formatting is applied across all packages

### Requirement: Root Package Scripts
The root package.json SHALL provide scripts for managing all workspace packages.

#### Scenario: Build all packages
- **WHEN** running `npm run build` at the root
- **THEN** all MCP server packages are built in correct order
- **AND** build artifacts are created in each package's dist/ directory

#### Scenario: Run tests across workspace
- **WHEN** running `npm test` at the root
- **THEN** tests run for all packages
- **AND** test results are aggregated

#### Scenario: Lint all packages
- **WHEN** running `npm run lint` at the root
- **THEN** ESLint checks all packages
- **AND** violations are reported

### Requirement: Git Ignore Patterns
The project SHALL include a .gitignore file that excludes build artifacts, dependencies, and environment files.

#### Scenario: Node modules excluded
- **WHEN** git status is checked
- **THEN** node_modules directories are not tracked
- **AND** they do not appear in commits

#### Scenario: Build artifacts excluded
- **WHEN** TypeScript compilation creates dist/ directories
- **THEN** they are excluded from git
- **AND** only source files are tracked

#### Scenario: Environment files protected
- **WHEN** .env files contain secrets
- **THEN** they are excluded from git
- **AND** only .env.example files are tracked
