# Supabase Edge Functions Migration Guide

This project has been migrated from Express.js backend to **Supabase Edge Functions**. This eliminates the need for a separate backend server.

## What Changed

### Before (Express Backend)
- Separate Express.js REST API server (deployed separately)
- Running on `http://localhost:3001` or `https://api.fundiguard.ke`
- Requires dedicated backend hosting

### After (Supabase Edge Functions)
- Backend logic runs as Edge Functions on Supabase
- Deployable via Supabase CLI
- No separate server required
- All requests route through Supabase infrastructure

## Edge Functions

### Available Functions

1. **`auth`** - Authentication (login, register)
   - URL: `https://your-project.supabase.co/functions/v1/auth`
   - No JWT required for registration/login

2. **`jobs`** - Job CRUD operations
   - URL: `https://your-project.supabase.co/functions/v1/jobs`
   - Requires JWT for create/update operations

3. **`bids`** - Bidding system
   - URL: `https://your-project.supabase.co/functions/v1/bids`
   - Requires JWT for submit/update operations

## Local Development

### Prerequisites
- Supabase CLI installed
- Docker (for local Supabase stack)
- Node.js 18+

### Setup

1. **Install Supabase CLI**
```bash
npm install -g @supabase/cli
# or use local installation
npx supabase (installed in this project)
```

2. **Login to Supabase**
```bash
supabase login
```

3. **Link to your project**
```bash
supabase link --project-ref mbudwsejaucyauthctpo
```

4. **Start local development**
```bash
supabase start
```

This will:
- Start local PostgreSQL on `localhost:54322`
- Start PostgREST API on `localhost:54321`
- Start Edge Functions on `localhost:54321/functions/v1`

5. **Run frontend**
```bash
npm run dev  # Frontend on http://localhost:3000
```

The frontend will automatically use `http://localhost:54321/functions/v1` for local development.

## Deployment to Production

### Option 1: Deploy via Supabase Dashboard

1. Go to Supabase Dashboard → Your Project
2. Click "Edge Functions" in the sidebar
3. Click "Create a new function"
4. Copy the code from `supabase/functions/*/index.ts`
5. Deploy

### Option 2: Deploy via CLI (Recommended)

```bash
# Deploy all functions
supabase functions deploy

# Or deploy specific function
supabase functions deploy auth
supabase functions deploy jobs
supabase functions deploy bids
```

### Option 3: Deploy via GitHub Actions

1. Add Supabase access token as GitHub secret (Settings → Secrets → New repository secret)
   - Name: `SUPABASE_ACCESS_TOKEN`
   - Value: Your Supabase personal access token

2. Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy Edge Functions

on:
  push:
    branches: [main]
    paths:
      - 'supabase/functions/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: supabase/setup-cli@v1
      - run: supabase functions deploy
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          PROJECT_ID: mbudwsejaucyauthctpo
```

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://mbudwsejaucyauthctpo.supabase.co
```

### Backend (Edge Functions)
Edge Functions have automatic access to:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (for admin operations)

No separate `.env` file needed for Edge Functions!

## Testing Edge Functions Locally

### Auth Function
```bash
curl -X POST http://localhost:54321/functions/v1/auth \
  -H "Content-Type: application/json" \
  -d '{
    "action": "login",
    "phone_number": "+254712345678",
    "password": "testpassword"
  }'
```

### Jobs Function
```bash
curl -X GET "http://localhost:54321/functions/v1/jobs?category=plumbing&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Debugging

### View Function Logs
```bash
# Local
supabase functions serve

# Production
supabase functions list
supabase functions describe FUNCTION_NAME
```

### Common Issues

**Issue**: "Module not found" error
- **Solution**: Use full URLs for imports from esm.sh
  ```typescript
  import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'
  ```

**Issue**: JWT verification failing
- **Solution**: Ensure token is passed in Authorization header
  ```typescript
  const token = req.headers.get('Authorization').replace('Bearer ', '')
  ```

**Issue**: CORS errors
- **Solution**: Edge Functions should return CORS headers for browser requests
  ```typescript
  'Access-Control-Allow-Origin': '*'
  ```

## Vercel Frontend Deployment

1. In Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `NEXT_PUBLIC_API_URL=https://mbudwsejaucyauthctpo.supabase.co`
3. Redeploy

The frontend will automatically route all API calls to the Edge Functions.

## Migration Notes

- The Express backend in `/backend` folder is **no longer used**
- All API logic is now in `/supabase/functions/`
- Database structure (`database/schema.sql`) remains the same
- No changes needed to frontend API calls (already compatible)

## Next Steps

1. ✅ Deploy Edge Functions to production
2. ✅ Update Vercel environment variables
3. ✅ Test all features in production
4. ✅ Monitor Edge Function logs
5. Optional: Remove `/backend` folder after migration is verified

## References

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Supabase CLI Docs](https://supabase.com/docs/reference/cli/supabase-functions-deploy)
- [Deno Docs](https://deno.land/manual) (Edge Functions use Deno runtime)
