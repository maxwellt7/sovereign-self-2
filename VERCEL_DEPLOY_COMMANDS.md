# ▲ Vercel Deployment - Step by Step

Deploy your frontend to Vercel in minutes!

---

## Prerequisites

- Railway backend is deployed
- You have your Railway API URL
- Vercel account (sign up at https://vercel.com)

---

## Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

---

## Step 2: Login to Vercel

```bash
vercel login
```

Choose your login method (GitHub, GitLab, Email, etc.)

---

## Step 3: Deploy

```bash
cd "/Users/maxmayes/Documents/Sovereign Self 2.0/sovereign-self/apps/web"

# Deploy (will ask questions)
vercel
```

Answer the prompts:
- **Set up and deploy?** `Y`
- **Which scope?** Choose your account
- **Link to existing project?** `N`
- **Project name:** `sovereign-self` (or your choice)
- **Directory:** `.` (current directory)
- **Override settings?** `N`

---

## Step 4: Set Environment Variables

After initial deployment, set production environment variables:

```bash
# Set your Railway API URL (replace with your actual Railway URL)
vercel env add VITE_API_URL production

# When prompted, enter:
https://your-railway-url.up.railway.app/api

# Set Clerk key
vercel env add VITE_CLERK_PUBLISHABLE_KEY production

# When prompted, enter:
pk_test_YmVjb21pbmctZ3JvdXNlLTc3LmNsZXJrLmFjY291bnRzLmRldiQ
```

---

## Step 5: Deploy to Production

```bash
vercel --prod
```

This creates your production deployment!

---

## Step 6: Get Your Vercel URL

After deployment, Vercel will show your URL:
```
https://sovereign-self.vercel.app
```

Or check dashboard: https://vercel.com/dashboard

---

## Step 7: Update Railway CORS

Now that you have your Vercel URL, update Railway:

```bash
cd "/Users/maxmayes/Documents/Sovereign Self 2.0/sovereign-self"

railway variables set CORS_ORIGIN="https://your-app.vercel.app"
```

Replace with your actual Vercel URL!

---

## Step 8: Configure Clerk for Production

1. Go to https://dashboard.clerk.com
2. Select: "becoming-grouse-77"
3. Go to **Paths**
4. Add your Vercel domain as an allowed origin

---

## ✅ Verification

Visit your Vercel URL:
```
https://your-app.vercel.app
```

You should see:
- ✅ Sovereign Self login page
- ✅ Can sign up/sign in
- ✅ Can create journal entries
- ✅ Can use all features

---

## 🔄 Updates and Redeployment

### Deploy Updates

Every time you push to your git repo:
- Vercel automatically redeploys
- Preview deployments for branches

### Manual Redeploy

```bash
cd apps/web
vercel --prod
```

### Environment Variable Updates

```bash
vercel env ls  # List variables
vercel env add VARIABLE_NAME production  # Add new
vercel env rm VARIABLE_NAME production   # Remove
```

---

## 🎯 Post-Deployment Checklist

- [ ] Frontend accessible at Vercel URL
- [ ] Backend accessible at Railway URL
- [ ] Can sign up and sign in
- [ ] Can create journal entries
- [ ] Can create knowledge items
- [ ] Clerk webhook configured
- [ ] CORS updated in Railway
- [ ] Custom domain (optional)

---

## 🌐 Optional: Add Custom Domain

In Vercel dashboard:
1. Go to **Settings** → **Domains**
2. Click **Add**
3. Enter your domain
4. Follow DNS configuration instructions
5. Update Railway CORS to include your custom domain

---

## 🆘 Troubleshooting

**Build fails:**
```bash
vercel logs
# Check build logs for errors
```

**Cannot connect to API:**
- Verify VITE_API_URL is correct
- Check Railway API is running
- Update CORS_ORIGIN in Railway

**Clerk auth not working:**
- Check VITE_CLERK_PUBLISHABLE_KEY is set
- Verify Clerk app settings
- Check allowed domains in Clerk dashboard

**Blank page:**
- Check browser console for errors
- Verify all environment variables
- Check Vercel deployment logs

---

## 📊 Vercel Dashboard

Access at: https://vercel.com/dashboard

You can:
- View deployments
- Check analytics
- Monitor performance
- View build logs
- Manage environment variables
- Configure custom domains

---

## 🎊 You're Live!

Your Sovereign Self app is now deployed to production!

**Backend**: Railway
**Frontend**: Vercel
**Database**: Supabase
**Vector DB**: Pinecone
**Auth**: Clerk

Share your Vercel URL with users and start journaling! 📝✨

---

**Quick Deploy Summary:**

```bash
# Frontend
cd apps/web
vercel login
vercel
vercel env add VITE_API_URL production
# Enter your Railway URL
vercel --prod

# Update backend CORS
railway variables set CORS_ORIGIN="https://your-vercel-url.vercel.app"
```

That's it! 🚀

