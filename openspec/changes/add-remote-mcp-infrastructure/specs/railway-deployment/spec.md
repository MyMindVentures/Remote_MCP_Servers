# Railway Deployment Specification

## ADDED Requirements

### Requirement: Railway Monorepo Configuration
The project MUST be configured for Railway monorepo deployment with independent services.

#### Scenario: Railway project creation
- **WHEN** setting up Railway deployment
- **THEN** a Railway project named "Remote MCP Servers" MUST be created
- **AND** it MUST support multiple services
- **AND** each MCP server MUST map to one Railway service

#### Scenario: railway.json configuration
- **WHEN** railway.json is created
- **THEN** it MUST define all MCP server services
- **AND** each service MUST specify rootDirectory, buildCommand, and startCommand
- **AND** schema validation MUST pass

#### Scenario: Service independence
- **WHEN** one MCP server is deployed
- **THEN** it MUST deploy independently of other servers
- **AND** failure in one service MUST not affect others
- **AND** each service MUST scale independently

### Requirement: Service Build Configuration
Each Railway service MUST have proper build configuration.

#### Scenario: Build command specification
- **WHEN** Railway builds a service
- **THEN** buildCommand MUST compile TypeScript or install Python dependencies
- **AND** build MUST succeed without manual intervention
- **AND** build artifacts MUST be created in expected locations

#### Scenario: Start command specification
- **WHEN** Railway starts a service
- **THEN** startCommand MUST execute the MCP server
- **AND** server MUST bind to 0.0.0.0:$PORT
- **AND** server MUST start within Railway's timeout limits

#### Scenario: Nixpacks builder
- **WHEN** Railway builds the service
- **THEN** Nixpacks builder MUST be used
- **AND** builder MUST detect language correctly (Python or Node.js)
- **AND** no custom build packs are required

### Requirement: Environment Variable Configuration
Railway services MUST have all required environment variables configured.

#### Scenario: Required variables in Railway UI
- **WHEN** a service is deployed
- **THEN** all environment variables from .env.example MUST be set in Railway UI
- **AND** PORT MUST be provided by Railway automatically
- **AND** secrets MUST be marked as sensitive

#### Scenario: Variable validation before deploy
- **WHEN** deployment is triggered
- **THEN** all required env vars MUST be present
- **AND** missing variables MUST cause deployment to fail
- **AND** explicit error message MUST indicate missing variables

#### Scenario: Secret management
- **WHEN** secrets are configured
- **THEN** they MUST only exist in Railway environment variables
- **AND** they MUST never be committed to git
- **AND** they MUST be marked as sensitive in Railway UI

### Requirement: Service Health Checks
Railway services MUST expose health check endpoints for monitoring.

#### Scenario: Health check configuration
- **WHEN** a service is deployed
- **THEN** Railway MUST be configured to check /health endpoint
- **AND** health check MUST run every 30 seconds
- **AND** failure MUST trigger alerts or restarts

#### Scenario: Startup health validation
- **WHEN** a service starts on Railway
- **THEN** /health endpoint MUST return 200 within 60 seconds
- **AND** if health check fails, deployment MUST be rolled back
- **AND** logs MUST indicate health check failure

### Requirement: Port Configuration
Railway services MUST properly configure and use the PORT environment variable.

#### Scenario: Railway PORT variable
- **WHEN** Railway starts a service
- **THEN** it MUST provide PORT environment variable
- **AND** MCP server MUST bind to 0.0.0.0:$PORT
- **AND** Railway MUST expose the service on a public URL

#### Scenario: Port binding validation
- **WHEN** service starts
- **THEN** it MUST log the port it's binding to
- **AND** Railway MUST detect successful binding
- **AND** service MUST be accessible via Railway's public URL

### Requirement: Deployment Pipeline
Railway MUST auto-deploy services from the main branch.

#### Scenario: Auto-deployment on push
- **WHEN** code is pushed to main branch
- **THEN** Railway MUST automatically trigger deployment
- **AND** affected services MUST be rebuilt and deployed
- **AND** deployment status MUST be visible in Railway UI

#### Scenario: Deployment success validation
- **WHEN** deployment completes
- **THEN** Railway MUST report success or failure
- **AND** service MUST be accessible via public URL
- **AND** health check MUST pass

#### Scenario: Deployment rollback
- **WHEN** deployment fails
- **THEN** previous successful deployment MUST remain active
- **AND** failed deployment MUST not affect production traffic
- **AND** logs MUST be available for debugging

### Requirement: Service Logs and Monitoring
Railway services MUST provide accessible logs and monitoring.

#### Scenario: Log access
- **WHEN** a service is running
- **THEN** logs MUST be accessible via Railway UI
- **AND** logs MUST include stdout and stderr
- **AND** logs MUST persist for at least 7 days

#### Scenario: Error logging
- **WHEN** an error occurs in the service
- **THEN** it MUST be logged with timestamp and stack trace
- **AND** it MUST be searchable in Railway logs
- **AND** critical errors MUST be identifiable

#### Scenario: Deployment logs
- **WHEN** deployment occurs
- **THEN** build logs MUST be available
- **AND** startup logs MUST be available
- **AND** logs MUST indicate success or failure clearly

### Requirement: Service Discovery and URLs
Railway MUST provide stable URLs for each deployed MCP server.

#### Scenario: Public URL generation
- **WHEN** a service is deployed
- **THEN** Railway MUST generate a public URL (e.g., https://service-name.railway.app)
- **AND** URL MUST be HTTPS
- **AND** URL MUST be stable across deployments

#### Scenario: Custom domain support
- **WHEN** a custom domain is configured
- **THEN** Railway MUST support custom domain mapping
- **AND** HTTPS MUST be automatically provisioned
- **AND** domain MUST route to the correct service

#### Scenario: Service URL in environment
- **WHEN** a service needs to know its own URL
- **THEN** Railway MUST provide RAILWAY_PUBLIC_URL or similar env var
- **AND** it MUST be accessible to the application
- **AND** it MUST be the correct public URL

### Requirement: Resource Limits and Scaling
Railway services MUST have appropriate resource limits and scaling configuration.

#### Scenario: Default resource allocation
- **WHEN** a service is deployed
- **THEN** Railway MUST allocate sufficient memory and CPU
- **AND** limits MUST be documented
- **AND** services MUST run within allocated resources

#### Scenario: Service restart on crash
- **WHEN** a service crashes
- **THEN** Railway MUST automatically restart it
- **AND** restart attempts MUST be logged
- **AND** excessive restarts MUST trigger alerts

#### Scenario: Manual scaling
- **WHEN** traffic increases
- **THEN** Railway plan MUST support manual scaling if needed
- **AND** scaling configuration MUST be accessible
- **AND** scaled instances MUST share environment variables

### Requirement: Deployment Validation Checklist
Each deployment MUST pass a validation checklist before being considered successful.

#### Scenario: Pre-deploy validation
- **WHEN** deployment is triggered
- **THEN** Dockerfile MUST build successfully
- **AND** all environment variables MUST be present
- **AND** no secrets MUST be in code

#### Scenario: Post-deploy validation
- **WHEN** deployment completes
- **THEN** service MUST respond on public URL
- **AND** /health endpoint MUST return 200
- **AND** MCP discovery MUST return tools
- **AND** at least one tool call MUST succeed

#### Scenario: Validation failure handling
- **WHEN** validation fails
- **THEN** deployment MUST be marked as failed
- **AND** previous deployment MUST remain active
- **AND** failure MUST be logged with details
