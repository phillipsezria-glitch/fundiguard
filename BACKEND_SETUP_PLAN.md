# Backend Setup Plan

## Phase 1: Environment & Credentials (30 min)

### 1.1 Supabase Setup
- [ ] Create account at supabase.com
- [ ] Create project `fundiguard-ke`
- [ ] Copy URL → `SUPABASE_URL`
- [ ] Copy Service Role Key → `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Copy Anon Key → `SUPABASE_ANON_KEY`

### 1.2 Create `.env` in `backend/`
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SUPABASE_ANON_KEY=eyJ...
JWT_SECRET=generate-random-32-chars
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890
MPESA_CONSUMER_KEY=...
MPESA_CONSUMER_SECRET=...
MPESA_PASSKEY=...
MPESA_SHORTCODE=...
PORT=3001
NODE_ENV=development
```

### 1.3 Import Database Schema
- [ ] Go to Supabase SQL Editor
- [ ] Open `database/schema.sql`
- [ ] Copy entire file
- [ ] Paste in SQL editor
- [ ] Click RUN
- [ ] Verify 16 tables created

---

## Phase 2: Build & Dependency Check (15 min)

### 2.1 Install Dependencies
```bash
cd backend
npm install
```

### 2.2 Build Backend
```bash
npm run build
```
✅ Should compile with **zero errors**

### 2.3 Verify Output
- [ ] `dist/` folder exists with compiled JS files
- [ ] No TypeScript errors
- [ ] All imports resolved

---

## Phase 3: Local Testing (30 min)

### 3.1 Start Server
```bash
npm run dev
```
Expected: `🚀 FundiGuard Backend running on http://localhost:3001`

### 3.2 Test Health Check
```bash
curl http://localhost:3001/health
```
Expected: `{"status":"ok","timestamp":"..."}`

### 3.3 Test Auth Flow
**Request OTP:**
```bash
curl -X POST http://localhost:3001/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"phone_number":"0712345678","action":"login"}'
```
Expected: `{"message":"OTP sent successfully"}`

**Verify OTP (default test OTP: 123456):**
```bash
curl -X POST http://localhost:3001/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone_number":"0712345678","otp_code":"123456","action":"login"}'
```
Expected: `{"user":{...},"token":"eyJ...","expires_in":86400}`

### 3.4 Create Test Job
```bash
TOKEN="eyJ..." # from verify-otp response

curl -X POST http://localhost:3001/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title":"Fix sink",
    "category":"Plumbing",
    "description":"Leaking tap",
    "budget":3000,
    "location":"Nairobi",
    "latitude":-1.286389,
    "longitude":36.817223
  }'
```
Expected: `{"success":true,"job":{...}}`

### 3.5 List Jobs
```bash
curl "http://localhost:3001/api/jobs?category=Plumbing&limit=10"
```
Expected: Array of jobs

---

## Phase 4: Database Verification (10 min)

### 4.1 Check Supabase Tables
- [ ] Go to Supabase dashboard
- [ ] Click Table Editor
- [ ] Verify all 16 tables exist:
  - users
  - professionals
  - jobs
  - bids
  - bookings
  - ratings
  - escrow_transactions
  - payment_ledger
  - disputes
  - insurance_policies
  - messages
  - notifications
  - admin_logs
  - system_settings
  - + 2 reference tables

### 4.2 Check Data
- [ ] `users` table has test user
- [ ] `jobs` table has test job
- [ ] Timestamps are correct

---

## Phase 5: Frontend Integration (20 min)

### 5.1 Create `app/.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 5.2 Test Frontend Auth
- [ ] Go to http://localhost:3000/auth
- [ ] Enter phone number
- [ ] Receive/enter OTP
- [ ] Login successful
- [ ] Redirect to dashboard

### 5.3 Test Frontend API
- [ ] Browse jobs list
- [ ] Should show test job
- [ ] Response times < 500ms

---

## Phase 6: Deployment Prep (15 min)

### 6.1 Build for Production
```bash
npm run build
```

### 6.2 Test Production Build Locally
```bash
npm start
```
Should run successfully on port 3001

### 6.3 Prepare Deployment
- [ ] Commit all changes: `git add . && git commit -m "Backend ready"`
- [ ] Push to GitHub: `git push origin main`

---

## Phase 7: Deploy to Vercel (15 min)

### 7.1 Setup Vercel CLI
```bash
npm install -g vercel
vercel login
```

### 7.2 Deploy Backend
```bash
cd backend
vercel --prod
```

### 7.3 Add Environment Variables
- [ ] Go to vercel.com dashboard
- [ ] Select project
- [ ] Settings → Environment Variables
- [ ] Add all variables from `.env`
- [ ] Redeploy: `vercel --prod`

### 7.4 Get Production URL
```
https://fundiguard-api.vercel.app
```

### 7.5 Update Frontend
Change `NEXT_PUBLIC_API_URL` in `app/.env.local`:
```env
NEXT_PUBLIC_API_URL=https://fundiguard-api.vercel.app/api
```

---

## Phase 8: Production Verification (15 min)

### 8.1 Test Production Endpoints
```bash
curl https://fundiguard-api.vercel.app/health
```

### 8.2 Full Journey Test (as Client)
1. Login with OTP
2. Browse professionals
3. Create job posting
4. View job details
5. See incoming bids

### 8.3 Full Journey Test (as Professional)
1. Login with OTP
2. Update profile
3. Browse available jobs
4. Submit bid on job
5. View bid status

### 8.4 Monitor Logs
- [ ] Check Vercel deployment logs for errors
- [ ] No 500 errors
- [ ] Response times acceptable

---

## Verification Checklist

### Backend
- [ ] TypeScript compiles without errors
- [ ] All 45+ endpoints implemented
- [ ] Database connected
- [ ] Environment variables configured
- [ ] Local testing passes
- [ ] Deployment successful

### Database
- [ ] 16 tables created
- [ ] Schema verified
- [ ] Sample data inserted
- [ ] Supabase accessible from backend

### Authentication
- [ ] OTP sending works
- [ ] User creation works
- [ ] JWT tokens valid
- [ ] Token expiry working

### APIs
- [ ] Auth endpoints: 6/6 ✓
- [ ] Job endpoints: 9/9 ✓
- [ ] Professional endpoints: 11/11 ✓
- [ ] Booking endpoints: 11/11 ✓
- [ ] Payment endpoints: 8/8 ✓

### Integration
- [ ] Frontend connects to backend
- [ ] API calls work from frontend
- [ ] CORS enabled
- [ ] Error handling works

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Module not found` | Run `npm install` |
| `TypeScript errors` | Check tsconfig.json, ensure types installed |
| `Database connection error` | Verify SUPABASE_URL and keys correct |
| `OTP not sending` | Check Twilio credentials, account balance |
| `401 Unauthorized` | Verify JWT_SECRET matches, token not expired |
| `CORS error` | Ensure CORS middleware enabled in index.ts |
| `Vercel deploy fails` | Check environment variables in Vercel dashboard |

---

## Timeline Summary

| Phase | Time | Status |
|-------|------|--------|
| Environment & Credentials | 30 min | ⏳ TODO |
| Build & Dependencies | 15 min | ✅ DONE |
| Local Testing | 30 min | ⏳ TODO |
| Database Verification | 10 min | ⏳ TODO |
| Frontend Integration | 20 min | ⏳ TODO |
| Deployment Prep | 15 min | ⏳ TODO |
| Deploy to Vercel | 15 min | ⏳ TODO |
| Production Verification | 15 min | ⏳ TODO |
| **TOTAL** | **~2.5 hours** | ⏳ IN PROGRESS |

---

## Next Steps

1. **Now**: Follow Phase 1 (Environment & Credentials)
2. **After credentials**: Follow Phase 2 (Build & Dependencies)
3. **Then**: Follow remaining phases sequentially

**Status**: Backend code is ready ✅
**Next**: Set up credentials and database 🚀
