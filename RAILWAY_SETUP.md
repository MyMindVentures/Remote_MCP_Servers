# Railway Deployment Setup

This document explains how to deploy the Remote MCP Servers monorepo to Railway.

## Prerequisites

- Railway account
- Railway CLI (optional, for local testing)
- Git repository connected to Railway

## Railway Project Setup

### 1. Create Railway Project

1. Go to [Railway](https://railway.app)
2. Create a new project named "Remote MCP Servers"
3. Connect your GitHub repository

### 2. Configure Services

Railway will detect the monorepo structure. For each MCP server package, create a separate service:

#### Service Configuration Template

For each service (e.g., `railway-mcp-server`):

1. **Create New Service**
   - Click "New Service"
   - Select "From Monorepo"
   - Choose the package directory (e.g., `packages/railway-mcp-server`)

2. **Build Settings**
   - **Root Directory**: `packages/<server-name>`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Dockerfile Path**: `Dockerfile` (in package directory)

3. **Environment Variables**

   Set these in the Railway UI for each service:

   ```
   PORT=<provided by Railway automatically>
   NODE_ENV=production

   # API Configuration (customize per service)
   API_BASE_URL=<service-specific-api-url>
   API_KEY=<service-api-key>
   API_AUTH_HEADER=Authorization
   API_AUTH_PREFIX=Bearer
   API_DEFAULT_HEADERS_JSON={"Content-Type":"application/json"}
   API_TIMEOUT_S=30
   API_ALLOW_ABSOLUTE_URLS=false

   # MCP Server Configuration
   MCP_SERVER_NAME=<service-name>
   MCP_SERVER_VERSION=1.0.0
   ```

4. **Health Check**
   - **Path**: `/health`
   - **Interval**: 30 seconds
   - **Timeout**: 10 seconds

5. **Deployment**
   - Railway will auto-deploy on pushes to `main` branch
   - Each service deploys independently

## Service-Specific Configurations

### Railway MCP Server

```env
API_BASE_URL=https://backboard.railway.app/graphql/v2
API_KEY=<your-railway-api-token>
API_AUTH_HEADER=Authorization
API_AUTH_PREFIX=Bearer
MCP_SERVER_NAME=railway-mcp-server
```

**Additional Variables**:
- `RAILWAY_PROJECT_ID` - Your Railway project ID
- `RAILWAY_ENVIRONMENT_ID` - Your Railway environment ID (optional)

### Notion MCP Server

```env
API_BASE_URL=https://api.notion.com/v1
API_KEY=<your-notion-integration-token>
API_AUTH_HEADER=Authorization
API_AUTH_PREFIX=Bearer
MCP_SERVER_NAME=notion-mcp-server
```

**Additional Variables**:
- `NOTION_VERSION=2022-06-28` - Notion API version

### Airtable MCP Server

```env
API_BASE_URL=https://api.airtable.com/v0
API_KEY=<your-airtable-api-key>
API_AUTH_HEADER=Authorization
API_AUTH_PREFIX=Bearer
MCP_SERVER_NAME=airtable-mcp-server
```

**Additional Variables**:
- `AIRTABLE_BASE_ID` - Default base ID (optional)

### Linear MCP Server

```env
API_BASE_URL=https://api.linear.app/graphql
API_KEY=<your-linear-api-key>
API_AUTH_HEADER=Authorization
API_AUTH_PREFIX=Bearer
MCP_SERVER_NAME=linear-mcp-server
```

## Deployment Workflow

### Automatic Deployment

1. Push code to `main` branch
2. Railway automatically detects changes
3. Affected services are rebuilt
4. Services are deployed with health checks
5. Public URLs are updated

### Manual Deployment

Using Railway CLI:

```bash
# Login to Railway
railway login

# Link to project
railway link

# Deploy specific service
railway up --service railway-mcp-server
```

## Validation Checklist

### Pre-Deploy Validation

- [ ] Dockerfile builds locally: `docker build -t test packages/<server-name>`
- [ ] TypeScript compiles: `npm run build`
- [ ] No secrets in code
- [ ] All environment variables defined in `.env.example`
- [ ] Health endpoint works: `/health` returns `{ "ok": true }`

### Post-Deploy Validation

- [ ] Service responds on Railway public URL
- [ ] `/health` endpoint returns 200
- [ ] MCP tools discoverable via stdio
- [ ] `tools.v1.ping` tool succeeds
- [ ] No errors in Railway logs

## Monitoring

### Railway Dashboard

- **Deployments**: View deployment history and status
- **Metrics**: CPU, memory, network usage
- **Logs**: Real-time logs from all services
- **Events**: Deployment events and health check results

### Health Checks

Railway automatically monitors the `/health` endpoint:
- **Success**: Service is healthy
- **Failure**: Service is restarted automatically
- **Repeated Failures**: Deployment may be rolled back

## Troubleshooting

### Service Won't Start

1. Check Railway logs for errors
2. Verify all environment variables are set
3. Check Dockerfile builds locally
4. Verify `PORT` is being read from environment

### Health Check Failing

1. Verify `/health` endpoint is accessible
2. Check server is binding to `0.0.0.0:$PORT`
3. Verify timeout settings (server should respond in < 10s)
4. Check Railway logs for startup errors

### Environment Variable Issues

1. Verify all required vars are set in Railway UI
2. Check variable names match exactly (case-sensitive)
3. Restart service after adding/changing variables
4. Check for JSON parsing errors in `API_DEFAULT_HEADERS_JSON`

### Build Failures

1. Check Dockerfile syntax
2. Verify dependencies install correctly
3. Check TypeScript compilation errors
4. Verify root directory is set correctly in Railway

## Scaling

### Horizontal Scaling

Each service can be scaled independently:

1. Go to service settings
2. Adjust "Number of Replicas"
3. Save changes
4. Railway will deploy additional instances

### Resource Limits

Configure per service:

- **Memory**: Allocate based on service needs
- **CPU**: Allocate based on request volume
- **Restarts**: Configure restart policy for failures

## Custom Domains

To add custom domains:

1. Go to service settings
2. Click "Add Domain"
3. Enter your custom domain
4. Update DNS records as instructed
5. Railway provisions SSL automatically

## Cost Optimization

- **Shared Resources**: Use Railway's shared resources for dev/staging
- **Sleep Policies**: Configure services to sleep when inactive (if applicable)
- **Resource Limits**: Set appropriate limits to avoid overages
- **Monitoring**: Use metrics to right-size resources

## Security

### Secrets Management

- **Never** commit secrets to git
- Use Railway's environment variables for all secrets
- Mark sensitive variables as "sensitive" in Railway UI
- Rotate API keys periodically

### Network Security

- Railway provides HTTPS by default
- Services are isolated by default
- Use Railway's private networking for inter-service communication

## Support

- **Railway Documentation**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **MCP Documentation**: https://modelcontextprotocol.io
