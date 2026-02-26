# Clerk Auth + Supabase Database Integration

## 🔄 Complete Authentication & Data Flow

### BEFORE (Phone/OTP Auth)
```
User Login → Phone OTP → JWT Token → Local Storage → Access App
                          ↓
                    Supabase (users table)
```

### AFTER (Clerk Auth)
```
User Signup/Login → Clerk → Clerk JWT → Backend Verification → Supabase Sync
                                         ↓
                    Users table (with clerk_user_id)
                    ↓
                    Access all features (jobs, bids, M-Pesa, escrow)
```

---

## 1️⃣ Supabase Database Connection

**Status:** ✅ **Still fully active**

### What Stays the Same
- All data tables remain: `users`, `jobs`, `bids`, `bookings`, `escrow_transactions`, `payments`, etc.
- Database schema unchanged
- RLS (Row Level Security) policies still protect data

### What Changes
The `users` table needs to be updated to link Clerk identity:

```sql
ALTER TABLE users ADD COLUMN clerk_user_id VARCHAR UNIQUE;

-- Example user record:
{
  id: UUID,
  clerk_user_id: "user_2f7h8k...",  -- NEW: Clerk user ID
  phone_number: "+254712345678",     -- STILL NEEDED for M-Pesa/escrow
  full_name: "John Doe",
  email: "john@example.com",         -- NEW: From Clerk
  role: "pro",                       -- client or pro
  created_at: timestamp,
  ...
}
```

---

## 2️⃣ After Successful Clerk Auth

### Current Flow (Frontend)
```
1. User fills sign-up form in Clerk
2. Clerk creates user account
3. User redirected to /complete-profile
4. User selects role (client/pro) and enters phone number
5. Frontend calls: POST /api/users/sync-clerk
   {
     phone_number: "+254712345678",
     role: "pro"
   }
6. Backend receives Clerk JWT token
7. Backend verifies token with Clerk
8. Backend creates user in Supabase with clerk_user_id
9. User redirected to /dashboard
```

### Backend Implementation Needed

**File:** `backend/src/routes/users-clerk.ts`

Currently it just returns success. It needs to:

```typescript
// 1. Verify Clerk JWT (done by middleware ✓)
// 2. Get Clerk user details (user object in req.user)
// 3. Add phone number from request body
// 4. CREATE or UPDATE user in Supabase:

const upsertUserQuery = `
  INSERT INTO users (clerk_user_id, phone_number, email, full_name, role)
  VALUES ($1, $2, $3, $4, $5)
  ON CONFLICT (clerk_user_id) DO UPDATE SET
    phone_number = EXCLUDED.phone_number,
    role = EXCLUDED.role
  RETURNING *;
`;

// 5. Return user data with clerk_user_id
// 6. Frontend stores Clerk token (automatic - Clerk handles this)
// 7. Frontend can now use app
```

---

## 3️⃣ Phone Number: Critical for Escrow & M-Pesa

### Why Phone Number is Essential

| Feature | Why Phone Number Needed | Source |
|---------|------------------------|--------|
| **M-Pesa Payments** | Safaricom requires phone to initiate STK push | User's Supabase record |
| **Escrow Release** | Need to confirm charge with phone OTP | User's Supabase record |
| **Account Recovery** | Send OTP to phone if account access lost | User's Supabase record |
| **Professional Verification** | KYC requires valid KE phone number | User's Supabase record |
| **Dispute Resolution** | Contact professionals via phone | User's Supabase record |

### How it Works Now

```
Clerk Auth → User enters phone on /complete-profile → Stored in Supabase
         ↓
    When payment needed:
         ↓
    M-Pesa integration reads phone from Supabase
         ↓
    Safaricom STK push to that phone
         ↓
    User enters PIN → Payment processed
```

### Current Status ⚠️

The `POST /api/users/sync-clerk` endpoint receives `phone_number` in the request body:

```typescript
router.post('/sync-clerk', clerkAuthMiddleware, async (req, res) => {
  const { role, phone_number } = req.body;  // ✓ Gets phone
  // TODO: Save to Supabase with clerk_user_id
});
```

**What's Missing:** The actual Supabase INSERT/UPDATE is not implemented yet.

---

## 4️⃣ Integration Checklist

### ✅ Complete
- [x] Clerk authentication (sign-up/sign-in)
- [x] Backend token verification
- [x] User sync endpoint created
- [x] Phone number captured in request
- [x] Supabase tables ready

### ⏳ TODO
- [ ] **Implement Supabase INSERT in `/api/users/sync-clerk`**
- [ ] Create/update user in `users` table with:
  - `clerk_user_id` (from Clerk token)
  - `phone_number` (from request body)
  - `email` (from Clerk user object)
  - `full_name` (from Clerk user object)
  - `role` (from request body)
- [ ] Update all payment endpoints to use phone from Supabase
- [ ] Update all endpoints to use `clerk_user_id` instead of custom JWT
- [ ] Test end-to-end: Auth → Profile → Job → M-Pesa → Escrow

---

## 5️⃣ Updated User Sync Endpoint

### What Backend Should Do

```typescript
// backend/src/routes/users-clerk.ts

router.post('/sync-clerk', clerkAuthMiddleware, async (req, res) => {
  try {
    const { role, phone_number } = req.body;
    const clerkUserId = req.userId;        // From Clerk token
    const clerkUser = req.user;            // From Clerk (has email, name)

    // Validate phone number
    if (!phone_number || !/^\+?254\d{9}$/.test(phone_number)) {
      return res.status(400).json({ 
        error: 'Valid Kenyan phone number required' 
      });
    }

    // Supabase: CREATE or UPDATE user
    const { data, error } = await supabase
      .from('users')
      .upsert({
        clerk_user_id: clerkUserId,
        phone_number: phone_number,
        email: clerkUser.email,
        full_name: clerkUser.name,
        role: role || 'client',
        status: 'active',
        created_at: new Date().toISOString(),
      }, {
        onConflict: 'clerk_user_id',  // Update if exists
      })
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      user: data,
      message: 'User synced successfully'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## 6️⃣ Data Flow: Auth to M-Pesa Payment

```
┌─────────────────────────────────────────────────────────┐
│ 1. USER SIGNS UP                                        │
│    - Uses Clerk (email/phone/Google)                   │
│    - Gets Clerk user account                           │
└─────────┬───────────────────────────────────────────────┘
          │
          ↓
┌─────────────────────────────────────────────────────────┐
│ 2. PROFILE COMPLETION (/complete-profile)             │
│    - Select role (client/pro)                          │
│    - Enter Kenya phone number (+254xxx)                │
│    - POST to /api/users/sync-clerk                     │
└─────────┬───────────────────────────────────────────────┘
          │
          ↓
┌─────────────────────────────────────────────────────────┐
│ 3. BACKEND SYNCS TO SUPABASE                          │
│    users table:                                         │
│    ├─ clerk_user_id: "user_xxx"                        │
│    ├─ phone_number: "+254712345678"                    │
│    ├─ email: from Clerk                                │
│    ├─ role: client/pro                                 │
│    └─ full_name: from Clerk                            │
└─────────┬───────────────────────────────────────────────┘
          │
          ↓
┌─────────────────────────────────────────────────────────┐
│ 4. USER CAN NOW:                                       │
│    - Create jobs (store in jobs table)                 │
│    - Post bids (store in bids table)                   │
│    - Accept bookings (store in bookings table)         │
└─────────┬───────────────────────────────────────────────┘
          │
          ↓
┌─────────────────────────────────────────────────────────┐
│ 5. ESCROW PAYMENT INITIATED                           │
│    - User clicks "Pay & Release Escrow"                │
│    - Frontend sends Clerk JWT token                    │
│    - Backend verifies with Clerk                       │
│    - Backend looks up phone number in Supabase         │
└─────────┬───────────────────────────────────────────────┘
          │
          ↓
┌─────────────────────────────────────────────────────────┐
│ 6. M-PESA INTEGRATION                                  │
│    - Call Safaricom Daraja API with:                   │
│      ├─ phone: "+254712345678" (from Supabase)        │
│      ├─ amount: Job budget                             │
│      ├─ account_reference: Job ID                      │
│      └─ description: "FundiGuard Escrow"               │
│                                                         │
│    - M-Pesa sends STK push to phone                    │
│    - User enters PIN                                   │
│    - Payment confirmed                                 │
└─────────┬───────────────────────────────────────────────┘
          │
          ↓
┌─────────────────────────────────────────────────────────┐
│ 7. ESCROW TRANSACTION RECORDED                         │
│    escrow_transactions table:                           │
│    ├─ id: UUID                                          │
│    ├─ booking_id: FK to bookings                       │
│    ├─ payer_id: clerk_user_id                          │
│    ├─ phone_number: "+254712345678"                    │
│    ├─ amount: paid amount                              │
│    ├─ mpesa_ref: STK reference                         │
│    ├─ status: "escrowed"                               │
│    └─ created_at: timestamp                            │
└─────────┬───────────────────────────────────────────────┘
          │
          ↓
┌─────────────────────────────────────────────────────────┐
│ 8. WORK COMPLETED                                      │
│    - Professional marks job done                       │
│    - Release escrow payment to professional            │
└─────────────────────────────────────────────────────────┘
```

---

## 7️⃣ Key Implementation Points

### Frontend (`app/complete-profile/page.tsx`)
```typescript
const handleCompleteProfile = async () => {
  const token = await getToken();  // From Clerk
  
  const response = await fetch('/api/users/sync-clerk', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      role: selectedRole,           // "client" or "pro"
      phone_number: phoneNumber,    // "+254712345678"
    }),
  });
  
  // After sync, user can access app
  router.push('/dashboard');
};
```

### Backend Job Posting
```typescript
// When accessing jobs, backend should:
// 1. Verify Clerk JWT ✓
// 2. Find user in Supabase using clerk_user_id
// 3. Check their role: 
//    - If "client" → can create jobs
//    - If "pro" → cannot create jobs (error)
// 4. Store job with user's clerk_user_id (not custom JWT)
```

### M-Pesa Integration
```typescript
// When initiating payment:
// 1. Get user from Supabase using clerk_user_id
// 2. Extract phone_number from Supabase record
// 3. Call Safaricom with that phone
// 4. Store transaction with clerk_user_id + phone
```

---

## ✨ Summary

| Aspect | Status | Notes |
|--------|--------|-------|
| **Clerk Auth** | ✅ Live | Users can sign up/in |
| **Supabase Connection** | ✅ Active | Database tables ready |
| **Phone Number** | ⏳ Needs Implementation | Captured but not stored |
| **User Sync** | ⏳ Needs Implementation | Endpoint exists, Supabase code missing |
| **M-Pesa Integration** | ⏳ Ready to Use | Just needs phone from Supabase |
| **Escrow System** | ⏳ Ready to Use | Just needs phone from Supabase |

**Next Steps:**
1. Implement Supabase INSERT in `/api/users/sync-clerk`
2. Test: Sign up → Select role → Enter phone → Check Supabase `users` table
3. Update all endpoints to query phone from Supabase instead of request
4. Test M-Pesa flow end-to-end

