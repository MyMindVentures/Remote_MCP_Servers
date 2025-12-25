import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';
import http from 'http';

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

// Create MCP server
const server = new Server(
  {
    name: MCP_SERVER_NAME,
    version: MCP_SERVER_VERSION,
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  }
);

// Tool: v1.ping - Health check tool
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'tools.v1.ping',
        description: 'Health check tool that validates server is responding',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'tools.v1.api_get',
        description: 'Make a GET request to the configured API',
        inputSchema: {
          type: 'object',
          properties: {
            endpoint: {
              type: 'string',
              description: 'API endpoint path (relative to API_BASE_URL)',
            },
            headers: {
              type: 'object',
              description: 'Additional headers to include',
              additionalProperties: { type: 'string' },
            },
          },
          required: ['endpoint'],
        },
      },
      {
        name: 'tools.v1.api_post',
        description: 'Make a POST request to the configured API',
        inputSchema: {
          type: 'object',
          properties: {
            endpoint: {
              type: 'string',
              description: 'API endpoint path (relative to API_BASE_URL)',
            },
            body: {
              type: 'object',
              description: 'Request body',
            },
            headers: {
              type: 'object',
              description: 'Additional headers to include',
              additionalProperties: { type: 'string' },
            },
          },
          required: ['endpoint', 'body'],
        },
      },
      {
        name: 'tools.v1.api_patch',
        description: 'Make a PATCH request to the configured API',
        inputSchema: {
          type: 'object',
          properties: {
            endpoint: {
              type: 'string',
              description: 'API endpoint path (relative to API_BASE_URL)',
            },
            body: {
              type: 'object',
              description: 'Request body',
            },
            headers: {
              type: 'object',
              description: 'Additional headers to include',
              additionalProperties: { type: 'string' },
            },
          },
          required: ['endpoint', 'body'],
        },
      },
      {
        name: 'tools.v1.api_delete',
        description: 'Make a DELETE request to the configured API',
        inputSchema: {
          type: 'object',
          properties: {
            endpoint: {
              type: 'string',
              description: 'API endpoint path (relative to API_BASE_URL)',
            },
            headers: {
              type: 'object',
              description: 'Additional headers to include',
              additionalProperties: { type: 'string' },
            },
          },
          required: ['endpoint'],
        },
      },
      {
        name: 'tools.v1.api_request',
        description: 'Make a generic HTTP request to the configured API',
        inputSchema: {
          type: 'object',
          properties: {
            method: {
              type: 'string',
              enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
              description: 'HTTP method',
            },
            endpoint: {
              type: 'string',
              description: 'API endpoint path (relative to API_BASE_URL)',
            },
            body: {
              type: 'object',
              description: 'Request body (for POST, PUT, PATCH)',
            },
            headers: {
              type: 'object',
              description: 'Additional headers to include',
              additionalProperties: { type: 'string' },
            },
          },
          required: ['method', 'endpoint'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'tools.v1.ping': {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              status: 'ok',
              timestamp: new Date().toISOString(),
              server: MCP_SERVER_NAME,
              version: MCP_SERVER_VERSION,
            }),
          },
        ],
      };
    }

    case 'tools.v1.api_get':
    case 'tools.v1.api_post':
    case 'tools.v1.api_patch':
    case 'tools.v1.api_delete':
    case 'tools.v1.api_request': {
      const apiArgs = args as {
        endpoint: string;
        method?: string;
        body?: unknown;
        headers?: Record<string, string>;
      };

      const { endpoint, body, headers: customHeaders } = apiArgs;

      // Determine method
      let method = 'GET';
      if (name === 'tools.v1.api_post') method = 'POST';
      else if (name === 'tools.v1.api_patch') method = 'PATCH';
      else if (name === 'tools.v1.api_delete') method = 'DELETE';
      else if (name === 'tools.v1.api_request' && apiArgs.method) {
        method = apiArgs.method;
      }

      // Validate endpoint (no absolute URLs unless allowed)
      if (!API_ALLOW_ABSOLUTE_URLS && (endpoint.startsWith('http://') || endpoint.startsWith('https://'))) {
        throw new Error('Absolute URLs are not allowed. Use relative endpoints only.');
      }

      // Construct full URL
      const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

      // Prepare headers
      const headers = {
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

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: response.status,
                statusText: response.statusText,
                data: responseData,
              }),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: errorMessage,
                endpoint,
                method,
              }),
            },
          ],
          isError: true,
        };
      }
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Resources handler
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'config://settings',
        name: 'Server Configuration',
        mimeType: 'application/json',
        description: 'Current server configuration and settings',
      },
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  if (uri === 'config://settings') {
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
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
        },
      ],
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
});

// Prompts handler
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: 'api-help',
        description: 'Get help with using the API tools',
      },
    ],
  };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name } = request.params;

  if (name === 'api-help') {
    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `This MCP server (${MCP_SERVER_NAME}) provides tools to interact with ${API_BASE_URL}. Available tools: ping, api_get, api_post, api_patch, api_delete, api_request. Use the ping tool to check server health.`,
          },
        },
      ],
    };
  }

  throw new Error(`Unknown prompt: ${name}`);
});

// Health check HTTP server
const healthServer = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
  } else if (req.url === '/mcp') {
    // MCP endpoint - this would be handled by the transport layer in production
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'MCP endpoint - use proper MCP client' }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

// Start server
async function main() {
  // Start health check server
  healthServer.listen(PORT, '0.0.0.0', () => {
    console.error(`Health check server listening on 0.0.0.0:${PORT}`);
    console.error(`Health endpoint: http://0.0.0.0:${PORT}/health`);
  });

  // Connect MCP server to stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
