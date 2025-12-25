# Template MCP Server

This is a template for creating Model Context Protocol (MCP) servers that can be deployed to Railway.

## Features

- ✅ **Global Invariants Compliance**:
  - Streamable HTTP transport (MCP via stdio + HTTP health endpoint)
  - Listens on `0.0.0.0:$PORT`
  - `/health` endpoint returns `{ "ok": true }`
  - Dockerfile builds without modification
  - No secrets in code (all via environment variables)
  - Versioned tools (`tools.v1.*`)
  - Ping tool for health validation

- **Standard Tools**:
  - `tools.v1.ping` - Health check
  - `tools.v1.api_get` - GET requests
  - `tools.v1.api_post` - POST requests
  - `tools.v1.api_patch` - PATCH requests
  - `tools.v1.api_delete` - DELETE requests
  - `tools.v1.api_request` - Generic HTTP requests

- **Resources**:
  - `config://settings` - Server configuration

- **Prompts**:
  - `api-help` - API usage help

## Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your environment variables in `.env`

3. Install dependencies:
   ```bash
   npm install
   ```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Production

```bash
npm start
```

## Environment Variables

All required environment variables are listed in `.env.example`:

- `PORT` - Server port (provided by Railway)
- `API_BASE_URL` - Base URL for API requests
- `API_KEY` - API authentication key
- `API_AUTH_HEADER` - Header name for auth (e.g., "Authorization")
- `API_AUTH_PREFIX` - Prefix for auth value (e.g., "Bearer")
- `API_DEFAULT_HEADERS_JSON` - Default headers as JSON string
- `API_TIMEOUT_S` - Request timeout in seconds
- `API_ALLOW_ABSOLUTE_URLS` - Allow absolute URLs (true/false)
- `MCP_SERVER_NAME` - Name of the MCP server
- `MCP_SERVER_VERSION` - Version of the MCP server

## Testing

Use MCP Inspector to test locally:

1. Start the server: `npm run dev`
2. Connect MCP Inspector to stdio transport
3. Test tools, resources, and prompts

## Deployment to Railway

1. Configure environment variables in Railway UI
2. Railway will automatically:
   - Build the Dockerfile
   - Start the server on `$PORT`
   - Expose the service on a public URL

## Creating a New MCP Server

1. Copy this template directory to a new package:
   ```bash
   cp -r packages/template-mcp-server packages/my-new-server
   ```

2. Update `package.json`:
   - Change `name` to `@remote-mcp/my-new-server`
   - Update `description`

3. Customize `src/index.ts`:
   - Add your custom tools
   - Add your custom resources
   - Add your custom prompts

4. Update `.env.example` with any new environment variables

5. Test locally with MCP Inspector

6. Add to Railway configuration in root `railway.json`
