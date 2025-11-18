# Development Setup Guide

Complete guide to setting up Sovereign Self for local development.

## Prerequisites

- Node.js 20+ 
- pnpm 8+
- Docker (for Redis)
- Git

## Quick Start

```bash
# Clone repository
git clone <repo-url>
cd sovereign-self

# Install dependencies
pnpm install

# Set up environment variables (see below)
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# Start Docker services
docker-compose up -d

# Run database migrations
pnpm --filter api db:generate
pnpm --filter api db:migrate

# Start development servers
pnpm dev
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Detailed Setup

### 1. Install Dependencies

```bash
pnpm install
```

This installs all dependencies for the monorepo.

### 2. Configure Supabase

1. Create account at https://supabase.com
2. Create a new project
3. Go to Settings → Database
4. Copy connection strings:
   - Transaction pooler (for migrations): `DATABASE_URL`
   - Direct connection (for Prisma): `DIRECT_URL`

### 3. Configure Clerk

1. Create account at https://clerk.com
2. Create a new application
3. Get your keys from Dashboard:
   - `VITE_CLERK_PUBLISHABLE_KEY` (starts with `pk_test_`)
   - `CLERK_SECRET_KEY` (starts with `sk_test_`)

4. Configure webhook (for local development):
   ```bash
   # Install Clerk CLI
   npm install -g @clerk/clerk-cli
   
   # Start webhook forwarding
   clerk forward --domain localhost:3000
   ```
   
   Copy the webhook secret to `CLERK_WEBHOOK_SECRET`

### 4. Configure Pinecone

1. Create account at https://pinecone.io
2. Create two indexes with these settings:
   
   **Index 1:**
   - Name: `journal-embeddings`
   - Dimensions: 1024 (or choose 384, 768, 1536 from dropdown)
   - Metric: cosine
   - Cloud: AWS or GCP
   - Region: us-east-1 (or your preference)
   
   **Index 2:**
   - Name: `knowledge-embeddings`
   - Dimensions: 1024 (same as above)
   - Metric: cosine
   - Cloud: AWS or GCP
   - Region: us-east-1

3. Get API key from console

**Note**: OpenAI's text-embedding-3-small supports dimensions: 384, 512, 768, 1024, or 1536.
Choose 1024 for a good balance of performance and accuracy.

If you choose a different dimension, add to `apps/api/.env`:
```bash
EMBEDDING_DIMENSION=1024  # Must match your Pinecone index dimension
```

### 5. Configure OpenAI

1. Create account at https://platform.openai.com
2. Go to API keys section
3. Create new secret key
4. Add to `.env` as `OPENAI_API_KEY`

### 6. Set Up Environment Variables

**Backend (`apps/api/.env`):**

```bash
# Database
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"

# Authentication
CLERK_SECRET_KEY="sk_test_..."
CLERK_WEBHOOK_SECRET="whsec_..."

# AI
OPENAI_API_KEY="sk-..."

# Pinecone
PINECONE_API_KEY="..."
PINECONE_ENVIRONMENT="us-east-1-aws"
PINECONE_INDEX_JOURNAL="journal-embeddings"
PINECONE_INDEX_KNOWLEDGE="knowledge-embeddings"

# Redis
REDIS_URL="redis://localhost:6379"

# Server
PORT=3000
NODE_ENV=development
CORS_ORIGIN="http://localhost:5173"
```

**Frontend (`apps/web/.env.local`):**

```bash
VITE_API_URL=http://localhost:3000/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_POSTHOG_KEY= # optional
```

### 7. Start Docker Services

```bash
# Start Redis
docker-compose up -d

# Verify Redis is running
docker ps
```

### 8. Set Up Database

```bash
# Generate Prisma Client
pnpm --filter api db:generate

# Run migrations
pnpm --filter api db:migrate

# (Optional) Seed database with sample data
pnpm --filter api db:seed

# Open Prisma Studio to view data
pnpm --filter api db:studio
```

### 9. Start Development Servers

```bash
# Start everything
pnpm dev

# Or start individually
pnpm --filter api dev    # Backend only
pnpm --filter web dev    # Frontend only
```

## Project Structure

```
sovereign-self/
├── apps/
│   ├── api/              # Backend (Express + Prisma)
│   │   ├── prisma/       # Database schema & migrations
│   │   ├── src/
│   │   │   ├── config/   # Configuration
│   │   │   ├── middleware/ # Express middleware
│   │   │   ├── modules/  # Feature modules
│   │   │   ├── services/ # Business logic
│   │   │   └── server.ts # Entry point
│   │   └── package.json
│   │
│   └── web/              # Frontend (Vite + React)
│       ├── src/
│       │   ├── components/ # React components
│       │   ├── hooks/    # Custom hooks
│       │   ├── lib/      # Utilities
│       │   ├── pages/    # Route pages
│       │   ├── styles/   # Global styles
│       │   ├── App.tsx   # App component
│       │   └── main.tsx  # Entry point
│       └── package.json
│
├── packages/
│   └── shared/           # Shared types & schemas
│       ├── src/
│       │   ├── types/    # TypeScript types
│       │   └── schemas/  # Zod schemas
│       └── package.json
│
├── .github/              # GitHub Actions
├── docker-compose.yml    # Local services
├── package.json          # Root package.json
└── pnpm-workspace.yaml   # Workspace config
```

## Development Workflow

### Creating Database Migrations

```bash
# After modifying prisma/schema.prisma
pnpm --filter api db:migrate
```

### Adding a New API Endpoint

1. Create service in `apps/api/src/modules/<module>/<module>.service.ts`
2. Create controller in `apps/api/src/modules/<module>/<module>.controller.ts`
3. Create routes in `apps/api/src/modules/<module>/<module>.routes.ts`
4. Import routes in `apps/api/src/server.ts`

### Adding a New React Component

1. Create component in `apps/web/src/components/`
2. If it's a UI component, add to `apps/web/src/components/ui/`
3. Import and use in pages

### Adding Shared Types

1. Add to `packages/shared/src/types/`
2. Export from `packages/shared/src/index.ts`
3. Use in both frontend and backend

## Testing

```bash
# Run all tests
pnpm test

# Run tests for specific app
pnpm --filter api test
pnpm --filter web test

# Run with coverage
pnpm test --coverage
```

## Linting & Formatting

```bash
# Lint all code
pnpm lint

# Format all code
pnpm format

# Type check
pnpm typecheck
```

## Common Issues

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change PORT in apps/api/.env
```

### Database Connection Issues

```bash
# Check DATABASE_URL format
# Ensure Supabase project is active
# Try direct connection URL instead of pooled

# Test connection
psql $DATABASE_URL
```

### Prisma Issues

```bash
# Regenerate Prisma Client
pnpm --filter api db:generate

# Reset database (WARNING: deletes all data)
pnpm --filter api db:migrate reset
```

### Redis Connection Issues

```bash
# Check Redis is running
docker ps

# Restart Redis
docker-compose restart redis

# View Redis logs
docker-compose logs redis
```

### Clerk Webhook Not Working

```bash
# Verify webhook secret is set
# Check webhook endpoint in Clerk dashboard
# Use ngrok or Clerk CLI for local testing

# Clerk CLI forward
clerk forward --domain localhost:3000
```

## Tips

- Use Prisma Studio to view/edit database: `pnpm --filter api db:studio`
- Check API docs at http://localhost:3000/api-docs (when implemented)
- Use React Query DevTools in browser for debugging queries
- Check Network tab for API request/response details
- Use Clerk Dev Mode for testing authentication locally

## Getting Help

- Check the logs in terminal
- Review error messages in browser console
- Check the DEPLOYMENT.md for production issues
- Review API documentation in code comments

