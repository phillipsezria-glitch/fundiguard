# Environment Variables Setup

## Backend (vercel.com/fundiguardbknd or your project)

Set these in Vercel Dashboard → Settings → Environment Variables

### Essential
```
NODE_ENV=production
API_URL=https://fundiguardbknd.vercel.app
FRONTEND_URL=https://fundiguard.vercel.app
PRODUCTION_URL=https://fundiguard.vercel.app
```

### Supabase
```
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

Get these from: https://app.supabase.com → Project Settings → API

### JWT
```
JWT_SECRET=your-long-random-secret-key-at-least-32-characters
JWT_EXPIRY=24h
```

### Twilio (for SMS/OTP)
```
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

Get these from: https://www.twilio.com/console

### M-Pesa (for payments)
```
MPESA_CONSUMER_KEY=your-consumer-key
MPESA_CONSUMER_SECRET=your-consumer-secret
MPESA_PASSKEY=your-passkey
MPESA_SHORTCODE=174379
```

---

## Frontend (vercel.com/fundiguard)

Set these in Vercel Dashboard → Settings → Environment Variables

### Essential
```
NEXT_PUBLIC_API_URL=https://fundiguardbknd.vercel.app
```

---

## How to Add Variables

### Option 1: Vercel Dashboard (Recommended)
1. Go to https://vercel.com/dashboard
2. Click on your project (fundiguardbknd for backend, fundiguard for frontend)
3. Click **Settings** → **Environment Variables**
4. Click **Add New**
5. Enter Name and Value
6. Select which environments (Production, Preview, Development)
7. Click **Save**

### Option 2: Vercel CLI
```bash
vercel env add
# Follow prompts to add variable
```

---

## After Adding Variables

1. **Backend**: Vercel will auto-redeploy
2. **Frontend**: Re-deploy manually
   ```bash
   git push origin main
   ```

3. **Test**: 
   ```bash
   curl https://fundiguardbknd.vercel.app/health
   ```

---

## Security Notes

- **Never commit** .env files with secrets
- Use Vercel's environment variables system
- For development, create `.env.local` (gitignored)
- Rotate secrets periodically
- Use strong JWT_SECRET (32+ characters)

---

## Current Status

### Backend
- ✅ URL: https://fundiguardbknd.vercel.app
- ⏳ Variables: Pending setup
- ❌ Status: Check deployment logs if errors

### Frontend  
- ✅ URL: https://fundiguard.vercel.app
- ✅ Updated API URL to backend
- ⏳ Redeploy needed (git push)
- ⏳ Variables: Add NEXT_PUBLIC_API_URL

---

## Troubleshooting

### Still getting 405 error?
1. Check backend variables are set
2. Verify FRONTEND_URL includes frontend URL
3. Test: `curl https://fundiguardbknd.vercel.app/health`

### CORS errors?
1. Verify FRONTEND_URL is correct
2. Backend CORS config includes Vercel frontend domain
3. Redeploy backend after variable changes

### Login still fails?
1. Check Supabase connection
2. Verify JWT_SECRET is set
3. Check Twilio credentials for OTP
4. Look at Vercel logs for detailed errors
