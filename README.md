# Sovereign Self

A production-grade personal development and journaling platform with AI-powered insights, content management, and knowledge base capabilities.

## Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Backend**: Node.js 20+ + Express + TypeScript
- **Database**: Supabase (PostgreSQL)
- **Vector DB**: Pinecone
- **Authentication**: Clerk
- **AI/ML**: OpenAI API
- **Hosting**: Vercel (Frontend) + Railway (Backend)

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- Docker (for local development)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env

# Run database migrations
pnpm --filter api db:migrate

# Start development servers
pnpm dev
```

### Development

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api-docs

## Project Structure

```
sovereign-self/
├── apps/
│   ├── web/        # Frontend (Vite + React)
│   └── api/        # Backend (Node.js + Express)
├── packages/
│   └── shared/     # Shared types and schemas
├── .github/        # CI/CD workflows
└── docker-compose.yml
```

## Scripts

- `pnpm dev` - Start all development servers
- `pnpm build` - Build all apps for production
- `pnpm test` - Run all tests
- `pnpm lint` - Lint all code
- `pnpm format` - Format all code with Prettier
- `pnpm typecheck` - Type-check all TypeScript code

## Architecture

See the [Build Plan](./sovereign-self-build-plan.plan.md) for detailed architecture and implementation phases.

## License

MIT

