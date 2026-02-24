# Auth Integration Testing Guide

## Overview
This guide covers testing the FundiGuard authentication system:
- Frontend (auth/page.tsx) ↔ Backend API
- Two authentication flows: Password-based & OTP-based
- JWT token storage and authenticated requests

---

## Pre-Test Checklist

Before running tests, ensure:

- [ ] Backend running: `cd backend && npm run dev` (should be on `http://localhost:3001`)
- [ ] Frontend running: `cd app && npm run dev` (should be on `http://localhost:3000`)
- [ ] Backend `.env` has Supabase credentials configured
- [ ] For SMS tests: Twilio credentials in backend `.env` (optional, fallback works without them)
- [ ] Database connection verified (test with health check)

---

## Quick Start Tests

### Test 1: Backend Health Check
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{"status": "OK", "timestamp": "2025-01-XX..."}
```

If this fails, backend isn't running.

---

## Frontend Auth Page Tests

### Test 2: Load Auth Page
1. Open browser to `http://localhost:3000/auth`
2. Should see:
   - ✅ FundiGuard.ke logo
   - ✅ Login/Create Account tabs
   - ✅ Phone input with +254 Kenya prefix (Login tab active)
   - ✅ Password field
   - ✅ Green button: "🔓 Login"

---

## Password-Based Authentication

### Test 3: Register New User (Password Flow)

**Objective**: Create a new account with phone number and password

**Steps**:
1. Click "Create Account" tab
2. Choose role: "I Am a Fundi" (Pro) or "I Need a Fundi" (Client)
3. Click "Continue as [Role]"
4. Enter:
   - Phone: `712345678` (app adds +254 automatically)
   - Full Name: `Grace Wanjiru`
   - Password: `SecurePass123!`
5. Click "✅ Create Account"

**Expected Result** ✅:
- Redirect to `/pro-dashboard` or `/dashboard` (depending on role)
- URL bar shows dashboard page
- Page loads (header/footer visible)

**If Error**:
- Check error message in red box
- Verify backend console for API errors
- Common issues:
  - Invalid phone format (must be 9 digits)
  - Password too short (min 8 chars)
  - User already exists

---

### Test 4: Login with Password

**Objective**: Login to existing account using password

**Steps**:
1. Click "Login" tab
2. Enter phone: `712345678` (same user from Test 3)
3. Enter password: `SecurePass123!`
4. Click "🔓 Login"

**Expected Result** ✅:
- Redirect to dashboard
- No error messages
- JWT token stored in localStorage

**Verify Token Storage**:
```javascript
// Open browser console (F12) and run:
localStorage.getItem('fundiguard_token')
// Should return: eyJhbGciOiJIUzI1NiIs...
```

---

### Test 5: Incorrect Password

**Objective**: Verify error handling for wrong password

**Steps**:
1. Login tab, enter correct phone
2. Enter wrong password: `WrongPassword123`
3. Click "🔓 Login"

**Expected Result** ✅:
- Red error box appears
- Message: "Invalid password" or similar
- Stay on login page
- No redirect

---

### Test 6: Invalid Phone Format

**Objective**: Verify phone number validation

**Steps**:
1. Login tab
2. Enter phone: `123` (too short)
3. Try to click button (observe disabled state), or enter more
4. Enter phone: `abc` (letters)
5. Try login

**Expected Result** ✅:
- Error: "Invalid phone number. Use format: 7XXXXXXXX"
- Stay on page
- No API call made

---

## OTP-Based Authentication

### Test 7: Request OTP (Signup)

**Objective**: Request OTP code for signup via SMS

**Steps**:
1. Click "Create Account" tab
2. Choose role: "I Need a Fundi" (Client)
3. Click "Continue as Client"
4. Enter:
   - Full Name: `John Kipchoge`
   - Phone: `712345679`
5. Click "📱 Send OTP Code"

**Expected Result** ✅:
- Success message: "OTP sent! Check SMS or console (dev mode)"
- Page moves to Step 3 (OTP verification)
- Six digit input fields appear

**In Backend Console** (if no Twilio):
```
[OTP] Generated for +254712345679: 123456
```

**In SMS** (if Twilio configured):
- Real SMS arrives: "Your FundiGuard OTP code is: 123456..."

---

### Test 8: Verify OTP and Complete Signup

**Objective**: Enter OTP and create account

**Steps** (continuing from Test 7):
1. From console/SMS, copy OTP code (e.g., `123456`)
2. Click first digit field
3. Enter code digit by digit: `1`, `2`, `3`, `4`, `5`, `6`
4. Click "✅ Verify & Continue"

**Expected Result** ✅:
- Redirect to `/dashboard` (client role)
- New user created in Supabase with:
  - Phone: +254712345679
  - Full Name: John Kipchoge
  - Role: client
  - OTP verified

**Verify in Database**:
```bash
# In Supabase console, users table should show:
- phone_number: +254712345679
- full_name: John Kipchoge
- role: client
```

---

### Test 9: OTP Login Flow (Existing User)

**Objective**: Login using OTP instead of password

**Limitation**: Current backend treats OTP same as signup

**Steps**:
1. Login tab
2. Enter phone: `712345679` (from Test 7)
3. Enter password: `anything` (not validated for OTP flow)
4. Click "🔓 Login"

**Expected Result**:
- Login works (existing user)
- Redirect to dashboard
- No OTP needed

**Note**: OTP login would require separate backend endpoint. Currently OTP is signup-only.

---

### Test 10: Wrong OTP Code

**Objective**: Verify error handling for incorrect OTP

**Steps**:
1. Go through Test 7 steps (request OTP)
2. Enter wrong code: `000000`
3. Click "✅ Verify & Continue"

**Expected Result** ✅:
- Red error: "Invalid OTP" or "OTP verification failed"
- Stay on OTP page
- Can retry with correct code

---

## Error Handling Tests

### Test 11: Network Error (Backend Down)

**Objective**: Verify UI handles backend failure gracefully

**Steps**:
1. Stop backend: Ctrl+C in backend terminal
2. Try to login with any credentials
3. Click button

**Expected Result** ✅:
- Error message appears (red box)
- Frontend doesn't crash
- Can see helpful error message

**Start backend again**:
```bash
cd backend && npm run dev
```

---

### Test 12: Empty Fields

**Objective**: Verify form validation

**Steps**:
1. Login tab
2. Leave phone and password blank
3. Click "🔓 Login"

**Expected Result** ✅:
- Error or form prevents submission
- No API call made (check Network tab in DevTools)

---

## Token & Session Tests

### Test 13: Verify JWT Token Storage

**Objective**: Confirm token is stored after login

**Steps**:
1. Complete Test 4 (Login with password)
2. Open browser DevTools (F12)
3. Go to Application → LocalStorage → http://localhost:3000
4. Check for keys:
   - `fundiguard_token`
   - `fundiguard_user`

**Expected Result** ✅:
```javascript
fundiguard_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
fundiguard_user: {"id":"...", "phone_number":"+254...", "role":"..."}
```

---

### Test 14: Logout and Access Protected Route

**Objective**: Verify token is required for protected pages

**Steps**:
1. Login and get token (Test 4)
2. Navigate to `/dashboard`
3. Page should load (authenticated)
4. Open DevTools Console
5. Run:
   ```javascript
   localStorage.removeItem('fundiguard_token')
   localStorage.removeItem('fundiguard_user')
   ```
6. Refresh page or navigate to `/dashboard` again

**Expected Result** ✅:
- Without token, dashboard should not load
- Should redirect to auth page or show error
- (This requires dashboard to check token - currently might not enforce)

---

## Multi-Flow Tests

### Test 15: Register → Verify Dashboard

**Complete User Journey**:
1. Create Account (Test 3) OR OTP flow (Test 7-8)
2. Land on dashboard
3. Page should have navigation and user info

**Checklist**:
- ✅ Header visible with "FundiGuard.ke"
- ✅ Footer visible
- ✅ Dashboard content renders
- ✅ No console errors

---

### Test 16: Create Job After Login

**Objective**: Verify authenticated API calls work

**Steps** (after login):
1. Click "Post a Job" in navigation (if available)
2. Fill form: Job title, description, budget
3. Submit

**Expected Result** ✅:
- Job created in database
- Confirmation message
- JWT token used in request (verify in DevTools Network tab)

**In DevTools Network tab**:
- Request to `/api/jobs`
- Request headers include: `Authorization: Bearer eyJ...`

---

## Automated Test Script (Optional)

### Using cURL for API Testing

**Register via OTP**:
```bash
# 1. Request OTP
curl -X POST http://localhost:3001/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+254712345680",
    "action": "register"
  }'

# Save OTP from console output, e.g.: 456789

# 2. Verify OTP
curl -X POST http://localhost:3001/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+254712345680",
    "otp_code": "456789",
    "action": "register",
    "full_name": "Test User",
    "role": "pro"
  }'

# Response includes: token
```

**Register with password**:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+254712345681",
    "password": "TestPass123",
    "full_name": "Another User",
    "role": "client"
  }'
```

**Login**:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+254712345681",
    "password": "TestPass123"
  }'

# Copy token from response for next call
TOKEN="eyJhbGciOiJIUzI1NiIs..."

# Use token for authenticated request
curl -X GET http://localhost:3001/api/user/profile \
  -H "Authorization: Bearer $TOKEN"
```

---

## Debugging Tips

### View Backend API Logs
```bash
cd backend
npm run dev
# Watch console for incoming requests and errors
```

### View Frontend Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Perform auth action
4. Click on request (e.g., POST auth/register)
5. Check:
   - Request body (what frontend sent)
   - Response body (what backend returned)
   - Headers (Authorization, Content-Type)
   - Status code (200, 400, 500, etc.)

### View Browser Console
1. F12 → Console tab
2. Watch for JavaScript errors
3. Check console.log statements from app

### Check localStorage
```javascript
// In browser console:
console.log(localStorage)
// Or query specific key:
console.log(localStorage.getItem('fundiguard_token'))
```

---

## Summary Checklist

After all tests pass:

- [ ] Test 1: Backend health check ✅
- [ ] Test 2: Auth page loads ✅
- [ ] Test 3: Password signup works ✅
- [ ] Test 4: Password login works ✅
- [ ] Test 5: Wrong password error ✅
- [ ] Test 6: Phone validation works ✅
- [ ] Test 7: OTP request works ✅
- [ ] Test 8: OTP verification works ✅
- [ ] Test 10: Wrong OTP error ✅
- [ ] Test 11: Backend down handled ✅
- [ ] Test 13: Token stored in localStorage ✅
- [ ] Test 15: Dashboard loads after login ✅

**All tests passing** = Ready for Vercel deployment ✅

---

## Next Steps

If all tests pass:
1. Commit changes to git
2. Push to GitHub
3. Deploy frontend to Vercel (auto-deploys)
4. Deploy backend to Vercel
5. Test production auth flow

If tests fail:
1. Check error messages
2. Review browser console and backend logs
3. Fix issues in code
4. Re-run specific failing test

---

**Last Updated**: 2025 | FundiGuard Auth Testing v1.0
