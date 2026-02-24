import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Lazy load Twilio client only if credentials exist
let client: any = null;

if (!accountSid || !authToken) {
  console.warn('⚠️  Twilio credentials not configured - SMS/OTP will not be sent');
} else {
  try {
    client = twilio(accountSid, authToken);
  } catch (error) {
    console.warn('⚠️  Failed to initialize Twilio -', error);
  }
}

/**
 * Generate a 6-digit OTP code
 */
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP via SMS using Twilio
 */
export const sendOTP = async (phoneNumber: string, otp: string): Promise<boolean> => {
  try {
    if (!client || !process.env.TWILIO_PHONE_NUMBER) {
      console.warn('⚠️  Twilio not configured - OTP mock mode. OTP: ' + otp);
      return true; // Mock success for development
    }

    const message = `Your FundiGuard verification code is: ${otp}. Do not share this code with anyone. Valid for 10 minutes.`;

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    console.log(`✓ OTP sent to ${phoneNumber}`);
    return true;
  } catch (error) {
    console.error('Failed to send OTP:', error);
    return false;
  }
};

/**
 * Format phone number to international format (+254...)
 */
export const formatPhoneNumber = (phone: string): string => {
  let cleaned = phone.replace(/\D/g, '');

  // Handle Kenyan numbers
  if (cleaned.startsWith('0')) {
    return '+254' + cleaned.substring(1);
  }

  if (cleaned.startsWith('7')) {
    return '+254' + cleaned;
  }

  if (cleaned.length === 10 && !cleaned.startsWith('254')) {
    return '+254' + cleaned.substring(1);
  }

  if (!cleaned.startsWith('254')) {
    return '+' + cleaned;
  }

  return '+' + cleaned;
};
