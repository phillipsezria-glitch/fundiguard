import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { OTPVerifyRequest, AuthRequest } from '../types';

/**
 * Request OTP for login or registration
 * POST /api/auth/request-otp
 * Body: { phone_number: string, action: 'login' | 'register' }
 */
export const requestOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone_number, action = 'login' } = req.body;

    if (!phone_number) {
      res.status(400).json({ error: 'Phone number required' });
      return;
    }

    await authService.requestOTP(phone_number, action);

    res.json({
      message: 'OTP sent successfully',
      ...(process.env.NODE_ENV === 'development' && { debug: 'Check SMS or check OTP store in development' }),
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Verify OTP and authenticate user
 * POST /api/auth/verify-otp
 * Body: { phone_number: string, otp_code: string, action: 'login' | 'register', full_name?: string, role?: string }
 */
export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const request: OTPVerifyRequest = req.body;

    if (!request.phone_number || !request.otp_code || !request.action) {
      res.status(400).json({ error: 'Phone number, OTP code, and action required' });
      return;
    }

    const { user, token } = await authService.verifyOTPAndAuth(request);

    res.json({
      user,
      token,
      expires_in: 86400, // 24 hours
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Register with phone and password
 * POST /api/auth/register
 * Body: { phone_number: string, password: string, full_name: string, role: 'client' | 'pro' }
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const request: AuthRequest = req.body;

    if (!request.phone_number || !request.password || !request.full_name || !request.role) {
      res.status(400).json({ error: 'Phone number, password, full name, and role required' });
      return;
    }

    const { user, token } = await authService.registerWithPassword(request);

    res.status(201).json({
      user,
      token,
      expires_in: 86400,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Login with phone and password
 * POST /api/auth/login
 * Body: { phone_number: string, password: string }
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone_number, password } = req.body;

    if (!phone_number || !password) {
      res.status(400).json({ error: 'Phone number and password required' });
      return;
    }

    const { user, token } = await authService.loginWithPassword(phone_number, password);

    res.json({
      user,
      token,
      expires_in: 86400,
    });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

/**
 * Request password reset
 * POST /api/auth/request-password-reset
 * Body: { phone_number: string }
 */
export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone_number } = req.body;

    if (!phone_number) {
      res.status(400).json({ error: 'Phone number required' });
      return;
    }

    await authService.requestPasswordReset(phone_number);

    res.json({ message: 'Password reset OTP sent successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Reset password with OTP
 * POST /api/auth/reset-password
 * Body: { phone_number: string, otp: string, new_password: string }
 */
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone_number, otp, new_password } = req.body;

    if (!phone_number || !otp || !new_password) {
      res.status(400).json({ error: 'Phone number, OTP, and new password required' });
      return;
    }

    await authService.resetPasswordWithOTP(phone_number, otp, new_password);

    res.json({ message: 'Password reset successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
