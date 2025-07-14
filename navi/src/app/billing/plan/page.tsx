"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from '@/context/ThemeContext';
import { useCurrentAccount } from '@/context/UserContext';
import Sidebar from '@/app/components/Sidebar';
import { motion, AnimatePresence } from "framer-motion";
import { HiXMark, HiArrowLeft, HiOutlineCheck, HiOutlineStar, HiOutlineUsers, HiOutlineUser, HiOutlineBuildingOffice2, HiOutlineExclamationTriangle } from "react-icons/hi2";
import { Crown, Zap, CheckCircle, XCircle, AlertTriangle, ArrowRight, CreditCard, Sparkles } from "lucide-react";
import { subscriptionService, subscriptionHelpers, SubscriptionData, PricingPlanData } from '@/lib/subscription-service';

interface PlanCardProps {
  plan: PricingPlanData;
  currentSubscription?: SubscriptionData | null;
  isPopular?: boolean;
  onSelectPlan: (plan: PricingPlanData) => void;
  isProcessing?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, currentSubscription, isPopular, onSelectPlan, isProcessing }) => {
  const isCurrentPlan = currentSubscription?.stripePriceId === plan.stripePriceId;
  const isActive = currentSubscription ? subscriptionHelpers.isActive(currentSubscription) : false;
  const isCanceled = currentSubscription ? subscriptionHelpers.isCanceled(currentSubscription) : false;
  
  const getButtonText = () => {
    if (isCurrentPlan && isActive) return "Current Plan";
    if (isCurrentPlan && isCanceled) return "Reactivate";
    if (isCurrentPlan) return "Manage";
    return plan.buttonText || "Subscribe";
  };

  const getFeatureIcon = (feature: string) => {
    if (feature.toLowerCase().includes('credits')) return <Zap className="w-4 h-4" />;
    if (feature.toLowerCase().includes('users')) return <HiOutlineUsers className="w-4 h-4" />;
    if (feature.toLowerCase().includes('bonus')) return <Sparkles className="w-4 h-4" />;
    if (feature.toLowerCase().includes('community')) return <HiOutlineStar className="w-4 h-4" />;
    return <HiOutlineCheck className="w-4 h-4" />;
  };

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
    if (title.includes('human') || title.includes('founder')) return {
      color: 'text-indigo-500',
      border: 'border-indigo-200',
      buttonColor: 'bg-indigo-500 text-white hover:bg-indigo-600',
      bgGradient: 'from-indigo-50 to-indigo-100'
    };
    // Default blue theme
    return {
      color: 'text-blue-500',
      border: 'border-blue-200',
      buttonColor: 'bg-blue-500 text-white hover:bg-blue-600',
      bgGradient: 'from-blue-50 to-blue-100'
    };
  };

  const colorScheme = getPlanColorScheme(plan.title);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
        isPopular ? 'border-purple-500 scale-105' : isCurrentPlan ? 'border-green-500' : colorScheme.border
      }`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-3 left-1/2 transform -translate-x-1/2"
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <Crown className="w-4 h-4" />
            Most Popular
          </div>
        </motion.div>
      )}

      {/* Current Plan Badge */}
      {isCurrentPlan && isActive && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-3 right-4"
        >
          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            Current
          </div>
        </motion.div>
      )}

      {/* Canceled Badge */}
      {isCurrentPlan && isCanceled && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-3 right-4"
        >
          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <XCircle className="w-4 h-4" />
            Canceled
          </div>
        </motion.div>
      )}

      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorScheme.bgGradient} opacity-30 rounded-2xl`} />

      <div className="relative p-8">
        {/* Plan Header */}
        <div className="text-center mb-6">
          <h3 className={`text-2xl font-bold mb-2 ${colorScheme.color}`}>{plan.title}</h3>
          <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className={`text-4xl font-bold ${colorScheme.color}`}>${formatPrice(plan.price)}</span>
            <span className="text-gray-600">{plan.billing}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span>{plan.credits} credits included</span>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-6">
          {plan.features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex-shrink-0 mt-0.5">
                {feature.included ? (
                  <div className={`p-1 rounded-full ${colorScheme.bgGradient.replace('50', '100').replace('100', '200')}`}>
                    {getFeatureIcon(feature.name)}
                  </div>
                ) : (
                  <XCircle className="w-5 h-5 text-gray-400" />
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
          onClick={() => onSelectPlan(plan)}
          disabled={isProcessing || (isCurrentPlan && isActive)}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            isCurrentPlan && isActive 
              ? 'bg-gray-100 text-gray-600 cursor-not-allowed' 
              : isCurrentPlan && isCanceled
              ? 'bg-green-500 text-white hover:bg-green-600'
              : isPopular
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
              : colorScheme.buttonColor
          }`}
        >
          {isProcessing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <>
              {getButtonText()}
              {!isCurrentPlan && <ArrowRight className="w-4 h-4" />}
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default function BillingPlanPage() {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { currentAccount } = useCurrentAccount();
  
  // State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNaviModalOpen, setIsNaviModalOpen] = useState(false);
  const [isNaviDropdownOpen, setIsNaviDropdownOpen] = useState(false);
  const [isNaviChatbotOpen, setIsNaviChatbotOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [pricingPlans, setPricingPlans] = useState<PricingPlanData[]>([]);
  const [activeSubscription, setActiveSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'Personal' | 'Business'>('Personal');

  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlanData | null>(null);
  const [modalAction, setModalAction] = useState<'subscribe' | 'change' | 'reactivate' | null>(null);

  // Cancel subscription modal state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState<string | null>(null);
  const [cancelFeedback, setCancelFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Add new state for the second confirmation modal
  const [showFounderClubModal, setShowFounderClubModal] = useState(false);
  // 1. Add a modal state for upgrade failure
  const [showUpgradeFailedModal, setShowUpgradeFailedModal] = useState(false);
  const [upgradeFailedMessage, setUpgradeFailedMessage] = useState('');

  // Function to get Founder's Club details based on selected plan
  const getFoundersClubDetails = (selectedPlan: PricingPlanData) => {
    const basePrice = selectedPlan.price / 100; // Convert from cents to dollars
    
    // Calculate Founder's Club price (same as selected plan)
    const foundersClubPrice = basePrice;
    
    // Calculate bonus credits (20% more than selected plan)
    const bonusCredits = Math.round(selectedPlan.credits * 0.2);
    const totalCredits = selectedPlan.credits + bonusCredits;
    
    return {
      originalPlan: selectedPlan.title,
      foundersClubPrice,
      totalCredits,
      bonusCredits,
      billing: selectedPlan.billing,
      colorScheme: getPlanColorScheme(selectedPlan.title)
    };
  };

  // Animation variants
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

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load pricing plans
      const plans = await subscriptionService.getPricingPlans();
      // Add foundersClubEligible: true to all plans
      const plansWithFounder = plans.map(plan => ({ ...plan, foundersClubEligible: true }));
      setPricingPlans(plansWithFounder);

      // Load subscriptions (using test user for now)
      const testUserId = 1;
      const userSubscriptions = await subscriptionService.getSubscriptions(testUserId);

      // Find active subscription
      const active = userSubscriptions.find(sub => subscriptionHelpers.isActive(sub));
      setActiveSubscription(active || null);

    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // 2. Update handlePlanSelect to show Founder's Club modal for any plan
  const handlePlanSelect = (plan: PricingPlanData) => {
    setSelectedPlan(plan);
    if (plan.foundersClubEligible) {
      setModalAction('change'); // or 'subscribe' depending on your logic
      setShowFounderClubModal(true);
      setShowConfirmModal(false);
      return;
    }
    
    if (activeSubscription) {
      // Check if it's the same plan
      if (activeSubscription.stripePriceId === plan.stripePriceId) {
        if (subscriptionHelpers.isCanceled(activeSubscription)) {
          setModalAction('reactivate');
        } else {
          // Already on this plan, no action needed
          return;
        }
      } else {
        setModalAction('change');
      }
    } else {
      setModalAction('subscribe');
    }
    
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    // Instead of upgrading immediately, show the Founder’s Club modal if Growth Plan is selected
    if (selectedPlan && selectedPlan.title === 'Growth') {
      setShowConfirmModal(false);
      setShowFounderClubModal(true);
      return;
    }
    // Otherwise, proceed as before
    await doUpgrade();
  };

  // 3. Update doUpgrade to show failure modal if Stripe fails
  const doUpgrade = async () => {
    if (!selectedPlan || !modalAction) return;
    try {
      setIsProcessing(true);
      switch (modalAction) {
        case 'subscribe':
          await subscriptionService.createSubscriptionWithStripe({
            userId: 1, // Test user ID
            accountId: currentAccount?.id || 1,
            planId: selectedPlan.id,
            stripePriceId: selectedPlan.stripePriceId,
            email: 'test@example.com', // TODO: Get from user context
            name: 'Test User', // TODO: Get from user context
            phone: '+1234567890' // TODO: Get from user context
          });
          break;
        case 'change':
          if (activeSubscription) {
            await subscriptionService.changePlanWithStripe(activeSubscription.id, selectedPlan.id);
          }
          break;
        case 'reactivate':
          if (activeSubscription) {
            await subscriptionService.reactivateSubscription(activeSubscription.id, selectedPlan.id);
          }
          break;
      }
      
      // Only reload data and update UI if the operation was successful
      await loadData();
      setShowConfirmModal(false);
      setShowFounderClubModal(false);
      setSelectedPlan(null);
      setModalAction(null);
    } catch (err) {
      console.error('Error processing action:', err);
      setUpgradeFailedMessage(err instanceof Error ? err.message : 'Failed to process action');
      setShowUpgradeFailedModal(true);
      // Don't reload data or update UI on failure - keep current state
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to handle subscription cancellation
  const handleCancelSubscription = async () => {
    setIsLoading(true);
    
    try {
      console.log('🔍 Client: Sending cancel subscription request:', {
        userId: 1,
        reason: cancelReason,
        feedback: cancelFeedback
      });

      // Use the subscription service to cancel with Stripe integration
      if (activeSubscription) {
        await subscriptionService.cancelSubscriptionWithStripe(activeSubscription.id, {
          reason: cancelReason || undefined,
          feedback: cancelFeedback || undefined
        });
      } else {
        throw new Error('No active subscription found');
      }

      // Reload data to reflect the canceled state
      await loadData();

      // Close the modal
      setShowCancelModal(false);
      setCancelReason(null);
      setCancelFeedback('');

      // Show success message
      setError(null);

    } catch (error) {
      console.error('❌ Client: Error canceling subscription:', error);
      setError(`Failed to cancel subscription: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getModalTitle = () => {
    switch (modalAction) {
      case 'subscribe':
        return `Subscribe to ${selectedPlan?.title}`;
      case 'change':
        return `Change to ${selectedPlan?.title}`;
      case 'reactivate':
        return `Reactivate ${selectedPlan?.title}`;
      default:
        return 'Confirm Action';
    }
  };

  // Format price from cents to dollars
  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toFixed(2);
  };

  const getModalDescription = () => {
    switch (modalAction) {
      case 'subscribe':
        return `You'll be charged $${formatPrice(selectedPlan?.price || 0)}${selectedPlan?.billing} and get ${selectedPlan?.credits} credits.`;
      case 'change':
        return `Your plan will change immediately. You'll be charged $${formatPrice(selectedPlan?.price || 0)}${selectedPlan?.billing} for the new plan.`;
      case 'reactivate':
        return `Your subscription will be reactivated with the ${selectedPlan?.title} plan.`;
      default:
        return '';
    }
  };

  // Filter plans by category
  const filteredPlans = pricingPlans.filter(plan => 
    plan.category.toLowerCase() === selectedTab.toLowerCase()
  );

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          isNaviModalOpen={isNaviModalOpen}
          setIsNaviModalOpen={setIsNaviModalOpen}
          isNaviDropdownOpen={isNaviDropdownOpen}
          setIsNaviDropdownOpen={setIsNaviDropdownOpen}
          isNaviChatbotOpen={isNaviChatbotOpen}
          setIsNaviChatbotOpen={setIsNaviChatbotOpen}
          isProfileOpen={isProfileOpen}
          setIsProfileOpen={setIsProfileOpen}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-gray-600">Loading pricing plans...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Sidebar
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        isNaviModalOpen={isNaviModalOpen}
        setIsNaviModalOpen={setIsNaviModalOpen}
        isNaviDropdownOpen={isNaviDropdownOpen}
        setIsNaviDropdownOpen={setIsNaviDropdownOpen}
        isNaviChatbotOpen={isNaviChatbotOpen}
        setIsNaviChatbotOpen={setIsNaviChatbotOpen}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
      />
      
      <div className="flex-1 flex flex-col">
        <div className={`flex-1 p-10 max-w-7xl mx-auto transition-all duration-300 ${isSidebarCollapsed ? 'ml-24' : 'ml-72'}`}>
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
        {/* Header */}
                <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/billing')}
                className={`p-2 rounded-lg hover:bg-gray-100 ${isDarkMode ? 'hover:bg-gray-700' : ''}`}
              >
                <HiArrowLeft className="w-5 h-5" />
                    </motion.button>
              <div>
                      <h1 className={`text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${isDarkMode ? 'from-blue-400 to-purple-400' : ''}`}>
                        Billing & Subscription
                </h1>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Choose the perfect plan for your needs
                </p>
              </div>
            </div>
            {activeSubscription && (
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowCancelModal(true)}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg shadow-red-500/25"
                    >
                      Cancel Subscription
                    </motion.button>
                  )}
                </motion.div>

                {/* Breadcrumb */}
                <motion.div variants={itemVariants} className="mb-8 text-sm text-gray-500">
                  <span
                    className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} cursor-pointer hover:underline`}
                    onClick={() => router.push("/billing")}
                  >
                    Billing & Subscription
                  </span>
                  <span className="mx-1">&gt;</span>
                  <span
                    className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} cursor-pointer hover:underline`}
                    onClick={() => router.push("/billing/plan")}
                  >
                    Your Plan
                  </span>
                </motion.div>

        {/* Error Message */}
        {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                  >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">{error}</span>
            </div>
                  </motion.div>
        )}

        {/* Current Subscription Info */}
        {activeSubscription && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                  >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">Current Subscription</h3>
                  <p className="text-sm text-blue-700">
                    Status: {subscriptionHelpers.formatStatus(activeSubscription.status)}
                    {activeSubscription.currentPeriodEnd && (
                      <span className="ml-2">
                        • Next billing: {subscriptionHelpers.formatDate(activeSubscription.currentPeriodEnd)}
                      </span>
                    )}
                  </p>
                </div>
              </div>
                  </motion.div>
        )}

        {/* Category Tabs */}
                <motion.div variants={itemVariants} className="flex gap-2 mb-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-6 py-3 rounded-lg font-medium text-base transition-all duration-200 flex items-center gap-2 relative ${
                      selectedTab === "Personal"
                        ? isDarkMode 
                          ? "bg-gradient-to-r from-pink-600 to-pink-700 text-white shadow-lg shadow-pink-600/25" 
                          : "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/25"
                        : isDarkMode
                          ? "bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700 hover:text-gray-300"
                          : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-700"
                    }`}
                    onClick={() => setSelectedTab("Personal")}
                  >
                    <HiOutlineUser className={`w-5 h-5 ${selectedTab === "Personal" ? "text-white" : isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                    Personal
                    {selectedTab === "Personal" && (
                      <motion.div
                        layoutId="activeTab"
                        className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-lg ${
                          isDarkMode ? "bg-pink-400" : "bg-pink-300"
                        }`}
                      />
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-6 py-3 rounded-lg font-medium text-base transition-all duration-200 flex items-center gap-2 relative ${
                      selectedTab === "Business"
                        ? isDarkMode 
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25" 
                          : "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                        : isDarkMode
                          ? "bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700 hover:text-gray-300"
                          : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-700"
                    }`}
                    onClick={() => setSelectedTab("Business")}
                  >
                    <HiOutlineBuildingOffice2 className={`w-5 h-5 ${selectedTab === "Business" ? "text-white" : isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                    Business
                    {selectedTab === "Business" && (
                      <motion.div
                        layoutId="activeTab"
                        className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-lg ${
                          isDarkMode ? "bg-blue-400" : "bg-blue-300"
                        }`}
                      />
                    )}
                  </motion.button>
                </motion.div>

        {/* Plans Grid */}
                <motion.div 
                  variants={itemVariants}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
            {filteredPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                currentSubscription={activeSubscription || undefined}
                isPopular={plan.popular}
                onSelectPlan={handlePlanSelect}
                isProcessing={isProcessing}
              />
            ))}
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
        </div>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirmModal && selectedPlan && (
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
                className={`w-full max-w-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-2xl shadow-xl overflow-hidden`}
              >
                <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl font-bold">
                    {getModalTitle()}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowConfirmModal(false)}
                    className={`p-1 rounded-full ${isDarkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} transition-colors`}
                  >
                    <HiXMark className="w-6 h-6" />
                  </motion.button>
                </div>
                
                <div className="p-6">
                  <p className={`mb-6 text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {getModalDescription()}
                </p>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-xl p-4 mb-6 ${isDarkMode ? 'bg-cyan-900 bg-opacity-30' : 'bg-cyan-50'}`}
                  > 
                    <div className="flex flex-col gap-2 text-base">
                      <div className="flex justify-between"><span className="font-medium">New Plan:</span> <span>{selectedPlan.title}</span></div>
                      <div className="flex justify-between"><span className="font-medium">Billing:</span> <span>${formatPrice(selectedPlan.price)}{selectedPlan.billing}</span></div>
                      <div className="flex justify-between"><span className="font-medium">Credits:</span> <span>{selectedPlan.credits} credits</span></div>
                      <div className="flex justify-between"><span className="font-medium">Effective:</span> <span>Immediately</span></div>
                    </div>
                  </motion.div>
                  
                  <p className={`mb-8 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Your new subscription will be activated immediately and you&apos;ll be charged for the new billing period.
                  </p>
                
                <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    onClick={() => setShowConfirmModal(false)}
                      className={`flex-1 py-2 px-4 border rounded-lg font-medium ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600 border-gray-600' : 'bg-white text-gray-800 hover:bg-gray-100 border-gray-300'}`}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={e => {
                        e.preventDefault?.();
                        console.log('Confirm clicked', selectedPlan?.title);
                        if (selectedPlan && selectedPlan.title === 'Growth') {
                          setShowConfirmModal(false);
                          setShowFounderClubModal(true);
                          console.log('Should show Founder Club modal');
                        } else {
                          handleConfirmAction();
                        }
                      }}
                      disabled={isProcessing}
                      className={`flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2`}
                    >
                      {isProcessing ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        'Confirm'
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Founder’s Club Confirmation Modal */}
        <AnimatePresence>
          {showFounderClubModal && (
            <>
              {console.log('Rendering Founder Club modal')}
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
                  <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-200">
                    <h2 className="text-2xl font-bold">Confirm Upgrade Subscription</h2>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowFounderClubModal(false)}
                      className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <HiXMark className="w-5 h-5" />
                    </motion.button>
                  </div>
                  <div className="p-6">
                    <p className="mb-4 text-gray-700">
                      You’re about to upgrade to the <span className="text-purple-500 font-semibold">Growth Plan</span> but we will upgrade you to our <span className="text-teal-500 font-semibold">Founder’s Club</span> for the same amount plus the following:
                    </p>
                    <ul className="mb-6 space-y-2 text-gray-800">
                      <li className="flex items-center"><HiOutlineCheck className="text-green-500 mr-2" />+20% Bonus Credits for Life</li>
                      <li className="flex items-center"><HiOutlineCheck className="text-green-500 mr-2" />Access to Community & Training</li>
                      <li className="flex items-center"><HiOutlineCheck className="text-green-500 mr-2" />Early Feature Access & Direct Feedback Loop</li>
                      <li className="flex items-center"><HiOutlineCheck className="text-green-500 mr-2" />Locked Pricing - No Future Increase</li>
                    </ul>
                    <div className="bg-blue-50 rounded-lg p-4 mb-6 text-gray-900">
                      <div className="flex justify-between mb-1"><span>New Plan:</span><span className="font-semibold">Founder’s Club</span></div>
                      <div className="flex justify-between mb-1"><span>Billing:</span><span className="font-semibold">$299/month</span></div>
                      <div className="flex justify-between"><span>Effective:</span><span className="font-semibold">Immediately</span></div>
                    </div>
                    <p className="mb-6 text-gray-500 text-sm">
                      Your new subscription will be activated immediately and you’ll be charged a prorate amount for the current billing period.
                    </p>
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setShowFounderClubModal(false)}
                        className="px-6 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                        onClick={doUpgrade}
                        className="px-6 py-2 rounded-lg bg-teal-500 text-white hover:bg-teal-600"
                      disabled={isProcessing}
                      >
                        {isProcessing ? 'Upgrading...' : 'Confirm Upgrade'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Cancel Subscription Modal */}
        <AnimatePresence>
          {showCancelModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className={`w-full max-w-lg ${
                  isDarkMode
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-900"
                } rounded-2xl shadow-xl overflow-hidden`}
              >
                <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold">Cancel Subscription</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowCancelModal(false)}
                    className={`p-1 rounded-full ${
                      isDarkMode
                        ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    } transition-colors`}
                  >
                    <HiXMark className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="p-6">
                  <p
                    className={`mb-6 text-base ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    We&apos;re sorry to see you go. Your subscription will remain active
                    until the end of your current billing period.
                  </p>

                  <div className="space-y-6">
                    <div>
                      <p
                        className={`mb-3 text-base ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Why are you canceling? (Optional)
                      </p>
                      <div className="space-y-2">
                        {[
                          "Too expensive",
                          "Not using it enough",
                          "Found a better alternative",
                          "Technical issues",
                          "No longer need the service",
                          "Other",
                        ].map((reason) => (
                          <motion.div 
                            key={reason} 
                            className="flex items-center"
                            whileHover={{ x: 5 }}
                          >
                            <input
                              type="radio"
                              id={reason}
                              name="cancelReason"
                              className="h-4 w-4 text-teal-500"
                              checked={cancelReason === reason}
                              onChange={() => setCancelReason(reason)}
                            />
                            <label
                              htmlFor={reason}
                              className={`ml-3 cursor-pointer ${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {reason}
                            </label>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p
                        className={`mb-3 text-base ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Additional feedback (Optional)
                      </p>
                      <textarea
                        placeholder="Help us improve by sharing your thoughts..."
                        value={cancelFeedback}
                        onChange={(e) => setCancelFeedback(e.target.value)}
                        className={`w-full p-3 border rounded-lg resize-none min-h-[100px] focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-8">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowCancelModal(false)}
                      className={`px-6 py-2 rounded-lg font-medium ${
                        isDarkMode
                          ? "bg-gray-700 text-white hover:bg-gray-600"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      Keep My Subscription
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCancelSubscription}
                      disabled={isLoading}
                      className={`px-6 py-2 rounded-lg font-medium ${isLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'} text-white`}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          />
                          <span>Canceling...</span>
                        </div>
                      ) : (
                        'Cancel Subscription'
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upgrade Failed Modal */}
        <AnimatePresence>
          {showUpgradeFailedModal && (
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
                className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="flex flex-col items-center p-8">
                  <HiOutlineExclamationTriangle className="w-12 h-12 text-red-500 mb-4" />
                  <h2 className="text-xl font-bold mb-2">Upgrade Failed</h2>
                  <p className="text-gray-700 mb-6 text-center">{upgradeFailedMessage || 'There was a problem upgrading your plan. Please try again or contact support.'}</p>
                  <button
                    onClick={() => setShowUpgradeFailedModal(false)}
                    className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
}
