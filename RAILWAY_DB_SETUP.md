# 🚂 Railway Database Setup

Quick guide to set up your production database on Railway.

---

## Method 1: Railway Shell (Easiest)

```bash
cd "/Users/maxmayes/Documents/Sovereign Self 2.0/sovereign-self"

# Connect to Railway
railway link

# Open Railway shell
railway shell

# Once in the shell:
cd apps/api
npx prisma db push

# Type 'exit' when done
exit
```

---

## Method 2: Via Railway Dashboard

1. Go to https://railway.app/dashboard
2. Click your project
3. Click your service
4. Click the **"Shell"** tab or **"Terminal"** button
5. In the shell, run:
   ```bash
   cd apps/api
   npx prisma db push
   ```

---

## Method 3: One-Line Command

```bash
railway run "cd apps/api && npx prisma db push"
```

---

## ✅ Expected Output

You should see:
```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "postgres"

🚀  Your database is now in sync with your Prisma schema. Done in 2.87s

✔ Generated Prisma Client
```

---

## 🌱 Optional: Seed Production Data

```bash
railway shell
cd apps/api
pnpm db:seed
exit
```

This adds sample data (test user, journal entry, etc.)

**Warning**: Only do this on a fresh database!

---

## ✅ Verification

Check your Supabase dashboard:
1. Go to https://ryulojxwynyannjmbkir.supabase.co
2. Click **"Table Editor"**
3. You should see these tables:
   - users
   - journal_entries
   - knowledge_base_items
   - reflections
   - growth_metrics
   - user_goals

---

## 🆘 Troubleshooting

**"Could not find Prisma Schema"**
→ Make sure you're in the `apps/api` directory first:
```bash
cd apps/api
```

**"Connection timeout"**
→ Check DATABASE_URL in Railway variables
→ Verify Supabase project is active

**"Permission denied"**
→ Check database password is correct in Railway variables

**"Database locked"**
→ Wait a few seconds and try again
→ Only one migration can run at a time

---

## 🎯 After Database is Set Up

Your Railway API will be fully operational:
- ✅ All tables created
- ✅ Ready to accept requests
- ✅ Webhooks will work
- ✅ Users can be created

Test it:
```bash
curl https://your-railway-url.up.railway.app/health
```

Should return:
```json
{
  "success": true,
  "data": {
    "status": "healthy"
  }
}
```

---

**That's it! Database is ready on Railway!** 🎉

