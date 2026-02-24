# 🚨 CRITICAL: Production API Domain Missing

## The Problem

Your frontend (`fundiguard.vercel.app`) tries to call `https://api.fundiguard.ke`, but this domain:
- ❌ Doesn't have DNS configured
- ❌ Doesn't point to your Vercel backend
- ❌ Results in a network error that appears as a 405 error

## Test Results

```
✅ https://fundiguard.vercel.app          → Status 200 (frontend works)
❌ https://api.fundiguard.ke              → ENOTFOUND (domain missing)
⚠️  https://fundiguard-api.vercel.app     → Status 404 (no backend deployed)
⚠️  https://fundiguard-backend.vercel.app → Status 404 (no backend deployed)
```

---

## 🛠️ Solution: Choose One Option

### Option 1: Use Vercel's Default Backend URL (Easiest)
**If you haven't deployed your backend yet:**

1. **Deploy backend to Vercel:**
   ```bash
   cd backend
   npm install -g vercel
   vercel
   ```

2. **Find your backend URL** (will be like `fundiguard-backend-xyz.vercel.app`)

3. **Update frontend API URL** - Edit [app/lib/api.ts](app/lib/api.ts):
   ```typescript
   const API_URL = process.env.NEXT_PUBLIC_API_URL || 
     (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
       ? 'http://localhost:3001' 
       : 'https://fundiguard-backend-xyz.vercel.app');  // ← Change this
   ```

4. **Set Vercel frontend environment variable:**
   - Go to `fundiguard.vercel.app` project settings
   - Add `NEXT_PUBLIC_API_URL=https://fundiguard-backend-xyz.vercel.app`

5. **Redeploy frontend:**
   ```bash
   git push origin main
   ```

---

### Option 2: Use Custom Domain (Recommended for Production)
**If you own or want to use api.fundiguard.ke:**

1. **Ensure domain is registered & owned**: fundiguard.ke

2. **Deploy backend first:**
   ```bash
   cd backend
   vercel
   ```

3. **Add custom domain to backend in Vercel:**
   - Go to Vercel backend project
   - Settings → Domains
   - Add `api.fundiguard.ke`
   - Follow Vercel's DNS setup (add CNAME record to your domain registrar)

4. **Update DNS at your domain registrar:**
   -  Add CNAME record: `api.fundiguard.ke` → `cname.vercel-dns.com`

5. **Frontend API URL stays the same** [app/lib/api.ts](app/lib/api.ts):
   ```typescript
   const API_URL = process.env.NEXT_PUBLIC_API_URL || 
     (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
       ? 'http://localhost:3001' 
       : 'https://api.fundiguard.ke');  // ← Already correct
   ```

6. **Test after DNS propagates** (5-30 minutes):
   ```bash
   curl https://api.fundiguard.ke/health
   ```

---

### Option 3: API Proxy via Next.js (Combine Frontend + Backend)
**If you want both on same domain:**

1. **Update [next.config.ts](next.config.ts):**
   ```typescript
   import type { NextConfig } from "next";

   const nextConfig: NextConfig = {
     rewrites: async () => ({
       beforeFiles: [
         {
           source: '/api/:path*',
           destination: 'http://localhost:3001/api/:path*',
         },
       ],
     }),
   };

   export default nextConfig;
   ```

2. **Update [app/lib/api.ts](app/lib/api.ts):**
   ```typescript
   const API_URL = process.env.NEXT_PUBLIC_API_URL || 
     (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
       ? 'http://localhost:3001' 
       : 'https://fundiguard.vercel.app');  // Same domain!
   ```

3. **Redeploy frontend:**
   ```bash
   git push origin main
   ```

---

## ✅ Recommended: Option 1 (Fastest)

```bash
# 1. Deploy backend
cd backend
vercel
# Note your backend URL

# 2. Update frontend
# Edit app/lib/api.ts with your backend URL

# 3. Set env variable on Vercel
# Dashboard → fundiguard.vercel.app → Settings → Environment Variables
# Add: NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app

# 4. Redeploy frontend
git push origin main

# 5. Test
curl https://your-backend-url.vercel.app/health
```

---

## 🧪 Verify the Fix

After implementing any option, test with:

```bash
# Test the endpoint you chose
curl https://YOUR_API_URL/health

# Should return:
# {"status":"ok","timestamp":"2026-02-25T..."}
```

Then test in browser:
1. Open `https://fundiguard.vercel.app`
2. Press F12 (Developer Tools)
3. Go to **Network** tab
4. Try login
5. Look for requests to your API URL (should be **Status 200**, not 405)

---

## 📋 Checklist

- [ ] Deployed backend to Vercel OR set up custom domain
- [ ] Updated frontend API URL in `app/lib/api.ts`
- [ ] Set `NEXT_PUBLIC_API_URL` env variable on Vercel frontend
- [ ] Redeployed frontend (`git push origin main`)
- [ ] Verified health check works
- [ ] Tested login in browser
- [ ] No 405 errors

---

## Still Getting Error?

```bash
# Test locally first
cd backend
npm run dev  # runs on localhost:3001

# In another terminal, test frontend
npm run dev  # runs on localhost:3000

# Try login - should work without 405 error
```

If local works but production doesn't, then it's a Vercel deployment or domain configuration issue.

---

**Note**: The 405 error isn't from your API code - it's a network error because the domain is unreachable. Once you point your API domain/URL correctly, tests should work!
