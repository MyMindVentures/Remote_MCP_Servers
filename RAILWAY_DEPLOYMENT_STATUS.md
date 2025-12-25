# Railway Deployment Status

**Last Updated:** 2025-12-25

## Current Status Summary

- **Project:** Remote MCP Servers (linked to GitHub: MyMindVentures/Remote_MCP_Servers)
- **Services Created:** 2/4 (50%)
- **Services Configured:** 2/4 (50%)
- **Deployments Ready:** 0/4 (0% - API keys needed)

## Services Status

### ✅ railway-mcp-server
- **Status:** Created & Configured
- **Environment Variables:** Set (11 variables)
- **Missing:** API_KEY needs actual Railway API token
- **Health Endpoint:** Not yet verified

### ✅ notion-mcp-server
- **Status:** Created & Configured
- **Environment Variables:** Set (13 variables)
- **Missing:** API_KEY needs actual Notion integration token
- **Health Endpoint:** Not yet verified

### ❌ airtable-mcp-server
- **Status:** NOT CREATED
- **Action Required:** Create service in Railway dashboard
- **Configuration Ready:** Yes (railway.json configured)

### ❌ linear-mcp-server
- **Status:** NOT CREATED
- **Action Required:** Create service in Railway dashboard
- **Configuration Ready:** Yes (railway.json configured)

## Railway Configuration

### railway.json
✅ **Status:** Properly configured with all 4 services
- All services defined with DOCKERFILE builder
- dockerfilePath and dockerContext set correctly
- watchPaths configured to prevent cross-service rebuilds
- Deploy policies configured (numReplicas: 1, restartPolicyType: ON_FAILURE)

## Required Actions

### 1. Create Missing Services in Railway Dashboard

The Railway CLI does not support creating services programmatically. Services must be created through the Railway web dashboard:

**Steps:**
1. Go to Railway dashboard: https://railway.app/project/[your-project-id]
2. Click "New Service" → "Empty Service"
3. Name it exactly: `airtable-mcp-server`
4. Repeat for `linear-mcp-server`

**Note:** Railway should automatically detect these services from railway.json once they're created.

### 2. Configure Environment Variables

Once services are created, set these environment variables:

#### airtable-mcp-server
```bash
railway variables --service airtable-mcp-server \
  --set PORT=3000 \
  --set NODE_ENV=production \
  --set API_BASE_URL=https://api.airtable.com/v0 \
  --set API_KEY=YOUR_AIRTABLE_API_KEY_HERE \
  --set API_AUTH_HEADER=Authorization \
  --set API_AUTH_PREFIX=Bearer \
  --set API_DEFAULT_HEADERS_JSON='{"Content-Type":"application/json"}' \
  --set API_TIMEOUT_S=30 \
  --set API_ALLOW_ABSOLUTE_URLS=false \
  --set MCP_SERVER_NAME=airtable-mcp-server \
  --set MCP_SERVER_VERSION=1.0.0 \
  --set AIRTABLE_BASE_ID=YOUR_AIRTABLE_BASE_ID_HERE
```

#### linear-mcp-server
```bash
railway variables --service linear-mcp-server \
  --set PORT=3000 \
  --set NODE_ENV=production \
  --set API_BASE_URL=https://api.linear.app/graphql \
  --set API_KEY=YOUR_LINEAR_API_KEY_HERE \
  --set API_AUTH_HEADER=Authorization \
  --set API_AUTH_PREFIX=Bearer \
  --set API_DEFAULT_HEADERS_JSON='{"Content-Type":"application/json"}' \
  --set API_TIMEOUT_S=30 \
  --set API_ALLOW_ABSOLUTE_URLS=false \
  --set MCP_SERVER_NAME=linear-mcp-server \
  --set MCP_SERVER_VERSION=1.0.0
```

### 3. Update API Keys

Replace placeholder API keys in all services:

**railway-mcp-server:**
```bash
railway variables --service railway-mcp-server --set API_KEY=YOUR_ACTUAL_RAILWAY_API_TOKEN
```

**notion-mcp-server:**
```bash
railway variables --service notion-mcp-server --set API_KEY=YOUR_ACTUAL_NOTION_INTEGRATION_TOKEN
```

**airtable-mcp-server:**
```bash
railway variables --service airtable-mcp-server --set API_KEY=YOUR_ACTUAL_AIRTABLE_API_KEY
```

**linear-mcp-server:**
```bash
railway variables --service linear-mcp-server --set API_KEY=YOUR_ACTUAL_LINEAR_API_KEY
```

### 4. Verify Deployments

After services are created and configured, verify each deployment:

```bash
# Check deployment status
railway status --service railway-mcp-server
railway status --service notion-mcp-server
railway status --service airtable-mcp-server
railway status --service linear-mcp-server

# Test health endpoints (once deployed)
curl https://railway-mcp-server.up.railway.app/health
curl https://notion-mcp-server.up.railway.app/health
curl https://airtable-mcp-server.up.railway.app/health
curl https://linear-mcp-server.up.railway.app/health
```

Expected response from each health endpoint:
```json
{"ok": true}
```

## Global Invariants Compliance

All MCP servers are configured to meet the global invariants:

✅ MCP transport: Streamable HTTP (stdio + HTTP health endpoint)
✅ Server listens on: 0.0.0.0:$PORT
✅ Health endpoint: /health returns {"ok": true}
✅ Dockerfile: Builds without modification
✅ No secrets in code: All secrets via environment variables
✅ Tool versioning: All tools prefixed with tools.v1.*
✅ Ping tool: Each server has callable tools.v1.ping

## Repository Information

- **GitHub:** https://github.com/MyMindVentures/Remote_MCP_Servers
- **Branch:** master
- **Last Commit:** Add watchPaths to railway.json services
- **Build Status:** All packages building successfully

## Environment Variables Summary

### Common to All Services
- PORT=3000
- NODE_ENV=production
- API_AUTH_HEADER=Authorization
- API_AUTH_PREFIX=Bearer
- API_TIMEOUT_S=30
- API_ALLOW_ABSOLUTE_URLS=false
- MCP_SERVER_NAME=[service-name]
- MCP_SERVER_VERSION=1.0.0

### Service-Specific

#### railway-mcp-server
- API_BASE_URL=https://backboard.railway.app/graphql/v2
- API_DEFAULT_HEADERS_JSON={"Content-Type":"application/json"}

#### notion-mcp-server
- API_BASE_URL=https://api.notion.com/v1
- API_DEFAULT_HEADERS_JSON={"Content-Type":"application/json","Notion-Version":"2022-06-28"}
- NOTION_VERSION=2022-06-28

#### airtable-mcp-server
- API_BASE_URL=https://api.airtable.com/v0
- API_DEFAULT_HEADERS_JSON={"Content-Type":"application/json"}
- AIRTABLE_BASE_ID=[your-base-id]

#### linear-mcp-server
- API_BASE_URL=https://api.linear.app/graphql
- API_DEFAULT_HEADERS_JSON={"Content-Type":"application/json"}

## Next Steps

1. **Manual Action Required:** Create airtable-mcp-server and linear-mcp-server in Railway dashboard
2. Configure environment variables for newly created services
3. Update all API_KEY placeholders with actual API tokens
4. Trigger deployments (should happen automatically after variable updates)
5. Verify health endpoints for all 4 services
6. Test MCP tools with MCP Inspector

## Technical Details

### Build Configuration
- **Builder:** DOCKERFILE
- **Node Version:** 20-alpine
- **Build Command:** npm ci && npm run build
- **Start Command:** npm start
- **Port:** 3000 (configurable via PORT env var)

### Dependencies
- fastmcp: ^3.25.4
- zod: ^3.22.4
- dotenv: ^16.4.1
- express: ^4.18.2
- typescript: ^5.3.3

## Troubleshooting

### Services Not Auto-Created
Railway does not automatically create services from railway.json. They must be created manually in the dashboard first, then Railway will use railway.json for build/deploy configuration.

### Build Failures
Check that:
1. Dockerfile paths are correct in railway.json
2. dockerContext points to correct package directory
3. All required files (package.json, tsconfig.json, src/) exist
4. Environment variables are set

### Health Endpoint Not Responding
1. Check deployment logs: `railway logs --service [service-name]`
2. Verify PORT environment variable is set
3. Ensure service is listening on 0.0.0.0 (not localhost)
4. Check for build/runtime errors in logs
