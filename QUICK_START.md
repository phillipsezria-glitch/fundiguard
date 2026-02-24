# 🚀 Quick Start Guide - Local Development

## ✅ Prerequisites
- Node.js 18+ installed
- Git repository cloned
- Supabase project configured
- Environment variables set

---

## 📋 Environment Setup

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

### Backend (.env)
```env
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE=your_twilio_phone
```

---

## 🎯 Start Development (2 Terminals)

### Terminal 1: Backend
```bash
cd backend
npm install
npm run dev
```
Expected output:
```
Server running on port 3001
✓ Database connected
```

### Terminal 2: Frontend
```bash
npm install
npm run dev
```
Expected output:
```
▲ Next.js 16.1.6
- Local: http://localhost:3000
```

---

## 🧪 Test Flow

### 1. Home Page (No Auth Required)
```
✅ Open http://localhost:3000
✅ See hero section with categories
✅ Click "Browse Services" → loads /browse-jobs
✅ Click "Post a Job" → redirects to /auth (not logged in)
✅ Click "For Professionals" → loads /for-pros
```

### 2. Authentication Flow (Required for Protected Routes)
```
✅ Click "Browse Services" (not logged in)
✅ Redirected to /auth
✅ Enter phone (0712345678 or 254712345678)
✅ Enter 6-digit OTP (check Twilio logs)
✅ Login successful
✅ Token stored in localStorage as 'authToken'
✅ User object stored as 'user'
```

### 3. Dashboard (After Login)
```
✅ Redirected to /dashboard
✅ See welcome banner with your full name
✅ Active jobs fetched from API
✅ Past jobs separated correctly
✅ Stats show real data (not hardcoded)
✅ All components render without errors
```

### 4. Protected Routes (After Login)
```
✅ /post-job - Create new job (works)
✅ /profile/edit - Edit your profile (works)
✅ /my-bids - View your bids (works)
✅ /pro-dashboard - Professional view (works)
```

### 5. Navigation (All Pages)
```
Header Links:
✅ Logo → /
✅ Browse Services → /browse-jobs
✅ Post Job → /post-job (if logged in)
✅ For Professionals → /for-pros  
✅ Insurance → /insurance
✅ Support → /support (or Help in mobile)

No broken links (404 errors)
```

---

## 🐛 Troubleshooting

### API Connection Failed
```bash
# Check backend is running
curl http://localhost:3001/health

# Check API_URL in app/lib/api.ts
# Should be: http://localhost:3001
```

### Redirects to /auth Loop
```bash
# Check localStorage has valid token:
# Open DevTools → Application → Local Storage
# Should have: authToken (JWT), user (JSON object)

# If empty, need to login again
```

### "Cannot find module" errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Clear Next.js cache
rm -rf .next
npm run dev
```

### CORS errors
```bash
# Check backend cors.ts configuration
# Should allow http://localhost:3000

# Check API_URL doesn't have trailing slash
# WRONG: http://localhost:3001/
# CORRECT: http://localhost:3001
```

---

## 📊 Key API Endpoints (Backend)

```
POST   /api/auth/register           - Register user
POST   /api/auth/verify-otp         - Verify OTP
POST   /api/auth/logout             - Logout

GET    /api/jobs                    - List all jobs
POST   /api/jobs                    - Create job
GET    /api/jobs/:id                - Get job details
PUT    /api/jobs/:id                - Update job
DELETE /api/jobs/:id                - Delete job

GET    /api/professionals           - List professionals
GET    /api/professionals/:id       - Professional details

GET    /api/bids                    - List bids
POST   /api/bids                    - Submit bid
PUT    /api/bids/:id/status         - Update bid status

POST   /api/payments/initiate       - Start M-Pesa payment
POST   /api/payments/callback       - M-Pesa webhook
```

---

## 🔐 Auth Flow Validation

### Check localStorage After Login
```javascript
// Open DevTools Console and run:
localStorage.getItem('authToken')    // Should return JWT
localStorage.getItem('user')         // Should return JSON
```

### Check useAuthProtected Hook
```javascript
// Protected pages auto-redirect if no token
// Pages protected:
// - /dashboard
// - /post-job
// - /profile/edit
// - /my-bids
// - /pro-dashboard
```

---

## ✅ Health Check Commands

```bash
# Check backend health
curl http://localhost:3001/health

# Check frontend is running
curl http://localhost:3000

# Check database connection
# (Backend logs should show "Database connected")

# Check Supabase connectivity
# (Try to login - should reach Supabase auth)
```

---

## 📁 Key Files Reference

| File | Purpose | Status |
|------|---------|--------|
| [app/lib/api.ts](app/lib/api.ts) | API client | ✅ Fixed |
| [app/lib/useAuthProtected.ts](app/lib/useAuthProtected.ts) | Route protection hook | ✅ New |
| [app/components/Header.tsx](app/components/Header.tsx) | Navigation | ✅ Fixed |
| [app/dashboard/page.tsx](app/dashboard/page.tsx) | User dashboard | ✅ Fixed |
| [backend/src/index.ts](backend/src/index.ts) | Backend entry | ✅ Ready |
| [backend/src/config/supabase.ts](backend/src/config/supabase.ts) | Supabase config | ✅ Ready |

---

## 🎯 Common Tasks

### Add New API Endpoint
1. Create route in `backend/src/routes/`
2. Create controller in `backend/src/controllers/`
3. Create service in `backend/src/services/`
4. Add to `backend/src/index.ts`
5. Use in frontend via `api.method()`

### Add Protected Route
1. Create page in `app/[feature]/page.tsx`
2. Add `'use client'` at top
3. Add `useAuthProtected()` call
4. Import hook: `import { useAuthProtected } from '@/app/lib/useAuthProtected'`

### Debug API Call
```typescript
// In frontend component:
console.log('Token:', localStorage.getItem('authToken')); // Check token exists
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL); // Check API URL
console.log('Response:', response);                         // Log API response
```

---

## 📞 Support & Debugging

**For API Issues**:
- Check backend logs for errors
- Verify NEXT_PUBLIC_API_URL is correct
- Test with `curl http://localhost:3001/api/endpoint`

**For Auth Issues**:
- Check Supabase auth config
- Verify Twilio credentials
- Check localStorage in DevTools

**For Route Issues**:
- Verify page file exists
- Check file has correct export
- Verify route in Header.tsx matches file structure

---

## 🚀 Deployment Preparation

Before deploying to production:

1. **Set Environment Variables**:
   - NEXT_PUBLIC_API_URL → Your backend URL
   - Database credentials
   - API keys and secrets

2. **Run Full Tests**:
   - Auth flow (register, login, logout)
   - All navigation links
   - Dashboard data loading
   - Protected routes redirect

3. **Security Check**:
   - No hardcoded URLs
   - No exposed API keys
   - CORS configured correctly
   - JWT tokens expire appropriately

4. **Performance Check**:
   - Bundle size acceptable
   - Page load times reasonable
   - API responses fast

---

**Last Updated**: February 25, 2026  
**Status**: ✅ All critical issues resolved. Ready for local development.
