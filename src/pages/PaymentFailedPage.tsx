import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, Home, RefreshCw, Phone } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cashfree } from '../lib/cashfreeService';

export const PaymentFailed: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const reason = searchParams.get('reason') || 'Payment was not completed successfully';
  const errorCode = searchParams.get('error_code');
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;
      try {
        const orderStatus = await cashfree.getOrderStatus(orderId);
        setOrderDetails(orderStatus);
      } catch (error) {
        console.error('Failed to fetch order details:', error);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  const retryPayment = () => {
    navigate('/cart');
  };
  const contactSupport = () => {
    navigate('/contact');
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}>
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
        </motion.div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
        <p className="text-gray-600 mb-6">{reason}</p>
        {orderId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Order ID</p>
            <p className="font-mono text-sm font-semibold text-gray-900">{orderId}</p>
            {errorCode && (<><p className="text-sm text-gray-500 mb-1 mt-2">Error Code</p><p className="font-mono text-xs font-semibold text-red-600">{errorCode}</p></>)}
          </div>
        )}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-yellow-800 mb-2">Common Solutions</h3>
          <ul className="text-xs text-yellow-700 space-y-1 text-left">
            <li>• Check your internet connection</li>
            <li>• Verify your card details are correct</li>
            <li>• Ensure sufficient balance in your account</li>
            <li>• Try a different payment method</li>
          </ul>
        </div>
        <div className="space-y-3">
          <Button onClick={retryPayment} className="w-full bg-gold hover:bg-gold-dark text-white flex items-center justify-center space-x-2"><RefreshCw size={18} /><span>Retry Payment</span></Button>
          <Button onClick={() => navigate('/')} variant="outline" className="w-full border-gold text-gold hover:bg-gold hover:text-white flex items-center justify-center space-x-2"><Home size={18} /><span>Continue Shopping</span></Button>
          <Button onClick={contactSupport} variant="ghost" className="w-full text-gray-600 hover:text-gray-800 flex items-center justify-center space-x-2"><Phone size={18} /><span>Contact Support</span></Button>
        </div>
        <div className="mt-6 text-xs text-gray-500 leading-relaxed">If you continue to experience issues, our support team is here to help you complete your purchase.</div>
      </motion.div>
    </div>
  );
};
