# 🚂 Railway Setup - Simple Steps

## Step 1: Navigate to Your Project

```bash
cd "/Users/maxmayes/Documents/Sovereign Self 2.0/sovereign-self"
```

---

## Step 2: Link Your Railway Project

```bash
railway link
```

You'll see a list of your Railway projects. Select the one you deployed.

---

## Step 3: Run Database Setup

```bash
railway run "cd apps/api && npx prisma db push --accept-data-loss"
```

This creates all tables in your production database.

---

## ✅ That's It!

Your database is now set up on Railway with all the tables.

---

## 🧪 Verify It Worked

```bash
# Get your Railway URL
railway domain

# Test health check (replace with your URL)
curl https://your-url.up.railway.app/health
```

---

## 🆘 If You Get "No linked project"

Make sure you've run:
```bash
railway link
```

This connects your local folder to your Railway deployment.

---

## Alternative: Use Railway Dashboard

1. Go to https://railway.app/dashboard
2. Click your project
3. Click your service
4. Find the "Shell" or "Terminal" tab
5. Run these commands in the web terminal:
   ```bash
   cd apps/api
   npx prisma db push
   ```

---

**Database setup complete!** 🎉

