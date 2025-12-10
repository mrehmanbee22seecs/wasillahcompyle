/**
 * Payment Checkout Component
 * Handles payment processing for subscription upgrades
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CreditCard, Shield, Loader2 } from 'lucide-react';
import { SubscriptionPlan } from '../../types/subscription';

interface PaymentCheckoutProps {
  plan: SubscriptionPlan;
  amount: number;
  currency: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({
  plan,
  amount,
  currency,
  onSuccess,
  onCancel,
}) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!currentUser) {
      setError('You must be logged in to make a payment');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Payment processing will be implemented when payment gateway is configured
      setError('Payment gateway not configured. Please contact support to upgrade your subscription.');
      setProcessing(false);
      
    } catch (err) {
      console.error('Payment error:', err);
      setError('Failed to initiate payment. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/20 mb-4">
            <CreditCard className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Complete Your Purchase
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Upgrade to {plan} Plan
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Order Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Plan</span>
              <span className="font-semibold text-gray-900 dark:text-white capitalize">
                {plan}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Billing Cycle</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                Monthly
              </span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
              <div className="flex justify-between items-baseline">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Total
                </span>
                <div className="text-right">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {currency} {amount.toLocaleString()}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">
                    /month
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Payment Method
          </h3>
          <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
            <div className="text-center py-4">
              <p className="text-gray-600 dark:text-gray-400">
                Payment gateway integration coming soon
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Please contact support to upgrade your subscription
              </p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <Shield className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-1">
                Secure Payment
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                All payments will be processed securely through our encrypted gateway.
                We never store your payment information.
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-900 dark:text-red-100">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          {onCancel && (
            <button
              onClick={onCancel}
              disabled={processing}
              className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handlePayment}
            disabled={processing}
            className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {processing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Proceed to Payment
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </div>

        {/* Terms */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          By proceeding, you agree to our{' '}
          <a href="/terms" className="text-purple-600 hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-purple-600 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default PaymentCheckout;
