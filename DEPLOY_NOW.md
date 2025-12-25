# Deploy to Railway NOW! 🚀

Your code is ready and pushed to GitHub!

**Repository**: https://github.com/MyMindVentures/Remote_MCP_Servers

## Quick Deployment (5 minutes)

### Step 1: Open Railway Project
1. Go to: https://railway.app/project/Remote%20MCP%20Servers
2. Or visit: https://railway.app/dashboard
3. Click on "Remote MCP Servers" project

### Step 2: Add GitHub Repository Connection

1. Click **"New Service"** → **"GitHub Repo"**
2. Select **"MyMindVentures/Remote_MCP_Servers"**
3. Railway will detect the monorepo structure

### Step 3: Create Each Service

For **each** of the 4 servers, create a new service:

#### 🚂 Railway MCP Server

**Service Configuration:**
- Name: `railway-mcp-server`
- Root Directory: `packages/railway-mcp-server`
- Build Command: `npm run build`
- Start Command: `npm start`

**Environment Variables** (add in Railway UI):
```
NODE_ENV=production
API_BASE_URL=https://backboard.railway.app/graphql/v2
API_KEY=<YOUR_RAILWAY_API_TOKEN>
API_AUTH_HEADER=Authorization
API_AUTH_PREFIX=Bearer
API_DEFAULT_HEADERS_JSON={"Content-Type":"application/json"}
API_TIMEOUT_S=30
API_ALLOW_ABSOLUTE_URLS=false
MCP_SERVER_NAME=railway-mcp-server
MCP_SERVER_VERSION=1.0.0
RAILWAY_PROJECT_ID=<YOUR_PROJECT_ID>
RAILWAY_ENVIRONMENT_ID=<YOUR_ENV_ID>
```

**Get Railway API Token**: https://railway.app/account/tokens

---

#### 📝 Notion MCP Server

**Service Configuration:**
- Name: `notion-mcp-server`
- Root Directory: `packages/notion-mcp-server`
- Build Command: `npm run build`
- Start Command: `npm start`

**Environment Variables**:
```
NODE_ENV=production
API_BASE_URL=https://api.notion.com/v1
API_KEY=<YOUR_NOTION_TOKEN>
API_AUTH_HEADER=Authorization
API_AUTH_PREFIX=Bearer
API_DEFAULT_HEADERS_JSON={"Content-Type":"application/json","Notion-Version":"2022-06-28"}
API_TIMEOUT_S=30
API_ALLOW_ABSOLUTE_URLS=false
MCP_SERVER_NAME=notion-mcp-server
MCP_SERVER_VERSION=1.0.0
NOTION_VERSION=2022-06-28
```

**Get Notion Token**: https://www.notion.so/my-integrations

---

#### 📊 Airtable MCP Server

**Service Configuration:**
- Name: `airtable-mcp-server`
- Root Directory: `packages/airtable-mcp-server`
- Build Command: `npm run build`
- Start Command: `npm start`

**Environment Variables**:
```
NODE_ENV=production
API_BASE_URL=https://api.airtable.com/v0
API_KEY=<YOUR_AIRTABLE_KEY>
API_AUTH_HEADER=Authorization
API_AUTH_PREFIX=Bearer
API_DEFAULT_HEADERS_JSON={"Content-Type":"application/json"}
API_TIMEOUT_S=30
API_ALLOW_ABSOLUTE_URLS=false
MCP_SERVER_NAME=airtable-mcp-server
MCP_SERVER_VERSION=1.0.0
AIRTABLE_BASE_ID=<YOUR_BASE_ID>
```

**Get Airtable Key**: https://airtable.com/account

---

#### 🎯 Linear MCP Server

**Service Configuration:**
- Name: `linear-mcp-server`
- Root Directory: `packages/linear-mcp-server`
- Build Command: `npm run build`
- Start Command: `npm start`

**Environment Variables**:
```
NODE_ENV=production
API_BASE_URL=https://api.linear.app/graphql
API_KEY=<YOUR_LINEAR_KEY>
API_AUTH_HEADER=Authorization
API_AUTH_PREFIX=Bearer
API_DEFAULT_HEADERS_JSON={"Content-Type":"application/json"}
API_TIMEOUT_S=30
API_ALLOW_ABSOLUTE_URLS=false
MCP_SERVER_NAME=linear-mcp-server
MCP_SERVER_VERSION=1.0.0
```

**Get Linear Key**: https://linear.app/settings/api

---

## Step 4: Deploy!

Once you add each service with environment variables, Railway will:

1. ✅ Auto-detect the Dockerfile
2. ✅ Build each service independently
3. ✅ Deploy to a public URL
4. ✅ Monitor health checks

## Step 5: Verify Deployments

Wait ~3-5 minutes for builds to complete, then test each service:

```bash
# Railway MCP Server
curl https://<railway-service-url>.railway.app/health

# Notion MCP Server
curl https://<notion-service-url>.railway.app/health

# Airtable MCP Server
curl https://<airtable-service-url>.railway.app/health

# Linear MCP Server
curl https://<linear-service-url>.railway.app/health
```

All should return: `{"ok":true}`

---

## What's Deployed?

✅ **4 Production MCP Servers**
✅ **All Global Invariants Met**
✅ **Health Endpoints Working**
✅ **Auto-Deploy on Git Push**

### Standard Tools Available:
- `tools.v1.ping` - Health check
- `tools.v1.api_get` - GET requests
- `tools.v1.api_post` - POST requests
- `tools.v1.api_patch` - PATCH requests
- `tools.v1.api_delete` - DELETE requests
- `tools.v1.api_request` - Generic HTTP

---

## Next Steps

### Use Your MCP Servers:

1. **Connect MCP Inspector** to test tools locally
2. **Integrate with AI Assistants** (Claude, GPT, etc.)
3. **Build Workflows** using MCP tools

### Monitor:
- Check Railway dashboard for logs
- Review health check status
- Monitor API usage

### Update:
```bash
# Make changes to code
git add .
git commit -m "Update servers"
git push

# Railway auto-deploys!
```

---

## Troubleshooting

**Service won't build?**
- Check build logs in Railway
- Verify root directory is correct
- Ensure all dependencies install

**Health check failing?**
- Check environment variables are set
- Review startup logs
- Verify PORT binding

**Need help?**
- See: `RAILWAY_SETUP.md` for detailed guide
- See: `DEPLOYMENT_CHECKLIST.md` for validation
- Check Railway docs: https://docs.railway.app

---

🎉 **Your Remote MCP Servers are ready to deploy!**

**GitHub Repo**: https://github.com/MyMindVentures/Remote_MCP_Servers
**Railway Project**: https://railway.app/project/Remote%20MCP%20Servers
