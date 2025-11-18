# 🎯 Commands to Run Now

Copy and paste these commands to complete your production setup.

---

## 1. Link to Railway Project

```bash
cd "/Users/maxmayes/Documents/Sovereign Self 2.0/sovereign-self"
railway link
```

Select your deployed project from the list.

---

## 2. Get Railway URL

```bash
railway domain
```

**Copy the URL** (e.g., `https://sovereign-self-production.up.railway.app`)

---

## 3. Run Database Migration on Railway

```bash
railway run --service your-service-name "cd apps/api && npx prisma db push"
```

Or use this simpler command:
```bash
railway shell
cd apps/api
npx prisma db push
exit
```

This creates all tables in your production database.

---

## 4. Get Vercel URL

```bash
cd "/Users/maxmayes/Documents/Sovereign Self 2.0/sovereign-self/apps/web"
vercel ls
```

**Copy your production URL** (e.g., `https://sovereign-self.vercel.app`)

---

## 5. Update Railway CORS

Replace `YOUR_VERCEL_URL` with your actual URL:

```bash
cd "/Users/maxmayes/Documents/Sovereign Self 2.0/sovereign-self"
railway variables set CORS_ORIGIN="https://YOUR_VERCEL_URL.vercel.app"
```

---

## 6. Update Vercel API URL

Replace `YOUR_RAILWAY_URL` with your actual URL:

```bash
cd "/Users/maxmayes/Documents/Sovereign Self 2.0/sovereign-self/apps/web"

# Remove old value
vercel env rm VITE_API_URL production

# Add new value
vercel env add VITE_API_URL production
```

When prompted, enter: `https://YOUR_RAILWAY_URL.up.railway.app/api`

Then redeploy:
```bash
vercel --prod
```

---

## 7. Test Your Production App

Replace with your actual Vercel URL:

```bash
curl https://YOUR_VERCEL_URL.vercel.app
```

Should return HTML.

Test API:
```bash
curl https://YOUR_RAILWAY_URL.up.railway.app/health
```

Should return JSON with "healthy" status.

---

## 8. Configure Clerk Webhook

**Go to Clerk Dashboard:**
1. Visit: https://dashboard.clerk.com
2. Select: "becoming-grouse-77"
3. Click **"Webhooks"** → **"+ Add Endpoint"**
4. **URL**: `https://YOUR_RAILWAY_URL.up.railway.app/api/auth/webhooks/clerk`
5. **Events**: user.created, user.updated, user.deleted
6. **Create** and copy the signing secret

**Update Railway:**
```bash
railway variables set CLERK_WEBHOOK_SECRET="whsec_YOUR_ACTUAL_SECRET"
```

---

## 9. Create Pinecone Indexes

Go to: https://app.pinecone.io

**Create two indexes:**
1. Name: `journal-embeddings`, Dimensions: 1024, Metric: cosine
2. Name: `knowledge-embeddings`, Dimensions: 1024, Metric: cosine

---

## 10. Final Verification

**Visit your Vercel URL** and:
- [ ] Sign up with your email
- [ ] Create a journal entry
- [ ] Create a knowledge item
- [ ] Check analytics page
- [ ] Try AI search (after Pinecone is ready)

---

## ✅ You're Done!

Your app is live in production! 🚀

**Share your Vercel URL** and start using Sovereign Self! ✨

---

## 📱 Quick Reference

**Dashboards:**
- Railway: https://railway.app/dashboard
- Vercel: https://vercel.com/dashboard
- Supabase: https://supabase.com/dashboard
- Pinecone: https://app.pinecone.io
- Clerk: https://dashboard.clerk.com

**Local Dev:**
```bash
pnpm dev  # Start local servers
```

**View Logs:**
```bash
railway logs  # Backend logs
vercel logs   # Frontend logs
```

