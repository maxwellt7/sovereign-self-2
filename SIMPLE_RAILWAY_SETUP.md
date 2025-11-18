# 🚂 Simple Railway Database Setup

## Run These Exact Commands:

```bash
# Step 1: Go to project directory
cd "/Users/maxmayes/Documents/Sovereign Self 2.0/sovereign-self"

# Step 2: Link to Railway (if not already linked)
railway link

# Step 3: Open Railway shell
railway shell
```

You'll now be inside the Railway container. Run:

```bash
# Step 4: Navigate to API directory
cd apps/api

# Step 5: Push database schema
npx prisma db push
```

When prompted "Are you sure?", type: **y**

You should see:
```
🚀  Your database is now in sync with your Prisma schema.
```

Then:
```bash
# Step 6: Exit Railway shell
exit
```

---

## ✅ Done!

Your production database now has all the tables:
- users
- journal_entries
- knowledge_base_items
- reflections
- growth_metrics
- user_goals

---

## 🧪 Test It:

```bash
curl https://your-railway-url.up.railway.app/health
```

Should return healthy status!

---

**That's it! Database is ready!** 🎉

See `POST_DEPLOYMENT_SETUP.md` for next steps.

