# ✅ COMPLETE Railway Deployment Guide

## Current Status

### ✅ Completed:
- FastMCP framework implemented (v3.25.4)
- All 4 servers built and tested
- Code pushed to GitHub: https://github.com/MyMindVentures/Remote_MCP_Servers
- railway-mcp-server service exists and configured (needs API_KEY)

### ⏳ Remaining:
- Create 3 additional services (Notion, Airtable, Linear)
- Add API keys for all services
- Deploy and verify

---

## Step-by-Step Deployment (15 minutes)

### Step 1: Open Railway Dashboard (1 min)

1. Go to: https://railway.app/project/d83f78bd-25a9-4f1f-a10d-20591819ecf8
2. You should see "Remote MCP Servers" project
3. Currently has: **railway-mcp-server** (failed - needs API_KEY)

---

### Step 2: Fix Railway MCP Server (3 min)

**Service**: railway-mcp-server (already exists)

1. Click on "railway-mcp-server" service
2. Go to "Variables" tab
3. Find `API_KEY` variable
4. Click "Edit"
5. **Get your Railway API token**:
   - Open new tab: https://railway.app/account/tokens
   - Click "Create Token"
   - Name it: "MCP Server Access"
   - Copy the token
6. Paste token as `API_KEY` value
7. **Save**

Railway will auto-deploy the service!

**Expected Result**: Service builds and deploys successfully

---

### Step 3: Create Notion MCP Server (3 min)

1. In Railway project, click **"New Service"**
2. Select **"GitHub Repo"**
3. Choose: **MyMindVentures/Remote_MCP_Servers**
4. Railway detects it's a monorepo

**Configure Service**:
- **Service Name**: `notion-mcp-server`
- **Root Directory**: `packages/notion-mcp-server`
- **Build Command**: (auto-detected) `npm run build`
- **Start Command**: (auto-detected) `npm start`

**Add Environment Variables**:

Click "Variables" tab and add these:

```
NODE_ENV=production
API_BASE_URL=https://api.notion.com/v1
API_KEY=<GET_FROM_NOTION>
API_AUTH_HEADER=Authorization
API_AUTH_PREFIX=Bearer
API_DEFAULT_HEADERS_JSON={"Content-Type":"application/json","Notion-Version":"2022-06-28"}
API_TIMEOUT_S=30
API_ALLOW_ABSOLUTE_URLS=false
MCP_SERVER_NAME=notion-mcp-server
MCP_SERVER_VERSION=1.0.0
NOTION_VERSION=2022-06-28
```

**Get Notion API Token**:
1. Open: https://www.notion.so/my-integrations
2. Click "+ New integration"
3. Name: "MCP Server"
4. Select workspace
5. Click "Submit"
6. Copy "Internal Integration Token"
7. Paste as `API_KEY` in Railway

**Save and Deploy!**

---

### Step 4: Create Airtable MCP Server (3 min)

1. Click **"New Service"** → **"GitHub Repo"**
2. Choose: **MyMindVentures/Remote_MCP_Servers**

**Configure Service**:
- **Service Name**: `airtable-mcp-server`
- **Root Directory**: `packages/airtable-mcp-server`

**Add Environment Variables**:

```
NODE_ENV=production
API_BASE_URL=https://api.airtable.com/v0
API_KEY=<GET_FROM_AIRTABLE>
API_AUTH_HEADER=Authorization
API_AUTH_PREFIX=Bearer
API_DEFAULT_HEADERS_JSON={"Content-Type":"application/json"}
API_TIMEOUT_S=30
API_ALLOW_ABSOLUTE_URLS=false
MCP_SERVER_NAME=airtable-mcp-server
MCP_SERVER_VERSION=1.0.0
AIRTABLE_BASE_ID=<YOUR_BASE_ID>
```

**Get Airtable API Key**:
1. Open: https://airtable.com/account
2. Scroll to "API" section
3. Click "Generate API key" or copy existing
4. Paste as `API_KEY` in Railway
5. Get base ID from your Airtable base URL
6. Paste as `AIRTABLE_BASE_ID`

**Save and Deploy!**

---

### Step 5: Create Linear MCP Server (3 min)

1. Click **"New Service"** → **"GitHub Repo"**
2. Choose: **MyMindVentures/Remote_MCP_Servers**

**Configure Service**:
- **Service Name**: `linear-mcp-server`
- **Root Directory**: `packages/linear-mcp-server`

**Add Environment Variables**:

```
NODE_ENV=production
API_BASE_URL=https://api.linear.app/graphql
API_KEY=<GET_FROM_LINEAR>
API_AUTH_HEADER=Authorization
API_AUTH_PREFIX=Bearer
API_DEFAULT_HEADERS_JSON={"Content-Type":"application/json"}
API_TIMEOUT_S=30
API_ALLOW_ABSOLUTE_URLS=false
MCP_SERVER_NAME=linear-mcp-server
MCP_SERVER_VERSION=1.0.0
```

**Get Linear API Key**:
1. Open: https://linear.app/settings/api
2. Click "Create new API key"
3. Name: "MCP Server"
4. Select scopes: `read`, `write`
5. Click "Create key"
6. Copy the key
7. Paste as `API_KEY` in Railway

**Save and Deploy!**

---

### Step 6: Verify All Deployments (2 min)

Once all services are deployed, verify they're healthy:

#### Check Railway Dashboard:

All 4 services should show:
- ✅ **Status**: Active (green)
- ✅ **Health Check**: Passing
- ✅ **Latest Deployment**: Successful

#### Test Health Endpoints:

Each service gets a public URL. Test them:

```bash
# Railway MCP Server
curl https://<railway-service>.up.railway.app/health
# Should return: {"ok":true}

# Notion MCP Server
curl https://<notion-service>.up.railway.app/health
# Should return: {"ok":true}

# Airtable MCP Server
curl https://<airtable-service>.up.railway.app/health
# Should return: {"ok":true}

# Linear MCP Server
curl https://<linear-service>.up.railway.app/health
# Should return: {"ok":true}
```

Find the URLs in Railway dashboard under each service → "Settings" → "Domains"

---

## Alternative: Using Railway CLI

If you prefer CLI, here's the complete command sequence:

```bash
# Make sure you're in the project directory
cd D:/GitHub_Local_Repos/Remote_MCP_Servers

# Link to Railway project
railway link --project "Remote MCP Servers"

# Create and configure Notion service
railway add --service notion-mcp-server --repo MyMindVentures/Remote_MCP_Servers
# (Follow interactive prompts)

# Repeat for Airtable and Linear
railway add --service airtable-mcp-server --repo MyMindVentures/Remote_MCP_Servers
railway add --service linear-mcp-server --repo MyMindVentures/Remote_MCP_Servers
```

Then configure variables for each:

```bash
# Notion
railway variables --service notion-mcp-server \
  --set "NODE_ENV=production" \
  --set "API_BASE_URL=https://api.notion.com/v1" \
  --set "API_KEY=<your-notion-token>" \
  # ... (add all variables from Step 3)

# Airtable
railway variables --service airtable-mcp-server \
  --set "NODE_ENV=production" \
  --set "API_BASE_URL=https://api.airtable.com/v0" \
  --set "API_KEY=<your-airtable-key>" \
  # ... (add all variables from Step 4)

# Linear
railway variables --service linear-mcp-server \
  --set "NODE_ENV=production" \
  --set "API_BASE_URL=https://api.linear.app/graphql" \
  --set "API_KEY=<your-linear-key>" \
  # ... (add all variables from Step 5)
```

---

## What Happens After Deployment?

### Automatic Railway Actions:

1. **Detects changes** - Railway monitors GitHub repo
2. **Builds Docker image** - Uses Dockerfile in each package
3. **Runs health checks** - Monitors `/health` endpoint
4. **Assigns public URL** - Each service gets HTTPS URL
5. **Auto-restarts on failure** - Self-healing deployment

### Each Service Provides:

**MCP Tools** (via stdio):
- `tools.v1.ping` - Health check
- `tools.v1.api_get` - GET requests to API
- `tools.v1.api_post` - POST requests
- `tools.v1.api_patch` - PATCH requests
- `tools.v1.api_delete` - DELETE requests
- `tools.v1.api_request` - Generic HTTP

**HTTP Endpoints**:
- `/health` - Returns `{"ok":true}` (for Railway health checks)

**MCP Resources**:
- `config://settings` - Server configuration

**MCP Prompts**:
- `api-help` - Usage instructions

---

## Troubleshooting

### Service fails to build?
**Check**: Build logs in Railway UI
**Fix**: Ensure root directory is correct (`packages/<service-name>`)

### Health check failing?
**Check**: Service logs for errors
**Fix**: Verify all environment variables are set
**Common issue**: Missing `API_KEY`

### Can't connect to API?
**Check**: `API_KEY` is valid
**Fix**: Regenerate API token and update in Railway

### Service keeps restarting?
**Check**: Logs for crash reason
**Common causes**:
- Missing environment variables
- Invalid API credentials
- Port binding issues (should be `0.0.0.0:$PORT`)

---

## Cost Estimate

Railway pricing (as of Dec 2025):
- **Free tier**: $5/month credits
- **Hobby plan**: $5/month + usage
- **Pro plan**: $20/month + usage

**Estimated monthly cost** for 4 services:
- Each service: ~100MB RAM, minimal CPU
- **Total**: $0-15/month depending on usage

---

## Next Steps After Deployment

### 1. Test with MCP Inspector

```bash
npx @modelcontextprotocol/inspector
```

Connect to each service's stdio transport to test tools.

### 2. Integrate with AI Assistants

Configure your AI assistant (Claude, GPT, etc.) to use the deployed MCP servers.

### 3. Monitor Performance

- Check Railway metrics dashboard
- Review logs regularly
- Monitor API rate limits

### 4. Add Custom Tools

Each server is a FastMCP template - add custom tools as needed!

---

## Quick Reference

### Important URLs:
- **Railway Dashboard**: https://railway.app/project/d83f78bd-25a9-4f1f-a10d-20591819ecf8
- **GitHub Repo**: https://github.com/MyMindVentures/Remote_MCP_Servers
- **Railway Tokens**: https://railway.app/account/tokens
- **Notion Integrations**: https://www.notion.so/my-integrations
- **Airtable Account**: https://airtable.com/account
- **Linear API**: https://linear.app/settings/api

### Environment Variables Template:
See individual steps above for complete variable lists.

### Health Check Endpoints:
- Railway: `https://<service-url>.up.railway.app/health`
- Notion: `https://<service-url>.up.railway.app/health`
- Airtable: `https://<service-url>.up.railway.app/health`
- Linear: `https://<service-url>.up.railway.app/health`

---

🎉 **You're ready to deploy all 4 Remote MCP Servers to Railway!**

Follow the steps above, and you'll have production-ready MCP servers running in ~15 minutes.
