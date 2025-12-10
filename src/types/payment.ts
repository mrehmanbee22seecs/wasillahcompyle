/**
 * Payment Types and Interfaces
 * Defines payment transactions and gateways
 */

export type PaymentGateway = 'manual';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
export type TransactionType = 'subscription' | 'donation' | 'one-time';

export interface PaymentTransaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  gateway: PaymentGateway;
  type: TransactionType;
  subscriptionPlan?: string;
  transactionId?: string;
  paymentReference?: string;
  metadata?: Record<string, any>;
  createdAt: any;
  updatedAt: any;
  completedAt?: any;
}

export interface CreatePaymentParams {
  amount: number;
  currency: string;
  userId: string;
  type: TransactionType;
  subscriptionPlan?: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface PaymentIntentResult {
  transactionId: string;
  paymentUrl: string;
  expiresAt: Date;
}
