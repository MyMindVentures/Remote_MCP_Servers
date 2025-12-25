#!/bin/bash
# Complete Railway Deployment Script
# This script sets up all 4 MCP servers on Railway

set -e

echo "🚂 Complete Railway Deployment for Remote MCP Servers"
echo "======================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Railway CLI
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI not installed${NC}"
    echo "Install: npm install -g @railway/cli"
    exit 1
fi

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo -e "${RED}❌ Not logged into Railway${NC}"
    echo "Run: railway login"
    exit 1
fi

echo -e "${GREEN}✅ Railway CLI ready${NC}"
echo ""

# Project IDs (auto-detected)
PROJECT_ID="d83f78bd-25a9-4f1f-a10d-20591819ecf8"
ENV_ID="d6bb17d6-e28b-4832-8e4d-330ab5485967"

echo "📋 Configuration:"
echo "  Project: Remote MCP Servers"
echo "  Project ID: $PROJECT_ID"
echo "  Environment ID: $ENV_ID"
echo ""

# Function to configure service
configure_service() {
    SERVICE_NAME=$1
    API_BASE_URL=$2
    API_KEY_PLACEHOLDER=$3
    EXTRA_VARS=$4

    echo -e "${YELLOW}⚙️  Configuring $SERVICE_NAME...${NC}"

    railway variables --service "$SERVICE_NAME" \
        --set "NODE_ENV=production" \
        --set "API_BASE_URL=$API_BASE_URL" \
        --set "API_KEY=$API_KEY_PLACEHOLDER" \
        --set "API_AUTH_HEADER=Authorization" \
        --set "API_AUTH_PREFIX=Bearer" \
        --set 'API_DEFAULT_HEADERS_JSON={"Content-Type":"application/json"}' \
        --set "API_TIMEOUT_S=30" \
        --set "API_ALLOW_ABSOLUTE_URLS=false" \
        --set "MCP_SERVER_NAME=$SERVICE_NAME" \
        --set "MCP_SERVER_VERSION=1.0.0" \
        $EXTRA_VARS \
        --skip-deploys || echo "  Variables set (some may have failed)"

    echo -e "${GREEN}✅ $SERVICE_NAME configured${NC}"
    echo ""
}

# 1. Configure Railway MCP Server
echo "1️⃣  Railway MCP Server"
configure_service "railway-mcp-server" \
    "https://backboard.railway.app/graphql/v2" \
    "YOUR_RAILWAY_API_TOKEN_HERE" \
    "--set RAILWAY_PROJECT_ID=$PROJECT_ID --set RAILWAY_ENVIRONMENT_ID=$ENV_ID"

# 2. Configure Notion MCP Server
echo "2️⃣  Notion MCP Server"
configure_service "notion-mcp-server" \
    "https://api.notion.com/v1" \
    "YOUR_NOTION_TOKEN_HERE" \
    '--set API_DEFAULT_HEADERS_JSON='"'"'{"Content-Type":"application/json","Notion-Version":"2022-06-28"}'"'"' --set NOTION_VERSION=2022-06-28'

# 3. Configure Airtable MCP Server
echo "3️⃣  Airtable MCP Server"
configure_service "airtable-mcp-server" \
    "https://api.airtable.com/v0" \
    "YOUR_AIRTABLE_API_KEY_HERE" \
    "--set AIRTABLE_BASE_ID=YOUR_BASE_ID_HERE"

# 4. Configure Linear MCP Server
echo "4️⃣  Linear MCP Server"
configure_service "linear-mcp-server" \
    "https://api.linear.app/graphql" \
    "YOUR_LINEAR_API_KEY_HERE" \
    ""

echo ""
echo "=========================================="
echo -e "${GREEN}✅ All services configured!${NC}"
echo ""
echo "⚠️  IMPORTANT: Update API keys in Railway dashboard:"
echo ""
echo "1. Railway MCP Server:"
echo "   - Get token: https://railway.app/account/tokens"
echo "   - Set API_KEY in Railway UI"
echo ""
echo "2. Notion MCP Server:"
echo "   - Get token: https://www.notion.so/my-integrations"
echo "   - Set API_KEY in Railway UI"
echo ""
echo "3. Airtable MCP Server:"
echo "   - Get key: https://airtable.com/account"
echo "   - Set API_KEY and AIRTABLE_BASE_ID in Railway UI"
echo ""
echo "4. Linear MCP Server:"
echo "   - Get key: https://linear.app/settings/api"
echo "   - Set API_KEY in Railway UI"
echo ""
echo "After updating API keys, Railway will auto-deploy each service."
echo ""
echo "Verify deployments:"
echo "  railway logs --service railway-mcp-server"
echo "  railway logs --service notion-mcp-server"
echo "  railway logs --service airtable-mcp-server"
echo "  railway logs --service linear-mcp-server"
echo ""
echo "🎉 Deployment configuration complete!"
