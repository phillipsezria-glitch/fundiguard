# 🚀 Vercel Production Deployment Guide

## Step 1: ✅ Code Pushed to GitHub
- [x] Committed changes
- [x] Pushed to origin/main
- [x] Vercel linked to project

## Step 2: Set Environment Variables on Vercel Dashboard

Visit: **https://vercel.com/phillips-projects-442c0a01/fundiguard.ke/settings/environment-variables**

### Required Variables for Production:

**Add these environment variables:**

```
Name: NEXT_PUBLIC_API_URL
Value: https://fundiguard-api.herokuapp.com
Environments: Production

Name: NEXT_PUBLIC_MAPBOX_TOKEN  
Value: 37w2XmOxao20xVh4Eby1ZUMhsTs9P8sv
Environments: Production

Name: NODE_ENV
Value: production
Environments: Production
```

**Steps to add:**
1. Go to: https://vercel.com/phillips-projects-442c0a01/fundiguard.ke/settings/environment-variables
2. Click "Add New..."
3. Fill in Name, Value
4. Select "Production" checkbox
5. Click "Add"
6. Repeat for each variable

## Step 3: Deploy to Production

After setting environment variables, run:

```bash
# Option A: Deploy from CLI
vercel --prod

# Option B: Deploy from Vercel Dashboard
# Just push to main branch, Vercel auto-deploys
```

## Step 4: Verify Deployment

```bash
# Check deployment status
vercel list

# View production URL
vercel env list --prod
```

---

## 🔴 CRITICAL: Before Deploying

**Update this value based on your backend:**

If your backend is NOT on Heroku:
1. Update `NEXT_PUBLIC_API_URL` to your actual backend domain
2. Make sure CORS is configured on backend for this domain

---

## ✅ Quick Checklist

- [ ] Frontend pushed to GitHub (main branch)
- [ ] Vercel linked to project
- [ ] Environment variables set on Vercel dashboard
- [ ] `NEXT_PUBLIC_API_URL` points to correct backend
- [ ] Run `vercel --prod` to deploy
- [ ] Verify site loads at https://fundiguard-ke.vercel.app
- [ ] Test login at https://fundiguard-ke.vercel.app/auth

---

**Current Project:** phillips-projects-442c0a01/fundiguard.ke  
**Repository:** https://github.com/phillipsezria-glitch/fundiguard
