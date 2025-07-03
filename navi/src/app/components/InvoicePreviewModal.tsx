"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark, HiOutlineDocumentText, HiOutlineCalendar, HiOutlineCreditCard, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineClock } from 'react-icons/hi2';
import { useTheme } from '@/context/ThemeContext';

interface InvoicePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: {
    id: string;
    amount: number;
    status: string;
    date: string;
    accountId: number;
    invoiceId?: number;
    type?: string;
    description?: string;
  } | null;
}

export default function InvoicePreviewModal({ isOpen, onClose, invoice }: InvoicePreviewModalProps) {
  const { isDarkMode } = useTheme();

  if (!invoice) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return <HiOutlineCheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <HiOutlineXCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <HiOutlineClock className="w-5 h-5 text-yellow-500" />;
      default:
        return <HiOutlineClock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'failed':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
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
            className={`w-full max-w-2xl max-h-[90vh] ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-2xl shadow-2xl overflow-hidden relative flex flex-col`}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-900' : 'bg-blue-50'}`}>
                  <HiOutlineDocumentText className={`w-5 h-5 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Invoice Preview</h2>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Invoice #{invoice.id}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className={`p-2 rounded-full ${isDarkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} transition-colors`}
              >
                <HiXMark className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {/* Invoice Details */}
              <div className="space-y-6">
                {/* Status Badge */}
                <div className="flex items-center gap-3">
                  {getStatusIcon(invoice.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                </div>

                {/* Amount */}
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Amount</div>
                  <div className="text-3xl font-bold">{formatAmount(invoice.amount)}</div>
                </div>

                {/* Invoice Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <HiOutlineCalendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">Date</span>
                    </div>
                    <div className="text-sm">{formatDate(invoice.date)}</div>
                  </div>

                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <HiOutlineCreditCard className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">Type</span>
                    </div>
                    <div className="text-sm">
                      {invoice.type === 'plan' ? 'Subscription' : 'Credits Purchase'}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {invoice.description && (
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="text-sm font-medium mb-2">Description</div>
                    <div className="text-sm">{invoice.description}</div>
                  </div>
                )}

                {/* Invoice ID (for reference) */}
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="text-sm font-medium mb-2">Invoice Reference</div>
                  <div className="text-sm font-mono text-gray-500 dark:text-gray-400">{invoice.id}</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 