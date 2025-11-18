# 🎯 START HERE - Getting Your App Running

Follow these steps in order to get Sovereign Self running locally.

---

## Step 1: Install Dependencies

```bash
cd sovereign-self
pnpm install
```

✅ This is done automatically and installs everything.

---

## Step 2: Get Your API Keys

You already have most keys! Here's what you need to do:

### A. Supabase Database Password ⚠️ REQUIRED

1. Go to https://ryulojxwynyannjmbkir.supabase.co
2. Navigate to **Settings** → **Database**  
3. Look for "Database Password" section
4. Copy or reset your password
5. Save it for the next step

### B. Clerk Webhook Secret ⚠️ REQUIRED

```bash
# Install Clerk CLI
npm install -g @clerk/clerk-cli

# Login
clerk login

# Start forwarding (keep this running)
clerk forward --domain localhost:3000

# This will show: "Signing secret: whsec_xxxxx"
# Copy that secret!
```

### C. OpenAI API Key ⚠️ REQUIRED

1. Go to https://platform.openai.com/api-keys
2. Create a new key
3. Copy it (starts with `sk-`)

### D. Pinecone API Key ⚠️ REQUIRED

1. Go to https://app.pinecone.io
2. Navigate to **API Keys**
3. Create a new key
4. Copy it

---

## Step 3: Configure Environment Files

### Backend Configuration

Copy the template:
```bash
cp apps/api/.env.configured apps/api/.env
```

Edit `apps/api/.env` and replace:
- `YOUR_DB_PASSWORD` → Your Supabase password from Step 2A
- `FOLLOW_STEPS_IN_CLERK_WEBHOOK_GUIDE.md` → Your webhook secret from Step 2B
- `sk-YOUR_OPENAI_KEY_HERE` → Your OpenAI key from Step 2C
- `YOUR_PINECONE_KEY_HERE` → Your Pinecone key from Step 2D

### Frontend Configuration

Copy the template:
```bash
cp apps/web/.env.local.configured apps/web/.env.local
```

This file is already configured! ✅

---

## Step 4: Set Up Pinecone Indexes

1. Go to https://app.pinecone.io
2. Click **Create Index**

**Index 1:**
- Name: `journal-embeddings`
- Dimensions: Choose from available (768 or 1024 recommended)
- Metric: `cosine`
- Click Create

**Index 2:**
- Name: `knowledge-embeddings`  
- Dimensions: **Same as Index 1** (must match!)
- Metric: `cosine`
- Click Create

**Update your .env:**
```bash
# In apps/api/.env, add this line:
EMBEDDING_DIMENSION=1024  # or whatever you chose (768, 1024, etc.)
```

---

## Step 5: Start Docker Services

```bash
# Start Redis
docker-compose up -d

# Verify it's running
docker ps
```

You should see a container named `sovereign-self-redis`.

---

## Step 6: Set Up Database

```bash
# Generate Prisma Client
pnpm --filter api db:generate

# Run migrations (creates tables)
pnpm --filter api db:migrate

# Add sample data (optional but recommended)
pnpm --filter api db:seed
```

---

## Step 7: Start Development Servers

```bash
# Start everything (frontend + backend)
pnpm dev
```

This starts:
- **Backend API**: http://localhost:3000
- **Frontend**: http://localhost:5173

---

## Step 8: Test It Out!

1. Open http://localhost:5173
2. Click "Sign Up"
3. Create an account with Clerk
4. You should see the dashboard!

**Check webhook worked:**
```bash
# In your API terminal, you should see:
✅ Created user in database: your-email@example.com

# Verify in database:
pnpm --filter api db:studio
```

---

## ✅ Verification Checklist

After completing setup:

- [ ] Backend API running on port 3000
- [ ] Frontend running on port 5173
- [ ] Can access http://localhost:5173
- [ ] Can sign up/sign in with Clerk
- [ ] User appears in database (check Prisma Studio)
- [ ] Redis is running (check `docker ps`)
- [ ] No errors in terminal

---

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error
- Check your password is correct in DATABASE_URL
- Make sure there are no extra spaces
- Try resetting password in Supabase dashboard

### Webhook Errors
- Make sure Clerk CLI is running: `clerk forward --domain localhost:3000`
- Check webhook secret is in `.env`
- Restart API server

### Redis Connection Failed
```bash
docker-compose restart redis
```

### Pinecone Errors
- Verify indexes exist and are "Ready"
- Check API key is correct
- Ensure dimensions match in both indexes

---

## 📚 Need More Help?

- **Quick start**: `QUICK_START.md`
- **Detailed setup**: `SETUP.md`
- **Clerk webhooks**: `CLERK_WEBHOOK_GUIDE.md`
- **Pinecone setup**: `PINECONE_SETUP.md`
- **Deployment**: `DEPLOYMENT.md`

---

## 🎊 You're All Set!

Once everything is running:
- Create your first journal entry
- Try the AI-powered semantic search
- Build your knowledge base
- Track your growth with analytics

**Happy journaling! 📝✨**

