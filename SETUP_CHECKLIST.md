# 🚀 Production Setup Checklist

## Status Update
✅ Backend: https://fundiguardbknd.vercel.app/
✅ Frontend: https://fundiguard.vercel.app/
✅ Frontend API URL: Updated to backend
⏳ Environment Variables: Needs setup

---

## 📋 Quick Setup (10 Minutes)

### Step 1: Set Backend Environment Variables (Vercel)

1. Go to: https://vercel.com/dashboard
2. Click on **fundiguardbknd** project
3. Click **Settings** → **Environment Variables**

**Add these variables:**

| Name | Value |
|------|-------|
| NODE_ENV | production |
| API_URL | https://fundiguardbknd.vercel.app |
| FRONTEND_URL | https://fundiguard.vercel.app |
| PRODUCTION_URL | https://fundiguard.vercel.app |
| SUPABASE_URL | *your-supabase-url* |
| SUPABASE_ANON_KEY | *your-supabase-anon-key* |
| SUPABASE_SERVICE_ROLE_KEY | *your-service-role-key* |
| JWT_SECRET | *generate random 32+ char key* |
| JWT_EXPIRY | 24h |
| TWILIO_ACCOUNT_SID | *your-twilio-sid* |
| TWILIO_AUTH_TOKEN | *your-twilio-token* |
| TWILIO_PHONE_NUMBER | *your-twilio-phone* |
| MPESA_CONSUMER_KEY | *your-mpesa-key* |
| MPESA_CONSUMER_SECRET | *your-mpesa-secret* |
| MPESA_PASSKEY | *your-passkey* |
| MPESA_SHORTCODE | 174379 |

💡 **Tip**: Use this to generate JWT_SECRET: `openssl rand -base64 32`

4. After adding each variable, Vercel will auto-redeploy

---

### Step 2: Set Frontend Environment Variables (Vercel)

1. Go to: https://vercel.com/dashboard
2. Click on **fundiguard** project  
3. Click **Settings** → **Environment Variables**

**Add this variable:**

| Name | Value |
|------|-------|
| NEXT_PUBLIC_API_URL | https://fundiguardbknd.vercel.app |

---

### Step 3: Redeploy Frontend

After adding frontend variables:

```bash
git push origin main
```

Or manually redeploy:
1. Go to https://vercel.com/dashboard
2. Click **fundiguard** 
3. Click **Deployments**
4. Find latest deployment
5. Click **⋯** → **Redeploy**

---

## ✅ Testing Checklist

After setup:

- [ ] Backend health check works
  ```bash
  curl https://fundiguardbknd.vercel.app/health
  ```

- [ ] Frontend loads
  ```
  https://fundiguard.vercel.app
  ```

- [ ] Try login in app
  - No 405 errors
  - No CORS errors
  - May show "Invalid credentials" (that's OK - wrong password)

- [ ] Open DevTools (F12)
  - Network tab
  - Try login
  - See request to `https://fundiguardbknd.vercel.app/api/auth/login`
  - Status should be **200** or **401** (not 405)

---

## 🔧 Where to Get the Variables

### Supabase
1. Go to https://app.supabase.com
2. Select your project
3. Click **Settings** → **API**
4. Copy `Project URL` and `anon key`
5. Copy `Service Role Key` (under secret keys)

### Twilio
1. Go to https://www.twilio.com/console
2. Copy `Account SID` and `Auth Token`
3. From **Phone Numbers** section, copy your verified phone number

### M-Pesa
1. Get from your M-Pesa Daraja account
2. Consumer Key and Secret
3. Passkey from M-Pesa sandbox

### JWT Secret
Generate random key:
```bash
# On Mac/Linux:
openssl rand -base64 32

# On Windows PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object {[byte](Get-Random -Max 256)}))

# Or just use a strong random string (min 32 chars)
```

---

## 🚨 If Something Goes Wrong

### Backend not responding (404/505)
1. Check Vercel deployment logs
2. Verify all variables are set
3. Redeploy backend

### 405 errors still appearing
1. Verify `FRONTEND_URL` is set correctly
2. Verify `API_URL` is set to backend
3. Check backend CORS config includes Vercel domain
4. Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)

### CORS errors
1. Backend has CORS enabled for `https://fundiguard.vercel.app`
2. Verify in [backend/src/index.ts](backend/src/index.ts#L20-L26)
3. Already configured - should work!

### Login fails with error
1. Check Supabase connection
2. Verify database has user
3. Try with correct phone + password
4. Check backend logs in Vercel

---

## 📊 Deployment Status

| Component | Status | URL |
|-----------|--------|-----|
| Frontend | ✅ Ready | https://fundiguard.vercel.app |
| Backend | 🟡 Waiting | https://fundiguardbknd.vercel.app |
| API URL | ✅ Updated | Points to backend |
| Env Vars | 🟡 Waiting | Need to add |

---

## 📝 Next Steps

1. **Add backend environment variables** (most important!)
2. **Add frontend API URL variable**
3. **Wait for redeployments**
4. **Test login**
5. **If issues, check browser Network tab**

---

**Questions?** Check [ENV_SETUP_GUIDE.md](ENV_SETUP_GUIDE.md) for detailed info.

Generated: 2026-02-25
