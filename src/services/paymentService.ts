import { PaymentRecord, PaymentProvider, PaymentStatus } from '../types';
import { INITIAL_PAYMENTS } from '../data/mockData';

const PAYMENTS_STORAGE_KEY = 'soulflow_payments_history';

export const formatMYR = (amount: number): string => {
  return `RM${amount.toFixed(2)}`;
};

export interface ProcessPaymentOptions {
  userId: string;
  subscriptionId?: string;
  amount: number;
  provider: PaymentProvider;
  cardLast4?: string;
}

export const paymentService = {
  // Get all payment transactions
  getPayments(): PaymentRecord[] {
    const local = localStorage.getItem(PAYMENTS_STORAGE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error('Failed to parse payments', e);
      }
    }
    return INITIAL_PAYMENTS;
  },

  // Record a payment
  savePayment(payment: PaymentRecord): void {
    const payments = this.getPayments();
    const updated = [payment, ...payments];
    localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(updated));
  },

  // Process checkout with chosen provider
  async processPayment(options: ProcessPaymentOptions): Promise<{
    success: boolean;
    payment?: PaymentRecord;
    error?: string;
  }> {
    const { userId, subscriptionId, amount, provider } = options;

    // Simulate provider latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Support test mode & mock providers
    const isSuccess = true; // In production, connects to Stripe API / Apple StoreKit / Google Billing

    if (!isSuccess) {
      return { success: false, error: 'Payment authorization failed. Please try another card.' };
    }

    const providerPrefix = provider === 'apple_iap' ? 'app_' : provider === 'google_play' ? 'GPA.' : 'pi_';
    const paymentRecord: PaymentRecord = {
      id: crypto.randomUUID(),
      user_id: userId,
      subscription_id: subscriptionId,
      provider,
      provider_payment_id: `${providerPrefix}${Math.random().toString(36).substring(2, 12)}`,
      amount,
      currency: 'MYR',
      status: 'paid',
      paid_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    this.savePayment(paymentRecord);
    return { success: true, payment: paymentRecord };
  },

  // Update payment status (e.g. refund)
  updatePaymentStatus(paymentId: string, status: PaymentStatus): PaymentRecord | null {
    const payments = this.getPayments();
    let updatedTarget: PaymentRecord | null = null;
    const updated = payments.map((p) => {
      if (p.id === paymentId) {
        updatedTarget = { ...p, status };
        return updatedTarget;
      }
      return p;
    });
    localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(updated));
    return updatedTarget;
  },
};
