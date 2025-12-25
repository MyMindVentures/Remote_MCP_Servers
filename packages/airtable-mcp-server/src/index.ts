import { FastMCP } from 'fastmcp';
import { z } from 'zod';
import dotenv from 'dotenv';
import express from 'express';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'PORT',
  'API_BASE_URL',
  'API_KEY',
  'API_AUTH_HEADER',
  'API_AUTH_PREFIX',
  'API_TIMEOUT_S',
  'MCP_SERVER_NAME',
  'MCP_SERVER_VERSION',
];

const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars.join(', '));
  process.exit(1);
}

const PORT = parseInt(process.env.PORT || '3000', 10);
const API_BASE_URL = process.env.API_BASE_URL!;
const API_KEY = process.env.API_KEY!;
const API_AUTH_HEADER = process.env.API_AUTH_HEADER!;
const API_AUTH_PREFIX = process.env.API_AUTH_PREFIX!;
const API_TIMEOUT_S = parseInt(process.env.API_TIMEOUT_S || '30', 10);
const API_ALLOW_ABSOLUTE_URLS = process.env.API_ALLOW_ABSOLUTE_URLS === 'true';
const MCP_SERVER_NAME = process.env.MCP_SERVER_NAME!;
const MCP_SERVER_VERSION = process.env.MCP_SERVER_VERSION!;

// Parse default headers
let API_DEFAULT_HEADERS: Record<string, string> = {};
try {
  if (process.env.API_DEFAULT_HEADERS_JSON) {
    API_DEFAULT_HEADERS = JSON.parse(process.env.API_DEFAULT_HEADERS_JSON) as Record<
      string,
      string
    >;
  }
} catch (error) {
  console.error('Failed to parse API_DEFAULT_HEADERS_JSON:', error);
  process.exit(1);
}

// Create FastMCP server instance
const server = new FastMCP({
  name: MCP_SERVER_NAME,
  version: '1.0.0',
});

// Tool: v1.ping - Health check tool
server.addTool({
  name: 'tools.v1.ping',
  description: 'Health check tool that validates server is responding',
  parameters: z.object({}),
  execute: async () => {
    return JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      server: MCP_SERVER_NAME,
      version: MCP_SERVER_VERSION,
    });
  },
});

// Tool: v1.api_get - GET requests
server.addTool({
  name: 'tools.v1.api_get',
  description: 'Make a GET request to the configured API',
  parameters: z.object({
    endpoint: z.string().describe('API endpoint path (relative to API_BASE_URL)'),
    headers: z
      .record(z.string())
      .optional()
      .describe('Additional headers to include'),
  }),
  execute: async (args) => {
    return await makeApiRequest('GET', args.endpoint, undefined, args.headers);
  },
});

// Tool: v1.api_post - POST requests
server.addTool({
  name: 'tools.v1.api_post',
  description: 'Make a POST request to the configured API',
  parameters: z.object({
    endpoint: z.string().describe('API endpoint path (relative to API_BASE_URL)'),
    body: z.any().describe('Request body'),
    headers: z
      .record(z.string())
      .optional()
      .describe('Additional headers to include'),
  }),
  execute: async (args) => {
    return await makeApiRequest('POST', args.endpoint, args.body, args.headers);
  },
});

// Tool: v1.api_patch - PATCH requests
server.addTool({
  name: 'tools.v1.api_patch',
  description: 'Make a PATCH request to the configured API',
  parameters: z.object({
    endpoint: z.string().describe('API endpoint path (relative to API_BASE_URL)'),
    body: z.any().describe('Request body'),
    headers: z
      .record(z.string())
      .optional()
      .describe('Additional headers to include'),
  }),
  execute: async (args) => {
    return await makeApiRequest('PATCH', args.endpoint, args.body, args.headers);
  },
});

// Tool: v1.api_delete - DELETE requests
server.addTool({
  name: 'tools.v1.api_delete',
  description: 'Make a DELETE request to the configured API',
  parameters: z.object({
    endpoint: z.string().describe('API endpoint path (relative to API_BASE_URL)'),
    headers: z
      .record(z.string())
      .optional()
      .describe('Additional headers to include'),
  }),
  execute: async (args) => {
    return await makeApiRequest('DELETE', args.endpoint, undefined, args.headers);
  },
});

// Tool: v1.api_request - Generic HTTP request
server.addTool({
  name: 'tools.v1.api_request',
  description: 'Make a generic HTTP request to the configured API',
  parameters: z.object({
    method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']).describe('HTTP method'),
    endpoint: z.string().describe('API endpoint path (relative to API_BASE_URL)'),
    body: z.any().optional().describe('Request body (for POST, PUT, PATCH)'),
    headers: z
      .record(z.string())
      .optional()
      .describe('Additional headers to include'),
  }),
  execute: async (args) => {
    return await makeApiRequest(args.method, args.endpoint, args.body, args.headers);
  },
});

// Add resource for server configuration
server.addResource({
  uri: 'config://settings',
  name: 'Server Configuration',
  description: 'Current server configuration and settings',
  mimeType: 'application/json',
  load: async () => {
    return {
      text: JSON.stringify(
        {
          server: MCP_SERVER_NAME,
          version: MCP_SERVER_VERSION,
          apiBaseUrl: API_BASE_URL,
          timeout: API_TIMEOUT_S,
        },
        null,
        2
      ),
    };
  },
});

// Add prompt for API help
server.addPrompt({
  name: 'api-help',
  description: 'Get help with using the API tools',
  load: async () => {
    return `This MCP server (${MCP_SERVER_NAME}) provides tools to interact with ${API_BASE_URL}. Available tools: ping, api_get, api_post, api_patch, api_delete, api_request. Use the ping tool to check server health.`;
  },
});

// Helper function to make API requests
async function makeApiRequest(
  method: string,
  endpoint: string,
  body?: unknown,
  customHeaders?: Record<string, string>
): Promise<string> {
  // Validate endpoint (no absolute URLs unless allowed)
  if (
    !API_ALLOW_ABSOLUTE_URLS &&
    (endpoint.startsWith('http://') || endpoint.startsWith('https://'))
  ) {
    throw new Error('Absolute URLs are not allowed. Use relative endpoints only.');
  }

  // Construct full URL
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  // Prepare headers
  const headers: Record<string, string> = {
    ...API_DEFAULT_HEADERS,
    [API_AUTH_HEADER]: `${API_AUTH_PREFIX} ${API_KEY}`,
    ...customHeaders,
  };

  // Make request
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_S * 1000);

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const responseText = await response.text();
    let responseData: unknown;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }

    return JSON.stringify({
      status: response.status,
      statusText: response.statusText,
      data: responseData,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return JSON.stringify({
      error: errorMessage,
      endpoint,
      method,
    });
  }
}

// Create Express app for health endpoint
const app = express();

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

// Start HTTP health server
app.listen(PORT, '0.0.0.0', () => {
  console.error(`Health check server listening on 0.0.0.0:${PORT}`);
  console.error(`Health endpoint: http://0.0.0.0:${PORT}/health`);
});

// Start FastMCP server with stdio transport
server.start({
  transportType: 'stdio',
});

console.error(`MCP server ${MCP_SERVER_NAME} v${MCP_SERVER_VERSION} running on stdio`);
