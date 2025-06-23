"use client";

import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineXMark, HiOutlineCreditCard, HiOutlineCalendar } from "react-icons/hi2";
import { CreditCard, Shield, Lock, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useTheme } from '@/context/ThemeContext';
import { paymentMethodHelpers } from '@/lib/payment-methods';

interface CardDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: any;
}

export default function CardDetailsModal({ isOpen, onClose, card }: CardDetailsModalProps) {
  const { isDarkMode } = useTheme();

  if (!card) return null;

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCard className="w-6 h-6" />;
      case 'paypal':
        return <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-bold">P</span>
        </div>;
      case 'bank':
        return <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-bold">B</span>
        </div>;
      default:
        return <CreditCard className="w-6 h-6" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'expired':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'suspended':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative`}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 p-6 border-b border-gray-200 dark:border-gray-700 bg-inherit rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    {getPaymentMethodIcon(card.paymentMethod)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{card.brand}</h2>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Payment Method Details
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className={`p-2 rounded-xl transition-colors ${
                    isDarkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <HiOutlineXMark className="w-6 h-6" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Status and Default Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(card.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${paymentMethodHelpers.getStatusColor(card.status)}`}>
                    {card.status}
                  </span>
                </div>
                {card.isDefault && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Default</span>
                  </div>
                )}
              </div>

              {/* Card Information */}
              <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <HiOutlineCreditCard className="w-5 h-5" />
                  Payment Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Card Number:</span>
                      <span className="font-mono font-medium">{card.number}</span>
                    </div>
                    
                    {card.paymentMethod === 'card' && (
                      <div className="flex justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Expires:</span>
                        <span className="font-medium">{card.expiry}</span>
                      </div>
                    )}
                    
                    {card.paymentMethod === 'paypal' && (
                      <div className="flex justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email:</span>
                        <span className="font-medium">{card.email}</span>
                      </div>
                    )}
                    
                    {card.paymentMethod === 'bank' && (
                      <>
                        <div className="flex justify-between">
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Bank:</span>
                          <span className="font-medium">{card.bankName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Account:</span>
                          <span className="font-mono font-medium">{card.accountNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Routing:</span>
                          <span className="font-mono font-medium">{card.routingNumber}</span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Cardholder:</span>
                      <span className="font-medium">{card.cardholderName}</span>
                    </div>
                    
                    {card.zipCode && (
                      <div className="flex justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>ZIP Code:</span>
                        <span className="font-medium">{card.zipCode}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Country:</span>
                      <span className="font-medium">{card.country}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Features */}
              {card.securityFeatures && card.securityFeatures.length > 0 && (
                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Features
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {card.securityFeatures.map((feature: string, index: number) => (
                      <div
                        key={index}
                        className={`px-3 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${
                          isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        <Shield className="w-4 h-4" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Usage Information */}
              <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <HiOutlineCalendar className="w-5 h-5" />
                  Usage Information
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Added:</span>
                    <span className="font-medium">
                      {new Date(card.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {card.lastUsed && (
                    <div className="flex justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Last Used:</span>
                      <span className="font-medium">
                        {paymentMethodHelpers.formatLastUsed(card.lastUsed)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Payment Type:</span>
                    <span className="font-medium capitalize">{card.paymentMethod}</span>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-200'}`}>
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-700 dark:text-blue-300">Security Notice</h4>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-blue-200' : 'text-blue-600'}`}>
                      Your payment information is encrypted and stored securely. We never store your full card details and use industry-standard security measures to protect your data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 