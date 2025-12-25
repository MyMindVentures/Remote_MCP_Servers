# Quick Railway Deployment Guide

Follow these steps to deploy all 4 MCP servers to Railway in under 10 minutes.

## Prerequisites

✅ Railway account (sign up at [railway.app](https://railway.app))
✅ This code pushed to GitHub repository
✅ API keys for each service (Railway, Notion, Airtable, Linear)

## Step 1: Create Railway Project (2 minutes)

1. **Go to Railway**: https://railway.app
2. **Click "New Project"**
3. **Select "Deploy from GitHub repo"**
4. **Choose this repository**: `remote-mcp-servers`
5. **Name the project**: "Remote MCP Servers"

## Step 2: Deploy Railway MCP Server (2 minutes)

### Create Service
1. In your Railway project, click **"New Service"**
2. Select **"GitHub Repo"** → Choose your repo
3. Click **"Add variables"** or go to service settings

### Configure Service
**Settings → Service Settings:**
- **Root Directory**: `packages/railway-mcp-server`
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

### Set Environment Variables
**Settings → Variables:**
```
NODE_ENV=production
API_BASE_URL=https://backboard.railway.app/graphql/v2
API_KEY=<your-railway-api-token>
API_AUTH_HEADER=Authorization
API_AUTH_PREFIX=Bearer
API_DEFAULT_HEADERS_JSON={"Content-Type":"application/json"}
API_TIMEOUT_S=30
API_ALLOW_ABSOLUTE_URLS=false
MCP_SERVER_NAME=railway-mcp-server
MCP_SERVER_VERSION=1.0.0
RAILWAY_PROJECT_ID=<your-project-id>
RAILWAY_ENVIRONMENT_ID=<your-environment-id>
```

**Get Your Railway API Token:**
- Go to: https://railway.app/account/tokens
- Click "Create Token"
- Copy and paste as `API_KEY`

### Deploy
1. Railway will **auto-deploy** after setting variables
2. Wait for build to complete (~2 minutes)
3. Check logs for: "Health check server listening on 0.0.0.0:XXXX"

### Verify
```bash
curl https://<your-railway-url>/health
# Should return: {"ok":true}
```

---

## Step 3: Deploy Notion MCP Server (2 minutes)

### Create Service
1. Click **"New Service"** in your project
2. Select **"GitHub Repo"** → Choose your repo

### Configure Service
**Settings → Service Settings:**
- **Root Directory**: `packages/notion-mcp-server`
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

### Set Environment Variables
**Settings → Variables:**
```
NODE_ENV=production
API_BASE_URL=https://api.notion.com/v1
API_KEY=<your-notion-integration-token>
API_AUTH_HEADER=Authorization
API_AUTH_PREFIX=Bearer
API_DEFAULT_HEADERS_JSON={"Content-Type":"application/json","Notion-Version":"2022-06-28"}
API_TIMEOUT_S=30
API_ALLOW_ABSOLUTE_URLS=false
MCP_SERVER_NAME=notion-mcp-server
MCP_SERVER_VERSION=1.0.0
NOTION_VERSION=2022-06-28
```

**Get Your Notion Integration Token:**
- Go to: https://www.notion.so/my-integrations
- Click "New integration"
- Copy "Internal Integration Token"
- Paste as `API_KEY`

### Deploy & Verify
Railway auto-deploys. Check: `curl https://<your-notion-service-url>/health`

---

## Step 4: Deploy Airtable MCP Server (2 minutes)

### Create Service
1. Click **"New Service"** in your project
2. Select **"GitHub Repo"** → Choose your repo

### Configure Service
**Settings → Service Settings:**
- **Root Directory**: `packages/airtable-mcp-server`
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

### Set Environment Variables
**Settings → Variables:**
```
NODE_ENV=production
API_BASE_URL=https://api.airtable.com/v0
API_KEY=<your-airtable-api-key>
API_AUTH_HEADER=Authorization
API_AUTH_PREFIX=Bearer
API_DEFAULT_HEADERS_JSON={"Content-Type":"application/json"}
API_TIMEOUT_S=30
API_ALLOW_ABSOLUTE_URLS=false
MCP_SERVER_NAME=airtable-mcp-server
MCP_SERVER_VERSION=1.0.0
AIRTABLE_BASE_ID=<your-base-id>
```

**Get Your Airtable API Key:**
- Go to: https://airtable.com/account
- Scroll to "API" section
- Copy "Personal Access Token"
- Paste as `API_KEY`

### Deploy & Verify
Railway auto-deploys. Check: `curl https://<your-airtable-service-url>/health`

---

## Step 5: Deploy Linear MCP Server (2 minutes)

### Create Service
1. Click **"New Service"** in your project
2. Select **"GitHub Repo"** → Choose your repo

### Configure Service
**Settings → Service Settings:**
- **Root Directory**: `packages/linear-mcp-server`
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

### Set Environment Variables
**Settings → Variables:**
```
NODE_ENV=production
API_BASE_URL=https://api.linear.app/graphql
API_KEY=<your-linear-api-key>
API_AUTH_HEADER=Authorization
API_AUTH_PREFIX=Bearer
API_DEFAULT_HEADERS_JSON={"Content-Type":"application/json"}
API_TIMEOUT_S=30
API_ALLOW_ABSOLUTE_URLS=false
MCP_SERVER_NAME=linear-mcp-server
MCP_SERVER_VERSION=1.0.0
```

**Get Your Linear API Key:**
- Go to: https://linear.app/settings/api
- Click "Create new API key"
- Copy the key
- Paste as `API_KEY`

### Deploy & Verify
Railway auto-deploys. Check: `curl https://<your-linear-service-url>/health`

---

## Final Verification (1 minute)

### Check All Services are Healthy

```bash
# Railway MCP Server
curl https://<railway-service>.railway.app/health

# Notion MCP Server
curl https://<notion-service>.railway.app/health

# Airtable MCP Server
curl https://<airtable-service>.railway.app/health

# Linear MCP Server
curl https://<linear-service>.railway.app/health
```

All should return: `{"ok":true}`

### Check Railway Dashboard
- All 4 services should show **"Active"** status
- No errors in logs
- Health checks passing

---

## Using Your MCP Servers

Each server is now accessible via:

### Public URLs (HTTP Health)
```
https://<service-name>.railway.app/health
```

### MCP via Stdio (for AI Assistants)
The servers run stdio transport for MCP protocol. To use them:

1. **Connect via SSH to Railway service**
2. **Or use Railway's API** to interact with MCP protocol

### Available Tools (All Servers)
- `tools.v1.ping` - Health check
- `tools.v1.api_get` - GET requests
- `tools.v1.api_post` - POST requests
- `tools.v1.api_patch` - PATCH requests
- `tools.v1.api_delete` - DELETE requests
- `tools.v1.api_request` - Generic HTTP

---

## Troubleshooting

### Service Won't Start
1. **Check logs** in Railway UI
2. **Verify all environment variables** are set
3. **Check build succeeded** (look for TypeScript errors)

### Health Check Failing
1. **Verify PORT** is not hardcoded in service
2. **Check server binds to 0.0.0.0** (not localhost)
3. **Review startup logs** for errors

### Build Failures
1. **Check TypeScript errors** in build logs
2. **Verify root directory** is correct: `packages/<service-name>`
3. **Ensure dependencies installed** (Railway auto-installs)

### Environment Variable Issues
1. **Verify all required variables** are in Railway UI
2. **Check for typos** in variable names (case-sensitive)
3. **Restart service** after adding/changing variables

---

## Cost Estimate

Railway offers:
- **$5/month** of free credits
- Each service uses minimal resources (~100MB RAM)
- Estimated cost: **$0-10/month** for all 4 services

---

## What's Next?

✅ **All 4 MCP servers deployed**
✅ **Health checks passing**
✅ **Ready to use with AI assistants**

### Advanced Usage
- Connect MCP Inspector to test tools
- Use with Claude, GPT, or other AI assistants
- Build custom workflows with MCP tools

### Monitoring
- Check Railway dashboard daily
- Review logs for errors
- Monitor API rate limits

### Maintenance
- Rotate API keys monthly
- Update dependencies quarterly
- Review Railway costs monthly

---

**Deployment Complete! 🚀**

Your Remote MCP Servers are now live on Railway!
