#!/bin/bash
# Railway Deployment Script for Remote MCP Servers
# This script helps deploy all MCP servers to Railway

set -e

echo "🚂 Railway MCP Servers Deployment Script"
echo "=========================================="
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI is not installed"
    echo "Install it: npm install -g @railway/cli"
    exit 1
fi

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo "❌ Not logged into Railway"
    echo "Run: railway login"
    exit 1
fi

echo "✅ Railway CLI ready"
echo ""

# Function to deploy a service
deploy_service() {
    SERVICE_NAME=$1
    PACKAGE_DIR=$2

    echo "📦 Deploying $SERVICE_NAME..."
    cd "packages/$PACKAGE_DIR"

    # Note: This requires the service to already exist in Railway
    # Or use Railway dashboard to create services

    railway up --service "$SERVICE_NAME" || echo "⚠️  Service $SERVICE_NAME not found - create it in Railway dashboard first"

    cd ../..
    echo ""
}

echo "ℹ️  To deploy, you need to:"
echo "1. Push this code to GitHub"
echo "2. Connect GitHub repo to Railway project 'Remote MCP Servers'"
echo "3. Railway will auto-deploy each service from packages/*"
echo ""
echo "Or manually create services in Railway dashboard:"
echo "  - Railway MCP Server (packages/railway-mcp-server)"
echo "  - Notion MCP Server (packages/notion-mcp-server)"
echo "  - Airtable MCP Server (packages/airtable-mcp-server)"
echo "  - Linear MCP Server (packages/linear-mcp-server)"
echo ""

read -p "Do you want to try deploying (requires services to exist)? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    deploy_service "railway-mcp-server" "railway-mcp-server"
    deploy_service "notion-mcp-server" "notion-mcp-server"
    deploy_service "airtable-mcp-server" "airtable-mcp-server"
    deploy_service "linear-mcp-server" "linear-mcp-server"
    echo "✅ Deployment complete!"
else
    echo "ℹ️  Follow QUICK_DEPLOY.md for manual deployment steps"
fi
