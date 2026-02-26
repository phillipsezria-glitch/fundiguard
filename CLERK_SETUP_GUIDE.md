# Clerk.com Authentication Migration - Complete Guide

## Status: 🚀 Files Created, Awaiting API Keys

Your codebase has been fully prepared for Clerk authentication. All files are in place, you just need to:

1. **Get Clerk API keys** (5 minutes)
2. **Update `.env` files** (2 minutes)
3. **Activate files** (2 minutes)
4. **Test & deploy** (10 minutes)

---

## ✅ What's Ready

### Frontend Changes ✅
- [x] `app/layout.tsx` - Updated with ClerkProvider wrapper
- [x] `app/auth/page-clerk.tsx` - New Clerk sign-in/sign-up page
- [x] `app/complete-profile/page.tsx` - Profile completion after signup
- [x] `app/lib/api-clerk.ts` - Clerk-based API client
- [x] `app/lib/useAuthProtected-clerk.ts` - Clerk auth hooks
- [x] `@clerk/nextjs` package installed ✅

### Backend Changes ✅
- [x] `backend/src/middleware/clerkAuth.ts` - Token verification middleware
- [x] `backend/src/routes/users-clerk.ts` - User sync endpoint
- [x] `@clerk/express` package installed ✅

---

## 🔧 SETUP STEPS

### Step 1: Create Clerk Account & App

1. Go to: **https://dashboard.clerk.com**
2. Sign up (free tier available)
3. Create new Application
4. Choose your authentication methods (Email, Phone, Social)

### Step 2: Get Clerk API Keys

In Clerk Dashboard → **Settings → API Keys**, copy:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_test_xxxxx
CLERK_SECRET_KEY = sk_test_xxxxx
```

### Step 3: Update Frontend Environment Variables

**Create or update `app/.env.local`:**

```env
# Clerk API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
NEXT_PUBLIC_API_URL=https://backend-9ni8xappo-phillips-projects-442c0a01.vercel.app

# Clerk Routes
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/complete-profile
```

**Update `app/.env.production`:**

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
NEXT_PUBLIC_API_URL=https://backend-9ni8xappo-phillips-projects-442c0a01.vercel.app
```

### Step 4: Update Backend Environment Variables

**Backend `backend/.env`:**

```env
CLERK_SECRET_KEY=sk_test_YOUR_KEY_HERE
```

**Backend `backend/.env.production`:**

```env
CLERK_SECRET_KEY=sk_test_YOUR_KEY_HERE
NODE_ENV=production
API_URL=https://backend-9ni8xappo-phillips-projects-442c0a01.vercel.app
CORS_ORIGINS=https://fundiguard-b6i4hcg3m-phillips-projects-442c0a01.vercel.app
```

### Step 5: Activate New Files

Replace old auth files with new ones:

```bash
# Frontend auth
mv app/auth/page.tsx app/auth/page.old.tsx
mv app/auth/page-clerk.tsx app/auth/page.tsx

# Frontend auth hooks
mv app/lib/useAuthProtected.ts app/lib/useAuthProtected.old.ts
cp app/lib/useAuthProtected-clerk.ts app/lib/useAuthProtected.ts

# Frontend API client (optional, keep both for gradual migration)
# mv app/lib/api.ts app/lib/api.old.ts
# cp app/lib/api-clerk.ts app/lib/api.ts
```

### Step 6: Update Backend Routes

Update `backend/src/index.ts` to mount the new Clerk user routes:

```typescript
import clerkUsersRoutes from './routes/users-clerk';

// ... existing code ...

app.use('/api/users', clerkUsersRoutes);
```

### Step 7: Test Locally

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend && npm run dev

# Visit http://localhost:3000/auth and test sign-up/sign-in
```

### Step 8: Deploy to Production

```bash
# Frontend
vercel --prod --yes

# Backend
cd backend && vercel --prod --yes

# Update environment variables on Vercel dashboard for both projects
```

---

## 🔐 Security Notes

### What Changed
- ❌ **Old:** Phone/OTP + custom JWT
- ✅ **New:** Industry-standard Clerk auth with security best practices

### What's Secure
- ✅ Clerk handles password hashing & encryption
- ✅ Implements OAuth2/OIDC standards
- ✅ Automatic security updates from Clerk
- ✅ 2FA/MFA support built-in
- ✅ Rate limiting & bot protection

### Environment Variables
- **Never commit** `CLERK_SECRET_KEY` or publishable keys
- `.env` files are already in `.gitignore`
- Vercel dashboard securely manages production keys

---

## 📊 Migration Features

### Current Implementation
| Feature | Status | Notes |
|---------|--------|-------|
| Sign In/Sign Up | ✅ Complete | Clerk components |
| Role Selection | ✅ Complete | Stored in Clerk metadata |
| Token Verification | ✅ Complete | Backend middleware ready |
| User Profile Sync | ⏳ TODO | Start with `sync-clerk` endpoint |
| Database Sync | ⏳ TODO | Implement in `clerkUsersRoutes` |
| Logout | ✅ Built-in | Clerk handles it |
| Password Reset | ✅ Built-in | Clerk email templates |
| 2FA/MFA | ✅ Available | Enable in Clerk dashboard |

### What Needs Implementation
1. **`userController.ts`** - Update to use Clerk tokens
2. **`professionalController.ts`** - Use Clerk user ID
3. **Database schema** - Add `clerk_user_id` columns
4. **Professional verification** - Map Clerk ID to pro status
5. **Payment integration** - Use Clerk user ID for M-Pesa

---

## 🚀 Phased Migration Plan

### Phase 1: Auth Only (Current)
- ✅ Frontend: Clerk sign-in/sign-up
- ✅ Backend: Token verification
- Keep database user table (will sync later)

### Phase 2: User Sync
- Users auto-sync on first login
- Store `clerk_user_id` in database
- Clerk ID becomes primary identifier

### Phase 3: Complete Migration
- Sunset old phone/OTP system
- All endpoints use Clerk tokens
- Delete old auth routes

### Phase 4: Enhanced Features
- Enable 2FA in Clerk dashboard
- Add social login (Google, Apple)
- Implement organization management (for pros)

---

## 🐛 Troubleshooting

### "CLERK_SECRET_KEY not found"
→ Add to `backend/.env` and `backend/.env.production`

### "CORS error from Clerk"
→ Update CORS_ORIGINS in backend to include frontend URL

### "Token verification failed"
→ Make sure CLERK_SECRET_KEY matches your Clerk app

### "User metadata not saving"
→ Allow unsafe metadata in Clerk dashboard (Settings → Advanced)

### Build errors?
→ Run `npm install` in both root and `backend/` directories

---

## 📚 Helpful Resources

- **Clerk Docs:** https://clerk.com/docs
- **Next.js Integration:** https://clerk.com/docs/quickstarts/nextjs
- **Express Integration:** https://clerk.com/docs/quickstarts/express
- **API Reference:** https://clerk.com/docs/reference

---

## ✅ Checklist

- [ ] Create Clerk account
- [ ] Create application in Clerk
- [ ] Copy publishable key to `.env.local`
- [ ] Copy secret key to `backend/.env`
- [ ] Install dependencies (done ✅)
- [ ] Update environment files
- [ ] Activate new auth page
- [ ] Test locally
- [ ] Update backend routes in `index.ts`
- [ ] Deploy frontend
- [ ] Deploy backend
- [ ] Verify Clerk on Vercel dashboard
- [ ] Test production login
- [ ] Monitor for errors

**Estimated total time:** ~30 minutes

