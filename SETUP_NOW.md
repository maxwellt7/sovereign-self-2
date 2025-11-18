# ⚡ Quick Setup - Do This Now

Follow these exact steps to get running.

---

## Step 1: Create Backend Environment File

Run this command to create your backend `.env`:

```bash
cat > apps/api/.env << 'EOF'
# Database (⚠️ REPLACE YOUR_DB_PASSWORD)
DATABASE_URL=postgresql://postgres.ryulojxwynyannjmbkir:YOUR_DB_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.ryulojxwynyannjmbkir:YOUR_DB_PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres

# Clerk (✅ Ready)
CLERK_SECRET_KEY=sk_test_4YRMd6TP7TJ5ZbFpJArRJtQoQAaFDdkh6IUdsGDAzj
CLERK_WEBHOOK_SECRET=whsec_development_placeholder

# OpenAI (⚠️ ADD YOUR KEY)
OPENAI_API_KEY=sk-YOUR_KEY_HERE

# Pinecone (⚠️ ADD YOUR KEY)  
PINECONE_API_KEY=YOUR_KEY_HERE
PINECONE_ENVIRONMENT=us-east-1-aws
PINECONE_INDEX_JOURNAL=journal-embeddings
PINECONE_INDEX_KNOWLEDGE=knowledge-embeddings
EMBEDDING_DIMENSION=1024

# Redis
REDIS_URL=redis://localhost:6379

# Server
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
EOF
```

---

## Step 2: Create Frontend Environment File

```bash
cat > apps/web/.env.local << 'EOF'
VITE_API_URL=http://localhost:3000/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YmVjb21pbmctZ3JvdXNlLTc3LmNsZXJrLmFjY291bnRzLmRldiQ
EOF
```

✅ Frontend is ready!

---

## Step 3: Get Your Missing Keys

Now open `apps/api/.env` in your editor and replace:

### A. Supabase Password
1. Go to https://ryulojxwynyannjmbkir.supabase.co
2. **Settings** → **Database**
3. Find or reset your password
4. Replace `YOUR_DB_PASSWORD` in both DATABASE_URL and DIRECT_URL

### B. OpenAI Key (Required for AI features)
1. Go to https://platform.openai.com/api-keys
2. Create new key
3. Replace `sk-YOUR_KEY_HERE`

### C. Pinecone Key (Required for semantic search)
1. Go to https://app.pinecone.io
2. **API Keys** → Create new key
3. Replace `YOUR_KEY_HERE`

---

## Step 4: Create Pinecone Indexes

1. In Pinecone dashboard, click **Create Index**

**First Index:**
- Name: `journal-embeddings`
- Dimensions: Choose **1024** or **768** (whatever's available)
- Metric: `cosine`
- Click Create

**Second Index:**
- Name: `knowledge-embeddings`
- Dimensions: **Same as first** (must match!)
- Metric: `cosine`
- Click Create

**Update .env if you chose 768:**
```bash
EMBEDDING_DIMENSION=768
```

---

## Step 5: Start Redis

```bash
docker-compose up -d
```

---

## Step 6: Setup Database

```bash
# Generate Prisma client
pnpm --filter api db:generate

# Run migrations (creates tables)
pnpm --filter api db:migrate

# Add sample data
pnpm --filter api db:seed
```

---

## Step 7: Start the App!

```bash
pnpm dev
```

Open http://localhost:5173 🎉

---

## ✅ Verification

You should see:
- Frontend at http://localhost:5173
- Backend logs showing "Sovereign Self API Server"
- No errors in terminal

Try signing up with Clerk - it should work!

---

## 🆘 If You Get Errors

**"Cannot connect to database"**
→ Check your database password in `.env`

**"Redis connection failed"**
→ Run `docker-compose up -d`

**"Pinecone errors"**
→ Make sure indexes exist with correct names

**"OpenAI errors"**
→ Check your API key is valid

---

**Need help?** Check the other .md files for detailed troubleshooting!

