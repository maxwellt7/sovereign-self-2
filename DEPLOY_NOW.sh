#!/bin/bash

# Sovereign Self - Railway Deployment Script
# Run this after you've logged in with: railway login

set -e

echo "🚂 Deploying Sovereign Self to Railway..."
echo ""

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo "❌ Not logged into Railway. Please run:"
    echo "   railway login"
    echo ""
    exit 1
fi

echo "✅ Logged into Railway"
echo ""

# Initialize project if not already
if [ ! -f "railway.json" ]; then
    echo "📦 Initializing Railway project..."
    railway init
    echo ""
fi

# Add Redis if not already added
echo "🔴 Adding Redis..."
railway add -d redis || echo "Redis might already be added"
echo ""

# Set environment variables
echo "⚙️  Setting environment variables..."

railway variables set DATABASE_URL="YOUR_SUPABASE_DATABASE_URL"
railway variables set DIRECT_URL="YOUR_SUPABASE_DIRECT_URL"
railway variables set CLERK_SECRET_KEY="YOUR_CLERK_SECRET_KEY"
railway variables set CLERK_WEBHOOK_SECRET="whsec_placeholder"
railway variables set OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
railway variables set PINECONE_API_KEY="YOUR_PINECONE_API_KEY"
railway variables set PINECONE_ENVIRONMENT="us-east-1-aws"
railway variables set PINECONE_INDEX_JOURNAL="journal-embeddings"
railway variables set PINECONE_INDEX_KNOWLEDGE="knowledge-embeddings"
railway variables set EMBEDDING_DIMENSION="1024"
railway variables set PORT="3000"
railway variables set NODE_ENV="production"
railway variables set CORS_ORIGIN="*"

echo ""
echo "✅ Environment variables set"
echo ""

# Deploy
echo "🚀 Deploying to Railway..."
railway up

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "📝 Next steps:"
echo "1. Wait for build to complete (check Railway dashboard)"
echo "2. Generate domain: railway domain"
echo "3. Run: railway run npx prisma db push"
echo "4. Test: curl https://your-url.up.railway.app/health"
echo ""
echo "🎉 Backend deployment complete!"

