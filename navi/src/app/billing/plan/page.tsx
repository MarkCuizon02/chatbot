"use client";

import React, { useState } from "react";
import Sidebar from '@/app/components/Sidebar';
import { motion } from "framer-motion";
import { HiOutlineUser, HiOutlineBuildingOffice2, HiArrowLeft } from "react-icons/hi2";
import { Crown, CheckCircle, XCircle, Zap, Calendar, Clock, ArrowRight } from "lucide-react";
import { useTheme } from '@/app/context/ThemeContext';

// PlanCard component (simplified for this UI)
const PlanCard = ({ plan, isPopular, isCurrentPlan, onSelectPlan }: any) => {
  const getFeatureIcon = (feature: string) => {
    if (feature.toLowerCase().includes('credits')) return <Zap className="w-4 h-4" />;
    if (feature.toLowerCase().includes('users')) return <HiOutlineUser className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
        isPopular ? 'border-purple-500 scale-105' : isCurrentPlan ? 'border-green-500' : plan.border
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow flex items-center gap-1"><Crown className="w-4 h-4" /> Most Popular</div>
      )}
      {isCurrentPlan && (
        <div className="absolute -top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Current</div>
      )}
      <div className="relative p-8">
        <div className="text-center mb-6">
          <h3 className={`text-2xl font-bold mb-2 ${plan.color}`}>{plan.title}</h3>
          <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className={`text-4xl font-bold ${plan.color}`}>${plan.price.toFixed(2)}</span>
            <span className="text-gray-600">/month</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span>{plan.credits} credits included</span>
          </div>
        </div>
        <ul className="mb-6 space-y-2">
          {plan.features.map((feature: any, idx: number) => (
            <li key={idx} className="flex items-center gap-2 text-gray-700">
              {getFeatureIcon(feature.name)} {feature.name}
            </li>
          ))}
        </ul>
        {plan.additionalCredits && (
          <div className="mb-4">
            <span className="inline-block bg-pink-100 text-pink-500 px-3 py-1 rounded-full text-xs font-semibold">+ Additional Credits</span>
        </div>
        )}
        <button
          className={`w-full py-3 rounded-lg font-bold text-lg transition ${plan.buttonColor} ${isCurrentPlan ? 'cursor-default' : ''}`}
          disabled={isCurrentPlan}
          onClick={() => onSelectPlan(plan)}
        >
          {plan.buttonText}
        </button>
      </div>
    </motion.div>
  );
};

const PERSONAL_PLANS = [
  {
    id: 'personal',
    title: 'Personal',
    description: 'Great for steady personal use with rollover and solid credit limits.',
    price: 19,
    credits: 20000,
    features: [
      { name: '20,000 credits per month', included: true },
    ],
    users: 1,
    buttonText: 'Downgrade Plan',
    isCurrent: false,
    color: 'text-pink-500',
    border: 'border-pink-200',
    buttonColor: 'bg-pink-500 text-white hover:bg-pink-600',
    additionalCredits: true,
    badge: undefined,
    popular: false,
    bgGradient: 'from-pink-50 to-pink-100',
  },
  {
    id: 'family',
    title: 'Family',
    description: 'Flexible plan for families or small teams with shared credits.',
    price: 39,
    credits: 50000,
    features: [
      { name: '50,000 credits per month', included: true },
      { name: '4 users', included: true },
    ],
    users: 4,
    buttonText: 'Current Plan',
    isCurrent: true,
    color: 'text-yellow-500',
    border: 'border-yellow-300',
    buttonColor: 'bg-yellow-400 text-white hover:bg-yellow-500',
    additionalCredits: false,
    badge: 'Current',
    popular: false,
    bgGradient: 'from-yellow-50 to-yellow-100',
  },
  {
    id: 'family-plus',
    title: 'Family Plus',
    description: 'A solid starting point for businesses with scalable credits.',
    price: 99,
    credits: 150000,
    features: [
      { name: '150,000 credits per month', included: true },
      { name: '6 users', included: true },
    ],
    users: 6,
    buttonText: 'Current Plan',
    isCurrent: false,
    color: 'text-blue-500',
    border: 'border-blue-400',
    buttonColor: 'bg-blue-600 text-white hover:bg-blue-700',
    additionalCredits: false,
    badge: 'Most Popular',
    popular: true,
    bgGradient: 'from-blue-50 to-blue-100',
  },
];

const BUSINESS_PLANS = [
  {
    id: 'business-starter',
    title: 'Business Starter',
    description: 'Entry-level for small businesses.',
    price: 199,
    credits: 300000,
    features: [
      { name: '300,000 credits per month', included: true },
      { name: '10 users', included: true },
    ],
    users: 10,
    buttonText: 'Choose Plan',
    isCurrent: false,
    color: 'text-green-500',
    border: 'border-green-300',
    buttonColor: 'bg-green-500 text-white hover:bg-green-600',
    additionalCredits: false,
    badge: undefined,
    popular: false,
    bgGradient: 'from-green-50 to-green-100',
  },
  {
    id: 'business-growth',
    title: 'Business Growth',
    description: 'For growing teams and expanding needs.',
    price: 399,
    credits: 700000,
    features: [
      { name: '700,000 credits per month', included: true },
      { name: '25 users', included: true },
    ],
    users: 25,
    buttonText: 'Choose Plan',
    isCurrent: false,
    color: 'text-purple-500',
    border: 'border-purple-300',
    buttonColor: 'bg-purple-500 text-white hover:bg-purple-600',
    additionalCredits: false,
    badge: 'Best Value',
    popular: true,
    bgGradient: 'from-purple-50 to-purple-100',
  },
  {
    id: 'business-pro',
    title: 'Business Pro',
    description: 'For large organizations with high volume.',
    price: 999,
    credits: 2000000,
    features: [
      { name: '2,000,000 credits per month', included: true },
      { name: '100 users', included: true },
    ],
    users: 100,
    buttonText: 'Choose Plan',
    isCurrent: false,
    color: 'text-indigo-500',
    border: 'border-indigo-300',
    buttonColor: 'bg-indigo-500 text-white hover:bg-indigo-600',
    additionalCredits: false,
    badge: undefined,
    popular: false,
    bgGradient: 'from-indigo-50 to-indigo-100',
  },
];

export default function BillingPlanPage() {
  const [selectedTab, setSelectedTab] = useState<'Personal' | 'Business'>('Personal');
  const plans = selectedTab === 'Personal' ? PERSONAL_PLANS : BUSINESS_PLANS;
  // Sidebar state (minimal for demo)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNaviModalOpen, setIsNaviModalOpen] = useState(false);
  const [isNaviDropdownOpen, setIsNaviDropdownOpen] = useState(false);
  const [isNaviChatbotOpen, setIsNaviChatbotOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();

  // Dummy current plan id for demo
  const currentPlanId = 'family';

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
        session={undefined}
      />
      <div className={`flex-1 flex flex-col px-4 py-8 ${isDarkMode ? 'bg-gray-900' : ''}`}>
        {/* Header with gradient and shadow */}
        <div className={`rounded-xl p-6 mb-4 shadow flex items-center justify-between ${isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-purple-50 to-pink-50'}`}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.location.href='/navi/billing'}
              className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            >
              <HiArrowLeft className={`w-5 h-5 ${isDarkMode ? 'text-gray-200' : ''}`} />
            </button>
            <div>
              <h1 className={`text-3xl font-extrabold mb-1 font-sans ${isDarkMode ? 'text-purple-200' : 'text-purple-700'}`}>Billing & Subscription</h1>
              <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Choose the perfect plan for your needs</p>
            </div>
          </div>
          <button className={`px-6 py-3 rounded-lg font-bold shadow-lg ${isDarkMode ? 'bg-gradient-to-r from-red-700 to-pink-700 text-white hover:from-red-800 hover:to-pink-800' : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white'}`}>Cancel Subscription</button>
        </div>
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-sm">
          <span className={`font-semibold cursor-pointer hover:underline ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`} onClick={() => window.location.href='/navi/billing'}>Billing & Subscription</span>
          <span className={`${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>/</span>
          <span className={`px-3 py-1 rounded-full font-semibold ${isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700'}`}>Your Plan</span>
        </div>
        {/* Current Subscription Info */}
        <div className={`border rounded-xl p-4 mb-8 flex items-center gap-4 shadow ${isDarkMode ? 'bg-gradient-to-r from-blue-900 to-gray-900 border-blue-900' : 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200'}`}>
          <span className={`rounded-full p-2 ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
            <Calendar className="w-5 h-5" />
          </span>
          <div>
            <div className={`font-semibold flex items-center gap-2 ${isDarkMode ? 'text-blue-200' : 'text-blue-900'}`}>
              Current Subscription
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ml-2 ${isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'}`}>Active</span>
            </div>
            <div className={`text-sm flex items-center gap-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
              <Clock className="w-4 h-4" />
              Next billing: Aug 10, 2025
            </div>
          </div>
        </div>
        {/* Divider */}
        <div className={`border-b mb-8 ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`} />
        {/* Tabs with animated underline and scale on active */}
        <div className="flex gap-2 mb-8">
          <button
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-base transition shadow-lg relative
              ${selectedTab === 'Personal'
                ? isDarkMode
                  ? 'bg-gradient-to-r from-pink-700 to-pink-600 text-white shadow-pink-900/60 scale-105'
                  : 'bg-gradient-to-r from-pink-500 to-pink-400 text-white shadow-pink-200/60 scale-105'
                : isDarkMode
                  ? 'bg-gray-900 text-gray-400 border border-gray-700 hover:scale-105'
                  : 'bg-white text-gray-500 border border-gray-200 hover:scale-105'}
            `}
            onClick={() => setSelectedTab('Personal')}
            style={{ fontFamily: 'inherit' }}
          >
            <HiOutlineUser className={`w-5 h-5 ${selectedTab === 'Personal' ? 'text-white' : isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} /> Personal
            {selectedTab === 'Personal' && (
              <span className={`absolute bottom-0 left-4 right-4 h-1 rounded-b-xl animate-pulse ${isDarkMode ? 'bg-pink-800' : 'bg-pink-300'}`} />
            )}
          </button>
          <button
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-base transition shadow-lg relative
              ${selectedTab === 'Business'
                ? isDarkMode
                  ? 'bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-blue-900/60 scale-105'
                  : 'bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-blue-200/60 scale-105'
                : isDarkMode
                  ? 'bg-gray-900 text-gray-400 border border-gray-700 hover:scale-105'
                  : 'bg-white text-gray-500 border border-gray-200 hover:scale-105'}
            `}
            onClick={() => setSelectedTab('Business')}
            style={{ fontFamily: 'inherit' }}
          >
            <HiOutlineBuildingOffice2 className={`w-5 h-5 ${selectedTab === 'Business' ? 'text-white' : isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} /> Business
            {selectedTab === 'Business' && (
              <span className={`absolute bottom-0 left-4 right-4 h-1 rounded-b-xl animate-pulse ${isDarkMode ? 'bg-blue-800' : 'bg-blue-300'}`} />
            )}
          </button>
        </div>
        {/* Plans Grid with modern card polish */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map(plan => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.04, boxShadow: isDarkMode ? '0 8px 32px rgba(236, 72, 153, 0.25)' : '0 8px 32px rgba(236, 72, 153, 0.15)' }}
              transition={{ duration: 0.3 }}
              className={`relative rounded-2xl border-2 p-8 shadow-lg hover:shadow-2xl transition-all duration-300
                ${plan.popular ? (isDarkMode ? 'border-purple-700' : 'border-purple-500') : plan.border}
                bg-gradient-to-br ${isDarkMode ? 'from-gray-900 to-gray-800' : plan.bgGradient}
                ${isDarkMode ? 'text-gray-100' : ''}`}
            >
              {/* Watermark icon */}
              <span className={`absolute right-4 bottom-4 opacity-10 pointer-events-none select-none ${isDarkMode ? 'text-pink-900' : 'text-pink-400'}`}>
                <Zap className="w-16 h-16" />
              </span>
              {/* Most Popular badge */}
              {plan.popular && (
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold shadow flex items-center gap-1 animate-bounce
                  ${isDarkMode ? 'bg-gradient-to-r from-purple-800 to-pink-800 text-white' : 'bg-gradient-to-r from-purple-500 to-pink-400 text-white'}`}
                >
                  <Crown className="w-4 h-4" /> Most Popular
                </div>
              )}
              {/* Current Plan badge */}
              {plan.isCurrent && (
                <div className={`absolute -top-4 right-4 px-3 py-1 rounded-full text-xs font-bold shadow flex items-center gap-1
                  ${isDarkMode ? 'bg-green-800 text-green-200' : 'bg-green-500 text-white'}`}
                >
                  <CheckCircle className="w-4 h-4" /> Current
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className={`text-2xl font-bold mb-2 font-sans ${plan.color} ${isDarkMode ? 'text-opacity-80' : ''}`}>{plan.title}</h3>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{plan.description}</p>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className={`text-4xl font-bold ${plan.color} ${isDarkMode ? 'text-opacity-90' : ''}`}>${plan.price.toFixed(2)}</span>
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>/month</span>
                </div>
                <div className={`flex items-center justify-center gap-2 text-sm ${isDarkMode ? 'text-yellow-200' : 'text-gray-600'}`}>
                  <Zap className={`w-4 h-4 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-500'}`} />
                  <span>{plan.credits} credits included</span>
                </div>
              </div>
              <ul className="mb-6 space-y-2">
                {plan.features.map((feature: any, idx: number) => (
                  <li key={idx} className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    <CheckCircle className={`w-4 h-4 ${isDarkMode ? 'text-green-300' : 'text-green-400'}`} /> {feature.name}
                  </li>
                ))}
              </ul>
              {plan.additionalCredits && (
                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${isDarkMode ? 'bg-pink-900 text-pink-200' : 'bg-pink-100 text-pink-500'}`}>+ Additional Credits</span>
                </div>
              )}
              <button
                className={`w-full py-3 rounded-lg font-bold text-lg flex items-center justify-center gap-2 shadow-lg
                  ${isDarkMode
                    ?
                      plan.id === 'personal' ? 'bg-pink-800 text-white hover:bg-pink-900'
                    : plan.id === 'family' ? 'bg-yellow-700 text-white hover:bg-yellow-800'
                    : plan.id === 'family-plus' ? 'bg-blue-800 text-white hover:bg-blue-900'
                    : plan.id === 'business-starter' ? 'bg-green-800 text-white hover:bg-green-900'
                    : plan.id === 'business-growth' ? 'bg-purple-800 text-white hover:bg-purple-900'
                    : plan.id === 'business-pro' ? 'bg-indigo-800 text-white hover:bg-indigo-900'
                    : 'bg-gray-800 text-white'
                    : plan.buttonColor
                  }
                `}
                disabled={plan.isCurrent}
              >
                {plan.buttonText} <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </motion.div>
                </div>
    </div>
  );
}
