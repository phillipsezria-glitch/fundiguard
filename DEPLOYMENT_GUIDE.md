# FundiGuard Deployment Guide

## Frontend Deployment (Already Done ✅)

The Next.js frontend is being deployed from the root directory on Vercel.

**Status**: Building with fixed TypeScript configuration

---

## Backend Deployment (Next Step)

### Option 1: Deploy Backend to Vercel (Recommended)

The backend is an Express.js server and needs to be deployed separately.

**Requirements:**
- Vercel CLI installed: `npm install -g vercel`
- GitHub repository connected to Vercel

**Steps:**

1. **Deploy Backend as Separate Vercel Project**

```bash
cd backend
vercel --prod
```

2. **Environment Variables in Vercel Backend Project**

In Vercel Dashboard → Backend Project Settings → Environment Variables, add:

```
SUPABASE_URL=<your-supabase-url>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
SUPABASE_ANON_KEY=<your-anon-key>
JWT_SECRET=<generate-new-secure-secret>
NODE_ENV=production
```

3. **Update Frontend to Use Production Backend URL**

In Vercel Dashboard → Frontend Project Settings → Environment Variables, add:

```
NEXT_PUBLIC_API_URL=<your-backend-vercel-url>
```

Example: `https://fundiguard-backend.vercel.app`

---

### Option 2: Use Monorepo Deployment (Advanced)

For a single deployment with both frontend and backend, use:

1. **Install Vercel CLI**: `npm install -g vercel`
2. **From root**: `vercel --prod`
3. **Configure `vercel.json` at root** with builds for both

---

### Backend Deployment Verification

After deploying the backend, test it:

```bash
curl https://<your-backend-url>/health

# Should return:
# {"status":"ok","timestamp":"2026-02-24T14:48:21.075Z"}
```

---

## Production Environment Setup

### 1. Backend Database (Supabase)

✅ Already configured with:
- 16 tables created
- Schema imported
- Service role key active

**In Production:**
- Verify connection in Vercel logs
- Monitor database queries in Supabase dashboard

### 2. Frontend API Configuration

The frontend is configured to use environment variables:

```typescript
// app/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
```

### 3. Authentication Flow

The system uses JWT tokens + Supabase auth:
1. User registers/logs in
2. Backend validates and creates JWT token
3. Frontend stores token in localStorage
4. Token included in all API requests

---

## Deployment Checklist

### Before Production Deploy

- [ ] Backend secret keys in Vercel environment
- [ ] Frontend API URL points to production backend
- [ ] Database backups configured
- [ ] Error monitoring enabled (Vercel Analytics)
- [ ] CORS configured correctly
- [ ] Rate limiting enabled (optional)
- [ ] Logging configured

### After Deployment

- [ ] Test registration and login
- [ ] Test job creation and bidding
- [ ] Verify database writes
- [ ] Check error logs in Vercel
- [ ] Monitor performance metrics

---

## Troubleshooting

### Frontend Build Fails

**Error**: `Cannot find module '@supabase/supabase-js'`

**Solution**: Already fixed in `.vercelignore` and `tsconfig.json`

### Backend Not Responding

**Check**:
1. Backend URL in frontend .env
2. Backend metrics in Vercel dashboard
3. Environment variables set in Vercel
4. Supabase connection status

### Database Connection Error

**Check**:
1. `SUPABASE_URL` and keys are correct
2. Supabase project is active
3. Network requests aren't blocked
4. Query timeout isn't exceeded

---

## URLs After Deployment

**Frontend**: `https://<frontend-project-name>.vercel.app`

**Backend**: `https://<backend-project-name>.vercel.app`

**API Base**: `https://<backend-project-name>.vercel.app/api`

---

## Support

For issues during deployment:
1. Check Vercel build logs
2. Review `.env` variables
3. Test API endpoints with curl
4. Check Supabase dashboard for errors
5. Review Vercel Analytics for performance issues
