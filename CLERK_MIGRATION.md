# Clerk.com Authentication Migration

## Setup Steps

### 1. Create Clerk Account
- Go to https://dashboard.clerk.com
- Sign up (test/free)
- Create a new Application

### 2. Get API Keys
In your Clerk Dashboard → Settings → API Keys, copy:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

### 3. Configure Environment Variables

**Frontend (.env.local)**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/complete-profile
```

**Backend (.env)**
```
CLERK_SECRET_KEY=sk_test_xxxxx
```

### 4. Update Frontend
- Install Clerk: `npm install @clerk/nextjs` ✅ DONE
- Update `app/layout.tsx` with ClerkProvider
- Replace `app/auth/page.tsx` with Clerk Sign-In/Sign-Up
- Update profile routes with `<ProtectedRoute>`

### 5. Update Backend
- Install Clerk: `npm install @clerk/express`
- Update auth middleware to verify Clerk tokens
- Update user endpoints to sync with Clerk

### 6. Migrate User Data
- Map existing users to Clerk (one-time migration)
- Store Clerk User ID in database

---

## Migration Progress
- [ ] Add Clerk API keys to environment
- [ ] Update frontend layout with ClerkProvider
- [ ] Create new auth page with Clerk components
- [ ] Update profile management
- [ ] Update backend middleware
- [ ] Test integration
- [ ] Deploy to production

