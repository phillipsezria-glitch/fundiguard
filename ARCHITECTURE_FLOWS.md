# 🔄 Project Flow & Architecture Diagrams

## Current Application Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        FUNDIGUARD.KE                             │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  FRONTEND (Next.js 16.1.6 - Port 3000)                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────┐                    │
│  │ 1. HOME PAGE (/page.tsx)                 │                   │
│  │ ├─ Hero Section                          │                   │
│  │ ├─ Service Categories                    │                   │
│  │ ├─ Live Jobs Feed (Mock)                 │                   │
│  │ ├─ Testimonials (Mock)                   │                   │
│  │ └─ CTA Buttons (Browse, Post, For Pros)  │                   │
│  └─────────────────────────────────────────┘                    │
│         │                                                         │
│         ├──→ Browse Services (/browse-jobs)  ✓ Working          │
│         ├──→ Post a Job (/post-job)          ⚠️ Needs Auth Check │
│         └──→ For Professionals (/for-pros)   ✓ Working          │
│                                                                   │
│  ┌─────────────────────────────────────────┐                    │
│  │ 2. AUTH PAGE (/auth/page.tsx)            │                   │
│  │ ├─ Step 1: Role Selection (Client/Pro)   │                   │
│  │ ├─ Step 2: Phone Input + Validation      │                   │
│  │ ├─ Step 3: OTP or Password               │                   │
│  │ ├─ Password Strength Indicator           │                   │
│  │ └─ JWT Token Storage (localStorage)      │                   │
│  └─────────────────────────────────────────┘                    │
│         │                                                         │
│         └──→ User Authenticated ✓                               │
│             └──→ Redirect to /dashboard                         │
│                                                                   │
│  ┌─────────────────────────────────────────┐                    │
│  │ 3. DASHBOARD (Protected)                 │                   │
│  │ ├─ Active Jobs (❌ MOCK DATA - BUG)      │                   │
│  │ ├─ Job Status Tracking                   │                   │
│  │ ├─ Release Payment Button                │                   │
│  │ └─ Past Jobs History (❌ MOCK DATA)      │                   │
│  └─────────────────────────────────────────┘                    │
│         │                                                         │
│         ├──→ Browse Jobs (/browse-jobs)                         │
│         ├──→ Post Job (/post-job)                               │
│         ├──→ My Bids (/my-bids)                                 │
│         ├──→ Profile (/profile)                                 │
│         └──→ Edit Profile (/profile/edit)                       │
│                                                                   │
│  ┌─────────────────────────────────────────┐                    │
│  │ 4. BROWSE JOBS (/browse-jobs)           │                   │
│  │ ├─ Category Filter                       │                   │
│  │ ├─ Search/Keyword Filter                 │                   │
│  │ ├─ Distance Filter (Map View)            │                   │
│  │ ├─ Job Cards with Details                │                   │
│  │ ├─ Bid Form (on job select)              │                   │
│  │ └─ Job Map Visualization                 │                   │
│  └─────────────────────────────────────────┘                    │
│                                                                   │
│  ┌─────────────────────────────────────────┐                    │
│  │ 5. POST JOB (/post-job)                  │                   │
│  │ ├─ Step 1: Job Details                   │                   │
│  │ ├─ Step 2: Location + Time               │                   │
│  │ ├─ Step 3: Photos + Review               │                   │
│  │ ├─ Photo Uploader Component              │                   │
│  │ └─ Insurance Option                      │                   │
│  └─────────────────────────────────────────┘                    │
│                                                                   │
│  ┌─────────────────────────────────────────┐                    │
│  │ 6. FOR PROFESSIONALS (/for-pros)         │                   │
│  │ ├─ Benefits Overview                     │                   │
│  │ ├─ Verification Steps                    │                   │
│  │ ├─ Pricing Plans                         │                   │
│  │ ├─ Pro Testimonials                      │                   │
│  │ └─ Sign Up CTA → /auth (with role=pro)  │                   │
│  └─────────────────────────────────────────┘                    │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
              API Client (app/lib/api.ts)
                        │
                API_URL Check:
              ┌─────────┴──────────┐
              │                    │
        Localhost?           Fallback URL ❌ (DELETED)
        localhost:3001        https://backend-vercel.app
              │                    │
              └─────────┬──────────┘


┌──────────────────────────────────────────────────────────────────┐
│  BACKEND (Express - Port 3001)                                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Authentication Service                                          │
│  ├─ POST /api/auth/register (phone + password)                 │
│  ├─ POST /api/auth/login (phone + password)                    │
│  ├─ POST /api/auth/request-otp (phone number)                  │
│  ├─ POST /api/auth/verify-otp (phone + otp)                    │
│  └─ GET  /api/auth/health (check status)                       │
│                                                                   │
│  Job Management                                                  │
│  ├─ GET  /api/jobs (list all jobs with filters)                │
│  ├─ POST /api/jobs (create new job)                            │
│  ├─ GET  /api/jobs/:id (get job details)                       │
│  ├─ PATCH /api/jobs/:id (update job)                           │
│  └─ DELETE /api/jobs/:id (delete job)                          │
│                                                                   │
│  Bidding System                                                  │
│  ├─ POST /api/bids (submit bid on job)                         │
│  ├─ GET  /api/bids/:jobId (get bids for job)                   │
│  ├─ PATCH /api/bids/:id (accept/reject bid)                    │
│  └─ DELETE /api/bids/:id (withdraw bid)                        │
│                                                                   │
│  Professional Management                                         │
│  ├─ GET /api/professionals (list professionals)                │
│  ├─ GET /api/professionals/:id (get pro details)               │
│  └─ POST /api/professionals/verify (submit verification)       │
│                                                                   │
│  Payment Processing                                              │
│  ├─ POST /api/payments/initiate (start payment)                │
│  ├─ POST /api/payments/confirm (confirm payment)               │
│  ├─ GET  /api/payments/status (check payment status)           │
│  └─ POST /api/payments/callback (M-Pesa webhook)               │
│                                                                   │
│  File Uploads                                                    │
│  ├─ POST /api/upload (single file)                             │
│  ├─ POST /api/upload/batch (multiple files)                    │
│  └─ DELETE /api/upload/:path (delete file)                     │
│                                                                   │
│  User Management                                                 │
│  ├─ GET  /api/users/profile (get user profile)                 │
│  ├─ PATCH /api/users/profile (update profile)                  │
│  └─ GET  /api/users/:id (get public profile)                   │
│                                                                   │
│  Bookings & Completion                                           │
│  ├─ GET  /api/bookings (list user bookings)                    │
│  ├─ GET  /api/bookings/:id (booking details)                   │
│  └─ POST /api/bookings/:id/complete (mark complete)            │
│                                                                   │
│  Database: Supabase PostgreSQL                                  │
│  ├─ users (phone, password hash, name, role)                   │
│  ├─ jobs (title, description, budget, photos)                  │
│  ├─ bids (job_id, professional_id, amount)                     │
│  ├─ bookings (job_id, professional_id, status)                 │
│  ├─ payments (booking_id, amount, status, ref)                 │
│  ├─ disputes (booking_id, photos, evidence)                    │
│  └─ professionals (user_id, verified, rating)                  │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## User Journey Maps

### Client Journey (Happy Path)

```
1. DISCOVERY
   Home → Browse Jobs → See job listings by category

2. AUTHENTICATION  
   Click "Browse" → Redirected to /auth
   → Select "Client" role
   → Enter phone number  
   → Verify with OTP
   → Store JWT token
   → Redirect to Dashboard

3. JOB BROWSING
   Dashboard → Click "Browse Jobs"
   → Category filter
   → Search by keyword
   → View jobs on map
   → Click job → See details
   → Click "Submit Bid"

4. BIDDING
   Bid Form → Enter bid amount
   → Add message to professional
   → Submit
   → Bid appears in professional's bids list

5. PAYMENT (Escrow)
   Professional accepts → Escrow holds payment
   → Client sees "Awaiting Completion"
   → Professional uploads completion photos
   → Client reviews → Releases payment via M-Pesa

6. DISPUTE (if needed)
   Job issue → Click "File Dispute"
   → Upload evidence photos
   → Add description
   → Admin reviews → Resolution
```

### Professional Journey (Happy Path)

```
1. RECRUITMENT
   Home → Click "For Professionals"
   → See benefits & verification steps
   → Click "Get Started"

2. AUTHENTICATION + VERIFICATION
   Select "Professional" role
   → Phone + OTP
   → Upload ID + Police Clearance
   → Record skill video
   → Admin review (24hrs)
   → Get verified badge

3. JOB NOTIFICATIONS
   Receive real-time notifications
   → See incoming jobs in their category
   → View job details + budget
   → Decide to bid or pass

4. BIDDING
   Available Jobs → View matching jobs
   → Submit bid with timeline + message
   → Wait for client response

5. COMPLETION
   Bid accepted → Job starts
   → Complete work
   → Upload completion photos
   → Client reviews → Payment released via M-Pesa B2C

6. REPUTATION
   Each completed job → Rating + review
   → Portfolio builds automatically
   → Higher ratings → More jobs
```

---

## Data Flow Diagram

```
┌────────────────┐
│  FRONTEND      │
│  (Next.js)     │
└────────┬───────┘
         │
         │ HTTP/REST
         │ (JSON)
         │
         ├──→ POST /api/auth/login
         │    Request: { phone, password }
         │    Response: { user: {...}, token: "jwt..." }
         │
         ├──→ GET /api/jobs?category=Plumbing
         │    Request: Authorization: Bearer <token>
         │    Response: { jobs: [...], total: 45 }
         │
         ├──→ POST /api/jobs
         │    Body: { title, description, budget, location, photos }
         │    Response: { id, created_at, ... }
         │
         ├──→ POST /api/bids
         │    Body: { job_id, amount, message }
         │    Response: { bid_id, status }
         │
         └──→ POST /api/upload
              Body: FormData with file
              Response: { url, path }
         │
         │
         │
┌────────▼───────┐
│  BACKEND       │
│  (Express)     │
└────────┬───────┘
         │
         │ SQL/ORM
         │
         │
┌────────▼──────────────┐
│  SUPABASE             │
│  PostgreSQL Database  │
│                       │
│  Tables:              │
│  ├─ users            │
│  ├─ jobs             │
│  ├─ bids             │
│  ├─ bookings         │
│  ├─ payments         │
│  ├─ disputes         │
│  └─ professionals    │
│                       │
│  Storage (S3-like):   │
│  └─ /job-photos      │
└───────────────────────┘
```

---

## State Management Flow

```
localStorage (Client-side)
├─ authToken (JWT)
├─ user: {
│   ├─ id
│   ├─ phone_number
│   ├─ full_name
│   ├─ role: 'client' | 'pro'
│   └─ created_at
│ }
└─ userLocation (for map filtering)


Component State (React)
├─ Dashboard
│   ├─ activeJobs (from API) ❌ Currently MOCK
│   ├─ selectedJobId
│   ├─ showReleaseModal
│   └─ expandedJobId
│
├─ BrowseJobs
│   ├─ jobs (from /api/jobs)
│   ├─ categoryFilter
│   ├─ searchTerm
│   ├─ userLocation
│   ├─ selectedJobId
│   └─ mapView: boolean
│
├─ PostJob  
│   ├─ step (1-3)
│   ├─ form data
│   ├─ uploadedPhotos
│   └─ submitted: boolean
│
└─ Auth
    ├─ tab: 'login' | 'signup'
    ├─ role: 'client' | 'pro'
    ├─ step: 1-3
    ├─ formData
    ├─ loading
    └─ error message


Server Session (Backend)
├─ JWT Secret (verify tokens)
├─ OTP Storage (in-memory or Redis)
├─ Database Transactions
└─ File Upload Cache
```

---

## Error Handling Flow

```
Frontend Error Scenarios:
├─ Network Error
│  └─ "Unable to connect to server"
│
├─ Invalid Phone Number
│  └─ "Phone must be 10-12 digits (Kenya format)"
│
├─ Weak Password
│  └─ "Password must have 8+ chars, uppercase, number"
│
├─ OTP Verification Failed
│  └─ "Invalid OTP, please try again"
│
├─ Unauthorized (401)
│  └─ Redirect to /auth, clear localStorage
│
├─ Forbidden (403)
│  └─ "You don't have permission for this action"
│
└─ Server Error (500)
   └─ "Server error, please try again later"


Backend Error Scenarios:
├─ User Already Exists
│  └─ 409 Conflict
│
├─ Invalid OTP
│  └─ 400 Bad Request
│
├─ Job Not Found
│  └─ 404 Not Found
│
├─ Insufficient Funds
│  └─ 402 Payment Required
│
└─ Database Error
   └─ 500 Internal Server Error
```

---

## Component Tree

```
RootLayout
├─ <Header>
│  ├─ Logo + Brand
│  ├─ NavLinks (Browse, Post, For Pros, Insurance, Support)
│  ├─ Language Toggle (EN/SW)
│  └─ Auth Buttons (Login/Logout/Profile)
│
├─ <Main Content>
│  └─ Pages/
│     ├─ page.tsx (Home)
│     │  ├─ Hero Section
│     │  ├─ Service Categories
│     │  ├─ Live Jobs Feed
│     │  ├─ Testimonials
│     │  └─ CTA Buttons
│     │
│     ├─ auth/page.tsx
│     │  ├─ Tab Switch (Login/Signup)
│     │  ├─ Role Selector
│     │  ├─ Phone Input
│     │  ├─ OTP/Password Input
│     │  └─ Password Strength
│     │
│     ├─ dashboard/page.tsx
│     │  ├─ Welcome Banner
│     │  ├─ Tab Switch (Active/Completed)
│     │  ├─ JobCard[] (Active Jobs)
│     │  │  └─ Release Payment Modal
│     │  └─ JobCard[] (Past Jobs)
│     │
│     ├─ browse-jobs/page.tsx
│     │  ├─ Search + Filters
│     │  │  ├─ Category Dropdown
│     │  │  ├─ Search Input
│     │  │  ├─ Distance Slider
│     │  │  └─ View Toggle (List/Map)
│     │  ├─ JobCard[] (List View)
│     │  │  └─ <BidForm> (on select)
│     │  └─ <JobMap> (Map View)
│     │
│     ├─ post-job/page.tsx
│     │  ├─ Step Indicator (1-3)
│     │  ├─ Step 1: Job Details
│     │  │  ├─ Category Selector
│     │  │  ├─ Title Input
│     │  │  ├─ Description Textarea
│     │  │  └─ Budget Input
│     │  ├─ Step 2: Location + Time
│     │  │  ├─ <LocationPicker>
│     │  │  ├─ Date Picker
│     │  │  ├─ Time Picker
│     │  │  └─ Urgency Toggle
│     │  ├─ Step 3: Photos + Review
│     │  │  ├─ <PhotoUploader>
│     │  │  ├─ Insurance Checkbox
│     │  │  └─ Submit Button
│     │  └─ Success Message
│     │
│     ├─ profile/page.tsx
│     │  ├─ Profile Header
│     │  ├─ User Details
│     │  ├─ Rating Display
│     │  ├─ Job History
│     │  └─ Edit Button → /profile/edit
│     │
│     ├─ profile/edit/page.tsx
│     │  ├─ Name Input
│     │  ├─ Location Input
│     │  ├─ Bio Textarea
│     │  ├─ <PhotoUploader> (profile)
│     │  └─ Save Button
│     │
│     ├─ for-pros/page.tsx
│     │  ├─ Hero Section
│     │  ├─ Benefits Grid
│     │  ├─ Verification Steps
│     │  ├─ Pricing Plans
│     │  ├─ Testimonials
│     │  └─ Call to Action
│     │
│     ├─ pro/[id]/page.tsx
│     │  ├─ Professional Header
│     │  ├─ Verification Badge
│     │  ├─ Rating + Reviews
│     │  ├─ Job History
│     │  └─ Contact/Hire Button
│     │
│     ├─ pro-dashboard/page.tsx (Professional)
│     │  ├─ Stats Overview
│     │  ├─ Available Jobs Tab
│     │  ├─ Active Jobs Tab
│     │  ├─ Past Jobs Tab
│     │  └─ Profile Settings
│     │
│     ├─ my-bids/page.tsx (Professional)
│     │  ├─ Pending Bids Tab
│     │  ├─ Accepted Bids Tab
│     │  ├─ Completed Bids Tab
│     │  └─ Earnings Summary
│     │
│     ├─ dispute/page.tsx
│     │  ├─ Dispute Management
│     │  ├─ File New Dispute Form
│     │  ├─ <PhotoUploader> (evidence)
│     │  └─ Active Disputes List
│     │
│     ├─ insurance/page.tsx (MISSING! ❌)
│     └─ support/page.tsx (MISSING! ❌)
│
├─ <Footer>
│  ├─ Company Info
│  ├─ Links
│  └─ Social Media
│
└─ Shared Components/
   ├─ <BidForm> - Submit bid on job
   ├─ <BidsList> - List of bids
   ├─ <PhotoUploader> - Image upload
   ├─ <LocationPicker> - Map-based location
   ├─ <JobMap> - Leaflet/Mapbox visualization
   ├─ CompletionModal - Mark job complete
   │
   └─ UI Components/
      ├─ <Button> - Reusable button
      ├─ <Modal> - Dialog component
      ├─ <FundiCard> - Professional card
      ├─ <ServiceCategoryCard>
      ├─ <StatusPill> - Status badge
      ├─ <RatingStars> - 5-star rating
      └─ <TrustBar> - Trust indicator
```

---

## Missing Pages (Breaking Navigation)

```
❌ Header Links vs Actual Routes

Header says:           Actual Route:
├─ Browse Services    → /browse (BROKEN! Should be /browse-jobs)
├─ Post a Job        → /post-job ✓
├─ For Pros          → /for-pros ✓
├─ Insurance         → /insurance ❌ (NO ROUTE)
└─ Support          → /support ❌ (NO ROUTE)

Also exists but not in nav:
├─ /dashboard ✓
├─ /profile ✓
├─ /profile/edit ✓
├─ /my-bids ✓
├─ /pro-dashboard ✓
├─ /dispute ✓
├─ /pro/[id] ✓
├─ /debug-map ⚠️ (Debug route!)
└─ /auth ✓
```

---

## Performance & Scalability Notes

### Good:
- ✅ Image compression on upload
- ✅ Lazy loading on category cards
- ✅ Map tiles cached by Mapbox
- ✅ Database indexed on frequently queried fields (phone_number, status)

### Could improve:
- ⚠️ Dashboard re-fetches jobs on every render (should use React Query or SWR)
- ⚠️ No pagination on job browse (loads all jobs)
- ⚠️ No image optimization (should use Next.js Image component)
- ⚠️ No API response caching

