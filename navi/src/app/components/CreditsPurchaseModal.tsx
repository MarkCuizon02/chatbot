"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark, HiOutlineMap, HiOutlineClock, HiOutlineCheck } from 'react-icons/hi2';
import { useTheme } from '@/context/ThemeContext';
import { useSubscription } from '@/context/SubscriptionContext';

interface CreditsPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const creditPackages = [
  {
    id: 'basic',
    name: 'Basic Pack',
    credits: 100,
    price: 10,
    popular: false,
    savings: 0,
    features: ['100 credits', '90 days expiry', 'Standard support']
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    credits: 500,
    price: 45,
    popular: true,
    savings: 10,
    features: ['500 credits', '90 days expiry', 'Priority support', '10% savings']
  },
  {
    id: 'enterprise',
    name: 'Enterprise Pack',
    credits: 1000,
    price: 80,
    popular: false,
    savings: 20,
    features: ['1000 credits', '90 days expiry', 'Premium support', '20% savings']
  },
  {
    id: 'unlimited',
    name: 'Unlimited Pack',
    credits: 2500,
    price: 180,
    popular: false,
    savings: 28,
    features: ['2500 credits', '90 days expiry', '24/7 support', '28% savings']
  }
];

export default function CreditsPurchaseModal({ isOpen, onClose }: CreditsPurchaseModalProps) {
  const { isDarkMode } = useTheme();
  const { purchaseAdditionalCredits } = useSubscription();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [customPrice, setCustomPrice] = useState('');

  const handlePurchase = async () => {
    if (!selectedPackage && !customAmount) return;
    
    setIsProcessing(true);
    
    let amount: number;
    let price: number;
    
    if (selectedPackage) {
      const pkg = creditPackages.find(p => p.id === selectedPackage);
      if (!pkg) return;
      amount = pkg.credits;
      price = pkg.price;
    } else {
      amount = parseInt(customAmount);
      price = parseFloat(customPrice);
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    purchaseAdditionalCredits(amount, price);
    
    setIsProcessing(false);
    onClose();
    setSelectedPackage(null);
    setCustomAmount('');
    setCustomPrice('');
  };

  const calculateCustomPrice = (amount: string) => {
    const numAmount = parseInt(amount) || 0;
    return (numAmount * 0.1).toFixed(2); // $0.10 per credit
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setCustomPrice(calculateCustomPrice(value));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className={`w-full max-w-3xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-2xl shadow-2xl overflow-hidden`}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-900' : 'bg-blue-50'}`}>
                  <HiOutlineMap className={`w-5 h-5 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold">Purchase Additional Credits</h2>
                  <p className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Choose a package or create a custom amount
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className={`p-1 md:p-2 rounded-full ${isDarkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} transition-colors`}
              >
                <HiXMark className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="p-4 md:p-6">
              {/* Package Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Credit Packages</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
                  {creditPackages.map((pkg, index) => (
                    <motion.div
                      key={pkg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className={`relative cursor-pointer rounded-xl border-2 p-3 transition-all ${
                        selectedPackage === pkg.id
                          ? isDarkMode
                            ? 'border-blue-500 bg-blue-900/20'
                            : 'border-blue-500 bg-blue-50'
                          : isDarkMode
                          ? 'border-gray-700 hover:border-gray-600'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        setSelectedPackage(pkg.id);
                        setCustomAmount('');
                        setCustomPrice('');
                      }}
                    >
                      {pkg.popular && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium"
                        >
                          Popular
                        </motion.div>
                      )}
                      
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-base">{pkg.name}</h4>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <HiOutlineClock className="w-3 h-3" />
                            90 days expiry
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold">{pkg.credits}</div>
                          <div className="text-xs text-gray-500">credits</div>
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold">${pkg.price}</span>
                          {pkg.savings > 0 && (
                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                              Save {pkg.savings}%
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          ${(pkg.price / pkg.credits).toFixed(2)} per credit
                        </div>
                      </div>
                      
                      <ul className="space-y-1">
                        {pkg.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs">
                            <HiOutlineCheck className="w-3 h-3 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h3 className="text-lg font-semibold mb-3">Custom Amount</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Number of Credits
                      </label>
                      <input
                        type="number"
                        value={customAmount}
                        onChange={(e) => handleCustomAmountChange(e.target.value)}
                        placeholder="Enter amount"
                        className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        onClick={() => setSelectedPackage(null)}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Total Price
                      </label>
                      <div className={`w-full p-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
                        <span className="text-xl font-bold">${customPrice || '0.00'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              {(selectedPackage || customAmount) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl p-3 mb-4 ${isDarkMode ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}
                >
                  <h4 className="font-semibold mb-2">Purchase Summary</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Credits:</span>
                      <span className="font-semibold">
                        {selectedPackage 
                          ? creditPackages.find(p => p.id === selectedPackage)?.credits 
                          : customAmount} credits
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Price:</span>
                      <span className="font-semibold">
                        ${selectedPackage 
                          ? creditPackages.find(p => p.id === selectedPackage)?.price 
                          : customPrice}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Expiry:</span>
                      <span>90 days from purchase</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className={`px-4 py-2 rounded-lg font-medium border text-sm ${
                    isDarkMode 
                      ? 'bg-gray-700 text-white hover:bg-gray-600 border-gray-600' 
                      : 'bg-white text-gray-800 hover:bg-gray-100 border-gray-300'
                  }`}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePurchase}
                  disabled={isProcessing || (!selectedPackage && !customAmount)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm ${
                    isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'
                  } ${(isProcessing || (!selectedPackage && !customAmount)) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isProcessing ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mx-auto"
                    />
                  ) : (
                    'Purchase Credits'
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 