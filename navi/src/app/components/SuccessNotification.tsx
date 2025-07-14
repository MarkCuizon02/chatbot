"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineCheckCircle, HiXMark } from 'react-icons/hi2';
import { Zap, CheckCircle, ArrowRight } from 'lucide-react';

interface PlanData {
  id: string;
  title: string;
  price: number;
  credits: number;
  description: string;
  billing: string;
  popular?: boolean;
  features: Array<{
    name: string;
    included: boolean;
    description?: string;
  }>;
}

interface SuccessNotificationProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
  planData?: PlanData;
}

export default function SuccessNotification({ isVisible, message, onClose, planData }: SuccessNotificationProps) {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Increased timeout for modal
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  // Format price from cents to dollars
  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toFixed(2);
  };

  // Get plan color scheme based on plan title
  const getPlanColorScheme = (planTitle: string) => {
    const title = planTitle.toLowerCase();
    if (title.includes('personal')) return {
      color: 'text-pink-500',
      border: 'border-pink-200',
      buttonColor: 'bg-pink-500 text-white hover:bg-pink-600',
      bgGradient: 'from-pink-50 to-pink-100'
    };
    if (title.includes('family')) return {
      color: 'text-yellow-500',
      border: 'border-yellow-200',
      buttonColor: 'bg-yellow-400 text-white hover:bg-yellow-500',
      bgGradient: 'from-yellow-50 to-yellow-100'
    };
    if (title.includes('launch')) return {
      color: 'text-red-500',
      border: 'border-red-200',
      buttonColor: 'bg-red-500 text-white hover:bg-red-600',
      bgGradient: 'from-red-50 to-red-100'
    };
    if (title.includes('growth')) return {
      color: 'text-purple-500',
      border: 'border-purple-200',
      buttonColor: 'bg-purple-500 text-white hover:bg-purple-600',
      bgGradient: 'from-purple-50 to-purple-100'
    };
    if (title.includes('pro')) return {
      color: 'text-orange-500',
      border: 'border-orange-200',
      buttonColor: 'bg-orange-500 text-white hover:bg-orange-600',
      bgGradient: 'from-orange-50 to-orange-100'
    };
    // Default blue theme
    return {
      color: 'text-blue-500',
      border: 'border-blue-200',
      buttonColor: 'bg-blue-500 text-white hover:bg-blue-600',
      bgGradient: 'from-blue-50 to-blue-100'
    };
  };

  const colorScheme = planData ? getPlanColorScheme(planData.title) : null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="p-2 bg-green-100 rounded-full"
                >
                  <HiOutlineCheckCircle className="w-6 h-6 text-green-600" />
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Success!</h2>
                  <p className="text-sm text-gray-600">{message}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <HiXMark className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Plan Details */}
            {planData && (
              <div className="p-6">
                <div className="text-center mb-6">
                  <h3 className={`text-2xl font-bold mb-2 ${colorScheme?.color}`}>
                    {planData.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{planData.description}</p>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className={`text-4xl font-bold ${colorScheme?.color}`}>
                      ${formatPrice(planData.price)}
                    </span>
                    <span className="text-gray-600">{planData.billing}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span>{planData.credits.toLocaleString()} credits included</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {planData.features.map((feature, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {feature.included ? (
                          <div className={`p-1 rounded-full ${colorScheme?.bgGradient.replace('50', '100').replace('100', '200')}`}>
                            <CheckCircle className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                          {feature.name}
                        </span>
                        {feature.description && (
                          <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    planData.popular
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                      : colorScheme?.buttonColor
                  }`}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            )}

            {/* Simple Success Message (fallback) */}
            {!planData && (
              <div className="p-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <HiOutlineCheckCircle className="w-8 h-8 text-green-600" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Success!</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Continue
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 