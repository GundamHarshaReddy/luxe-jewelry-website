import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

export const MiniCart: React.FC = () => {
  const { state, dispatch } = useCart();
  const [isExpanded, setIsExpanded] = useState(true); // Auto-expand when items are present
  const navigate = useNavigate();
  const location = useLocation();

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const handleViewFullCart = () => {
    navigate('/cart');
  };

  // Don't show mini cart if no items OR if we're on the cart page
  if (state.items.length === 0 || location.pathname === '/cart') return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed top-20 right-4 z-50 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
      style={{ width: isExpanded ? '380px' : '280px' }}
    >
      {/* Mini Header - Always visible */}
      <div 
        className="flex items-center justify-between p-3 bg-gradient-to-r from-gold to-yellow-500 text-black cursor-pointer hover:from-yellow-500 hover:to-gold transition-all duration-300"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <ShoppingBag size={20} />
          <span className="font-cormorant font-bold">
            Cart ({state.itemCount})
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-montserrat font-semibold">
            ₹{state.total.toLocaleString()}
          </span>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {/* Cart Items */}
            <div className="max-h-64 overflow-y-auto p-3">
              <div className="space-y-3">
                {state.items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg"
                  >
                    {/* Product Image */}
                    <img
                      src={item.selectedVariant.images[0] || '/placeholder-image.jpg'}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-cormorant font-semibold text-sm text-black truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-gray-600 font-montserrat">
                        ₹{item.price.toLocaleString()}
                      </p>
                      {item.size && (
                        <p className="text-xs text-gray-500 font-montserrat">
                          Size: {item.size}
                        </p>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(item.id, item.quantity - 1);
                        }}
                        className="p-1 text-gray-500 hover:text-black transition-colors duration-300"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center text-sm font-montserrat">
                        {item.quantity}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(item.id, item.quantity + 1);
                        }}
                        className="p-1 text-gray-500 hover:text-black transition-colors duration-300"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(item.id);
                      }}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-all duration-300"
                      title="Remove item"
                    >
                      <Trash2 size={12} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-gray-200 p-3">
              <div className="space-y-2">
                <button
                  onClick={handleViewFullCart}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-500 hover:to-gold text-black font-montserrat font-semibold text-sm rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                >
                  View Full Cart
                </button>
                <button
                  onClick={handleViewFullCart}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-gray-800 to-black hover:from-black hover:to-gray-800 text-white font-montserrat font-semibold text-sm rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                >
                  Checkout Now
                </button>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="w-full text-xs text-gray-500 hover:text-gray-700 transition-colors duration-300 py-1"
                >
                  Minimize Cart
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};