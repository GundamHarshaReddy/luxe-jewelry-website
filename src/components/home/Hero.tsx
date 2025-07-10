import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-charcoal to-black overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/20 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="text-gold mr-2" size={24} />
            <span className="text-gold font-montserrat font-medium uppercase tracking-wider">
              Luxury Jewelry Collection
            </span>
            <Sparkles className="text-gold ml-2" size={24} />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-cormorant font-bold text-white mb-6 leading-tight">
            Exquisite Jewelry
            <br />
            <span className="text-gold">Timeless Elegance</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 font-montserrat max-w-3xl mx-auto mb-8 leading-relaxed">
            Discover our handcrafted collection of luxury jewelry, where every piece tells a story of sophistication and unparalleled craftsmanship.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center items-center"
        >
          <Button 
            variant="secondary" 
            size="lg"
            className="group flex items-center space-x-2 px-8 py-4"
            onClick={() => navigate('/products')}
          >
            <span>Shop Collection</span>
            <ArrowRight 
              size={20} 
              className="group-hover:translate-x-1 transition-transform duration-300" 
            />
          </Button>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="text-black" size={24} />
            </div>
            <h3 className="text-white font-cormorant font-bold text-xl mb-2">
              Premium Quality
            </h3>
            <p className="text-gray-400 font-montserrat">
              Crafted with the finest materials and attention to detail
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="text-black" size={24} />
            </div>
            <h3 className="text-white font-cormorant font-bold text-xl mb-2">
              Free Shipping
            </h3>
            <p className="text-gray-400 font-montserrat">
              Free shipping for orders above ₹1000
            </p>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 border border-gold/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-24 h-24 border border-gold/20 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-10 w-16 h-16 border border-gold/20 rounded-full animate-pulse delay-500"></div>
    </section>
  );
};