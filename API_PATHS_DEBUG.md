# FundiGuard API Paths Debug Report
**Generated: 2026-02-25**

## Summary
- **Frontend API Base URL**: `https://api.fundiguard.ke` (production) or `http://localhost:3001` (local)
- **Backend Routes**: All prefixed with `/api`
- **Total Endpoints**: 60+

---

## ✅ VERIFIED ENDPOINTS (Frontend ↔ Backend Match)

### 1. Authentication Routes (`/api/auth/*`)
| Frontend Call | HTTP | Backend Endpoint | Status |
|---|---|---|---|
| `api.auth.login()` | POST | `/api/auth/login` | ✅ |
| `api.auth.register()` | POST | `/api/auth/register` | ✅ |
| `api.auth.requestOTP()` | POST | `/api/auth/request-otp` | ✅ |
| `api.auth.verifyOTP()` | POST | `/api/auth/verify-otp` | ✅ |
| N/A | POST | `/api/auth/request-password-reset` | ✅ Available |
| N/A | POST | `/api/auth/reset-password` | ✅ Available |
| N/A | GET | `/api/auth/health` | ✅ Available |

### 2. Jobs Routes (`/api/jobs/*`)
| Frontend Call | HTTP | Backend Endpoint | Status |
|---|---|---|---|
| `api.jobs.list()` | GET | `/api/jobs?page=X&limit=Y` | ✅ |
| `api.jobs.create()` | POST | `/api/jobs` | ✅ |
| `api.jobs.getById()` | GET | `/api/jobs/:id` | ✅ |
| N/A | GET | `/api/jobs/trending` | ✅ Available |
| N/A | GET | `/api/jobs/nearby` | ✅ Available |
| N/A | GET | `/api/jobs/search` | ✅ Available |
| N/A | GET | `/api/jobs/category/:category` | ✅ Available |
| N/A | GET | `/api/jobs/user/my-jobs` | ✅ Available |
| N/A | PUT | `/api/jobs/:id` | ✅ Available |
| N/A | DELETE | `/api/jobs/:id` | ✅ Available |

### 3. Bids Routes (`/api/bids/*`)
| Frontend Call | HTTP | Backend Endpoint | Status |
|---|---|---|---|
| `api.bids.create()` | POST | `/api/bids` | ✅ |
| `api.bids.getForJob()` | GET | `/api/bids?job_id=X` | ✅ |
| `api.bids.getMyBids()` | GET | `/api/bids/my-bids` | ✅ |
| `api.bids.accept()` | PATCH | `/api/bids/accept` | ✅ |
| `api.bids.reject()` | PATCH | `/api/bids/reject` | ✅ |

### 4. Upload Routes (`/api/upload/*`)
| Frontend Call | HTTP | Backend Endpoint | Status |
|---|---|---|---|
| `api.upload.single()` | POST | `/api/upload` | ✅ |
| `api.upload.batch()` | POST | `/api/upload/batch` | ✅ |
| `api.upload.delete()` | DELETE | `/api/upload` | ✅ |

### 5. User Routes (`/api/users/*`)
| Frontend Call | HTTP | Backend Endpoint | Status |
|---|---|---|---|
| `api.users.getProfile()` | GET | `/api/users/profile` | ✅ |
| N/A | GET | `/api/users/professionals` | ✅ Available |
| N/A | GET | `/api/users/professionals/:id` | ✅ Available |

---

## ⚠️ POTENTIAL ISSUES / MISMATCHES

### Issue #1: Booking Completion Endpoint
**Problem**: Mismatch in endpoint path

```typescript
// FRONTEND (app/lib/api.ts)
'/bookings/:bookingId/completion'  // ❌ This path doesn't exist on backend

// BACKEND AVAILABLE ROUTES (backend/src/routes/bookings.ts)
'/bookings/:bookingId/complete'     // ✅ This is the correct path
```

**Fix Required**: Update frontend API client
```typescript
// Change from:
apiCall<any>(`/bookings/${bookingId}/completion`, {...})

// To:
apiCall<any>(`/bookings/${bookingId}/complete`, {...})
```

---

## 📋 ADDITIONAL BACKEND ROUTES (Not Used in Frontend Yet)

### Bookings Routes (`/api/bookings/*`)
| Endpoint | HTTP | Notes |
|---|---|---|
| `/api/bookings/bids` | POST | Submit bid |
| `/api/bookings/bids/:jobId` | GET | Get bids for job |
| `/api/bookings/user/my-bids` | GET | Get my bids |
| `/api/bookings/bids/:bidId/reject` | PATCH | Reject bid |
| `/api/bookings/accept-bid` | POST | Accept bid and create booking |
| `/api/bookings/` | GET | Get my bookings |
| `/api/bookings/:bookingId` | GET | Get booking details |
| `/api/bookings/:bookingId/status` | PATCH | Update booking status |
| `/api/bookings/:bookingId/complete` | PATCH | **Complete booking** |
| `/api/bookings/:bookingId/cancel` | POST | Cancel booking |
| `/api/bookings/:bookingId/rate` | POST | Submit rating |
| `/api/bookings/ratings/:professionalUserId` | GET | Get professional ratings |

### Professionals Routes (`/api/professionals/*`)
| Endpoint | HTTP | Notes |
|---|---|---|
| `/api/professionals` | GET | List all |
| `/api/professionals/top` | GET | Top professionals |
| `/api/professionals/search` | GET | Search professionals |
| `/api/professionals/category/:category` | GET | By category |
| `/api/professionals/me` | GET | My profile (protected) |
| `/api/professionals/me` | PUT | Update profile (protected) |
| `/api/professionals/me/stats` | GET | My stats (protected) |
| `/api/professionals/me/earnings` | GET | My earnings (protected) |
| `/api/professionals/me/availability` | PATCH | Update availability (protected) |
| `/api/professionals/me/online-status` | PATCH | Update online status (protected) |
| `/api/professionals/me/upgrade-subscription` | POST | Upgrade subscription (protected) |
| `/api/professionals/:id` | GET | Get professional by ID |

### Payments Routes (`/api/payments/*`)
| Endpoint | HTTP | Notes |
|---|---|---|
| `/api/payments/initiate` | POST | Initiate M-Pesa payment (protected) |
| `/api/payments/callback` | POST | M-Pesa callback (public) |
| `/api/payments/history` | GET | Payment history (protected) |
| `/api/payments/escrow/:escrowId` | GET | Get escrow details |
| `/api/payments/booking/:bookingId/escrows` | GET | Get escrows for booking |
| `/api/payments/release-escrow` | POST | Release escrow (admin) |
| `/api/payments/refund-escrow` | POST | Refund escrow (admin) |
| `/api/payments/stats` | GET | Platform stats (admin) |

---

## 🌐 Health Check Endpoints

| Endpoint | Method | Notes |
|---|---|---|
| `/health` | GET | General health check |
| `/api/auth/health` | GET | Auth service health check |

---

## 🔧 CORS Configuration

**Allowed Origins**:
- `http://localhost:3000` (local frontend)
- `http://localhost:3001` (local backend)
- `http://127.0.0.1:3000` (local testing)
- `https://fundiguard.vercel.app` (production frontend)
- `process.env.FRONTEND_URL` (env variable)
- `process.env.PRODUCTION_URL` (env variable)

**Allowed Methods**: GET, POST, PUT, PATCH, DELETE, OPTIONS
**Allowed Headers**: Content-Type, Authorization
**Credentials**: Enabled

---

## 🚨 ENVIRONMENT VARIABLES TO SET

### Frontend (.env.local or Vercel)
```
NEXT_PUBLIC_API_URL=https://api.fundiguard.ke
```

### Backend (.env or Vercel)
```
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://fundiguard.vercel.app
PRODUCTION_URL=https://fundiguard.vercel.app
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
# ... other environment variables
```

---

## ✅ ACTION ITEMS

- [ ] Fix booking completion endpoint in frontend API client
- [ ] Test all endpoints locally first
- [ ] Verify all environment variables are set on Vercel
- [ ] Test login flow end-to-end on production

---

## 📝 Testing Commands

```bash
# Test health check
curl https://api.fundiguard.ke/health

# Test auth health check
curl https://api.fundiguard.ke/api/auth/health

# Test login (local example)
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone_number":"+254...", "password":"..."}'
```

---

**Generated by Debug Agent**
**Last Updated: 2026-02-25**
