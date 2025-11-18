# 🚀 Quick Start Guide

Get Sovereign Self running in 5 minutes!

## Prerequisites Checklist

Before you start, make sure you have:
- ✅ Node.js 20+ installed
- ✅ pnpm installed (`npm install -g pnpm`)
- ✅ Docker Desktop installed and running
- ✅ The API keys provided (Supabase, Clerk, OpenAI, Pinecone)

## Step 1: Install Dependencies (2 minutes)

```bash
cd sovereign-self
pnpm install
```

This installs all dependencies for the entire monorepo.

## Step 2: Get Supabase Database Password (1 minute)

You need your Supabase database password:

1. Go to https://supabase.com/dashboard
2. Select project: `ryulojxwynyannjmbkir`
3. Go to **Settings** → **Database**
4. Find your database password (or reset it)
5. Keep this handy for the next step

## Step 3: Configure Environment (1 minute)

The `.env` files have been created with your keys. You just need to:

1. **Update database password in `apps/api/.env`:**
   ```bash
   # Replace YOUR_DB_PASSWORD with your actual password
   DATABASE_URL=postgresql://postgres.ryulojxwynyannjmbkir:YOUR_DB_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   DIRECT_URL=postgresql://postgres.ryulojxwynyannjmbkir:YOUR_DB_PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres
   ```

2. **Add your OpenAI API key:**
   ```bash
   OPENAI_API_KEY=sk-your-openai-key-here
   ```

3. **Add your Pinecone API key:**
   ```bash
   PINECONE_API_KEY=your-pinecone-key-here
   ```

4. **Set up Clerk webhook** (see CLERK_SETUP.md for detailed instructions):
   ```bash
   # For now, you can use a placeholder:
   CLERK_WEBHOOK_SECRET=whsec_placeholder
   
   # Follow CLERK_SETUP.md to get the real secret
   ```

## Step 4: Set Up Pinecone Indexes (2 minutes)

1. Go to https://app.pinecone.io
2. Create two indexes with these settings:

**Index 1:**
- Name: `journal-embeddings`
- Dimensions: Choose from available options (384, 768, 1024, or 1536)
  - **Recommended**: 1024 or 768
- Metric: `cosine`
- Infrastructure: Serverless (recommended) or Pod-based
- Cloud: `AWS` or `GCP`
- Region: `us-east-1` or your preferred region

**Index 2:**
- Name: `knowledge-embeddings`
- Dimensions: **SAME as Index 1** (must match!)
- Metric: `cosine`
- Infrastructure: Same as above
- Cloud: Same as above
- Region: Same as above

**Important**: Add the dimension size to `apps/api/.env`:
```bash
# Add this line (use whatever dimension you chose)
EMBEDDING_DIMENSION=1024

# Or if you chose 768:
EMBEDDING_DIMENSION=768
```

**Not sure which dimension to choose?** 
- See `PINECONE_SETUP.md` for detailed comparison
- **Quick choice**: Use 1024 if available, otherwise 768

## Step 5: Start Services (1 minute)

```bash
# Start Redis in Docker
docker-compose up -d

# Generate Prisma Client
pnpm --filter api db:generate

# Run database migrations
pnpm --filter api db:migrate

# (Optional) Add sample data
pnpm --filter api db:seed

# Start both frontend and backend
pnpm dev
```

## Step 6: Access the Application

Open your browser:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

## 🎉 That's It!

You should now see:
1. The Sovereign Self login page
2. You can sign up with Clerk
3. After signing in, you'll see the dashboard

## Common Issues

### "Cannot connect to database"
- Check your database password is correct
- Verify Supabase project is active
- Try the direct connection URL instead

### "Port 3000 already in use"
```bash
# Kill the process
lsof -ti:3000 | xargs kill -9

# Or change the port in apps/api/.env
PORT=3001
```

### "Redis connection failed"
```bash
# Make sure Docker is running
docker ps

# Restart Redis
docker-compose restart redis
```

### "Clerk webhook errors"
- For local development, use Clerk CLI: `clerk forward --domain localhost:3000`
- See CLERK_SETUP.md for complete instructions

## Next Steps

1. **Complete Clerk webhook setup**: See `CLERK_SETUP.md`
2. **Customize the app**: Edit components in `apps/web/src/`
3. **Add your first journal entry**: Click "New Entry" in the Journal page
4. **Deploy to production**: See `DEPLOYMENT.md`

## Need More Help?

- **Detailed setup**: See `SETUP.md`
- **Deployment guide**: See `DEPLOYMENT.md`
- **Architecture**: See `ARCHITECTURE.md`
- **API keys missing**: Check the docs for each service

## Development Commands

```bash
# Start everything
pnpm dev

# Backend only
pnpm --filter api dev

# Frontend only  
pnpm --filter web dev

# Database GUI
pnpm --filter api db:studio

# Run tests
pnpm test

# Format code
pnpm format
```

---

**Your Sovereign Self app is now running! 🎊**

Start journaling and building your knowledge base!

