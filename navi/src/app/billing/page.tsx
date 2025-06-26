"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from '@/context/ThemeContext';
import { useSubscription } from '@/context/SubscriptionContext';
import Sidebar from '@/app/components/Sidebar';
import CreditsPurchaseModal from '@/app/components/CreditsPurchaseModal';
import CreditsUsageChart from '@/app/components/CreditsUsageChart';
import SubscriptionManagementModal from '@/app/components/SubscriptionManagementModal';
import { HiOutlineEye, HiOutlineCreditCard, HiOutlineCalendar, HiOutlineCog, HiOutlinePlus, HiOutlineArrowDownTray, HiOutlineArrowPath, HiOutlineBell } from "react-icons/hi2";
import { TrendingUp, TrendingDown, Zap, DollarSign, Users, Shield, Star, ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function BillingPage() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { subscription } = useSubscription();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNaviModalOpen, setIsNaviModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [isClient, setIsClient] = useState(false);
  
  // Subscription management modal state
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  
  // Monthly discount toggle state - only enabled if user is subscribed
  const [monthlyDiscountActive, setMonthlyDiscountActive] = useState(false);

  const router = useRouter();

  // Check if user is subscribed to a plan
  const isSubscribed = subscription.currentPlan && subscription.currentPlan.name !== "No Active Plan";

  // Fix hydration mismatch by ensuring client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3
      }
    },
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        duration: 0.2
      }
    }
  };

  // Calculate discounted price
  const originalPrice = Number(subscription.currentPlan?.price) || 0;
  const discountedPrice = (originalPrice * 0.8).toFixed(2);

  const getCreditsPercentage = () => {
    if (!isClient) return 0; // Return 0 during SSR to prevent hydration mismatch
    const used = Number(subscription.creditsUsed) || 0;
    const remaining = Number(subscription.creditsRemaining) || 0;
    const additional = Number(subscription.totalAdditionalCredits) || 0;
    const total = used + remaining + additional;
    return total > 0 ? (used / total) * 100 : 0;
  };

  const getTotalCreditsRemaining = () => {
    if (!isClient) return 0; // Return 0 during SSR to prevent hydration mismatch
    const remaining = Number(subscription.creditsRemaining) || 0;
    const additional = Number(subscription.totalAdditionalCredits) || 0;
    const usedAdditional = Number(subscription.usedAdditionalCredits) || 0;
    return remaining + (additional - usedAdditional);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900 dark:to-emerald-900 dark:text-green-300';
      case 'Failed':
        return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 dark:from-red-900 dark:to-pink-900 dark:text-red-300';
      case 'Pending':
        return 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 dark:from-yellow-900 dark:to-orange-900 dark:text-yellow-300';
      default:
        return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 dark:from-gray-700 dark:to-slate-700 dark:text-gray-300';
    }
  };

  const getCreditsStatusColor = () => {
    const percentage = getCreditsPercentage();
    if (percentage > 80) return 'from-red-500 to-pink-500';
    if (percentage > 60) return 'from-yellow-500 to-orange-500';
    return 'from-green-500 to-emerald-500';
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      // Here you would call your account deletion API
      console.log('Deleting account...');
      // For now, just close the modal
      setShowSubscriptionModal(false);
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  // Don't render dynamic content until client-side
  if (!isClient) {
    return (
      <div className={`min-h-screen ${isDarkMode ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100" : "bg-gradient-to-br from-gray-50 via-white to-blue-50 text-gray-900"} flex font-poppins transition-all duration-500`}>
        <Sidebar
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          isNaviModalOpen={isNaviModalOpen}
          setIsNaviModalOpen={setIsNaviModalOpen}
          isProfileOpen={isProfileOpen}
          setIsProfileOpen={setIsProfileOpen}
        />
        <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? "ml-24" : "ml-72"} p-8 md:p-12 overflow-x-hidden`}>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100" : "bg-gradient-to-br from-gray-50 via-white to-blue-50 text-gray-900"} flex font-poppins transition-all duration-500`}>
      <Sidebar
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        isNaviModalOpen={isNaviModalOpen}
        setIsNaviModalOpen={setIsNaviModalOpen}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
      />
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? "ml-24" : "ml-72"} p-8 md:p-12 overflow-x-hidden`}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Billing & Subscription
                  </h1>
                  <p className={`text-lg mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Manage your subscription, credits, and billing history
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300' 
                        : 'bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 shadow-sm'
                    }`}
                  >
                    <HiOutlineArrowPath className="w-4 h-4" />
                    Refresh
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300' 
                        : 'bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 shadow-sm'
                    }`}
                  >
                    <HiOutlineBell className="w-4 h-4" />
                    Notifications
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Monthly Subscription Promo */}
            <motion.div
              variants={itemVariants}
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
                    onChange={() => isSubscribed && setMonthlyDiscountActive(v => !v)}
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

            {/* Enhanced Stats Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className={`relative overflow-hidden rounded-2xl p-6 shadow-lg transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600' 
                    : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
                }`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg`}>
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      getCreditsPercentage() > 80 ? 'text-red-500' : 
                      getCreditsPercentage() > 60 ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      <TrendingUp className="w-4 h-4" />
                      {getCreditsPercentage().toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-1">{getTotalCreditsRemaining() || 0}</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Credits Remaining</div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-2">
                      <span>Used: {subscription.creditsUsed}</span>
                      <span>Total: {subscription.creditsUsed + subscription.creditsRemaining}</span>
                    </div>
                    <div className={`w-full bg-gray-200 rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <motion.div 
                        className={`h-2 rounded-full bg-gradient-to-r ${getCreditsStatusColor()}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${getCreditsPercentage()}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      ></motion.div>
                    </div>
                    <div className="mt-2 text-xs text-blue-600 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      +{(Number(subscription.totalAdditionalCredits) || 0) - (Number(subscription.usedAdditionalCredits) || 0)} additional credits
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className={`relative overflow-hidden rounded-2xl p-6 shadow-lg transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600' 
                    : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
                }`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg`}>
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <TrendingDown className={`w-5 h-5 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
                  </div>
                  <div className="text-3xl font-bold mb-1">${subscription.currentPlan?.price}</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Monthly Cost</div>
                  <div className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} flex items-center gap-1`}>
                    <HiOutlineCalendar className="w-3 h-3" />
                    Next billing: {subscription.nextBillingDate}
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className={`relative overflow-hidden rounded-2xl p-6 shadow-lg transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600' 
                    : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
                }`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg`}>
                      <HiOutlineCreditCard className="w-6 h-6 text-white" />
                    </div>
                    <Shield className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{subscription.paymentMethod.type}</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Payment Method</div>
                  <div className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    **** {subscription.paymentMethod.last4}
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className={`relative overflow-hidden rounded-2xl p-6 shadow-lg transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600' 
                    : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
                }`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg`}>
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <Star className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{subscription.currentPlan?.category}</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Plan Category</div>
                  <div className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {subscription.currentPlan?.features.length} features included
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Credits Usage Chart with Enhanced Header */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Credits Usage Analytics</h2>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Track your credit consumption and usage patterns
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {['week', 'month', 'quarter'].map((timeframe) => (
                    <motion.button
                      key={timeframe}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedTimeframe(timeframe)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedTimeframe === timeframe
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                          : isDarkMode
                            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                    </motion.button>
                  ))}
                </div>
              </div>
              <CreditsUsageChart />
            </motion.div>

            {/* Enhanced Plan Section */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="font-semibold text-xl mb-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500`}>
                  <HiOutlineCog className="w-5 h-5 text-white" />
                </div>
                Your Current Plan
              </div>
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className={`relative overflow-hidden rounded-2xl border shadow-lg transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600' 
                    : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
                }`}
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="relative z-10 p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                    <div className="flex-1 flex flex-col gap-4 min-w-[280px]">
                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 dark:from-teal-900 dark:to-cyan-900 dark:text-teal-300`}>
                          Renews on {subscription.nextBillingDate}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 dark:from-blue-900 dark:to-purple-900 dark:text-blue-300`}>
                          {subscription.currentPlan?.category}
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-2xl mb-2">{subscription.currentPlan?.name}</div>
                        <div className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                          {monthlyDiscountActive ? (
                            <>
                              <span className="line-through text-gray-400 mr-2">${originalPrice.toFixed(2)}</span>
                              <span>${discountedPrice}</span>
                            </>
                          ) : (
                            <span>${originalPrice.toFixed(2)}</span>
                          )}
                        </div>
                        <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
                          {subscription.currentPlan?.description}
                        </div>
                      </div>
                      <div className="space-y-2">
                        {subscription.currentPlan?.features.map((feature, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-3"
                          >
                            <div className="w-2 h-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></div>
                            <span className="text-sm">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-medium text-sm hover:shadow-lg transition-all duration-200 w-fit flex items-center gap-2 group"
                        onClick={() => router.push('/billing/plan')}
                      >
                        Manage Plan
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    </div>
                    <div className="flex flex-col min-w-[300px] gap-6">
                      <div className="flex flex-col items-end">
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`mb-6 border px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                            isDarkMode 
                              ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500' 
                              : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'
                          }`}
                          onClick={() => router.push('/billing/cards')}
                        >
                          <HiOutlineCreditCard className="w-4 h-4" />
                          Change Payment Method
                        </motion.button>
                      </div>
                      <div className="w-full flex flex-col items-start p-6 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700">
                        <div className="flex items-center gap-2 mb-3">
                          <Zap className="w-5 h-5 text-blue-600" />
                          <div className={`font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>Additional Credits</div>
                        </div>
                        <div className="text-2xl font-bold mb-2">
                          {(Number(subscription.totalAdditionalCredits) || 0) - (Number(subscription.usedAdditionalCredits) || 0)}
                        </div>
                        <div className={`${isDarkMode ? 'text-blue-300' : 'text-blue-600'} mb-4 text-sm`}>
                          {((Number(subscription.totalAdditionalCredits) || 0) - (Number(subscription.usedAdditionalCredits) || 0)) > 0
                            ? `${(Number(subscription.totalAdditionalCredits) || 0) - (Number(subscription.usedAdditionalCredits) || 0)} additional credits available`
                            : 'No additional credits purchased'}
                        </div>
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowCreditsModal(true)}
                          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-medium text-sm hover:shadow-lg transition-all duration-200 w-fit flex items-center gap-2 group"
                        >
                          <HiOutlinePlus className="w-4 h-4" />
                          Add More Credits
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Enhanced Payment Method Section */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="font-semibold text-xl mb-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500`}>
                  <HiOutlineCreditCard className="w-5 h-5 text-white" />
                </div>
                Payment Method
              </div>
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className={`relative overflow-hidden rounded-2xl border shadow-lg transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600' 
                    : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
                }`}
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="relative z-10 p-8 flex items-center min-h-[100px]">
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} mr-6`}>
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" 
                      alt="Visa" 
                      className="w-16 h-10 object-contain" 
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-semibold mb-1">{subscription.paymentMethod.type} ending in **** {subscription.paymentMethod.last4}</div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Expires {subscription.paymentMethod.expiry}</div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-green-600 dark:text-green-400">Secure payment method</span>
                    </div>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`border px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                      isDarkMode 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'
                    }`}
                    onClick={() => router.push('/billing/cards')}
                  >
                    Update
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>

            {/* Enhanced Billing History Section */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="font-semibold text-xl mb-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500`}>
                  <HiOutlineArrowDownTray className="w-5 h-5 text-white" />
                </div>
                Billing History
              </div>
              <motion.div
                variants={cardVariants}
                className={`relative overflow-hidden rounded-2xl border shadow-lg transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600' 
                    : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
                }`}
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/5 to-blue-500/5 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="relative z-10 p-8">
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className={`text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                          <th className="py-4 pr-6">Invoice ID</th>
                          <th className="py-4 pr-6">Description</th>
                          <th className="py-4 pr-6">Type</th>
                          <th className="py-4 pr-6">Amount</th>
                          <th className="py-4 pr-6">Date</th>
                          <th className="py-4 pr-6">Status</th>
                          <th className="py-4 pr-6"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscription.billingHistory.map((row, index) => (
                          <motion.tr 
                            key={row.id} 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`border-b last:border-0 group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                          >
                            <td className="py-4 pr-6 font-mono text-blue-600 dark:text-blue-400">
                              {row.status === 'Failed' ? '------' : row.id}
                            </td>
                            <td className="py-4 pr-6 font-medium">{row.plan}</td>
                            <td className="py-4 pr-6">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                row.type === 'plan' 
                                  ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 dark:from-purple-900 dark:to-pink-900 dark:text-purple-300'
                                  : 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 dark:from-blue-900 dark:to-cyan-900 dark:text-blue-300'
                              }`}>
                                {row.type === 'plan' ? 'Plan' : 'Credits'}
                              </span>
                            </td>
                            <td className="py-4 pr-6 font-bold text-lg">${row.amount}</td>
                            <td className="py-4 pr-6">{row.date}</td>
                            <td className="py-4 pr-6">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(row.status)}`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="py-4 pr-6 relative text-right">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                                onClick={() => setMenuOpen(menuOpen === row.id ? null : row.id)}
                              >
                                <span className="sr-only">Actions</span>
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-400">
                                  <circle cx="12" cy="6" r="1.5" />
                                  <circle cx="12" cy="12" r="1.5" />
                                  <circle cx="12" cy="18" r="1.5" />
                                </svg>
                              </motion.button>
                              <AnimatePresence>
                                {menuOpen === row.id && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    className={`absolute right-0 mt-2 w-36 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border rounded-xl shadow-lg z-10 overflow-hidden`}
                                  >
                                    <motion.button 
                                      whileHover={{ backgroundColor: isDarkMode ? '#374151' : '#f3f4f6' }}
                                      className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-700 hover:bg-gray-50 text-sm transition-colors"
                                    >
                                      <HiOutlineEye className="w-4 h-4" /> View Details
                                    </motion.button>
                                    <motion.button 
                                      whileHover={{ backgroundColor: isDarkMode ? '#374151' : '#f3f4f6' }}
                                      className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-700 hover:bg-gray-50 text-sm transition-colors"
                                    >
                                      <HiOutlineArrowDownTray className="w-4 h-4" /> Download Invoice
                                    </motion.button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
      
      {/* Credits Purchase Modal */}
      <CreditsPurchaseModal
        isOpen={showCreditsModal}
        onClose={() => setShowCreditsModal(false)}
        monthlyDiscountActive={monthlyDiscountActive}
      />

      {/* Subscription Management Modal */}
      <SubscriptionManagementModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        action="cancel"
        onDeleteAccount={handleDeleteAccount}
      />
    </div>
  );
} 