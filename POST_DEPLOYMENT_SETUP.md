# 🎯 Post-Deployment Configuration

Your app is deployed! Now let's connect everything together.

---

## Step 1: Get Your Deployment URLs

### Get Railway URL
```bash
cd "/Users/maxmayes/Documents/Sovereign Self 2.0/sovereign-self"
railway domain
```

Or check Railway dashboard: https://railway.app/dashboard

Your Railway URL will look like:
```
https://sovereign-self-api-production.up.railway.app
```

### Get Vercel URL
```bash
cd "/Users/maxmayes/Documents/Sovereign Self 2.0/sovereign-self/apps/web"
vercel ls
```

Or check Vercel dashboard: https://vercel.com/dashboard

Your Vercel URL will look like:
```
https://sovereign-self.vercel.app
```

---

## Step 2: Run Database Migrations on Railway

```bash
cd "/Users/maxmayes/Documents/Sovereign Self 2.0/sovereign-self"

# Option A: Using Railway shell (easiest)
railway shell
cd apps/api
npx prisma db push
exit

# Option B: Direct command
railway run "cd apps/api && npx prisma db push"
```

**Note**: You may see a warning about migrations - that's okay for initial setup.

---

## Step 3: Update Railway CORS

Allow your frontend to access the API:

```bash
railway variables set CORS_ORIGIN="https://your-vercel-url.vercel.app"
```

Replace with your actual Vercel URL!

---

## Step 4: Update Vercel Environment Variables

Your frontend needs to know where the API is:

```bash
cd "/Users/maxmayes/Documents/Sovereign Self 2.0/sovereign-self/apps/web"

# Update API URL
vercel env rm VITE_API_URL production
vercel env add VITE_API_URL production
# Enter: https://your-railway-url.up.railway.app/api

# Redeploy with new variables
vercel --prod
```

---

## Step 5: Configure Clerk Production Webhook

1. Go to https://dashboard.clerk.com
2. Select: "becoming-grouse-77"
3. Click **Webhooks** → **+ Add Endpoint**

4. **Configure:**
   - **URL**: `https://your-railway-url.up.railway.app/api/auth/webhooks/clerk`
   - **Description**: Production webhook
   - **Events**: 
     - ✅ user.created
     - ✅ user.updated
     - ✅ user.deleted

5. Click **Create**

6. **Copy the Signing Secret** (starts with `whsec_`)

7. **Update Railway:**
```bash
railway variables set CLERK_WEBHOOK_SECRET="whsec_your_actual_secret"
```

---

## Step 6: Verify Everything Works

### Test Backend
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

### Test Frontend
Visit: https://your-vercel-url.vercel.app

You should see:
- ✅ Login page
- ✅ Can sign up
- ✅ Can sign in
- ✅ Dashboard loads

### Test Webhook
1. Sign up with a new email
2. Check Railway logs: `railway logs`
3. Look for: "✅ Created user in database: your@email.com"

---

## Step 7: Create Pinecone Indexes (If Not Already Done)

Go to https://app.pinecone.io

**Create Two Indexes:**

**Index 1:**
- Name: `journal-embeddings`
- Dimensions: 1024 (or 768)
- Metric: cosine

**Index 2:**
- Name: `knowledge-embeddings`
- Dimensions: Same as Index 1
- Metric: cosine

If you used 768, update Railway:
```bash
railway variables set EMBEDDING_DIMENSION="768"
```

---

## ✅ Post-Deployment Checklist

- [ ] Railway URL obtained
- [ ] Vercel URL obtained
- [ ] Database migrated on Railway
- [ ] CORS updated in Railway
- [ ] Vercel API URL updated
- [ ] Clerk webhook configured
- [ ] Backend health check passing
- [ ] Frontend loads correctly
- [ ] Can sign up/sign in
- [ ] Pinecone indexes created
- [ ] AI features working

---

## 🔧 Useful Commands

**Railway:**
```bash
railway logs           # View logs
railway status         # Check status
railway variables      # List env vars
railway open           # Open dashboard
```

**Vercel:**
```bash
vercel logs            # View logs
vercel ls              # List deployments
vercel inspect         # Inspect deployment
```

---

## 🎊 Production is Live!

Once all steps are complete:
- Visit your Vercel URL
- Sign up and start using your app
- Share with others!

Your production-grade personal development platform is now live! 🚀

---

## 🆘 Troubleshooting

**Backend not responding:**
- Check Railway logs: `railway logs`
- Verify environment variables: `railway variables`
- Check database connection

**Frontend can't connect to API:**
- Verify VITE_API_URL in Vercel
- Check CORS_ORIGIN in Railway
- Make sure both match

**Clerk auth not working:**
- Verify webhook is configured
- Check webhook secret in Railway
- Test webhook in Clerk dashboard

**AI features not working:**
- Create Pinecone indexes
- Verify PINECONE_API_KEY in Railway
- Check OpenAI API key is valid

---

**Need the actual URLs and keys?** They're in your:
- Railway dashboard: https://railway.app/dashboard
- Vercel dashboard: https://vercel.com/dashboard
- Clerk dashboard: https://dashboard.clerk.com

