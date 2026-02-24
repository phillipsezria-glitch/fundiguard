import express from 'express';
import * as paymentController from '../controllers/paymentController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

/**
 * Payment Routes
 */

// Initiate M-Pesa payment (protected)
router.post('/initiate', authMiddleware, paymentController.initiateMpesaPayment);

// M-Pesa callback (public - from Safaricom)
router.post('/callback', paymentController.mpesaCallback);

// Get payment history (protected)
router.get('/history', authMiddleware, paymentController.getPaymentHistory);

// Get escrow transaction details
router.get('/escrow/:escrowId', paymentController.getEscrowTransaction);

// Get escrow transactions for booking
router.get('/booking/:bookingId/escrows', paymentController.getEscrowsByBooking);

// Release escrow payment (admin only)
router.post('/release-escrow', authMiddleware, paymentController.releaseEscrow);

// Refund escrow payment (admin only)
router.post('/refund-escrow', authMiddleware, paymentController.refundEscrow);

// Get platform stats (admin only)
router.get('/stats', authMiddleware, paymentController.getPlatformStats);

export default router;
