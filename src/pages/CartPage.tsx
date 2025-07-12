import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Minus, X, ShoppingBag, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/Button';
import { CustomerDetailsForm } from '../components/cart/CustomerDetailsForm';
import { PaymentButton } from '../components/cart/PaymentButton';

export const CartPage: React.FC = () => {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isPaymentStarted, setIsPaymentStarted] = useState(false);

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const clearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      dispatch({ type: 'CLEAR_CART' });
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate('/products')}
              className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-300"
            >
              <ArrowLeft size={20} />
              <span className="font-montserrat">Continue Shopping</span>
            </button>
          </div>

          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingBag size={48} className="text-gray-400" />
            </div>
            <h2 className="text-3xl font-cormorant font-bold text-black mb-4">
              Your Cart is Empty
            </h2>
            <p className="text-gray-600 mb-8 font-montserrat">
              Looks like you haven't added any items to your cart yet. Start shopping to find something you like!
            </p>
            <Button variant="primary" onClick={() => navigate('/products')}>
              Start Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/products')}
              className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-300"
            >
              <ArrowLeft size={20} />
              <span className="font-montserrat">Continue Shopping</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-3xl font-cormorant font-bold text-black">
              Shopping Cart ({state.itemCount} items)
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors duration-300"
          >
            <Trash2 size={20} />
            <span className="font-montserrat">Clear Cart</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="p-6">
                <div className="space-y-6">
                  {state.items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start space-x-4 p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors duration-300"
                    >
                      {/* Product Image */}
                      <img
                        src={item.selectedVariant.images[0] || '/placeholder-image.jpg'}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-cormorant font-bold text-lg text-black mb-2">
                          {item.product.name}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600 font-montserrat">
                          <p>Color: <span className="font-medium">{item.selectedVariant.color}</span></p>
                          {item.size && <p>Size: <span className="font-medium">{item.size}</span></p>}
                          {item.personalization && (
                            <p>Personalization: <span className="font-medium">{item.personalization}</span></p>
                          )}
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 border border-gray-300 rounded-lg hover:border-gold hover:text-gold transition-colors duration-300"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-12 text-center font-montserrat font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 border border-gray-300 rounded-lg hover:border-gold hover:text-gold transition-colors duration-300"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-red-500 hover:text-red-700 transition-colors duration-300"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-lg font-cormorant font-bold text-black">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500 font-montserrat">
                          ₹{item.price.toLocaleString()} each
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
              <h2 className="text-xl font-cormorant font-bold text-black mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between font-montserrat">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{state.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-montserrat">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-montserrat">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-cormorant font-bold text-black mb-6">
                <span>Total</span>
                <span>₹{state.total.toLocaleString()}</span>
              </div>

              {/* Customer Details Form */}
              <div className="mb-6">
                <CustomerDetailsForm
                  onCustomerInfoChange={setCustomerInfo}
                  initialValues={customerInfo}
                />
              </div>

              {/* Payment Error */}
              {paymentError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{paymentError}</p>
                </div>
              )}

              {/* Payment Button */}
              <div className="mb-4">
                <PaymentButton
                  totalAmount={state.total}
                  items={state.items.map(item => ({
                    id: item.id,
                    name: item.product.name,
                    price: item.price,
                    quantity: item.quantity
                  }))}
                  customerInfo={customerInfo}
                  onPaymentStart={() => {
                    setIsPaymentStarted(true);
                    setPaymentError(null);
                  }}
                  onPaymentError={(error) => {
                    setPaymentError(error);
                    setIsPaymentStarted(false);
                  }}
                />
              </div>

              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/products')}
                  disabled={isPaymentStarted}
                >
                  Continue Shopping
                </Button>
              </div>

              {/* Security Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 font-montserrat text-center">
                  🔒 Secure checkout with 256-bit SSL encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
