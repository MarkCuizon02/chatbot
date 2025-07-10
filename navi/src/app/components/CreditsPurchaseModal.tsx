"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark, HiOutlineMap, HiOutlineCheck, HiOutlineSparkles } from 'react-icons/hi2';
import { useTheme } from '@/context/ThemeContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { useCurrentAccount } from '@/context/UserContext';
import { CREDIT_PACKS, formatPrice, formatPricePerCredit, getCreditPackPrice } from '@/lib/creditPricing';

interface CreditsPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  monthlyDiscountActive?: boolean;
  setMonthlyDiscountActive?: (value: boolean) => void;
}

// Use the new credit packs from the pricing system
const creditPackages = CREDIT_PACKS.map((pack, index) => ({
  id: `pack-${index}`,
  name: `${pack.credits.toLocaleString()} Credits`,
  credits: pack.credits,
  price: pack.totalPrice,
  popular: pack.popular || false,
  savings: 0, // Will be calculated dynamically
  features: [
    `${pack.credits.toLocaleString()} credits`,
    'Standard support',
    `${formatPricePerCredit(pack.pricePerCredit)} per credit`
  ]
}));

export default function CreditsPurchaseModal({ isOpen, onClose, monthlyDiscountActive = false, setMonthlyDiscountActive }: CreditsPurchaseModalProps) {
  const { isDarkMode } = useTheme();
  const { subscription, addPendingCreditPurchase } = useSubscription();
  const { currentAccount } = useCurrentAccount();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseData, setPurchaseData] = useState<{ amount: number; price: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSubscribed = subscription.currentPlan && subscription.currentPlan.name !== "No Active Plan";

  const calculateSavings = (packagePrice: number, packageCredits: number) => {
    if (!isSubscribed) return 0;
    const regularPrice = packageCredits * 0.200; // $0.200 per credit (highest tier)
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
    const basePrice = getCreditPackPrice(numAmount);
    return getDiscountedPrice(basePrice).toFixed(2);
  };

  const handlePurchase = async () => {
    if (!selectedPackage && !customAmount) return;
    
    setIsProcessing(true);
    setErrorMessage(null); // Clear any previous errors
    
    let amount: number;
    let price: number;
    
    if (selectedPackage) {
      const pkg = creditPackages.find(p => p.id === selectedPackage);
      if (!pkg) return;
      amount = pkg.credits;
      price = getDiscountedPrice(pkg.price);
    } else {
      amount = parseInt(customAmount);
      price = parseFloat(customPrice);
    }

    try {
      // Check if we have an account
      if (!currentAccount) {
        throw new Error('No account selected. Please try again.');
      }

      // Call the new API endpoint
      const response = await fetch('/api/billing/purchase-credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId: currentAccount.id, // Use actual account ID from context
          credits: amount,
          applyDiscount: monthlyDiscountActive,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Failed to purchase credits');
      }

      const result = await response.json();
      console.log('Payment intent created:', result);
      
      // ⭐ IMPORTANT: Add pending credit purchase (no credits added yet!)
      // Credits will only be added after Stripe webhook confirms successful payment
      if (result.success && result.paymentIntentId) {
        addPendingCreditPurchase(amount, price, result.paymentIntentId);
      }
      
      // Show success modal with "processing" status instead
      setIsProcessing(false);
      setShowPurchaseModal(true);
      setPurchaseData({ amount, price });
      setSelectedPackage(null);
      setCustomAmount('');
      setCustomPrice('');
    } catch (error) {
      console.error('Error purchasing credits:', error);
      setIsProcessing(false);
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.');
    }
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
                  onClick={() => {
                    setErrorMessage(null);
                    onClose();
                  }}
                  className={`p-1 md:p-2 rounded-full ${isDarkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} transition-colors`}
                >
                  <HiXMark className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="p-4 md:p-6 overflow-y-auto flex-1">
                {/* Monthly Subscription Toggle Section */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center justify-between rounded-2xl border shadow-md mb-6 px-6 py-4 ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl"><span role="img" aria-label="crown">👑</span></span>
                    <div>
                      <div className="font-bold text-lg md:text-xl">Monthly Subscription</div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {isSubscribed 
                          ? "Get 20% OFF on all packages when you subscribe to monthly packs"
                          : "Subscribe to a plan to unlock 20% OFF on all credit packages"
                        }
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-green-100 text-green-600 text-xs font-semibold px-3 py-1 rounded-lg border border-green-200">20% OFF</span>
                    <label className={`relative inline-flex items-center ${isSubscribed ? 'cursor-pointer' : 'cursor-not-allowed'} ml-2`}>
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={monthlyDiscountActive}
                        onChange={() => isSubscribed && setMonthlyDiscountActive && setMonthlyDiscountActive(!monthlyDiscountActive)}
                        disabled={!isSubscribed}
                      />
                      <div
                        className={`w-10 h-6 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500 transition-colors duration-200 ${
                          isSubscribed 
                            ? monthlyDiscountActive 
                              ? 'bg-green-400' 
                              : 'bg-gray-200 dark:bg-gray-700'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      ></div>
                      <div
                        className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                          monthlyDiscountActive ? 'translate-x-4' : ''
                        }`}
                      ></div>
                    </label>
                    {!isSubscribed && (
                      <div className="text-xs text-gray-500 ml-2">Subscribe to enable</div>
                    )}
                  </div>
                </motion.div>

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
                                  <span className="text-sm line-through text-gray-400">{formatPrice(originalPrice)}</span>
                                )}
                                <span className="text-xl font-bold">{formatPrice(discountedPrice)}</span>
                              </div>
                              {monthlyDiscountActive && (
                                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                  20% OFF
                                </span>
                              )}
                              {savings > 0 && !monthlyDiscountActive && (
                                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                  Save {formatPrice(savings)}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatPricePerCredit(discountedPrice / pkg.credits)} per credit
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
                          <span className="text-xl font-bold">{customPrice ? formatPrice(parseFloat(customPrice)) : formatPrice(0)}</span>
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
                          {selectedPackage 
                            ? formatPrice(getDiscountedPrice(creditPackages.find(p => p.id === selectedPackage)?.price || 0))
                            : customPrice ? formatPrice(parseFloat(customPrice)) : formatPrice(0)}
                        </span>
                      </div>
                      {monthlyDiscountActive && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount:</span>
                          <span>20% OFF applied</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Error Message */}
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-xl p-3 mb-4 border ${isDarkMode ? 'bg-red-900/20 border-red-700 text-red-300' : 'bg-red-50 border-red-200 text-red-700'}`}
                  >
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Purchase Failed</h4>
                        <p className="text-sm">{errorMessage}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setErrorMessage(null);
                      onClose();
                    }}
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
                  <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-900' : 'bg-blue-50'}`}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className={`w-5 h-5 border-2 ${isDarkMode ? 'border-blue-300 border-t-transparent' : 'border-blue-600 border-t-transparent'} rounded-full`}
                    />
                  </div>
                  <h2 className="text-xl font-semibold">Payment Processing</h2>
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
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Processing Your Payment...</h3>
                  <div className={`space-y-3 text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <p>
                      Your purchase of <span className="font-semibold text-blue-600">{purchaseData.amount} credits</span> for <span className="font-semibold">${purchaseData.price}</span> is being processed.
                    </p>
                    <p className="text-orange-600 font-medium">
                      ⚠️ Credits will be added to your account only after payment is confirmed.
                    </p>
                  </div>
                </div>
                
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-orange-900/20 border border-orange-700' : 'bg-orange-50 border border-orange-200'}`}>
                  <div className="flex items-start gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full mt-0.5 flex-shrink-0"
                    />
                    <div className="text-sm">
                      <p className="font-medium text-orange-800 dark:text-orange-300 mb-1">What happens next?</p>
                      <ul className={`space-y-1 ${isDarkMode ? 'text-orange-200' : 'text-orange-700'}`}>
                        <li>• Payment is being processed by Stripe</li>
                        <li>• Credits will be added after confirmation</li>
                        <li>• You&apos;ll receive an email notification</li>
                        <li>• Check your billing history for updates</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 pt-0">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowPurchaseModal(false)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 