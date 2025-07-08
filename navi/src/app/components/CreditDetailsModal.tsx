import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Calendar, TrendingUp, DollarSign } from 'lucide-react';
import { IntegratedCreditData, formatCredits, formatCurrency, AdditionalCredits } from '../../lib/credit-billing-integration';

interface CreditDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  integratedCredits: IntegratedCreditData;
  isDarkMode: boolean;
}

export default function CreditDetailsModal({ 
  isOpen, 
  onClose, 
  integratedCredits, 
  isDarkMode 
}: CreditDetailsModalProps) {
  if (!isOpen) return null;

  const planUsagePercentage = integratedCredits.planCredits.monthly > 0 
    ? (integratedCredits.planCredits.used / integratedCredits.planCredits.monthly) * 100 
    : 0;

  const additionalUsagePercentage = integratedCredits.additionalCredits.total > 0
    ? (integratedCredits.additionalCredits.used / integratedCredits.additionalCredits.total) * 100
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Credit Details & Billing
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Complete breakdown of your credit usage and billing
          </p>
        </div>

        <div className="p-6 space-y-8">
          {/* Credit Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-3">
                <CreditCard className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatCredits(integratedCredits.totalCredits.available)}
                </span>
              </div>
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Total Available</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>All credits combined</p>
            </div>

            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-3">
                <TrendingUp className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatCredits(integratedCredits.totalCredits.used)}
                </span>
              </div>
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Used This Period</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {integratedCredits.totalCredits.usagePercentage.toFixed(1)}% of available
              </p>
            </div>

            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-3">
                <DollarSign className={`w-6 h-6 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatCurrency(integratedCredits.billing.estimatedCost)}
                </span>
              </div>
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Estimated Cost</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>This billing period</p>
            </div>
          </div>

          {/* Plan Credits Breakdown */}
          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Plan Credits
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Monthly Allowance</span>
                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatCredits(integratedCredits.planCredits.monthly)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Used</span>
                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatCredits(integratedCredits.planCredits.used)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Remaining</span>
                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatCredits(integratedCredits.planCredits.remaining)}
                </span>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Usage</span>
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {planUsagePercentage.toFixed(1)}%
                  </span>
                </div>
                <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    className={`h-2 rounded-full ${
                      planUsagePercentage >= 90 ? 'bg-red-500' : 
                      planUsagePercentage >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(planUsagePercentage, 100)}%` }}
                  />
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Resets on {new Date(integratedCredits.planCredits.resetDate).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Additional Credits */}
          {integratedCredits.additionalCredits.total > 0 && (
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Additional Credits
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Total Purchased</span>
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {formatCredits(integratedCredits.additionalCredits.total)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Used</span>
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {formatCredits(integratedCredits.additionalCredits.used)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Remaining</span>
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {formatCredits(integratedCredits.additionalCredits.remaining)}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Usage</span>
                    <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {additionalUsagePercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div 
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: `${Math.min(additionalUsagePercentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Overage Information */}
          {integratedCredits.billing.overage.credits > 0 && (
            <div className={`p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800`}>
              <h3 className="text-lg font-semibold mb-4 text-red-800 dark:text-red-300">
                Overage Usage
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-red-700 dark:text-red-400">Credits Beyond Plan</span>
                  <span className="font-semibold text-red-800 dark:text-red-300">
                    {formatCredits(integratedCredits.billing.overage.credits)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-red-700 dark:text-red-400">Overage Cost</span>
                  <span className="font-semibold text-red-800 dark:text-red-300">
                    {formatCurrency(integratedCredits.billing.overage.cost)}
                  </span>
                </div>
                <div className="text-sm text-red-600 dark:text-red-400">
                  Rate: {formatCurrency(integratedCredits.billing.costPerCredit)} per credit
                </div>
              </div>
            </div>
          )}

          {/* Billing Period */}
          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Current Billing Period
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className={`block ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Period Start</span>
                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {new Date(integratedCredits.billing.currentPeriodStart).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className={`block ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Period End</span>
                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {new Date(integratedCredits.billing.currentPeriodEnd).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
