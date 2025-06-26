"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark, HiOutlineMap, HiOutlineCheck, HiOutlineSparkles } from 'react-icons/hi2';
import { useTheme } from '@/context/ThemeContext';
import { useSubscription } from '@/context/SubscriptionContext';

interface CreditsPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  monthlyDiscountActive?: boolean;
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

export default function CreditsPurchaseModal({ isOpen, onClose, monthlyDiscountActive = false }: CreditsPurchaseModalProps) {
  const { isDarkMode } = useTheme();
  const { purchaseAdditionalCredits, subscription } = useSubscription();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseData, setPurchaseData] = useState<{ amount: number; price: number } | null>(null);

  const isSubscribed = subscription.currentPlan && subscription.currentPlan.name !== "No Active Plan";

  const calculateSavings = (packagePrice: number, packageCredits: number) => {
    if (!isSubscribed) return 0;
    const regularPrice = packageCredits * 0.1; // $0.10 per credit
    const savings = regularPrice - packagePrice;
    return savings > 0 ? savings : 0;
  };

  // Calculate discounted price for monthly subscription
  const getDiscountedPrice = (originalPrice: number) => {
    return monthlyDiscountActive ? originalPrice * 0.8 : originalPrice;
  };

  // Calculate custom price with discount
  const calculateCustomPrice = (amount: string) => {
    const numAmount = parseInt(amount) || 0;
    const basePrice = numAmount * 0.1; // $0.10 per credit
    return getDiscountedPrice(basePrice).toFixed(2);
  };

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
    setShowPurchaseModal(true);
    setPurchaseData({ amount, price });
    setSelectedPackage(null);
    setCustomAmount('');
    setCustomPrice('');
    // Do NOT call onClose() here - let user see the confirmation modal
  };

  const confirmPurchase = async () => {
    if (!purchaseData) return;
    
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setShowPurchaseModal(false);
    setPurchaseData(null);
    onClose();
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setCustomPrice(calculateCustomPrice(value));
  };

  return (
    <>
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
              className={`w-full max-w-4xl max-h-[90vh] ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-2xl shadow-2xl overflow-hidden relative flex flex-col`}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
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

              <div className="p-4 md:p-6 overflow-y-auto flex-1">
                {/* Monthly Discount Banner */}
                {monthlyDiscountActive && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl flex items-center gap-3"
                  >
                    <HiOutlineSparkles className="w-5 h-5" />
                    <div>
                      <div className="font-semibold">Monthly Subscription Active!</div>
                      <div className="text-sm opacity-90">You&apos;re getting 20% OFF on all credit packages</div>
                    </div>
                  </motion.div>
                )}

                {/* Package Selection */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">Credit Packages</h3>
                    {isSubscribed && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg"
                      >
                        <HiOutlineSparkles className="w-3 h-3" />
                        Subscriber Savings
                      </motion.div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
                    {creditPackages.map((pkg, index) => {
                      const savings = calculateSavings(pkg.price, pkg.credits);
                      const discountedPrice = getDiscountedPrice(pkg.price);
                      const originalPrice = pkg.price;
                      return (
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
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
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
                              <div className="flex items-center gap-1">
                                {monthlyDiscountActive && (
                                  <span className="text-sm line-through text-gray-400">${originalPrice}</span>
                                )}
                                <span className="text-xl font-bold">${discountedPrice.toFixed(2)}</span>
                              </div>
                              {monthlyDiscountActive && (
                                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                  20% OFF
                                </span>
                              )}
                              {savings > 0 && !monthlyDiscountActive && (
                                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                  Save ${savings.toFixed(2)}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              ${(discountedPrice / pkg.credits).toFixed(2)} per credit
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
                      );
                    })}
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
                            ? getDiscountedPrice(creditPackages.find(p => p.id === selectedPackage)?.price || 0).toFixed(2)
                            : customPrice}
                        </span>
                      </div>
                      {monthlyDiscountActive && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount:</span>
                          <span>20% OFF applied</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span>Expiry:</span>
                        <span>90 days from purchase</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 flex-shrink-0">
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

      {/* Purchase Confirmation Modal */}
      <AnimatePresence>
        {showPurchaseModal && purchaseData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[60] p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className={`w-full max-w-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-2xl shadow-xl overflow-hidden`}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-green-900' : 'bg-green-50'}`}>
                    <HiOutlineCheck className={`w-5 h-5 ${isDarkMode ? 'text-green-300' : 'text-green-600'}`} />
                  </div>
                  <h2 className="text-xl font-semibold">Purchase Confirmation</h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowPurchaseModal(false)}
                  className={`p-2 rounded-full ${isDarkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} transition-colors`}
                >
                  <HiXMark className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="mb-4">
                    <HiOutlineCheck className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">You have purchased credits!</h3>
                  <div className={`space-y-3 text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <p>
                      You have purchased <span className="font-semibold text-blue-600">{purchaseData.amount} credits</span> for <span className="font-semibold">${purchaseData.price}</span>.
                    </p>
                    <p>
                      <span className="font-semibold text-green-600">These credits will expire in 90 days</span> and will be consumed separately from your plan credits.
                    </p>
                  </div>
                </div>
                
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}>
                  <div className="flex items-start gap-3">
                    <HiOutlineCheck className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-800 dark:text-blue-300 mb-1">What happens next?</p>
                      <ul className={`space-y-1 ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                        <li>• Credits added to your account immediately</li>
                        <li>• Used before your plan credits</li>
                        <li>• Expire in 90 days</li>
                        <li>• Available for all features</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 pt-0">
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowPurchaseModal(false)}
                    className={`flex-1 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-700 text-white hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={confirmPurchase}
                    disabled={isProcessing}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mx-auto"
                      />
                    ) : (
                      'Confirm Purchase'
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 