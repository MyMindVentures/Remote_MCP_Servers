# Deployment Checklist

This checklist ensures all Remote MCP Servers meet global invariants and are ready for Railway deployment.

## Global Invariants Verification

For EACH server, verify these requirements are met:

### ✅ MCP Transport is Streamable HTTP
- [ ] Server uses stdio transport for MCP protocol
- [ ] HTTP health endpoint exists at `/health`
- [ ] Both transports are functional

### ✅ Server Listens on 0.0.0.0:$PORT
- [ ] Server binds to `0.0.0.0` (not `localhost` or `127.0.0.1`)
- [ ] Port is read from `process.env.PORT`
- [ ] No hardcoded port values exist

### ✅ /health Endpoint Returns { "ok": true }
- [ ] `/health` endpoint exists
- [ ] Returns HTTP 200 status
- [ ] Response body is `{ "ok": true }`
- [ ] Responds within 5 seconds

### ✅ Dockerfile Builds Without Modification
- [ ] Dockerfile exists in package directory
- [ ] Uses official base image (node:20-alpine)
- [ ] Builds successfully with `docker build`
- [ ] No modifications required for deployment

### ✅ No Secrets in Code or Files
- [ ] No API keys in source code
- [ ] No tokens or passwords in files
- [ ] All secrets in environment variables
- [ ] `.env` file is gitignored
- [ ] `.env.example` uses placeholder values only

### ✅ Tools are Versioned (tools.v1.*)
- [ ] All tools follow `tools.v1.*` naming convention
- [ ] No unversioned tools exist
- [ ] Tool versions are consistent

### ✅ At Least One Tool is Callable
- [ ] `tools.v1.ping` tool exists
- [ ] Ping tool returns successful response
- [ ] Tool completes within 5 seconds

## Pre-Deployment Validation

### Build Validation
- [ ] `npm install` succeeds without errors
- [ ] `npm run build` succeeds for all packages
- [ ] TypeScript compiles with zero errors
- [ ] No TypeScript warnings (if strict mode)
- [ ] All `dist/` directories contain compiled JavaScript

### Code Quality
- [ ] `npm run lint` passes with no errors
- [ ] `npm run format:check` shows all files are formatted
- [ ] No eslint warnings or errors
- [ ] Code follows project conventions (see `openspec/project.md`)

### Environment Variables
- [ ] `.env.example` exists for each server
- [ ] All required variables documented in `.env.example`
- [ ] No default values that hide misconfiguration
- [ ] Placeholder values are clearly marked

### Dockerfile Validation
- [ ] Dockerfile syntax is valid
- [ ] Base image is official (`node:20-alpine`)
- [ ] Dependencies copied before source code (layer caching)
- [ ] PORT is exposed dynamically
- [ ] CMD uses `npm start`

## Railway Configuration Validation

### Project Setup
- [ ] Railway project "Remote MCP Servers" created
- [ ] GitHub repository connected
- [ ] Auto-deployment enabled for `main` branch

### Service Configuration (Per Server)
- [ ] Service created in Railway UI
- [ ] Root directory set to `packages/<server-name>`
- [ ] Build command: `npm run build`
- [ ] Start command: `npm start`
- [ ] Nixpacks builder selected

### Environment Variables (Per Server)
- [ ] `PORT` - Provided by Railway automatically
- [ ] `NODE_ENV=production`
- [ ] `API_BASE_URL` - Service-specific API
- [ ] `API_KEY` - Service API key (marked sensitive)
- [ ] `API_AUTH_HEADER` - Usually "Authorization"
- [ ] `API_AUTH_PREFIX` - Usually "Bearer"
- [ ] `API_DEFAULT_HEADERS_JSON` - Headers as JSON string
- [ ] `API_TIMEOUT_S` - Request timeout (30)
- [ ] `API_ALLOW_ABSOLUTE_URLS` - false
- [ ] `MCP_SERVER_NAME` - Server name
- [ ] `MCP_SERVER_VERSION` - Server version

### Health Check Configuration
- [ ] Health check path: `/health`
- [ ] Interval: 30 seconds
- [ ] Timeout: 10 seconds
- [ ] Health check enabled

## Post-Deployment Validation

### Service Accessibility
- [ ] Railway provides public URL
- [ ] Public URL is HTTPS
- [ ] Service responds within 10 seconds
- [ ] No 502/503 errors

### Health Endpoint
- [ ] `curl https://<service-url>/health` returns 200
- [ ] Response body is `{ "ok": true }`
- [ ] Response time < 5 seconds

### MCP Protocol
- [ ] MCP server accessible via stdio
- [ ] Tools list is discoverable
- [ ] At least `tools.v1.ping` is present
- [ ] Tool schemas are valid JSON Schema

### Tool Execution
- [ ] `tools.v1.ping` executes successfully
- [ ] Returns expected response structure
- [ ] Completes within 5 seconds
- [ ] No errors in Railway logs

### Logging
- [ ] Startup logs visible in Railway
- [ ] Server logs port binding: "listening on 0.0.0.0:<port>"
- [ ] No error logs present
- [ ] Health check logs show success

## Server-Specific Checklists

### Railway MCP Server
- [ ] `RAILWAY_PROJECT_ID` configured
- [ ] `RAILWAY_ENVIRONMENT_ID` configured (if applicable)
- [ ] API_BASE_URL: `https://backboard.railway.app/graphql/v2`
- [ ] Railway API token is valid

### Notion MCP Server
- [ ] Notion integration token is valid
- [ ] API_BASE_URL: `https://api.notion.com/v1`
- [ ] `NOTION_VERSION=2022-06-28` configured
- [ ] Notion-Version header in default headers

### Airtable MCP Server
- [ ] Airtable API key is valid
- [ ] API_BASE_URL: `https://api.airtable.com/v0`
- [ ] `AIRTABLE_BASE_ID` configured (if using default base)
- [ ] API permissions are sufficient

### Linear MCP Server
- [ ] Linear API key is valid
- [ ] API_BASE_URL: `https://api.linear.app/graphql`
- [ ] GraphQL endpoint accessible
- [ ] API permissions are sufficient

## Rollback Plan

If deployment fails:

### Immediate Actions
- [ ] Check Railway logs for error details
- [ ] Verify environment variables are set correctly
- [ ] Check health endpoint is accessible
- [ ] Verify Dockerfile builds locally

### Rollback Steps
- [ ] Revert to previous Railway deployment (if available)
- [ ] Fix issues locally
- [ ] Re-test with local Docker build
- [ ] Re-deploy when issues resolved

### Prevention
- [ ] Test locally before deploying
- [ ] Use staging environment for testing (if available)
- [ ] Monitor Railway logs during deployment
- [ ] Keep previous deployment active until new one is validated

## Continuous Monitoring

### Daily Checks
- [ ] All services report healthy in Railway
- [ ] No unusual error rates in logs
- [ ] Response times are normal
- [ ] No failed health checks

### Weekly Checks
- [ ] Review Railway resource usage
- [ ] Check for dependency updates
- [ ] Review API rate limits
- [ ] Verify all environment variables are current

### Monthly Checks
- [ ] Review and rotate API keys
- [ ] Update dependencies if needed
- [ ] Review Railway costs
- [ ] Update documentation if changes made

## Sign-off

### Developer Sign-off
- Developer Name: _______________
- Date: _______________
- Signature: _______________

### Pre-Deployment Confirmation
I confirm that:
- [ ] All global invariants are met
- [ ] All pre-deployment validations passed
- [ ] Dockerfile builds successfully
- [ ] Environment variables are configured
- [ ] Railway services are configured correctly

### Post-Deployment Confirmation
I confirm that:
- [ ] All services deployed successfully
- [ ] Health checks are passing
- [ ] Tools are callable
- [ ] No errors in logs
- [ ] Public URLs are accessible

---

**Last Updated**: 2025-12-25
**Next Review**: Before each deployment
