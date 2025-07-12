import React, { useState } from 'react';
import { Shield, CreditCard, Lock } from 'lucide-react';
import { Button } from '../ui/Button';
import { cashfree } from '../../lib/cashfreeService';

interface PaymentButtonProps {
  totalAmount: number;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  onPaymentStart?: () => void;
  onPaymentSuccess?: (orderId: string) => void;
  onPaymentError?: (error: string) => void;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  totalAmount,
  items,
  customerInfo,
  onPaymentStart,
  onPaymentError
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      onPaymentStart?.();

      // Validate customer info
      if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
        throw new Error('Please fill in all customer details');
      }

      // Create order with Cashfree
      const orderResponse = await cashfree.createOrder({
        amount: totalAmount,
        currency: 'INR',
        customerDetails: {
          customer_id: `CUST_${Date.now()}`,
          customer_name: customerInfo.name,
          customer_email: customerInfo.email,
          customer_phone: customerInfo.phone
        },
        orderNote: `Luxe & Lush Order - ${items.length} items`,
        returnUrl: `${window.location.origin}/payment/success`
      });

      console.log('Order created:', orderResponse);

      // Redirect to payment page using Cashfree SDK
      await cashfree.redirectToPayment(
        orderResponse.payment_session_id,
        `${window.location.origin}/payment/success?order_id=${orderResponse.order_id}`
      );

    } catch (error) {
      console.error('Payment initiation failed:', error);
      onPaymentError?.(error instanceof Error ? error.message : 'Payment failed to start');
      setIsProcessing(false);
    }
  };

  const isDisabled = isProcessing || !customerInfo.name || !customerInfo.email || !customerInfo.phone;

  return (
    <div className="space-y-4">
      {/* Security badge */}
      <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
        <Shield className="w-4 h-4 text-green-600" />
        <span>Secured by Cashfree Payments</span>
      </div>

      {/* Main payment button */}
      <Button
        onClick={handlePayment}
        disabled={isDisabled}
        className="w-full bg-gold hover:bg-gold-dark text-white font-semibold py-4 text-lg relative overflow-hidden"
      >
        {isProcessing ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Processing...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <Lock className="w-5 h-5" />
            <span>Pay ₹{totalAmount.toFixed(2)}</span>
          </div>
        )}
      </Button>

      {/* Payment methods */}
      <div className="text-center">
        <p className="text-xs text-gray-500 mb-2">We accept</p>
        <div className="flex items-center justify-center space-x-2">
          <CreditCard className="w-6 h-6 text-gray-400" />
          <span className="text-xs text-gray-500">Credit/Debit Cards, UPI, Net Banking, Wallets</span>
        </div>
      </div>

      {/* Terms */}
      <p className="text-xs text-gray-500 text-center">
        By proceeding, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
};
