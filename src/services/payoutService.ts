import { 
  PayoutRecord, 
  PayoutStatus, 
  Commission, 
  CommissionStatus, 
  AuditLog,
  PaymentRecord 
} from '../types';
import { INITIAL_PAYOUTS, INITIAL_AUDIT_LOGS } from '../data/mockData';

const PAYOUTS_STORAGE_KEY = 'soulflow_payout_requests';
const AUDIT_STORAGE_KEY = 'soulflow_audit_logs';
const COMMISSIONS_STORAGE_KEY = 'soulflow_commissions_ledger';

export const MINIMUM_PAYOUT_AMOUNT = 100.00;

export const payoutService = {
  // Payout requests
  getPayouts(mentorId?: string): PayoutRecord[] {
    const local = localStorage.getItem(PAYOUTS_STORAGE_KEY);
    let list: PayoutRecord[] = INITIAL_PAYOUTS;
    if (local) {
      try {
        list = JSON.parse(local);
      } catch (e) {
        console.error('Failed to parse payouts', e);
      }
    }
    if (mentorId) {
      return list.filter(p => p.mentor_id === mentorId);
    }
    return list;
  },

  // Request payout
  requestPayout(mentorId: string, mentorName: string, amount: number, notes?: string): {
    success: boolean;
    payout?: PayoutRecord;
    error?: string;
  } {
    if (amount < MINIMUM_PAYOUT_AMOUNT) {
      return {
        success: false,
        error: `Minimum payout amount is RM${MINIMUM_PAYOUT_AMOUNT.toFixed(2)}.`,
      };
    }

    const newPayout: PayoutRecord = {
      id: crypto.randomUUID(),
      mentor_id: mentorId,
      mentor_name: mentorName,
      amount: Number(amount.toFixed(2)),
      status: 'requested',
      requested_at: new Date().toISOString(),
      notes,
    };

    const current = this.getPayouts();
    const updated = [newPayout, ...current];
    localStorage.setItem(PAYOUTS_STORAGE_KEY, JSON.stringify(updated));

    return { success: true, payout: newPayout };
  },

  // Admin approves payout
  approvePayout(payoutId: string, adminId: string = 'adm-001'): PayoutRecord | null {
    const payouts = this.getPayouts();
    let target: PayoutRecord | null = null;
    const updated = payouts.map(p => {
      if (p.id === payoutId) {
        target = { ...p, status: 'processing', approved_at: new Date().toISOString() };
        return target;
      }
      return p;
    });

    localStorage.setItem(PAYOUTS_STORAGE_KEY, JSON.stringify(updated));

    if (target) {
      this.logAudit({
        action: 'payout_approved',
        admin_id: adminId,
        target_type: 'payout',
        target_id: payoutId,
        old_value: { status: 'requested' },
        new_value: { status: 'processing' },
      });
    }

    return target;
  },

  // Admin marks payout paid
  markPayoutPaid(payoutId: string, referenceNumber: string, adminId: string = 'adm-001'): PayoutRecord | null {
    const payouts = this.getPayouts();
    let target: PayoutRecord | null = null;
    const now = new Date().toISOString();
    const updated = payouts.map(p => {
      if (p.id === payoutId) {
        target = { 
          ...p, 
          status: 'paid', 
          paid_at: now, 
          reference_number: referenceNumber || `PAY-MYR-${Date.now()}` 
        };
        return target;
      }
      return p;
    });

    localStorage.setItem(PAYOUTS_STORAGE_KEY, JSON.stringify(updated));

    if (target) {
      this.logAudit({
        action: 'payout_paid',
        admin_id: adminId,
        target_type: 'payout',
        target_id: payoutId,
        old_value: { status: 'processing' },
        new_value: { status: 'paid', referenceNumber },
      });
    }

    return target;
  },

  // Admin rejects payout
  rejectPayout(payoutId: string, reason: string, adminId: string = 'adm-001'): PayoutRecord | null {
    const payouts = this.getPayouts();
    let target: PayoutRecord | null = null;
    const updated = payouts.map(p => {
      if (p.id === payoutId) {
        target = { ...p, status: 'rejected', notes: reason };
        return target;
      }
      return p;
    });

    localStorage.setItem(PAYOUTS_STORAGE_KEY, JSON.stringify(updated));

    if (target) {
      this.logAudit({
        action: 'payout_rejected',
        admin_id: adminId,
        target_type: 'payout',
        target_id: payoutId,
        old_value: { status: 'requested' },
        new_value: { status: 'rejected', reason },
      });
    }

    return target;
  },

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    const local = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error('Failed to parse audit logs', e);
      }
    }
    return INITIAL_AUDIT_LOGS;
  },

  logAudit(entry: Omit<AuditLog, 'id' | 'created_at'>): AuditLog {
    const newLog: AuditLog = {
      id: crypto.randomUUID(),
      ...entry,
      created_at: new Date().toISOString(),
    };
    const logs = [newLog, ...this.getAuditLogs()];
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs));
    return newLog;
  },
};
