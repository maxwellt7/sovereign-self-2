# 🚂 Deploy to Railway - Step by Step

## Prerequisites
- Railway account (sign up at https://railway.app)
- Railway CLI installed
- Your local app is working

---

## Step 1: Install Railway CLI

```bash
# Install via Homebrew
brew install railway

# Or via npm
npm i -g @railway/cli

# Login
railway login
```

---

## Step 2: Initialize Railway Project

```bash
cd "/Users/maxmayes/Documents/Sovereign Self 2.0/sovereign-self"

# Create new Railway project
railway init

# When prompted:
# - Project name: sovereign-self-api (or your choice)
# - Choose: Empty Project
```

---

## Step 3: Add Redis Database

In Railway Dashboard (https://railway.app):
1. Open your project
2. Click **"+ New"** → **"Database"** → **"Add Redis"**
3. Wait for it to provision
4. Railway will automatically add `REDIS_URL` to your environment

---

## Step 4: Set Environment Variables

### Option A: Via Dashboard (Easier)

1. In Railway dashboard, click your service
2. Go to **"Variables"** tab
3. Click **"+ New Variable"**
4. Add each variable from `.env.railway` file:

```
DATABASE_URL=your_supabase_database_url
DIRECT_URL=your_supabase_direct_url
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=whsec_placeholder_update_after_deploy
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=us-east-1-aws
PINECONE_INDEX_JOURNAL=journal-embeddings
PINECONE_INDEX_KNOWLEDGE=knowledge-embeddings
EMBEDDING_DIMENSION=1024
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-app.vercel.app
```

### Option B: Via CLI

```bash
railway variables set DATABASE_URL="postgresql://postgres:Savage93!!@db.ryulojxwynyannjmbkir.supabase.co:5432/postgres"
railway variables set CLERK_SECRET_KEY="sk_test_4YRMd6TP7TJ5ZbFpJArRJtQoQAaFDdkh6IUdsGDAzj"
# ... continue for all variables
```

---

## Step 5: Deploy

```bash
cd "/Users/maxmayes/Documents/Sovereign Self 2.0/sovereign-self"

# Deploy to Railway
railway up
```

This will:
- Build your backend
- Upload to Railway
- Start the service

---

## Step 6: Run Database Migrations on Railway

```bash
# Connect to your Railway project
railway link

# Run migrations
railway run pnpm --filter api prisma db push
```

---

## Step 7: Get Your Railway URL

After deployment, Railway will give you a URL like:
```
https://sovereign-self-api-production.up.railway.app
```

Save this URL - you'll need it for:
1. Clerk webhook configuration
2. Vercel frontend deployment

---

## Step 8: Configure Clerk Webhook for Production

1. Go to https://dashboard.clerk.com
2. Select app: "becoming-grouse-77"
3. Click **Webhooks** → **+ Add Endpoint**
4. **Endpoint URL**: `https://your-railway-url.up.railway.app/api/auth/webhooks/clerk`
5. **Subscribe to**: `user.created`, `user.updated`, `user.deleted`
6. Click **Create**
7. **Copy the signing secret**

Update in Railway:
```bash
railway variables set CLERK_WEBHOOK_SECRET="whsec_your_actual_secret"
```

---

## Step 9: Update CORS for Your Frontend

Once you have your Vercel URL (from frontend deployment):
```bash
railway variables set CORS_ORIGIN="https://your-app.vercel.app"
```

---

## ✅ Verification

Test your deployed API:
```bash
curl https://your-railway-url.up.railway.app/health
```

Should return:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "...",
    "environment": "production"
  }
}
```

---

## 🎯 What's Next

After Railway is deployed:
1. **Deploy Frontend to Vercel** (see next steps)
2. **Update Clerk webhook** with Railway URL
3. **Update CORS_ORIGIN** in Railway with Vercel URL
4. **Test the production app**

---

## 🆘 Troubleshooting

**Build fails:**
- Check Railway build logs
- Verify all environment variables are set
- Make sure `nixpacks.toml` is present

**Health check fails:**
- Check Railway service logs
- Verify DATABASE_URL is correct
- Check if service is running

**Cannot connect to database:**
- Verify Supabase project is active
- Check database password is correct
- Try direct connection (not pooled)

---

Ready to deploy? Run these commands:

```bash
cd "/Users/maxmayes/Documents/Sovereign Self 2.0/sovereign-self"
railway login
railway init
railway up
```

