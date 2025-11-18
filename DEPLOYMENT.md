# Deployment Guide

This guide covers deploying Sovereign Self to production using Railway (backend) and Vercel (frontend).

## Prerequisites

- Supabase project with database URL
- Pinecone account with indexes created
- Clerk account with app configured
- Railway account
- Vercel account
- OpenAI API key

## Backend Deployment (Railway)

### 1. Create Railway Project

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init
```

### 2. Add PostgreSQL Database

In Railway dashboard:
1. Click "New" → "Database" → "PostgreSQL"
2. Copy the connection strings

### 3. Add Redis

In Railway dashboard:
1. Click "New" → "Database" → "Redis"
2. Copy the connection URL

### 4. Set Environment Variables

In Railway dashboard, add these variables:

```
DATABASE_URL=<from_railway_postgres>
DIRECT_URL=<from_railway_postgres_direct>
CLERK_SECRET_KEY=<from_clerk_dashboard>
CLERK_WEBHOOK_SECRET=<from_clerk_dashboard>
OPENAI_API_KEY=<from_openai>
PINECONE_API_KEY=<from_pinecone>
PINECONE_ENVIRONMENT=<from_pinecone>
PINECONE_INDEX_JOURNAL=journal-embeddings
PINECONE_INDEX_KNOWLEDGE=knowledge-embeddings
REDIS_URL=<from_railway_redis>
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-app.vercel.app
```

### 5. Deploy

```bash
# From project root
railway up
```

### 6. Run Migrations

```bash
railway run pnpm --filter api db:migrate:deploy
```

### 7. Configure Clerk Webhook

1. Go to Clerk Dashboard → Webhooks
2. Add endpoint: `https://your-railway-app.up.railway.app/api/auth/webhooks/clerk`
3. Subscribe to events: `user.created`, `user.updated`, `user.deleted`
4. Copy the signing secret to `CLERK_WEBHOOK_SECRET`

## Frontend Deployment (Vercel)

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Deploy to Vercel

```bash
# From project root
cd apps/web
vercel
```

### 3. Set Environment Variables

In Vercel dashboard:

```
VITE_API_URL=https://your-railway-app.up.railway.app/api
VITE_CLERK_PUBLISHABLE_KEY=<from_clerk_dashboard>
VITE_POSTHOG_KEY=<optional_from_posthog>
```

### 4. Configure Production Domain

1. In Vercel dashboard, go to Settings → Domains
2. Add your custom domain
3. Update `CORS_ORIGIN` in Railway to match

### 5. Redeploy

```bash
vercel --prod
```

## Database Setup

### Supabase Configuration

1. Create a new Supabase project
2. Get connection strings from Settings → Database
3. Use "Connection pooling" URL for `DATABASE_URL`
4. Use "Direct connection" URL for `DIRECT_URL`

### Run Migrations

```bash
# Development
pnpm --filter api db:migrate

# Production (via Railway)
railway run pnpm --filter api db:migrate:deploy
```

### Seed Database (Optional)

```bash
# Development
pnpm --filter api db:seed

# Production (careful!)
railway run pnpm --filter api db:seed
```

## Pinecone Setup

1. Create account at https://pinecone.io
2. Create two indexes:
   - Name: `journal-embeddings`
   - Dimensions: **1024** (choose from dropdown: 384, 768, 1024, or 1536)
   - Metric: cosine
   - Pod Type: s1 (serverless) or p1 (pod-based)
   
3. Create second index:
   - Name: `knowledge-embeddings`
   - Dimensions: **1024** (must match first index)
   - Same settings as above

**Important**: Both indexes must use the same dimension size. Add to Railway environment:
```
EMBEDDING_DIMENSION=1024
```

**Choosing Dimensions:**
- 384: Fastest, lowest cost, good for large datasets
- 768: Balanced performance
- **1024**: Recommended - good balance of speed and accuracy
- 1536: Highest accuracy, more expensive

## Monitoring Setup

### Sentry

1. Create project at https://sentry.io
2. Get DSN
3. Add to environment variables:
   - Railway: `SENTRY_DSN`

### PostHog (Optional)

1. Create project at https://posthog.com
2. Get project API key
3. Add to Vercel: `VITE_POSTHOG_KEY`

## CI/CD

GitHub Actions automatically:
- Runs linting and type checking on PRs
- Runs tests
- Builds the project

Vercel automatically:
- Creates preview deployments for PRs
- Deploys to production on merge to main

Railway automatically:
- Deploys on push to main
- Runs health checks
- Restarts on failure

## Post-Deployment Checklist

- [ ] Backend health check passing: `https://your-api.railway.app/health`
- [ ] Frontend loads correctly
- [ ] Sign up/sign in works
- [ ] Clerk webhook delivering events
- [ ] Journal entries can be created
- [ ] AI features working (semantic search, insights)
- [ ] Knowledge base functional
- [ ] Admin panel accessible (for admin users)
- [ ] Error monitoring active (Sentry)
- [ ] Analytics tracking (PostHog)

## Troubleshooting

### Backend Issues

```bash
# View logs
railway logs

# Check environment variables
railway variables

# Connect to database
railway connect postgres
```

### Frontend Issues

```bash
# View deployment logs
vercel logs

# Check build
vercel build

# Test locally with production API
VITE_API_URL=https://your-api.railway.app/api pnpm dev
```

### Database Issues

```bash
# Check migrations
railway run pnpm --filter api db:migrate status

# Reset database (WARNING: deletes all data)
railway run pnpm --filter api db:migrate reset
```

## Scaling

### Backend (Railway)

- Vertical scaling: Increase resources in Railway dashboard
- Horizontal scaling: Add more replicas
- Database: Upgrade Supabase plan for more connections

### Frontend (Vercel)

- Automatically scales with traffic
- Configure caching in `vercel.json`
- Use Vercel Edge Functions for dynamic content

## Backup Strategy

### Database

Supabase provides automatic backups. Manual backup:

```bash
# Export database
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

### Pinecone

Pinecone indexes are durable. To backup:
- Export data via API (custom script needed)
- Rebuild from source data (journal/knowledge entries)

## Security Checklist

- [ ] Environment variables never committed to git
- [ ] Clerk webhook secret validated
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] HTTPS enforced
- [ ] Database connection encrypted
- [ ] Admin routes protected
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (Prisma handles this)
- [ ] XSS protection (React handles this)

## Maintenance

### Regular Tasks

- Monitor error rates in Sentry
- Review usage and costs
- Update dependencies monthly
- Review and rotate API keys quarterly
- Check database performance
- Optimize slow queries

### Updating

```bash
# Update dependencies
pnpm update --latest

# Test locally
pnpm dev
pnpm build
pnpm test

# Deploy
git push origin main
```

## Support

For issues:
- Check logs in Railway/Vercel dashboards
- Review Sentry for error details
- Check database connection status
- Verify environment variables are set correctly

