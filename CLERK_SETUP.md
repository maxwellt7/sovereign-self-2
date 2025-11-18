# Clerk Webhook Setup Guide

Your Clerk credentials are already configured! Now you need to set up the webhook to sync users to your database.

## Step 1: Generate Webhook Secret

### Option A: For Local Development (Using Clerk CLI)

```bash
# Install Clerk CLI
npm install -g @clerk/clerk-cli

# Login to Clerk
clerk login

# Forward webhooks to your local server
clerk forward --domain localhost:3000
```

This will:
- Start a tunnel to your local server
- Display your webhook secret
- Copy the secret and add it to `apps/api/.env` as `CLERK_WEBHOOK_SECRET`

### Option B: For Production (Using Clerk Dashboard)

1. Go to https://dashboard.clerk.com
2. Select your application: "becoming-grouse-77"
3. Navigate to **Webhooks** in the sidebar
4. Click **Add Endpoint**

5. Configure the endpoint:
   - **Endpoint URL**: `https://your-railway-app.up.railway.app/api/auth/webhooks/clerk`
   - **Description**: User sync webhook
   - **Subscribe to events**:
     - ✅ user.created
     - ✅ user.updated
     - ✅ user.deleted

6. Click **Create**

7. Copy the **Signing Secret** (starts with `whsec_`)
   - For local: Add to `apps/api/.env` as `CLERK_WEBHOOK_SECRET`
   - For production: Add to Railway environment variables

## Step 2: Test the Webhook

### Local Testing

```bash
# Start your API server
pnpm --filter api dev

# The webhook endpoint will be available at:
# http://localhost:3000/api/auth/webhooks/clerk
```

### Verify It Works

1. Create a test user in Clerk Dashboard
2. Check your terminal logs for: `✅ Created user in database: test@example.com`
3. Verify in Prisma Studio: `pnpm --filter api db:studio`

## Step 3: Update Environment Variable

Once you have the webhook secret, update your `.env` file:

```bash
# In apps/api/.env
CLERK_WEBHOOK_SECRET=whsec_YOUR_ACTUAL_SECRET_HERE
```

## Troubleshooting

### Webhook Not Receiving Events

1. **Check the URL is correct**
   - Local: Must use Clerk CLI forwarding
   - Production: Must be your Railway URL

2. **Verify the secret is correct**
   - Copy the exact secret from Clerk dashboard
   - No extra spaces or quotes

3. **Check logs**
   ```bash
   # View Railway logs
   railway logs
   
   # View local logs
   # Watch your terminal where the API is running
   ```

4. **Test the endpoint manually**
   ```bash
   curl -X POST http://localhost:3000/api/auth/webhooks/clerk \
     -H "Content-Type: application/json" \
     -H "svix-id: test" \
     -H "svix-timestamp: 1234567890" \
     -H "svix-signature: test" \
     -d '{"type":"user.created","data":{}}'
   ```

### Common Issues

**Issue**: "Missing CLERK_WEBHOOK_SECRET"
- **Solution**: Add the webhook secret to your `.env` file

**Issue**: "Invalid signature"
- **Solution**: Make sure you're using the correct signing secret from Clerk

**Issue**: "Webhook not firing"
- **Solution**: For local dev, make sure Clerk CLI is running: `clerk forward --domain localhost:3000`

## Current Configuration

Your Clerk keys are already set:
- ✅ **Publishable Key**: `pk_test_YmVjb21pbmctZ3JvdXNlLTc3LmNsZXJrLmFjY291bnRzLmRldiQ`
- ✅ **Secret Key**: `sk_test_4YRMd6TP7TJ5ZbFpJArRJtQoQAaFDdkh6IUdsGDAzj`
- ⏳ **Webhook Secret**: Follow steps above to get this

## Next Steps

1. Get the webhook secret (see Option A or B above)
2. Add it to `apps/api/.env`
3. Restart your API server
4. Test by creating a user in Clerk
5. Verify user appears in your database

That's it! Your Clerk integration will be fully operational. 🎉

