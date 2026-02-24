import express from 'express';
import * as authController from '../controllers/authController';

const router = express.Router();

/**
 * Authentication Routes
 */

// Request OTP for login/registration
router.post('/request-otp', authController.requestOTP);

// Verify OTP and authenticate
router.post('/verify-otp', authController.verifyOTP);

// Register with phone and password
router.post('/register', authController.register);

// Login with phone and password
router.post('/login', authController.login);

// Request password reset
router.post('/request-password-reset', authController.requestPasswordReset);

// Reset password with OTP
router.post('/reset-password', authController.resetPassword);

export default router;
