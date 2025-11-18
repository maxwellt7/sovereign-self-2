# Sovereign Self API

Backend API for the Sovereign Self platform.

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Set up the database:
```bash
# Generate Prisma Client
pnpm db:generate

# Run migrations
pnpm db:migrate

# (Optional) Seed the database
pnpm db:seed
```

4. Start the development server:
```bash
pnpm dev
```

The API will be available at http://localhost:3000

## Database Setup Instructions

### Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Get your connection strings from Project Settings > Database
3. Update `.env`:
   - `DATABASE_URL` - Connection pooling URL (for Prisma migrations)
   - `DIRECT_URL` - Direct connection URL (for Prisma client)

4. Run migrations:
```bash
pnpm db:migrate:deploy
```

5. (Optional) Enable Row Level Security policies in Supabase dashboard

### Pinecone Setup

1. Create a Pinecone account at https://www.pinecone.io
2. Create two indexes with these settings:
   - **Name**: `journal-embeddings` and `knowledge-embeddings`
   - **Dimensions**: 1536
   - **Metric**: cosine
   - **Pod Type**: p1.x1 (starter) or s1.x1 (serverless)

3. Update `.env` with your Pinecone API key and index names

## Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm db:generate` - Generate Prisma Client
- `pnpm db:migrate` - Create and apply migrations
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:seed` - Seed the database with sample data

## API Documentation

API documentation is available at `/api-docs` when the server is running.

## Architecture

```
src/
├── config/         # Configuration files
├── middleware/     # Express middleware
├── modules/        # Feature modules
│   ├── auth/       # Authentication
│   ├── journal/    # Journal entries
│   ├── knowledge/  # Knowledge base
│   ├── ai/         # AI services
│   └── admin/      # Admin functionality
├── services/       # Business logic services
├── utils/          # Utility functions
└── server.ts       # Application entry point
```

