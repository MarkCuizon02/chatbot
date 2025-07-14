"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark, HiOutlineExclamationTriangle, HiOutlineCheckCircle, HiOutlineArrowRight, HiOutlineTrash, HiOutlineUser } from 'react-icons/hi2';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';

interface SubscriptionManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: 'cancel' | 'update' | 'success';
  planName?: string;
  currentPlan?: string;
  onDeleteAccount?: () => void;
}

export default function SubscriptionManagementModal({ 
  isOpen, 
  onClose, 
  action, 
  planName, 
  currentPlan,
  onDeleteAccount 
}: SubscriptionManagementModalProps) {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  // handleConfirm is not used in this component, but kept for future use
  // const handleConfirm = async () => {
  //   if (onConfirm) {
  //     setIsProcessing(true);
  //     try {
  //       await onConfirm();
  //     } finally {
  //       setIsProcessing(false);
  //     }
  //   }
  // };

  const handleDeleteAccount = async () => {
    if (onDeleteAccount) {
      setIsProcessing(true);
      try {
        await onDeleteAccount();
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const getModalContent = () => {
    switch (action) {
      case 'cancel':
        return {
          title: 'Cancel Subscription',
          icon: <HiOutlineExclamationTriangle className="w-8 h-8 text-red-500" />,
          content: (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mb-4">
                  <HiOutlineExclamationTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Your subscription has been cancelled</h3>
                <div className={`space-y-3 text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <p>
                    On your next billing period, your account will be downgraded to a free account. 
                    You may still use the account with <span className="font-semibold text-blue-600">1000 free credits each month</span>.
                  </p>
                  <p>
                    You can reactivate your subscription anytime before the end of your current billing period 
                    to maintain uninterrupted access to all features.
                  </p>
                </div>
              </div>
              
              <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}>
                <div className="flex items-start gap-3">
                  <HiOutlineCheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-800 dark:text-blue-300 mb-1">What happens next?</p>
                    <ul className={`space-y-1 ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                      <li>• Access continues until {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</li>
                      <li>• Account automatically downgrades to free plan</li>
                      <li>• 1000 free credits per month</li>
                      <li>• Can reactivate anytime</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                  If you were intending to delete your account completely, click the button below.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDeleteAccount}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <HiOutlineTrash className="w-4 h-4" />
                  Delete My Account Completely
                </motion.button>
              </div>
            </div>
          ),
          actions: (
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className={`flex-1 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Got it
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/billing/plan')}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2"
              >
                Reactivate Subscription
                <HiOutlineArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          )
        };

      case 'update':
        return {
          title: 'Update Subscription',
          icon: <HiOutlineCheckCircle className="w-8 h-8 text-green-500" />,
          content: (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mb-4">
                  <HiOutlineCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Subscription Updated Successfully</h3>
                <div className={`space-y-3 text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <p>
                    Your subscription has been updated from <span className="font-semibold">{currentPlan}</span> to{' '}
                    <span className="font-semibold text-green-600">{planName}</span>.
                  </p>
                  <p>
                    The changes will take effect immediately, and you&apos;ll be charged a prorated amount 
                    for the current billing period.
                  </p>
                </div>
              </div>
              
              <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
                <div className="flex items-start gap-3">
                  <HiOutlineCheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-green-800 dark:text-green-300 mb-1">What&apos;s new?</p>
                    <ul className={`space-y-1 ${isDarkMode ? 'text-green-200' : 'text-green-700'}`}>
                      <li>• Plan changes effective immediately</li>
                      <li>• Prorated billing for current period</li>
                      <li>• New features available now</li>
                      <li>• Updated credit allocation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ),
          actions: (
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/billing')}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2"
              >
                View Billing Details
                <HiOutlineArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          )
        };

      case 'success':
        return {
          title: 'Success',
          icon: <HiOutlineCheckCircle className="w-8 h-8 text-green-500" />,
          content: (
            <div className="text-center">
              <div className="mb-4">
                <HiOutlineCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Operation Completed Successfully</h3>
              <p className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Your subscription has been updated successfully. You can continue using all features 
                according to your new plan.
              </p>
            </div>
          ),
          actions: (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200"
            >
              Continue
            </motion.button>
          )
        };

      default:
        return {
          title: 'Subscription Management',
          icon: <HiOutlineUser className="w-8 h-8 text-blue-500" />,
          content: <div>Content not available</div>,
          actions: <div>Actions not available</div>
        };
    }
  };

  const modalContent = getModalContent();

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
            className={`w-full max-w-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-2xl shadow-xl overflow-hidden`}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                {modalContent.icon}
                <h2 className="text-xl font-semibold">{modalContent.title}</h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className={`p-2 rounded-full transition-colors ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <HiXMark className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-6">
              {modalContent.content}
            </div>

            {/* Actions */}
            <div className="p-6 pt-0">
              {modalContent.actions}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 