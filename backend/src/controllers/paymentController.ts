import { Request, Response } from 'express';
import * as paymentService from '../services/paymentService';
import { AuthenticatedRequest } from '../middleware/auth';

/**
 * Initiate M-Pesa payment
 * POST /api/payments/initiate
 */
export const initiateMpesaPayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { phone_number, amount, booking_id, description } = req.body;

    if (!phone_number || !amount || !booking_id) {
      res.status(400).json({ error: 'Phone number, amount, and booking ID required' });
      return;
    }

    if (amount < 10) {
      res.status(400).json({ error: 'Minimum amount is KES 10' });
      return;
    }

    const payment = await paymentService.initiateMpesaPayment({
      phone_number,
      amount: parseFloat(amount),
      booking_id,
      description: description || 'FundiGuard Service Payment',
    });

    res.status(201).json(payment);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * M-Pesa Callback Webhook
 * POST /api/payments/callback
 */
export const mpesaCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    await paymentService.handleMpesaCallback(req.body);

    // Always return 200 to Safaricom
    res.status(200).json({ status: 'received' });
  } catch (error: any) {
    console.error('[M-Pesa Callback Error]', error);
    res.status(200).json({ status: 'received' }); // Still acknowledge to Safaricom
  }
};

/**
 * Release escrow payment
 * POST /api/payments/release-escrow
 */
export const releaseEscrow = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ error: 'Admin only endpoint' });
      return;
    }

    const { escrow_transaction_id, booking_id, professional_phone } = req.body;

    if (!escrow_transaction_id || !booking_id) {
      res.status(400).json({ error: 'Escrow transaction ID and booking ID required' });
      return;
    }

    const updated = await paymentService.releaseEscrowPayment({
      escrow_transaction_id,
      booking_id,
      professional_phone,
    });

    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Refund escrow payment
 * POST /api/payments/refund-escrow
 */
export const refundEscrow = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ error: 'Admin only endpoint' });
      return;
    }

    const { escrow_transaction_id, booking_id, client_phone, reason } = req.body;

    if (!escrow_transaction_id || !booking_id || !client_phone) {
      res.status(400).json({ error: 'Escrow transaction ID, booking ID, and client phone required' });
      return;
    }

    const updated = await paymentService.refundEscrowPayment(
      escrow_transaction_id,
      booking_id,
      client_phone,
      reason || 'Refund requested'
    );

    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Get payment history
 * GET /api/payments/history
 */
export const getPaymentHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { limit = 50 } = req.query;

    const history = await paymentService.getPaymentHistory(
      req.user.userId,
      parseInt(limit as string) || 50
    );

    res.json(history);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get escrow transaction details
 * GET /api/payments/escrow/:escrowId
 */
export const getEscrowTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { escrowId } = req.params;

    const escrow = await paymentService.getEscrowTransaction(escrowId);

    res.json(escrow);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

/**
 * Get escrow transactions for a booking
 * GET /api/payments/booking/:bookingId/escrows
 */
export const getEscrowsByBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;

    const escrows = await paymentService.getEscrowTransactionsByBooking(bookingId);

    res.json(escrows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get platform stats (admin only)
 * GET /api/payments/stats?days=30
 */
export const getPlatformStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ error: 'Admin only endpoint' });
      return;
    }

    const { days = 30 } = req.query;

    const stats = await paymentService.getPlatformStats(parseInt(days as string) || 30);

    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
