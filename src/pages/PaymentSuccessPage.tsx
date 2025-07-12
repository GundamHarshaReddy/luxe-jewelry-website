import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Home, Download, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cashfree } from '../lib/cashfreeService';

export const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!orderId) {
        setIsVerifying(false);
        return;
      }
      try {
        const isVerified = await cashfree.verifyPayment(orderId);
        setPaymentVerified(isVerified);
        if (isVerified) {
          const orderStatus = await cashfree.getOrderStatus(orderId);
          setOrderDetails(orderStatus);
        }
      } catch (error) {
        setPaymentVerified(false);
      } finally {
        setIsVerifying(false);
      }
    };
    verifyPayment();
  }, [orderId]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <Loader2 className="w-20 h-20 text-blue-500 mx-auto mb-6 animate-spin" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h1>
          <p className="text-gray-600">Please wait while we confirm your payment...</p>
        </div>
      </div>
    );
  }
  if (!paymentVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-500 text-4xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Verification Failed</h1>
          <p className="text-gray-600 mb-6">We couldn't verify your payment. Please contact support if you believe this is an error.</p>
          <div className="space-y-3">
            <Button onClick={() => navigate('/cart')} className="w-full bg-red-500 hover:bg-red-600 text-white">Try Again</Button>
            <Button onClick={() => navigate('/contact')} variant="outline" className="w-full">Contact Support</Button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">Your order has been confirmed and will be processed shortly.</p>
        {orderId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Order ID</p>
            <p className="font-mono text-sm font-semibold text-gray-900">{orderId}</p>
          </div>
        )}
        {orderDetails && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">Payment Details</h3>
            <div className="text-xs text-blue-700 space-y-1 text-left">
              <p>• Amount: ₹{orderDetails.order_amount}</p>
              <p>• Currency: {orderDetails.order_currency}</p>
              <p>• Status: {orderDetails.order_status}</p>
            </div>
          </div>
        )}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-green-800 mb-2">What's Next?</h3>
          <ul className="text-xs text-green-700 space-y-1 text-left">
            <li>• You'll receive an order confirmation email shortly</li>
            <li>• Your jewelry will be carefully crafted and shipped</li>
            <li>• Track your order status in your account</li>
          </ul>
        </div>
        <div className="space-y-3">
          <Button onClick={() => navigate('/')} className="w-full bg-gold hover:bg-gold-dark text-white flex items-center justify-center space-x-2"><Home size={18} /><span>Continue Shopping</span></Button>
          <Button onClick={() => navigate('/contact')} variant="outline" className="w-full border-gold text-gold hover:bg-gold hover:text-white flex items-center justify-center space-x-2"><Download size={18} /><span>Download Receipt</span></Button>
        </div>
        <div className="mt-6 text-xs text-gray-500">Need help? Contact our support team anytime.</div>
      </div>
    </div>
  );
};
