import { supabase } from '../config/supabase';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export interface InitiateMpesaPaymentInput {
  phone_number: string;
  amount: number;
  booking_id: string;
  description: string;
}

export interface ReleaseEscrowInput {
  escrow_transaction_id: string;
  booking_id: string;
  professional_phone: string;
}

/**
 * Generate M-Pesa authorization token
 */
const getMpesaToken = async (): Promise<string> => {
  try {
    const key = process.env.MPESA_CONSUMER_KEY;
    const secret = process.env.MPESA_CONSUMER_SECRET;

    if (!key || !secret) {
      throw new Error('M-Pesa credentials not configured');
    }

    const auth = Buffer.from(`${key}:${secret}`).toString('base64');

    const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Failed to get M-Pesa token:', error);
    throw new Error('Failed to authenticate with M-Pesa');
  }
};

/**
 * Initiate M-Pesa payment (STK Push)
 */
export const initiateMpesaPayment = async (input: InitiateMpesaPaymentInput) => {
  try {
    // Check if booking exists
    const { data: booking } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', input.booking_id)
      .single();

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Create escrow hold record
    const escrowId = crypto.randomUUID();
    const platformFee = booking.final_price * 0.1; // 10% commission
    const proReceives = booking.final_price - platformFee;

    const { data: escrowRecord, error: escrowError } = await supabase
      .from('escrow_transactions')
      .insert([{
        id: escrowId,
        booking_id: input.booking_id,
        amount: booking.final_price,
        platform_fee: platformFee,
        pro_receives: proReceives,
        status: 'pending',
        initiated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (escrowError) {
      throw new Error('Failed to create escrow transaction');
    }

    // Get M-Pesa token
    const token = await getMpesaToken();

    // Format phone number for M-Pesa (254...)
    const phone = input.phone_number.startsWith('+254')
      ? input.phone_number.substring(1)
      : input.phone_number.startsWith('254')
        ? input.phone_number
        : '254' + input.phone_number.substring(1);

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').substring(0, 14);
    const passkey = process.env.MPESA_PASSKEY || '';
    const businessShortCode = process.env.MPESA_SHORTCODE || '174379';

    const password = Buffer.from(`${businessShortCode}${passkey}${timestamp}`).toString('base64');

    // Initiate STK Push
    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: businessShortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.ceil(input.amount),
        PartyA: phone,
        PartyB: businessShortCode,
        PhoneNumber: phone,
        CallBackURL: `${process.env.API_URL}/api/payments/callback`,
        AccountReference: escrowId,
        TransactionDesc: input.description,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.ResponseCode === '0') {
      return {
        ...escrowRecord,
        checkout_request_id: response.data.CheckoutRequestID,
        message: 'STK push sent successfully',
      };
    } else {
      throw new Error('M-Pesa request failed: ' + response.data.ResponseDescription);
    }
  } catch (error) {
    console.error('Payment initiation failed:', error);
    throw error;
  }
};

/**
 * Handle M-Pesa callback (webhook from Safaricom)
 */
export const handleMpesaCallback = async (callbackData: any) => {
  try {
    const result = callbackData.Body?.stkCallback;

    if (!result) {
      throw new Error('Invalid callback structure');
    }

    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = result;
    const escrowId = CheckoutRequestID;

    // Get escrow transaction
    const { data: escrow } = await supabase
      .from('escrow_transactions')
      .select('*')
      .eq('id', escrowId)
      .single();

    if (!escrow) {
      console.error('Escrow transaction not found:', escrowId);
      return;
    }

    if (ResultCode === 0) {
      // Payment successful
      const mpesaReference = CallbackMetadata?.Item?.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value;

      // Update escrow to "held"
      await supabase
        .from('escrow_transactions')
        .update({
          status: 'held',
          mpesa_reference: mpesaReference,
        })
        .eq('id', escrowId);

      // Create payment record
      await supabase
        .from('payments')
        .insert([{
          id: crypto.randomUUID(),
          user_id: escrow.booking_id, // Placeholder - get real user from booking
          amount: escrow.amount,
          payment_type: 'escrow_hold',
          reference_id: escrow.booking_id,
          status: 'completed',
          mpesa_transaction_id: mpesaReference,
          created_at: new Date().toISOString(),
        }]);

      return { status: 'success', escrow_id: escrowId };
    } else {
      // Payment failed
      await supabase
        .from('escrow_transactions')
        .update({ status: 'failed' })
        .eq('id', escrowId);

      return { status: 'failed', reason: ResultDesc };
    }
  } catch (error) {
    console.error('Callback handling error:', error);
    throw error;
  }
};

/**
 * Release escrow payment to professional
 */
export const releaseEscrowPayment = async (input: ReleaseEscrowInput) => {
  try {
    // Get escrow transaction
    const { data: escrow } = await supabase
      .from('escrow_transactions')
      .select('*')
      .eq('id', input.escrow_transaction_id)
      .single();

    if (!escrow) {
      throw new Error('Escrow transaction not found');
    }

    if (escrow.status !== 'held') {
      throw new Error(`Cannot release escrow with status: ${escrow.status}`);
    }

    // Get professional user
    const { data: booking } = await supabase
      .from('bookings')
      .select('professional_id')
      .eq('id', input.booking_id)
      .single();

    if (!booking) {
      throw new Error('Booking not found');
    }

    // In production, initiate actual M-Pesa payment to professional
    // For MVP, we'll just mark as released

    const { data: updated } = await supabase
      .from('escrow_transactions')
      .update({
        status: 'released',
        released_at: new Date().toISOString(),
      })
      .eq('id', input.escrow_transaction_id)
      .select()
      .single();

    // Create payment record for professional
    await supabase
      .from('payments')
      .insert([{
        id: crypto.randomUUID(),
        user_id: booking.professional_id,
        amount: escrow.pro_receives,
        payment_type: 'earning',
        reference_id: input.escrow_transaction_id,
        status: 'pending', // Will be marked completed when actually sent to M-Pesa
        mpesa_phone_number: input.professional_phone,
        created_at: new Date().toISOString(),
      }]);

    return updated;
  } catch (error) {
    throw error;
  }
};

/**
 * Refund escrow payment to client
 */
export const refundEscrowPayment = async (
  escrowTransactionId: string,
  bookingId: string,
  clientPhone: string,
  _reason: string
) => {
  try {
    // Get escrow transaction
    const { data: escrow } = await supabase
      .from('escrow_transactions')
      .select('*')
      .eq('id', escrowTransactionId)
      .single();

    if (!escrow) {
      throw new Error('Escrow transaction not found');
    }

    if (!['held', 'disputed'].includes(escrow.status)) {
      throw new Error(`Cannot refund escrow with status: ${escrow.status}`);
    }

    // In production, initiate actual M-Pesa refund
    const { data: updated } = await supabase
      .from('escrow_transactions')
      .update({
        status: 'refunded',
        refunded_at: new Date().toISOString(),
      })
      .eq('id', escrowTransactionId)
      .select()
      .single();

    // Get client from booking
    const { data: booking } = await supabase
      .from('bookings')
      .select('client_id')
      .eq('id', bookingId)
      .single();

    // Create refund record
    await supabase
      .from('payments')
      .insert([{
        id: crypto.randomUUID(),
        user_id: booking?.client_id || '',
        booking_id: bookingId,
        amount: escrow.amount,
        payment_type: 'refund',
        reference_id: escrowTransactionId,
        status: 'pending',
        mpesa_phone_number: clientPhone,
        created_at: new Date().toISOString(),
      }]);

    return updated;
  } catch (error) {
    throw error;
  }
};

/**
 * Get payment history for a user
 */
export const getPaymentHistory = async (userId: string, limit: number = 50) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error('Failed to fetch payment history');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get escrow transaction details
 */
export const getEscrowTransaction = async (escrowId: string) => {
  try {
    const { data, error } = await supabase
      .from('escrow_transactions')
      .select('*')
      .eq('id', escrowId)
      .single();

    if (error) {
      throw new Error('Escrow transaction not found');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all escrow transactions for a booking
 */
export const getEscrowTransactionsByBooking = async (bookingId: string) => {
  try {
    const { data, error } = await supabase
      .from('escrow_transactions')
      .select('*')
      .eq('booking_id', bookingId);

    if (error) {
      throw new Error('Failed to fetch escrow transactions');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Calculate platform revenue
 */
export const getPlatformStats = async (days: number = 30) => {
  try {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    const { data: escrows } = await supabase
      .from('escrow_transactions')
      .select('*')
      .eq('status', 'released')
      .gte('released_at', dateThreshold.toISOString());

    const totalRevenue = (escrows || []).reduce((sum, e) => sum + (e.platform_fee || 0), 0);
    const totalPaid = (escrows || []).reduce((sum, e) => sum + (e.pro_receives || 0), 0);
    const totalTransactions = escrows?.length || 0;

    return {
      period_days: days,
      total_transactions: totalTransactions,
      total_revenue: totalRevenue,
      total_payments_to_pros: totalPaid,
      average_transaction: totalTransactions > 0 ? totalPaid / totalTransactions : 0,
    };
  } catch (error) {
    throw error;
  }
};
