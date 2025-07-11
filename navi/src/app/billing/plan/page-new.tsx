"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from '@/context/ThemeContext';
import { useCurrentAccount } from '@/context/UserContext';
import Sidebar from '@/app/components/Sidebar';
import { motion, AnimatePresence } from "framer-motion";
import { HiXMark, HiArrowLeft } from "react-icons/hi2";
import { Crown, Zap, CheckCircle, XCircle, AlertTriangle, ArrowRight, Settings, CreditCard } from "lucide-react";
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

  const getButtonColor = () => {
    if (isCurrentPlan && isActive) return "bg-gray-100 text-gray-600 cursor-not-allowed";
    if (isCurrentPlan && isCanceled) return "bg-green-500 text-white hover:bg-green-600";
    if (isPopular) return "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700";
    return "bg-blue-500 text-white hover:bg-blue-600";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
        isPopular ? 'border-purple-500 scale-105' : isCurrentPlan ? 'border-green-500' : 'border-gray-200'
      }`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <Crown className="w-4 h-4" />
            Most Popular
          </div>
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrentPlan && isActive && (
        <div className="absolute -top-3 right-4">
          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            Current
          </div>
        </div>
      )}

      {/* Canceled Badge */}
      {isCurrentPlan && isCanceled && (
        <div className="absolute -top-3 right-4">
          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <XCircle className="w-4 h-4" />
            Canceled
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Plan Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.title}</h3>
          <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
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
            <div key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {feature.included ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
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
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={() => onSelectPlan(plan)}
          disabled={isProcessing || (isCurrentPlan && isActive)}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${getButtonColor()}`}
        >
          {isProcessing ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              {getButtonText()}
              {!isCurrentPlan && <ArrowRight className="w-4 h-4" />}
            </>
          )}
        </button>
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
      setPricingPlans(plans);

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

  const handlePlanSelect = (plan: PricingPlanData) => {
    setSelectedPlan(plan);
    
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
    if (!selectedPlan || !modalAction) return;

    try {
      setIsProcessing(true);
      
      switch (modalAction) {
        case 'subscribe':
          await subscriptionService.createSubscription({
            userId: 1, // Test user ID
            accountId: currentAccount?.id || 1,
            planId: selectedPlan.id,
            stripePriceId: selectedPlan.stripePriceId
          });
          break;
          
        case 'change':
          if (activeSubscription) {
            await subscriptionService.changePlan(activeSubscription.id, selectedPlan.id);
          }
          break;
          
        case 'reactivate':
          if (activeSubscription) {
            await subscriptionService.reactivateSubscription(activeSubscription.id, selectedPlan.id);
          }
          break;
      }

      // Reload data
      await loadData();
      setShowConfirmModal(false);
      setSelectedPlan(null);
      setModalAction(null);

    } catch (err) {
      console.error('Error processing action:', err);
      setError(err instanceof Error ? err.message : 'Failed to process action');
    } finally {
      setIsProcessing(false);
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

  const getModalDescription = () => {
    switch (modalAction) {
      case 'subscribe':
        return `You'll be charged $${selectedPlan?.price}${selectedPlan?.billing} and get ${selectedPlan?.credits} credits.`;
      case 'change':
        return `Your plan will change immediately. You'll be charged $${selectedPlan?.price}${selectedPlan?.billing} for the new plan.`;
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
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading pricing plans...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
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
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/billing')}
                className={`p-2 rounded-lg hover:bg-gray-100 ${isDarkMode ? 'hover:bg-gray-700' : ''}`}
              >
                <HiArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Subscription Plans
                </h1>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Choose the perfect plan for your needs
                </p>
              </div>
            </div>
            {activeSubscription && (
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${subscriptionHelpers.getStatusBgColor(activeSubscription.status)} ${subscriptionHelpers.getStatusColor(activeSubscription.status)}`}>
                  {subscriptionHelpers.formatStatus(activeSubscription.status)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Current Subscription Info */}
        {activeSubscription && (
          <div className="mx-6 mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
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
              <button
                onClick={() => router.push('/billing')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
              >
                <Settings className="w-4 h-4" />
                Manage
              </button>
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <div className="mx-6 mt-6">
          <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg w-fit">
            {['Personal', 'Business'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab as 'Personal' | 'Business')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedTab === tab
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Plans Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </div>
        </div>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirmModal && selectedPlan && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {getModalTitle()}
                  </h3>
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <HiXMark className="w-5 h-5" />
                  </button>
                </div>
                
                <p className="text-gray-600 mb-6">
                  {getModalDescription()}
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmAction}
                    disabled={isProcessing}
                    className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Confirm'
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
