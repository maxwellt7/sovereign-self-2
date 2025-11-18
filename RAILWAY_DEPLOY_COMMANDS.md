# 🚂 Railway Deployment - Run These Commands

All your API keys are configured. Just run these commands to deploy!

---

## Step 1: Login to Railway

```bash
cd "/Users/maxmayes/Documents/Sovereign Self 2.0/sovereign-self"

railway login
```

This will open your browser. Login with:
- GitHub
- Google
- Or email

---

## Step 2: Create New Project

```bash
railway init
```

When prompted:
- **Project name**: `sovereign-self-api` (or your choice)
- **Choose**: Empty Project

---

## Step 3: Add Redis Database

```bash
railway add
```

Select: **Redis**

Railway will automatically add `REDIS_URL` to your environment.

---

## Step 4: Set All Environment Variables

Run this command to set all variables at once:

```bash
railway variables set \
  DATABASE_URL="your_supabase_database_url" \
  DIRECT_URL="your_supabase_direct_url" \
  CLERK_SECRET_KEY="your_clerk_secret_key" \
  CLERK_WEBHOOK_SECRET="whsec_placeholder" \
  OPENAI_API_KEY="your_openai_api_key" \
  PINECONE_API_KEY="your_pinecone_api_key" \
  PINECONE_ENVIRONMENT="us-east-1-aws" \
  PINECONE_INDEX_JOURNAL="journal-embeddings" \
  PINECONE_INDEX_KNOWLEDGE="knowledge-embeddings" \
  EMBEDDING_DIMENSION="1024" \
  PORT="3000" \
  NODE_ENV="production" \
  CORS_ORIGIN="*"
```

---

## Step 5: Deploy!

```bash
railway up
```

This will:
- Build your app
- Upload to Railway
- Start the service

Wait for it to complete (2-3 minutes).

---

## Step 6: Get Your Railway URL

```bash
railway domain
```

This will show your app URL, like:
```
sovereign-self-api-production.up.railway.app
```

**Save this URL!** You'll need it for:
- Frontend deployment
- Clerk webhook

Or visit Railway dashboard and click "Generate Domain" if no domain exists.

---

## Step 7: Run Database Setup

```bash
# Push database schema
railway run npx prisma db push

# Seed with sample data (optional)
railway run pnpm --filter api db:seed
```

---

## Step 8: Test Your Deployed API

```bash
# Get your Railway URL first
railway domain

# Then test (replace with your actual URL):
curl https://your-railway-url.up.railway.app/health
```

Should return:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "environment": "production"
  }
}
```

---

## Step 9: Configure Clerk Webhook

1. Go to https://dashboard.clerk.com
2. Select: "becoming-grouse-77"
3. Click **Webhooks** → **+ Add Endpoint**
4. **URL**: `https://your-railway-url.up.railway.app/api/auth/webhooks/clerk`
5. **Events**: Select `user.created`, `user.updated`, `user.deleted`
6. Click **Create**
7. **Copy the signing secret** (starts with `whsec_`)

Update Railway:
```bash
railway variables set CLERK_WEBHOOK_SECRET="whsec_your_actual_secret"
```

---

## Step 10: Update CORS (After Frontend Deploy)

After deploying frontend to Vercel:
```bash
railway variables set CORS_ORIGIN="https://your-app.vercel.app"
```

---

## ✅ Deployment Checklist

- [ ] Railway CLI installed
- [ ] Logged into Railway
- [ ] Project created
- [ ] Redis added
- [ ] Environment variables set
- [ ] App deployed
- [ ] Database pushed
- [ ] Health check passing
- [ ] Clerk webhook configured
- [ ] CORS updated (after frontend deploy)

---

## 🎯 Quick Commands Reference

```bash
# View logs
railway logs

# Check status
railway status

# Open in browser
railway open

# View environment
railway variables

# Redeploy
railway up

# Link existing project
railway link
```

---

## 🆘 Troubleshooting

**Build fails:**
```bash
railway logs
# Check for missing dependencies or build errors
```

**Health check fails:**
```bash
railway logs --follow
# Watch live logs for errors
```

**Database connection fails:**
- Verify DATABASE_URL is correct
- Check Supabase allows connections from Railway IPs
- Try using direct URL instead of pooled

**Redis errors:**
- Make sure Redis addon is added
- Check REDIS_URL is set automatically

---

## Next: Deploy Frontend

Once Railway backend is deployed:
1. Get your Railway URL
2. Go to Vercel deployment (see `VERCEL_DEPLOY_COMMANDS.md`)
3. Set VITE_API_URL to your Railway URL
4. Deploy!

---

**Your backend will be live on Railway! 🚀**

