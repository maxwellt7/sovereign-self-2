# ⚡ Run These Commands in Your Terminal

Copy and paste these **one at a time** in your terminal:

---

## Step 1: Navigate to Project

```bash
cd "/Users/maxmayes/Documents/Sovereign Self 2.0/sovereign-self"
```

---

## Step 2: Link Railway Project

```bash
railway link
```

**You'll see a list** - select your deployed project (use arrow keys + Enter)

---

## Step 3: Set Up Production Database

```bash
railway run "cd apps/api && npx prisma db push --accept-data-loss"
```

**Wait for it to complete** - you'll see: "🚀 Your database is now in sync"

---

## Step 4: Get Your Railway URL

```bash
railway domain
```

**Copy this URL** - you'll need it for Vercel configuration

---

## Step 5: Update Vercel with Railway URL

```bash
cd apps/web
vercel env add VITE_API_URL production
```

**When prompted, paste**: `https://your-railway-url.up.railway.app/api`

Then redeploy:
```bash
vercel --prod
```

---

## Step 6: Update Railway CORS

```bash
cd ..
railway variables set CORS_ORIGIN="https://your-vercel-url.vercel.app"
```

Replace with your actual Vercel URL from dashboard

---

## ✅ Done!

Your production app is now fully connected and working!

Test it:
- Visit your Vercel URL
- Sign up
- Create journal entry
- Everything should work!

---

## 🎯 Still Need to Do:

1. **Create Pinecone indexes** (https://app.pinecone.io)
   - journal-embeddings (1024 dimensions, cosine)
   - knowledge-embeddings (1024 dimensions, cosine)

2. **Configure Clerk webhook** (https://dashboard.clerk.com)
   - Add webhook with Railway URL
   - Copy signing secret to Railway

---

**Your app is ready for production! 🚀**

