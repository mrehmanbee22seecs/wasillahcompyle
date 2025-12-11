/**
 * Payment Return Page
 * Handles return from payment gateway
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useSubscription } from '../contexts/SubscriptionContext';

const PaymentReturn: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshSubscription } = useSubscription();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('');
  const [transactionDetails, setTransactionDetails] = useState<any>(null);

  useEffect(() => {
    handlePaymentReturn();
  }, [searchParams]);

  const handlePaymentReturn = async () => {
    try {
      // Get transaction reference from URL
      const txnRef = searchParams.get('txn_ref');
      const statusParam = searchParams.get('status');
      
      if (statusParam === 'success' && txnRef) {
        setStatus('success');
        setMessage('Payment successful! Your subscription has been activated.');
        
        // Refresh subscription data
        await refreshSubscription();
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        setStatus('failed');
        setMessage(params.pp_ResponseMessage || 'Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Error processing payment return:', error);
      setStatus('failed');
      setMessage('An error occurred while processing your payment.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        {status === 'loading' && (
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Processing Payment
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we verify your payment...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {message}
            </p>
            
            {transactionDetails && (
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Transaction Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {transactionDetails.currency} {transactionDetails.amount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Plan:</span>
                    <span className="font-semibold text-gray-900 dark:text-white capitalize">
                      {transactionDetails.subscriptionPlan}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
                    <span className="font-mono text-xs text-gray-900 dark:text-white">
                      {transactionDetails.transactionId}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        )}

        {status === 'failed' && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {message}
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentReturn;
