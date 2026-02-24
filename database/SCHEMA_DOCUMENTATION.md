# FundiGuard.ke Database Schema Documentation

## Overview
Complete PostgreSQL schema for FundiGuard.ke with 16 tables, optimized for job marketplace operations.

## Table Structure

### 1. **users** (Core User Account)
Stores all user accounts (clients, professionals, admins)

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| phone_number | VARCHAR | Unique, used for login via OTP |
| email | VARCHAR | Optional, for notifications |
| password_hash | VARCHAR | Hashed via bcrypt |
| full_name | VARCHAR | User's display name |
| profile_photo_url | TEXT | Avatar/profile picture |
| role | VARCHAR | 'client', 'pro', 'admin' |
| bio | TEXT | Professional bio (if pro) |
| location | VARCHAR | City/area (e.g., "Nairobi") |
| latitude, longitude | DECIMAL | For geolocation |
| verified | BOOLEAN | Email/phone verified |
| id_verified | BOOLEAN | National ID verified |
| dci_verified | BOOLEAN | Police background check passed |
| created_at | TIMESTAMP | Account creation date |

---

### 2. **professionals** (Fundi/Pro Profiles)
Extended data for professionals (fundis)

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | References users.id (one-to-one) |
| skill_category | VARCHAR | "Plumbing", "Electrical", "Carpentry" |
| skill_description | TEXT | Detailed skills |
| hourly_rate | DECIMAL | Hourly price |
| portfolio_url | TEXT | Link to portfolio |
| years_experience | INT | Experience level |
| response_time_minutes | INT | Avg response time (used in ranking) |
| is_available | BOOLEAN | Currently accepting jobs |
| online_status | BOOLEAN | Currently online |
| subscription_type | VARCHAR | 'free', 'premium', 'elite' |
| total_jobs_completed | INT | Career total |
| total_earnings | DECIMAL | Career earnings |
| average_rating | DECIMAL | 1-5 stars |
| rating_count | INT | Number of ratings |

---

### 3. **jobs** (Job Postings)
Job listings created by clients

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| client_id | UUID | Who posted the job |
| title | VARCHAR | Job title (e.g., "Fix leaking pipe") |
| category | VARCHAR | Category for filtering |
| description | TEXT | Detailed job description |
| budget | DECIMAL | Client's budget |
| urgency | VARCHAR | 'normal' or 'urgent' |
| location | VARCHAR | Job location |
| latitude, longitude | DECIMAL | For map display |
| status | VARCHAR | 'open', 'in_progress', 'completed', 'disputed' |
| photos | JSONB | Array of photo URLs |
| proposed_job_date | DATE | When job should be done |
| created_at | TIMESTAMP | When posted |

---

### 4. **bids** (Professional Bids on Jobs)
Professionals submit bids on open jobs

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| job_id | UUID | Which job this bid is for |
| professional_id | UUID | Who's bidding |
| proposed_price | DECIMAL | Their offered price |
| estimated_duration_hours | INT | How long it will take |
| bid_message | TEXT | Custom message from pro |
| status | VARCHAR | 'pending', 'accepted', 'rejected', 'withdrawn' |
| created_at | TIMESTAMP | When bid submitted |
| accepted_at | TIMESTAMP | When client accepted |

---

### 5. **bookings** (Accepted Bids)
Final contract between client and pro

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| job_id | UUID | Which job |
| client_id | UUID | Client ID |
| professional_id | UUID | Pro ID |
| bid_id | UUID | Which bid was accepted |
| final_price | DECIMAL | Agreed price |
| status | VARCHAR | 'scheduled', 'in_progress', 'completed', 'cancelled' |
| scheduled_date | DATE | Appointment date |
| scheduled_time | TIME | Appointment time |
| started_at | TIMESTAMP | When work started |
| completed_at | TIMESTAMP | When work finished |
| completion_photos | JSONB | Photos of completed work |
| pro_notes | TEXT | Pro's notes about the job |

---

### 6. **escrow_transactions** (Payment Holding)
M-Pesa payments held in escrow

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| booking_id | UUID | Which booking payment is for |
| amount | DECIMAL | Total amount |
| platform_fee | DECIMAL | FundiGuard's 10% commission |
| pro_receives | DECIMAL | Amount paid to pro (after fees) |
| status | VARCHAR | 'held', 'released', 'refunded', 'disputed' |
| mpesa_reference | VARCHAR | M-Pesa transaction ID |
| initiated_at | TIMESTAMP | When payment initiated |
| released_at | TIMESTAMP | When paid to pro |
| refunded_at | TIMESTAMP | When refunded to client |

---

### 7. **ratings** (Reviews & Ratings)
Client and pro rate each other after booking

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| booking_id | UUID | Which booking |
| reviewer_id | UUID | Who's rating |
| recipient_id | UUID | Who's being rated |
| rating | INT | 1-5 stars |
| review_text | TEXT | Written review |
| categories | JSONB | {"communication": 5, "quality": 5, "punctuality": 4} |
| created_at | TIMESTAMP | When rated |

---

### 8. **disputes** (Payment Disputes)
Client and pro disagree about payment/quality

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| booking_id | UUID | Which booking |
| initiator_id | UUID | Who started dispute |
| respondent_id | UUID | The other party |
| reason | TEXT | Dispute reason |
| evidence_files | JSONB | Photos/documents |
| status | VARCHAR | 'open', 'under_review', 'resolved', 'appealed' |
| resolution_notes | TEXT | Admin's decision notes |
| resolution_amount | DECIMAL | How much to refund |
| resolved_at | TIMESTAMP | When resolved |
| resolved_by_admin | UUID | Which admin resolved it |

---

### 9. **insurance_policies** (Job Insurance)
Optional job insurance coverage

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| booking_id | UUID | Which booking |
| plan_type | VARCHAR | 'basic', 'standard', 'premium' |
| coverage_amount | DECIMAL | Max coverage (50k-250k KSh) |
| premium_amount | DECIMAL | Cost (99-299 KSh) |
| status | VARCHAR | 'active', 'claimed', 'expired' |
| purchased_at | TIMESTAMP | When bought |
| expires_at | TIMESTAMP | 30 days after purchased |
| claim_amount | DECIMAL | Amount claimed |
| claim_status | VARCHAR | 'pending', 'approved', 'denied' |

---

### 10. **payments** (Earnings Ledger)
Track all money movements for professionals

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | Pro's user ID |
| amount | DECIMAL | Amount (positive) |
| payment_type | VARCHAR | 'earning', 'refund', 'bonus', 'deduction' |
| reference_id | UUID | booking_id or dispute_id |
| status | VARCHAR | 'pending', 'completed', 'failed' |
| mpesa_phone_number | VARCHAR | Where to send money |
| mpesa_transaction_id | VARCHAR | M-Pesa confirmation |
| created_at | TIMESTAMP | When generated |
| processed_at | TIMESTAMP | When actually paid to M-Pesa |

---

### 11. **messages** (Chat Between Users)
Client/Pro communication

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| booking_id | UUID | Which booking (optional) |
| sender_id | UUID | Who sent message |
| recipient_id | UUID | Who receives |
| message_text | TEXT | Message content |
| attachment_url | TEXT | File/image attachment |
| is_read | BOOLEAN | Message read status |
| created_at | TIMESTAMP | Sent time |

---

### 12. **notifications** (User Alerts)
Push/in-app notifications

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | Who receives |
| type | VARCHAR | 'new_bid', 'booking_completed', 'payment_received' |
| title | VARCHAR | Notification title |
| message | TEXT | Message body |
| related_id | UUID | Related booking_id/job_id |
| is_read | BOOLEAN | Read status |
| created_at | TIMESTAMP | When sent |

---

### 13. **disputes, insurance_policies, admin_logs, system_settings**
(See schema.sql for full details)

---

## Key Design Patterns

### 1. **Relationships**
```
users (1) ──────→ (1) professionals
       ├──────→ (M) jobs
       ├──────→ (M) bookings
       ├──────→ (M) ratings
       └──────→ (M) messages

jobs (M) ──────→ (M) bids ──────→ (1) bookings
        └──────→ (1) bookings

bookings ──────→ (1) escrow_transactions
        ├──────→ (1) ratings
        ├──────→ (1) disputes
        └──────→ (1) insurance_policies
```

### 2. **Status Workflows**

**Job Status Flow:**
```
open → in_progress → completed
                  ↓
                disputed → resolved
```

**Booking Status Flow:**
```
scheduled → in_progress → completed
         ↓
      cancelled
```

**Escrow Status Flow:**
```
held → released (payment to pro)
    → refunded (payment to client)
    → disputed (under review)
```

### 3. **Performance Optimization**
- **Indexes** on frequently queried columns:
  - user role, verification status
  - job category, status, location
  - professional rating, availability
  - booking status, dates
  - message timestamps

- **JSONB columns** for flexible data:
  - photos array
  - insurance details
  - notification metadata

---

## How to Import

### Option 1: Supabase SQL Editor
1. Go to Supabase Dashboard → SQL Editor
2. Copy entire schema.sql content
3. Click "Run" to create tables

### Option 2: Direct PostgreSQL
```bash
psql -U postgres -d fundiguard_db -f database/schema.sql
```

### Option 3: Using Supabase CLI
```bash
supabase db push
```

---

## Next Steps

1. ✅ **Database Schema** (DONE)
2. ⏳ **Authentication Service** (Next)
3. ⏳ **Job Management APIs**
4. ⏳ **Payment Integration (M-Pesa)**
5. ⏳ **Rating & Review System**

Ready to proceed with Authentication Service setup?
