# 🔐 Clerk Webhook Setup Guide (React + Vite)

Your Clerk credentials are already configured! Now you need to get the webhook secret.

**Important**: Our project uses **React + Vite** (not Next.js), so the Clerk integration is simpler - we just need the webhook for user sync.

---

## ✅ Already Configured

- **Frontend**: `@clerk/clerk-react` (React components)
- **Backend**: `@clerk/clerk-sdk-node` (Node.js SDK)
- **Publishable Key**: `pk_test_YmVjb21pbmctZ3JvdXNlLTc3LmNsZXJrLmFjY291bnRzLmRldiQ`
- **Secret Key**: `sk_test_4YRMd6TP7TJ5ZbFpJArRJtQoQAaFDdkh6IUdsGDAzj`

---

## 🎯 What You Need: Webhook Secret

The webhook secret is used to verify that webhook events are actually coming from Clerk (not attackers).

---

## Option 1: For Local Development (Clerk CLI)

### Install Clerk CLI
```bash
npm install -g @clerk/clerk-cli
```

### Start Webhook Forwarding
```bash
# Login to Clerk
clerk login

# Forward webhooks to your local API
clerk forward --domain localhost:3000

# This will display:
# ✓ Webhook endpoint: http://localhost:3000/api/auth/webhooks/clerk
# ✓ Signing secret: whsec_xxxxxxxxxxxxx
```

### Copy the Secret
The CLI will show something like:
```
Signing secret: whsec_a1b2c3d4e5f6g7h8i9j0
```

Copy this and add to `apps/api/.env`:
```bash
CLERK_WEBHOOK_SECRET=whsec_a1b2c3d4e5f6g7h8i9j0
```

### Keep CLI Running
While developing, keep the `clerk forward` command running in a separate terminal.

---

## Option 2: For Production (Clerk Dashboard)

### Step 1: Deploy Your Backend First
You need a public URL for the webhook. Deploy to Railway first, then come back here.

Your webhook URL will be:
```
https://your-app-name.up.railway.app/api/auth/webhooks/clerk
```

### Step 2: Add Webhook in Clerk Dashboard

1. Go to https://dashboard.clerk.com
2. Select your application: **"becoming-grouse-77"**
3. Click **Webhooks** in the left sidebar
4. Click **+ Add Endpoint**

5. **Configure the webhook:**
   - **Endpoint URL**: `https://your-railway-app.up.railway.app/api/auth/webhooks/clerk`
   - **Description**: "User sync for Sovereign Self"
   - **Subscribe to events** (check these):
     - ✅ `user.created`
     - ✅ `user.updated`  
     - ✅ `user.deleted`

6. Click **Create**

7. **Copy the Signing Secret**
   - It starts with `whsec_`
   - Add to Railway environment variables as `CLERK_WEBHOOK_SECRET`

---

## Step 3: Test the Webhook

### Local Testing

```bash
# Start your API
pnpm --filter api dev

# In another terminal, start Clerk CLI forwarding
clerk forward --domain localhost:3000

# Go to Clerk Dashboard and create a test user
# Watch your API terminal for:
# ✅ Created user in database: test@example.com
```

### Verify in Database

```bash
# Open Prisma Studio
pnpm --filter api db:studio

# Check the users table - you should see the synced user
```

---

## What the Webhook Does

When you create/update/delete a user in Clerk:
1. Clerk sends a POST request to your webhook endpoint
2. Your API verifies the signature using the webhook secret
3. Your API creates/updates/deletes the user in your database
4. This keeps your database in sync with Clerk

---

## Webhook Endpoint Details

Your webhook is already implemented at:
- **File**: `apps/api/src/modules/auth/webhook.controller.ts`
- **URL**: `/api/auth/webhooks/clerk`
- **Method**: POST
- **Verification**: Uses `svix` library (already installed: `"svix": "^1.15.0"`)

### Supported Events:
- `user.created` → Creates user in your database
- `user.updated` → Updates user in your database
- `user.deleted` → Deletes user from your database

---

## Troubleshooting

### Webhook Not Working

**Check the logs:**
```bash
# Your API should show:
✅ Created user in database: user@example.com

# If you see errors:
❌ Missing CLERK_WEBHOOK_SECRET
❌ Invalid signature
```

**Common fixes:**
1. Make sure webhook secret is in `.env`
2. Restart API server after adding secret
3. For local dev, use Clerk CLI forwarding
4. Check Clerk dashboard for webhook delivery status

### "Missing CLERK_WEBHOOK_SECRET"
Add the secret to `apps/api/.env` and restart the server.

### "Invalid signature"  
Make sure you copied the complete secret from Clerk (no spaces, quotes, or extra characters).

### Local webhook not receiving events
Use Clerk CLI: `clerk forward --domain localhost:3000`

---

## Quick Reference

### Your Clerk App Details
- **App Name**: becoming-grouse-77
- **Dashboard**: https://dashboard.clerk.com
- **Domain**: becoming-grouse-77.clerk.accounts.dev

### Environment Variables Needed

**Backend (`apps/api/.env`):**
```bash
CLERK_SECRET_KEY=sk_test_4YRMd6TP7TJ5ZbFpJArRJtQoQAaFDdkh6IUdsGDAzj  # ✅ Set
CLERK_WEBHOOK_SECRET=whsec_GET_FROM_CLERK_DASHBOARD  # ⚠️ Need this
```

**Frontend (`apps/web/.env.local`):**
```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YmVjb21pbmctZ3JvdXNlLTc3LmNsZXJrLmFjY291bnRzLmRldiQ  # ✅ Set
```

---

## Next Steps

1. **For local development**:
   ```bash
   npm install -g @clerk/clerk-cli
   clerk login
   clerk forward --domain localhost:3000
   ```

2. **For production**:
   - Deploy backend to Railway first
   - Add webhook in Clerk dashboard
   - Copy signing secret to Railway environment variables

3. **Verify it works**:
   - Create a test user
   - Check database for synced user
   - View logs for success message

---

**Note**: Our project uses React + Vite (not Next.js), so we don't need middleware.ts or ClerkProvider in layout.tsx. Those are Next.js-specific. Our React setup with `<ClerkProvider>` in `main.tsx` is correct! ✅

