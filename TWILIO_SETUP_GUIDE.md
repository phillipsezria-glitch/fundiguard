# Twilio SMS Setup Guide for FundiGuard.ke

## Overview
This guide walks you through setting up Twilio to send OTP codes via SMS for FundiGuard's authentication system.

## Current Status
- ✅ OTP system works in **development mode** (shows codes in console)
- ✅ Backend gracefully handles missing Twilio credentials
- ⏳ Production needs real SMS delivery via Twilio

---

## Step 1: Create Twilio Account

1. Go to https://www.twilio.com/try-twilio
2. Sign up with your email and create a password
3. Verify your email address
4. Complete the signup process
5. You'll be taken to the Twilio Console at https://console.twilio.com

---

## Step 2: Get Twilio Credentials

### Account SID & Auth Token
1. Login to https://console.twilio.com
2. Click on your account name (top-left) → Settings
3. Under **Account SID**: Copy the SID value (looks like: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
4. Under **Auth Token**: Copy the token (looks like: `abcdef123456789...`)

⚠️ **Security Note**: Never commit these credentials to git! Use environment variables only.

### Example Credentials (DO NOT USE):
```
TWILIO_ACCOUNT_SID=AC123456789abcdefghijklmnopqrstuv
TWILIO_AUTH_TOKEN=abcdef123456789ghijklmnopqrstuvwx
```

---

## Step 3: Get a Twilio Phone Number

### Option A: Try Account (Free)
1. In Console, go to **Phone Numbers** → **Manage** → **Active Numbers**
2. Click **Get a trial number**
3. Select country: **Kenya** (+254)
4. Accept terms and get a phone number (you'll get US number in trial)
5. Click **Approve** to claim the number
6. Copy the number (e.g., `+1234567890`)

**Note**: Trial accounts can only send SMS to verified numbers. You must register all recipient phone numbers.

### Option B: Upgrade for Production
1. Upgrade your Twilio account (add payment method)
2. Purchase a Kenya phone number (+254)
3. Use any number as recipient

---

## Step 4: Register Recipient Numbers (Trial Only)

If using trial account, add numbers that can receive SMS:

1. Go to **Phone Numbers** → **Verify Caller IDs**
2. Click **Add a new Caller ID**
3. Select **Phone Number**
4. Enter the phone number (e.g., +254712345678)
5. Follow verification instructions (Twilio calls you)
6. Number is now verified and can receive SMS

---

## Step 5: Update Backend Environment Variables

### For Development
Update `backend/.env`:

```env
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

Example:
```env
SUPABASE_URL=https://mbudwsejaucyauthctpo.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxx
SUPABASE_ANON_KEY=sb_publishable_xxx
JWT_SECRET=fundiguard-dev-secret-key-change-in-prod-2026
PORT=3001
NODE_ENV=development

# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=abcdefghijklmnopqrstuvwxyzabcdef
TWILIO_PHONE_NUMBER=+1234567890
```

### For Vercel Production
1. Go to your Vercel project settings
2. Environment Variables
3. Add the three Twilio variables
4. Deploy

---

## Step 6: Test OTP Delivery

### Local Testing

1. **Start backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Request OTP** via API:
   ```bash
   curl -X POST http://localhost:3001/api/auth/request-otp \
     -H "Content-Type: application/json" \
     -d '{"phone_number": "+254712345678", "action": "register"}'
   ```
   
   Response:
   ```json
   {"message": "OTP sent successfully"}
   ```

3. **Check SMS** on your registered phone number
   - You should receive: "Your FundiGuard OTP code is: 123456. Valid for 10 minutes."

4. **Verify OTP** with received code:
   ```bash
   curl -X POST http://localhost:3001/api/auth/verify-otp \
     -H "Content-Type: application/json" \
     -d '{
       "phone_number": "+254712345678",
       "otp_code": "123456",
       "action": "register",
       "full_name": "John Doe",
       "role": "client"
     }'
   ```
   
   Response:
   ```json
   {
     "user": {
       "id": "xxx",
       "phone_number": "+254712345678",
       "full_name": "John Doe",
       "role": "client"
     },
     "token": "eyJhbGciOiJIUzI1NiIs...",
     "expires_in": 86400
   }
   ```

### Frontend Testing

1. **Start frontend** (in new terminal):
   ```bash
   cd app
   npm run dev
   ```

2. Open http://localhost:3000/auth

3. Click "Create Account" as Client/Pro

4. Enter:
   - Phone: 712345678 (app adds +254 automatically)
   - Full Name: Your Name
   - Select role

5. Click "Send OTP Code" 📱

6. Check SMS (or backend console for dev mode)

7. Enter 6-digit OTP

8. Should redirect to dashboard with auth token

---

## Step 7: OTP Template Customization

### Current OTP Message
```
Your FundiGuard OTP code is: 123456. Valid for 10 minutes.
```

To customize, edit `backend/src/services/authService.ts`:

Find the OTP sending code:
```typescript
const smsText = `Your FundiGuard OTP code is: ${otpCode}. Valid for 10 minutes.`;
```

Change to your preferred message:
```typescript
const smsText = `Your FundiGuard verification code is ${otpCode}. expires in 10 min`;
```

---

## Troubleshooting

### Issue: "Missing Twilio credentials"
**Solution**: Verify credentials in `.env` file and restart server

### Issue: No SMS received
**Checklist**:
- ✓ Phone number registered (trial account)
- ✓ Twilio account has available credits
- ✓ Phone number uses correct format (+254...)
- ✓ Check SMS spam folder
- ✓ Restart backend after env changes

### Issue: "Authentication failed" on Twilio
**Solution**: Check credentials are correct (copy-paste without spaces)

### Issue: Backend console shows error
**Solution**: 
- Check `backend/src/services/authService.ts` for Twilio initialization
- Verify phone number is in international format (+254...)

---

## Development Fallback Mode

If Twilio credentials are missing:
- ✅ Backend still works
- ✅ OTP code logged to backend console
- ✅ Login/signup shows OTP in modal
- ✅ Useful for testing without real SMS

Example console output:
```
[OTP] Generated for +254712345678: 747462
```

---

## SMS Costs

### Trial Account
- **Free**: First 15 EUR
- **Includes**: SMS to verified numbers only
- **Outbound**: ~$0.08 per SMS (Kenya rates vary)

### Production Account
- **Suggested**: Upgrade and buy credits
- **Cost**: Pay-as-you-go (usually ~$0.05-0.10 per SMS to Kenya)
- **Volume**: Consider bulk SMS discounts for high volume

---

## Security Best Practices

1. ✅ Never commit credentials to git
2. ✅ Use environment variables for all secrets
3. ✅ Rotate auth tokens monthly
4. ✅ Use strong JWT secret in production
5. ✅ Enable 2FA on Twilio account
6. ✅ Monitor Twilio console for unauthorized usage

---

## Next Steps After Setup

1. **Test locally** with Twilio credentials added
2. **Deploy backend** to Vercel with environment variables
3. **Test production** SMS delivery
4. **Monitor costs** in Twilio console
5. **Add email fallback** (optional) if SMS fails
6. **Set rate limiting** to prevent OTP brute force attacks

---

## Reference Links

- **Twilio Console**: https://console.twilio.com
- **Twilio Pricing**: https://www.twilio.com/sms/pricing/ke
- **Twilio Docs**: https://www.twilio.com/docs/sms
- **Kenya Phone Formats**: +254 followed by 9-digit number

---

## Backend Code Reference

### When Twilio is configured (`backend/src/services/authService.ts`)
```typescript
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    const twilio = require('twilio');
    const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
    );
    
    await client.messages.create({
        body: `Your FundiGuard OTP code is: ${otpCode}. Valid for 10 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
    });
}
```

This is already implemented! Just add the environment variables.

---

## Support

For issues:
1. Check backend logs: `npm run dev` output
2. Verify Twilio credentials in console
3. Test with `curl` commands above
4. Check Twilio console → Logs → SMS

---

**Last Updated**: 2025 | FundiGuard Auth System v1.0
