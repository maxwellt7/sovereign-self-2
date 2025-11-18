# 🔐 Clerk Webhook Setup Guide (UPDATED - Working Method)

Your Clerk credentials are already configured! Now you need to get the webhook secret.

**Note**: The Clerk CLI doesn't exist, so we'll use a different approach.

---

## ✅ Already Configured

- **Publishable Key**: `pk_test_YmVjb21pbmctZ3JvdXNlLTc3LmNsZXJrLmFjY291bnRzLmRldiQ` ✅
- **Secret Key**: `sk_test_4YRMd6TP7TJ5ZbFpJArRJtQoQAaFDdkh6IUdsGDAzj` ✅
- **Frontend**: Configured in `apps/web/.env.local` ✅
- **Backend**: Configured in `apps/api/.env` ✅

**What's missing**: Webhook secret for syncing users to your database

---

## Option 1: Skip Webhook for Now (Fastest)

You can actually skip the webhook for initial development:

1. **Use a placeholder** in `apps/api/.env`:
   ```bash
   CLERK_WEBHOOK_SECRET=whsec_placeholder_for_testing
   ```

2. **Manually create users** in your database when testing:
   ```bash
   pnpm --filter api db:studio
   ```

3. **Set up webhook later** when you deploy to production

**Pro**: Get started immediately
**Con**: Users won't auto-sync to database (but app will still work for testing)

---

## Option 2: Use Ngrok for Local Webhooks (Recommended)

### Step 1: Install Ngrok

```bash
# Install via Homebrew
brew install ngrok

# Or download from https://ngrok.com
```

### Step 2: Start Your API Server

```bash
cd sovereign-self
pnpm --filter api dev
```

Your API is now running on http://localhost:3000

### Step 3: Create Ngrok Tunnel

```bash
# In a new terminal
ngrok http 3000
```

You'll see output like:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

Copy that `https://abc123.ngrok.io` URL.

### Step 4: Add Webhook in Clerk Dashboard

1. Go to https://dashboard.clerk.com
2. Select your app: **"becoming-grouse-77"**
3. Click **Webhooks** → **+ Add Endpoint**

4. **Configure:**
   - **Endpoint URL**: `https://abc123.ngrok.io/api/auth/webhooks/clerk`
     (Use your actual ngrok URL!)
   - **Description**: "Local development webhook"
   - **Subscribe to events**:
     - ✅ `user.created`
     - ✅ `user.updated`
     - ✅ `user.deleted`

5. Click **Create**

6. **Copy the Signing Secret** (starts with `whsec_`)

### Step 5: Add Secret to .env

```bash
# In apps/api/.env
CLERK_WEBHOOK_SECRET=whsec_YOUR_ACTUAL_SECRET
```

### Step 6: Restart API Server

```bash
# Stop the server (Ctrl+C)
# Start it again
pnpm --filter api dev
```

### Step 7: Test It!

1. Create a test user in Clerk dashboard
2. Watch your API terminal for:
   ```
   ✅ Created user in database: test@example.com
   ```

3. Verify in database:
   ```bash
   pnpm --filter api db:studio
   ```

**Important**: Keep ngrok running while developing. When ngrok restarts, you'll get a new URL and need to update the webhook in Clerk dashboard.

---

## Option 3: Production Setup (Skip for Now)

When you deploy to Railway:
1. Your webhook URL will be: `https://your-app.up.railway.app/api/auth/webhooks/clerk`
2. Add webhook in Clerk dashboard with that URL
3. Copy the signing secret to Railway environment variables

---

## Recommended Approach

For getting started **right now**:

### **Use Option 1** (Placeholder)
- Fastest way to start developing
- Set up webhook later
- Still get authentication working

### **Use Option 2** (Ngrok) when you want to test the full user sync flow

---

## Testing Without Webhook

Even without the webhook, you can:
- ✅ Sign up and sign in with Clerk
- ✅ Get JWT tokens
- ✅ Access protected routes
- ✅ Use all features

The webhook just ensures users are synced to your database automatically.

---

## Manual User Creation (If Needed)

If you want to test without webhook:

```bash
# Open Prisma Studio
pnpm --filter api db:studio

# Create a user manually:
# - Get your user ID from Clerk dashboard
# - Add a user record with that clerkUserId
```

Or use the seed script which creates a test user:
```bash
pnpm --filter api db:seed
```

---

## Updated Environment Files

I've created `.env.configured` files for you. To use them:

```bash
# Copy the configured templates
cp apps/api/.env.configured apps/api/.env
cp apps/web/.env.local.configured apps/web/.env.local

# Edit apps/api/.env and update:
# - Your Supabase database password
# - CLERK_WEBHOOK_SECRET=whsec_placeholder_for_testing
# - Your OpenAI key
# - Your Pinecone key
```

---

## Quick Start (Without Webhook)

```bash
cd sovereign-self

# 1. Install
pnpm install

# 2. Copy env files
cp apps/api/.env.configured apps/api/.env
cp apps/web/.env.local.configured apps/web/.env.local

# 3. Edit apps/api/.env with your keys
# (Use whsec_placeholder_for_testing for webhook secret)

# 4. Start Docker
docker-compose up -d

# 5. Setup database
pnpm --filter api db:generate
pnpm --filter api db:migrate
pnpm --filter api db:seed  # Creates test user

# 6. Start app
pnpm dev
```

Open http://localhost:5173 and you're ready to go! 🚀

---

**Recommendation**: Use Option 1 (placeholder) to start developing now. Add webhooks later when you need user sync. The app will work fine without it for testing!
