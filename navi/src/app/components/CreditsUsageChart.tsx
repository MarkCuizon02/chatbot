"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { Zap, TrendingUp, TrendingDown, Clock, BarChart3, Activity, Target } from 'lucide-react';

export default function CreditsUsageChart() {
  const { isDarkMode } = useTheme();
  const { subscription } = useSubscription();

  const getTotalCredits = () => {
    return subscription.creditsUsed + subscription.creditsRemaining + subscription.totalAdditionalCredits;
  };

  const getUsagePercentage = () => {
    const total = getTotalCredits();
    return total > 0 ? (subscription.creditsUsed / total) * 100 : 0;
  };

  const getAdditionalCreditsPercentage = () => {
    const total = getTotalCredits();
    return total > 0 ? ((subscription.totalAdditionalCredits - subscription.usedAdditionalCredits) / total) * 100 : 0;
  };

  const getRemainingCreditsPercentage = () => {
    const total = getTotalCredits();
    return total > 0 ? (subscription.creditsRemaining / total) * 100 : 0;
  };

  const getUsageTrend = () => {
    // Simulate usage trend (in a real app, this would come from historical data)
    const dailyUsage = [45, 52, 38, 61, 47, 53, 49];
    const avgUsage = dailyUsage.reduce((a, b) => a + b, 0) / dailyUsage.length;
    const currentUsage = subscription.creditsUsed / 30; // Assuming 30 days
    return currentUsage > avgUsage ? 'up' : 'down';
  };

  const getUsageStatus = () => {
    const percentage = getUsagePercentage();
    if (percentage > 80) return { status: 'High', color: 'text-red-500', bg: 'bg-red-500/10' };
    if (percentage > 60) return { status: 'Moderate', color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
    return { status: 'Low', color: 'text-green-500', bg: 'bg-green-500/10' };
  };

  const usageStatus = getUsageStatus();

  let additionalCreditsValue = (Number(subscription.totalAdditionalCredits) || 0) - (Number(subscription.usedAdditionalCredits) || 0);
  if (isNaN(additionalCreditsValue) || additionalCreditsValue < 0) additionalCreditsValue = 0;
  const totalCredits = getTotalCredits();
  const additionalCreditsPercent = totalCredits > 0 ? (additionalCreditsValue / totalCredits) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-2xl border shadow-lg transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600' 
          : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
      }`}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full -translate-y-32 translate-x-32"></div>
      <div className="relative z-10 p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg`}>
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Credits Analytics</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Comprehensive usage insights and trends
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${usageStatus.bg} ${usageStatus.color}`}>
              {usageStatus.status} Usage
            </div>
            <div className="flex items-center gap-2">
              {getUsageTrend() === 'up' ? (
                <TrendingUp className="w-5 h-5 text-red-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-green-500" />
              )}
              <span className={`text-sm font-medium ${
                getUsageTrend() === 'up' ? 'text-red-600' : 'text-green-600'
              }`}>
                {getUsageTrend() === 'up' ? 'Increasing' : 'Decreasing'}
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Usage Chart */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Total Credits: {getTotalCredits().toLocaleString()}
            </span>
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {getUsagePercentage().toFixed(1)}% used
            </span>
          </div>
          <div className="flex flex-wrap gap-6 mb-4">
            <span className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
              Additional Credits: {additionalCreditsValue} ({isNaN(additionalCreditsPercent) ? 0 : additionalCreditsPercent.toFixed(1)}% of total)
            </span>
            <span className={`text-sm font-medium ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
              Remaining Credits: {Number(subscription.creditsRemaining) || 0}
            </span>
            <span className={`text-sm font-medium ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
              Used Credits: {Number(subscription.creditsUsed) || 0}
            </span>
          </div>
          
          <div className="relative h-10 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
            {/* Used Credits */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${getUsagePercentage()}%` }}
              transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-500 to-pink-500"
            />
            
            {/* Additional Credits */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${getAdditionalCreditsPercentage()}%` }}
              transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
              className="absolute h-full bg-gradient-to-r from-blue-500 to-cyan-500"
              style={{ left: `${getUsagePercentage()}%` }}
            />
            
            {/* Remaining Credits */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${getRemainingCreditsPercentage()}%` }}
              transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
              className="absolute h-full bg-gradient-to-r from-green-500 to-emerald-500"
              style={{ left: `${getUsagePercentage() + getAdditionalCreditsPercentage()}%` }}
            />
          </div>
        </div>

        {/* Enhanced Usage Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`relative overflow-hidden rounded-xl p-6 shadow-sm transition-all duration-200 hover:shadow-md ${
              isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-600' : 'bg-gradient-to-br from-red-50 to-pink-50'
            }`}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
                <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Used Credits
                </span>
              </div>
              <div className="text-3xl font-bold mb-1">{subscription.creditsUsed.toLocaleString()}</div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {getUsagePercentage().toFixed(1)}% of total
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`relative overflow-hidden rounded-xl p-6 shadow-sm transition-all duration-200 hover:shadow-md ${
              isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-600' : 'bg-gradient-to-br from-blue-50 to-cyan-50'
            }`}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Additional Credits
                </span>
              </div>
              <div className="text-3xl font-bold mb-1">
                {additionalCreditsValue.toLocaleString()}
              </div>
              <div className={`text-sm ${isNaN(additionalCreditsPercent) ? (isDarkMode ? 'text-gray-400' : 'text-gray-600') : (isDarkMode ? 'text-gray-400' : 'text-gray-600')}`}>
                {isNaN(additionalCreditsPercent) ? '0' : additionalCreditsPercent.toFixed(1)}% of total
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`relative overflow-hidden rounded-xl p-6 shadow-sm transition-all duration-200 hover:shadow-md ${
              isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-600' : 'bg-gradient-to-br from-green-50 to-emerald-50'
            }`}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Remaining Credits
                </span>
              </div>
              <div className="text-3xl font-bold mb-1">{subscription.creditsRemaining.toLocaleString()}</div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {getRemainingCreditsPercentage().toFixed(1)}% of total
              </div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Usage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-gray-700">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <Activity className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Daily Average
              </div>
              <div className="text-xl font-bold">
                {Math.round(subscription.creditsUsed / 30).toLocaleString()} credits
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
            className="flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <Clock className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
            </div>
            <div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Days Remaining
              </div>
              <div className="text-xl font-bold">
                {Math.round(subscription.creditsRemaining / (subscription.creditsUsed / 30))} days
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
            className="flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <Target className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Usage Efficiency
              </div>
              <div className="text-xl font-bold">
                {Math.round((subscription.creditsUsed / getTotalCredits()) * 100)}%
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
} 