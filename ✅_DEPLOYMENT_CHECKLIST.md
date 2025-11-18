# ✅ Post-Deployment Configuration Checklist

Your apps are deployed! Complete these steps to connect everything.

---

## 📋 **Configuration Tasks**

### ✅ Step 1: Get Your URLs

**Railway Backend URL:**
- Go to: https://railway.app/dashboard
- Find your "sovereign-self" project
- Copy the URL (looks like: `https://xxx.up.railway.app`)

**Vercel Frontend URL:**
- Go to: https://vercel.com/dashboard
- Find your "sovereign-self" project
- Copy the URL (looks like: `https://sovereign-self.vercel.app`)

**Write them down:**
- Railway: `_______________________________`
- Vercel: `_______________________________`

---

### ✅ Step 2: Run Database Migration on Railway

In Railway dashboard:
1. Go to your project
2. Click on your service
3. Go to **"Settings"** tab
4. Scroll to **"Deploy"** section
5. Add **Custom Start Command**:
   ```
   npx prisma db push && node dist/server.js
   ```
6. Click **"Redeploy"**

This will create all database tables in production.

---

### ✅ Step 3: Update Environment Variables

#### In Railway Dashboard:

1. Click your service → **"Variables"** tab
2. Find `CORS_ORIGIN` and update to:
   ```
   https://your-vercel-url.vercel.app
   ```
   (Replace with your actual Vercel URL)

3. Save and redeploy

#### In Vercel Dashboard:

1. Click your project → **"Settings"** → **"Environment Variables"**
2. Find or add `VITE_API_URL`:
   ```
   https://your-railway-url.up.railway.app/api
   ```
   (Replace with your actual Railway URL)

3. Make sure it's set for **"Production"**
4. Go to **"Deployments"** → Click **"Redeploy"**

---

### ✅ Step 4: Configure Clerk Production Webhook

1. Go to: https://dashboard.clerk.com
2. Select: **"becoming-grouse-77"**
3. Click **"Webhooks"** in sidebar
4. Click **"+ Add Endpoint"**

5. **Configure:**
   - **Endpoint URL**: `https://your-railway-url.up.railway.app/api/auth/webhooks/clerk`
   - **Description**: Production user sync
   - **Subscribe to events**:
     - ✅ user.created
     - ✅ user.updated
     - ✅ user.deleted

6. Click **"Create"**

7. **Copy the Signing Secret** (starts with `whsec_`)

8. **Add to Railway:**
   - Go to Railway dashboard
   - Your service → **"Variables"**
   - Find `CLERK_WEBHOOK_SECRET`
   - Update with the actual secret: `whsec_xxxxx`
   - Redeploy

---

### ✅ Step 5: Create Pinecone Indexes

Go to: https://app.pinecone.io

**Create Index 1:**
- Click **"Create Index"**
- Name: `journal-embeddings`
- Dimensions: **1024** (or 768 if not available)
- Metric: **cosine**
- Click **"Create"**

**Create Index 2:**
- Name: `knowledge-embeddings`
- Dimensions: **Same as Index 1** (must match!)
- Metric: **cosine**
- Click **"Create"**

**If you used 768:**
- Go to Railway → Variables
- Update: `EMBEDDING_DIMENSION=768`
- Redeploy

---

### ✅ Step 6: Test Production App

**Test Backend:**
```bash
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

**Test Frontend:**
1. Visit: `https://your-vercel-url.vercel.app`
2. You should see the Sovereign Self login page
3. Try signing up with your email
4. Should load dashboard after sign-in

**Test Webhook:**
1. Sign up with a test email
2. Check Railway logs for: "✅ Created user in database"
3. User should appear in your Supabase database

---

### ✅ Step 7: Optional Configurations

#### Add Custom Domain (Vercel):
1. Vercel dashboard → Settings → Domains
2. Add your domain
3. Follow DNS configuration
4. Update CORS in Railway with custom domain

#### Enable Monitoring:

**Sentry (Error Tracking):**
1. Create project at https://sentry.io
2. Get DSN
3. Add to Railway: `SENTRY_DSN=your_dsn`
4. Add to Vercel: `VITE_SENTRY_DSN=your_dsn`

**PostHog (Analytics):**
1. Create project at https://posthog.com
2. Get API key
3. Add to Vercel: `VITE_POSTHOG_KEY=your_key`

---

## 🎯 **Configuration Summary**

Fill in as you complete:

**URLs:**
- [ ] Railway URL: `_______________________________`
- [ ] Vercel URL: `_______________________________`

**Railway Variables:**
- [ ] CORS_ORIGIN updated with Vercel URL
- [ ] CLERK_WEBHOOK_SECRET updated with real secret
- [ ] Database migrated (prisma db push)
- [ ] All other variables verified

**Vercel Variables:**
- [ ] VITE_API_URL updated with Railway URL
- [ ] VITE_CLERK_PUBLISHABLE_KEY verified
- [ ] Redeployed after changes

**Clerk:**
- [ ] Production webhook added
- [ ] Webhook secret copied to Railway
- [ ] Tested user creation

**Pinecone:**
- [ ] journal-embeddings index created
- [ ] knowledge-embeddings index created
- [ ] Both use same dimensions
- [ ] EMBEDDING_DIMENSION set correctly

---

## 🧪 **Testing Your Production App**

### 1. Basic Functionality
- [ ] Can access Vercel URL
- [ ] Login page loads
- [ ] Can sign up
- [ ] Can sign in
- [ ] Dashboard loads

### 2. Core Features
- [ ] Can create journal entry
- [ ] Can edit journal entry
- [ ] Can view journal list
- [ ] Can create knowledge item
- [ ] Can view knowledge tree
- [ ] Analytics page loads

### 3. AI Features
- [ ] Semantic search works
- [ ] Can generate insights
- [ ] Mood analysis works

### 4. Admin Features (if admin)
- [ ] Can access admin panel
- [ ] Can see user list
- [ ] Can view system stats

---

## 🚀 **You're Live!**

Once all checkboxes are complete:
- Share your Vercel URL with users
- Start using your production app
- Monitor logs in Railway/Vercel dashboards

---

## 📊 **Monitoring Your App**

**Railway Dashboard:**
- View deployment logs
- Monitor resource usage
- Check environment variables
- View database connections

**Vercel Dashboard:**
- View deployment history
- Check analytics
- Monitor performance
- Review build logs

**Supabase Dashboard:**
- View database tables
- Check query performance
- Monitor connections
- Review logs

---

## 🆘 **Common Issues**

**"Cannot connect to API"**
- Verify CORS_ORIGIN in Railway matches Vercel URL exactly
- Check VITE_API_URL in Vercel matches Railway URL
- Both must be HTTPS

**"Webhook not working"**
- Verify webhook URL in Clerk is correct
- Check CLERK_WEBHOOK_SECRET in Railway
- View Railway logs for webhook errors

**"Database errors"**
- Make sure prisma db push was run
- Check DATABASE_URL in Railway
- Verify Supabase project is active

**"AI features not working"**
- Create Pinecone indexes
- Verify dimensions match
- Check OpenAI and Pinecone API keys

---

## 🎊 **Congratulations!**

Your Sovereign Self platform is now in production! 🚀

**Production Stack:**
- ✅ Frontend: Vercel (edge network, auto-scaling)
- ✅ Backend: Railway (containerized, Redis included)
- ✅ Database: Supabase (managed PostgreSQL)
- ✅ Vector DB: Pinecone (semantic search)
- ✅ Auth: Clerk (user management)
- ✅ AI: OpenAI (insights and embeddings)

**You built an enterprise-grade application!** 🎉

Share your URL and start helping people grow through reflection! ✨

