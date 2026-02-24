import { supabase } from '../config/supabase';
import { generateOTP, sendOTP, formatPhoneNumber } from '../utils/otp';
import { hashPassword, comparePassword, validatePhoneNumber, validatePasswordStrength } from '../utils/validation';
import { generateToken } from '../utils/jwt';
import { User, AuthRequest, OTPVerifyRequest } from '../types';

// In-memory OTP storage (in production, use Redis)
const otpStore: Map<string, { code: string; expiresAt: number; action: string }> = new Map();

/**
 * Request OTP for login/registration
 */
export const requestOTP = async (phoneNumber: string, action: 'register' | 'login' = 'login'): Promise<void> => {
  // Validate phone number format
  if (!validatePhoneNumber(phoneNumber)) {
    throw new Error('Invalid phone number format');
  }

  const formattedPhone = formatPhoneNumber(phoneNumber);

  // Check if user exists (for login)
  if (action === 'login') {
    const { data } = await supabase
      .from('users')
      .select('id')
      .eq('phone_number', formattedPhone)
      .single();

    if (!data) {
      throw new Error('User not found. Please register first.');
    }
  }

  // Generate OTP
  const otp = generateOTP();

  // Store OTP with 10-minute expiry
  otpStore.set(formattedPhone, {
    code: otp,
    expiresAt: Date.now() + 10 * 60 * 1000,
    action,
  });

  // Send OTP via SMS
  await sendOTP(formattedPhone, otp);

  console.log(`OTP requested for ${formattedPhone} (${action})`);
};

/**
 * Verify OTP and login/register user
 */
export const verifyOTPAndAuth = async (request: OTPVerifyRequest): Promise<{ user: User; token: string }> => {
  const formattedPhone = formatPhoneNumber(request.phone_number);
  const otpData = otpStore.get(formattedPhone);

  // Validate OTP exists
  if (!otpData) {
    throw new Error('OTP not found. Please request a new one.');
  }

  // Validate OTP not expired
  if (Date.now() > otpData.expiresAt) {
    otpStore.delete(formattedPhone);
    throw new Error('OTP expired. Please request a new one.');
  }

  // Validate OTP code
  if (otpData.code !== request.otp_code) {
    throw new Error('Invalid OTP code');
  }

  // Clear OTP after successful verification
  otpStore.delete(formattedPhone);

  // Handle registration
  if (request.action === 'register') {
    if (!request.full_name || !request.role) {
      throw new Error('Full name and role required for registration');
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('phone_number', formattedPhone)
      .single();

    if (existingUser) {
      throw new Error('User already registered with this phone number');
    }

    // Create new user
    const newUser: User = {
      id: crypto.randomUUID(),
      phone_number: formattedPhone,
      full_name: request.full_name,
      role: request.role,
      verified: true, // Phone verified via OTP
      id_verified: false,
      dci_verified: false,
      created_at: new Date().toISOString(),
    };

    const { error: insertError } = await supabase
      .from('users')
      .insert([newUser]);

    if (insertError) {
      console.error('Failed to create user:', insertError);
      throw new Error('Failed to create user account');
    }

    // Create professional profile if registering as pro
    if (request.role === 'pro') {
      const { error: proError } = await supabase
        .from('professionals')
        .insert([{
          id: crypto.randomUUID(),
          user_id: newUser.id,
          skill_category: 'General',
          hourly_rate: 500,
          years_experience: 1,
          response_time_minutes: 60,
          is_available: true,
          online_status: false,
          subscription_type: 'free',
          total_jobs_completed: 0,
          total_earnings: 0,
          average_rating: 0,
          rating_count: 0,
        }]);

      if (proError) {
        console.error('Failed to create professional profile:', proError);
      }
    }

    const token = generateToken(newUser.id, newUser.role);

    return { user: newUser, token };
  }

  // Handle login
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('phone_number', formattedPhone)
    .single();

  if (error || !user) {
    throw new Error('User not found');
  }

  const token = generateToken(user.id, user.role);

  return { user, token };
};

/**
 * Register user with password (alternative to OTP)
 */
export const registerWithPassword = async (request: AuthRequest): Promise<{ user: User; token: string }> => {
  if (!request.full_name || !request.role || !request.password) {
    throw new Error('Full name, role, and password required');
  }

  if (!validatePhoneNumber(request.phone_number)) {
    throw new Error('Invalid phone number format');
  }

  if (!validatePasswordStrength(request.password)) {
    throw new Error('Password must be at least 8 characters with uppercase, lowercase, and number');
  }

  const formattedPhone = formatPhoneNumber(request.phone_number);

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('phone_number', formattedPhone)
    .single();

  if (existingUser) {
    throw new Error('User already registered with this phone number');
  }

  // Hash password
  const passwordHash = await hashPassword(request.password);

  // Create new user
  const newUser: User = {
    id: crypto.randomUUID(),
    phone_number: formattedPhone,
    full_name: request.full_name,
    password_hash: passwordHash,
    role: request.role,
    verified: false,
    id_verified: false,
    dci_verified: false,
    created_at: new Date().toISOString(),
  };

  const { error: insertError } = await supabase
    .from('users')
    .insert([newUser]);

  if (insertError) {
    throw new Error('Failed to create user account');
  }

  // Create professional profile if registering as pro
  if (request.role === 'pro') {
    await supabase
      .from('professionals')
      .insert([{
        id: crypto.randomUUID(),
        user_id: newUser.id,
        skill_category: 'General',
        hourly_rate: 500,
        years_experience: 1,
        response_time_minutes: 60,
        is_available: true,
        online_status: false,
        subscription_type: 'free',
        total_jobs_completed: 0,
        total_earnings: 0,
        average_rating: 0,
        rating_count: 0,
      }]);
  }

  const token = generateToken(newUser.id, newUser.role);

  return { user: newUser, token };
};

/**
 * Login with phone and password
 */
export const loginWithPassword = async (phoneNumber: string, password: string): Promise<{ user: User; token: string }> => {
  if (!validatePhoneNumber(phoneNumber)) {
    throw new Error('Invalid phone number format');
  }

  const formattedPhone = formatPhoneNumber(phoneNumber);

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('phone_number', formattedPhone)
    .single();

  if (error || !user) {
    throw new Error('Invalid credentials');
  }

  if (!user.password_hash) {
    throw new Error('This account uses OTP login only');
  }

  const passwordMatch = await comparePassword(password, user.password_hash);

  if (!passwordMatch) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user.id, user.role);

  return { user, token };
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (phoneNumber: string): Promise<void> => {
  if (!validatePhoneNumber(phoneNumber)) {
    throw new Error('Invalid phone number format');
  }

  const formattedPhone = formatPhoneNumber(phoneNumber);

  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('phone_number', formattedPhone)
    .single();

  if (!user) {
    throw new Error('User not found');
  }

  // Generate and send OTP
  const otp = generateOTP();
  otpStore.set(formattedPhone, {
    code: otp,
    expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes for password reset
    action: 'reset',
  });

  await sendOTP(formattedPhone, otp);
};

/**
 * Reset password with OTP verification
 */
export const resetPasswordWithOTP = async (phoneNumber: string, otp: string, newPassword: string): Promise<void> => {
  if (!validatePhoneNumber(phoneNumber)) {
    throw new Error('Invalid phone number format');
  }

  if (!validatePasswordStrength(newPassword)) {
    throw new Error('Password must be at least 8 characters with uppercase, lowercase, and number');
  }

  const formattedPhone = formatPhoneNumber(phoneNumber);
  const otpData = otpStore.get(formattedPhone);

  if (!otpData) {
    throw new Error('No reset request found');
  }

  if (Date.now() > otpData.expiresAt) {
    otpStore.delete(formattedPhone);
    throw new Error('OTP expired');
  }

  if (otpData.code !== otp) {
    throw new Error('Invalid OTP');
  }

  otpStore.delete(formattedPhone);

  const passwordHash = await hashPassword(newPassword);

  const { error } = await supabase
    .from('users')
    .update({ password_hash: passwordHash })
    .eq('phone_number', formattedPhone);

  if (error) {
    throw new Error('Failed to reset password');
  }
};
