/**
 * M-Pesa Daraja API helpers for escrow & payment flows
 * Production: Use real Daraja API credentials
 * Development: Mock implementations for sandbox
 */

interface STKPushPayload {
  amount: number;
  phone: string;
  jobId: string;
  reference: string;
}

interface EscrowState {
  jobId: string;
  amount: number;
  clientPhone: string;
  proPhone: string;
  status: "HELD" | "RELEASED" | "REFUNDED" | "DISPUTED";
  createdAt: Date;
  releasedAt?: Date;
}

/**
 * Initiate M-Pesa STK Push for job escrow
 * In production, calls Daraja OAuth2 + STK Push endpoint
 * In development/sandbox, mocks the response
 */
export async function initiateSTKPush(payload: STKPushPayload): Promise<{
  success: boolean;
  message: string;
  transactionId?: string;
}> {
  // TODO: Implement real Daraja integration
  // const daraja = await getDarajaAccessToken();
  // const response = await fetch('https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
  //   method: 'POST',
  //   headers: { Authorization: `Bearer ${daraja.access_token}` },
  //   body: JSON.stringify({...payload})
  // });

  // Mock for now
  console.log("Mock STK Push initiated:", payload);
  return {
    success: true,
    message: `STK Push sent to ${payload.phone}`,
    transactionId: `TXN_${Date.now()}`,
  };
}

/**
 * Create escrow record for a job
 * Money stays in FundiGuard wallet until client approves
 */
export async function createEscrow(data: Omit<EscrowState, "status" | "createdAt">): Promise<EscrowState> {
  // TODO: Save to Supabase
  return {
    ...data,
    status: "HELD",
    createdAt: new Date(),
  };
}

/**
 * Release escrow to fundi after approval
 */
export async function releaseEscrow(jobId: string): Promise<boolean> {
  // TODO: Trigger B2C payment to fundi's M-Pesa
  console.log(`Releasing escrow for job ${jobId}`);
  return true;
}

/**
 * Refund escrow to client (disputed/refund case)
 */
export async function refundEscrow(jobId: string): Promise<boolean> {
  // TODO: Trigger B2C refund
  console.log(`Refunding escrow for job ${jobId}`);
  return true;
}
