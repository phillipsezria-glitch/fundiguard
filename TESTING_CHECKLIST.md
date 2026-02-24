# FundiGuard Testing Checklist

## Pre-Test Environment Setup

### ✅ Step 1: Verify Environment Variables

**Backend Requirements** (set on Vercel backend project):
```
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://fundiguard.vercel.app
PRODUCTION_URL=https://fundiguard.vercel.app
JWT_SECRET=your-secret-key
JWT_EXPIRY=24h
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-number
MPESA_CONSUMER_KEY=your-mpesa-consumer-key
MPESA_CONSUMER_SECRET=your-mpesa-consumer-secret
MPESA_PASSKEY=your-mpesa-passkey
MPESA_SHORTCODE=your-merchant-code
API_URL=https://api.fundiguard.ke
```

**Frontend Requirements** (set on Vercel frontend project):
```
NEXT_PUBLIC_API_URL=https://api.fundiguard.ke
```

---

## 🧪 Local Testing (Before Production)

### Test 1: Health Check
```bash
# Test general health
curl http://localhost:3001/health

# Expected Response:
# {"status":"ok","timestamp":"2026-02-25T..."}
```

### Test 2: Auth Health Check
```bash
curl http://localhost:3001/api/auth/health

# Expected Response:
# {"status":"ok","service":"auth","timestamp":"2026-02-25T..."}
```

### Test 3: Login Endpoint
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+254712345678",
    "password": "testpassword"
  }'

# Expected Response (Success):
# {
#   "token": "eyJhbGc...",
#   "user": {
#     "id": "user-id",
#     "phone_number": "+254712345678",
#     "full_name": "Test User",
#     "role": "client",
#     "created_at": "..."
#   }
# }

# Expected Response (Failure):
# {"error": "Invalid credentials"}
```

### Test 4: Request OTP
```bash
curl -X POST http://localhost:3001/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+254712345678",
    "action": "login"
  }'

# Expected Response:
# {"message": "OTP sent successfully"}
```

### Test 5: CORS Preflight
```bash
curl -X OPTIONS http://localhost:3001/api/auth/login \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type"

# Should return 200 with proper CORS headers
```

---

## 🌐 Production Testing (After Deployment)

### Test 1: Health Check (Production)
```bash
curl https://api.fundiguard.ke/health

# Expected Response:
# {"status":"ok","timestamp":"2026-02-25T..."}
```

### Test 2: Auth Health Check (Production)
```bash
curl https://api.fundiguard.ke/api/auth/health

# Expected Response:
# {"status":"ok","service":"auth","timestamp":"2026-02-25T..."}
```

### Test 3: Frontend to Backend Connection
```bash
curl -H "Origin: https://fundiguard.vercel.app" \
  -X OPTIONS https://api.fundiguard.ke/api/auth/login \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type"

# Should show:
# Access-Control-Allow-Origin: https://fundiguard.vercel.app
# Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
```

---

## 📱 Browser Testing (Production)

### Test 1: Open Developer Console
Open `https://fundiguard.vercel.app` in browser (Chrome/Firefox)
1. Press `F12` to open Developer Tools
2. Go to **Network** tab
3. Try logging in
4. Look for the POST request to `/api/auth/login`
5. Check the response status and body

### Test 2: Check Network Requests
When you login, you should see:
- ✅ Request: `POST https://api.fundiguard.ke/api/auth/login` 
- ✅ Status: 200 (Success) or 401 (Invalid credentials)
- ✅ Response: Contains `token` and `user` fields

### Test 3: Check CORS Errors
If you see errors like:
```
Access to XMLHttpRequest at 'https://api.fundiguard.ke/api/auth/login' 
from origin 'https://fundiguard.vercel.app' has been blocked by CORS policy
```

This means:
- ❌ Backend CORS config is wrong
- ❌ Frontend origin not in allowed list
- ❌ Preflight request failed

---

## 🐛 Debugging Tips

### If you get **405 Method Not Allowed**:
1. ✅ Fix: The endpoint path or HTTP method is wrong
2. Check [API_PATHS_DEBUG.md](API_PATHS_DEBUG.md) for correct paths
3. Verify the HTTP method (GET, POST, PUT, PATCH, DELETE)

### If you get **CORS Error**:
1. ✅ Check if origin is in `allowedOrigins` in [backend/src/index.ts](backend/src/index.ts#L20-L26)
2. ✅ Add any missing origins to backend CORS config
3. ✅ Redeploy backend after making changes

### If you get **Network Error / Failed to fetch**:
1. ✅ Check if API_URL is correct in [app/lib/api.ts](app/lib/api.ts#L1-L6)
2. ✅ Verify backend is deployed and running on that URL
3. ✅ Check internet connection
4. ✅ Look at browser console for detailed error message

### If you get **401 Unauthorized**:
1. ✅ Auth token is missing or invalid
2. ✅ Make sure token is included in Authorization header
3. ✅ Token format should be: `Bearer <token>`

### If you get **500 Internal Server Error**:
1. ✅ Check backend logs on Vercel
2. ✅ Verify all environment variables are set correctly
3. ✅ Check database connection (Supabase)
4. ✅ Check third-party service credentials (Twilio, M-Pesa)

---

## 📋 Files Modified for Debugging

| File | Change | Reason |
|---|---|---|
| [app/lib/api.ts](app/lib/api.ts) | Fixed booking completion endpoint path `/complete` instead of `/completion`, changed method from PUT to PATCH | Endpoint mismatch between frontend and backend |
| [backend/src/index.ts](backend/src/index.ts) | Added explicit OPTIONS middleware for CORS preflight, added Vercel frontend domain | Better CORS handling for production |
| [API_PATHS_DEBUG.md](API_PATHS_DEBUG.md) | Created comprehensive endpoint documentation | Reference guide for all API paths |

---

## ✅ Pre-Deployment Checklist

- [ ] All environment variables are set on both frontend and backend Vercel projects
- [ ] Backend has been redeployed after latest changes
- [ ] Frontend has been redeployed to pick up new API URL
- [ ] Health check endpoints return 200
- [ ] Login endpoint works locally with `npm run dev`
- [ ] CORS is properly configured
- [ ] No 405 errors on production
- [ ] Browser console shows no CORS warnings

---

## 🚀 Deployment Steps

1. **Backend**:
   ```bash
   cd backend
   git push origin main
   # Wait for Vercel to deploy
   ```

2. **Frontend**:
   ```bash
   git push origin main
   # Wait for Vercel to deploy
   ```

3. **Verify**:
   ```bash
   curl https://api.fundiguard.ke/health
   curl https://fundiguard.vercel.app
   ```

---

## 📞 Support

If you encounter issues:
1. Check [API_PATHS_DEBUG.md](API_PATHS_DEBUG.md) for endpoint reference
2. Look at browser Network tab (F12 → Network)
3. Check Vercel logs for backend errors
4. Verify all environment variables are set

---

**Last Updated**: 2026-02-25
**Status**: Ready for testing
