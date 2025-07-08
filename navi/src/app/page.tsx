'use client';

import React, { useState, useContext, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Menu, Bell, Users, Link as LinkIcon, CreditCard, Trophy, ChevronDown, ChevronRight, BarChart2, ChevronLeft, Sun, Moon, LogOut, BookOpen, Settings, HelpCircle, ChevronUp, AlertTriangle, Info } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from '../context/ThemeContext';
import { useSubscription } from '../context/SubscriptionContext';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Sidebar from './components/Sidebar';
import CreditDetailsModal from './components/CreditDetailsModal';

// Import database functions
import {
  fetchDashboardStats,
  fetchAgentStatuses,
  fetchChartData,
  fetchTeamUsage,
  fetchAgentActivities,
  type DashboardStats,
  type AgentStatus,
  type ChartDataPoint,
  type TeamUser as DatabaseTeamUser,
  type AgentActivity
} from '../lib/dashboard-data';

// Import credit-billing integration
import { 
  calculateIntegratedCredits, 
  getCreditAlerts, 
  formatCredits, 
  formatCurrency,
  type IntegratedCreditData 
} from '../lib/credit-billing-integration';

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

function DropdownItem({ icon, label, isDarkMode, hasExternalLink, path }: { icon: React.ReactNode; label: string; isDarkMode: boolean; hasExternalLink?: boolean; path?: string }) {
  const router = useRouter();

  const handleClick = () => {
    if (path) {
      router.push(path);
    } else {
      // Placeholder for items without a specific path, e.g., Sign Out if it becomes a DropdownItem
      console.log(`Clicked ${label}`);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      onClick={handleClick}
      className={`${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} flex items-center px-5 py-2 font-medium w-full text-left`}
    >
      <span className="mr-3">{icon}</span>
      {label}
      {hasExternalLink && (
        <span className="ml-auto flex items-center space-x-2">
          <Image src="/images/h_icon.png" alt="H icon" width={20} height={20} className="rounded-full" />
          <LinkIcon size={16} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        </span>
      )}
    </motion.button>
  );
}

function NaviAgentsModal({ isOpen, onClose, isDarkMode }: { isOpen: boolean; onClose: () => void; isDarkMode: boolean }) {
  if (!isOpen) return null;

  const mostUsedAgents = [
    { name: 'Navi', description: 'Your smart assistant', image: '/images/Navi.png', bgColor: 'from-emerald-400 to-teal-500' },
    { name: 'Flicka', description: 'Audio generation expert', image: '/images/flicka.png', bgColor: 'from-purple-600 to-indigo-700' },
    { name: 'Audra', description: 'Video creation tool', image: '/images/Audra.png', bgColor: 'from-green-600 to-emerald-700' },
  ];

  const availableAgents = [
    { name: 'Navi', description: 'Your smart assistant', image: '/images/Navi.png', bgColor: 'from-emerald-400 to-teal-500' },
    { name: 'Flicka', description: 'Audio generation expert', image: '/images/flicka.png', bgColor: 'from-purple-600 to-indigo-700' },
    { name: 'Audra', description: 'Video creation tool', image: '/images/Audra.png', bgColor: 'from-green-600 to-emerald-700' },
    { name: 'Pixie', description: 'Conversational AI', image: '/images/Pixie.png', bgColor: 'from-pink-400 to-rose-500' },
    { name: 'Paige', description: 'Image generation', image: '/images/Paige.png', bgColor: 'from-amber-400 to-orange-500' },
    { name: 'Neuro', description: 'Coming Soon', image: null, bgColor: 'from-gray-600 to-gray-700' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl w-full max-w-4xl p-8 transform transition-all scale-100 opacity-100`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-3xl font-bold`}>Choose an Agent</h2>
              <button onClick={onClose} className={`${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} focus:outline-none`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="mb-8">
              <h3 className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-lg font-semibold mb-4`}>Most Frequently Used</h3>
              <div className="grid grid-cols-3 gap-4">
                {mostUsedAgents.map((agent, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                    className={`rounded-xl p-4 flex flex-col items-center justify-center text-center text-white min-h-[140px] bg-gradient-to-br ${agent.bgColor}`}
                  >
                    {agent.image ? (
                      <Image src={agent.image} alt={agent.name} width={64} height={64} className="rounded-full mb-2" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-500 flex items-center justify-center mb-2">
                        <span className="text-gray-300 text-3xl">?</span>
                      </div>
                    )}
                    <h4 className="font-semibold text-lg">{agent.name}</h4>
                    <p className="text-sm opacity-80">{agent.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-lg font-semibold mb-4`}>Available Agents</h3>
              <div className="grid grid-cols-3 gap-4">
                {availableAgents.map((agent, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                    className={`rounded-xl p-4 flex flex-col items-center justify-center text-center text-white min-h-[140px] bg-gradient-to-br ${agent.bgColor}`}
                  >
                    {agent.image ? (
                      <Image src={agent.image} alt={agent.name} width={64} height={64} className="rounded-full mb-2" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-500 flex items-center justify-center mb-2">
                        <span className="text-gray-300 text-3xl">?</span>
                      </div>
                    )}
                    <h4 className="font-semibold text-lg">{agent.name}</h4>
                    <p className="text-sm opacity-80">{agent.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface TeamUser {
  name: string;
  usage: number;
  credits: number;
}

function TeamUsageModal({ isOpen, onClose, teamData, isDarkMode }: { isOpen: boolean; onClose: () => void; teamData: TeamUser[]; isDarkMode: boolean }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl w-full max-w-3xl p-8 transform transition-all scale-100 opacity-100`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-2xl font-bold`}>Team Usage Details</h2>
              <button onClick={onClose} className={`${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} focus:outline-none`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className={`grid grid-cols-3 gap-4 text-sm font-medium sticky top-0 ${isDarkMode ? 'text-gray-300 bg-gray-800' : 'text-gray-700 bg-white'} pb-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} z-10 mb-2`}>
                <span>User</span>
                <span>Usage</span>
                <span>Used credits</span>
              </div>
              {teamData.map((user, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`grid grid-cols-3 gap-4 text-sm items-center py-3 px-2 rounded-lg transition-colors duration-200
                    ${isDarkMode
                      ? index % 2 === 0
                        ? 'bg-gray-800'
                        : 'bg-gray-700'
                      : index % 2 === 0
                        ? 'bg-white'
                        : 'bg-gray-50'}
                  `}
                >
                  <div className="flex items-center space-x-2">                      <div className={`${isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-300 text-gray-700'} w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium`}>
                      {user.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</span>
                  </div>
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{user.usage}</span>
                  <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium`}>{user.credits.toLocaleString()}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Dashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNaviDropdownOpen, setIsNaviDropdownOpen] = useState(false);
  const [isNaviModalOpen, setIsNaviModalOpen] = useState(false);
  const [isTeamUsageModalOpen, setIsTeamUsageModalOpen] = useState(false);
  const [isCreditDetailsModalOpen, setIsCreditDetailsModalOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { subscription } = useSubscription();
  const router = useRouter();

  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [agentStatuses, setAgentStatuses] = useState<AgentStatus[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [teamUsageData, setTeamUsageData] = useState<TeamUser[]>([]);
  const [agentActivities, setAgentActivities] = useState<AgentActivity[]>([]);
  const [integratedCredits, setIntegratedCredits] = useState<IntegratedCreditData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // TODO: Replace hardcoded accountId with actual user's account ID
      const accountId = 1; // This should come from user session/context
      
      const stats = await fetchDashboardStats(accountId);
      setDashboardStats(stats);

      const statuses = await fetchAgentStatuses(accountId);
      setAgentStatuses(statuses);

      const chartData = await fetchChartData(accountId);
      setChartData(chartData);

      const teamData = await fetchTeamUsage(accountId);
      setTeamUsageData(teamData);

      const activities = await fetchAgentActivities(accountId);
      setAgentActivities(activities);

      // Calculate integrated credit data
      if (stats) {
        const integrated = calculateIntegratedCredits(stats, subscription, accountId);
        setIntegratedCredits(integrated);
      }
    };

    fetchData();
  }, [subscription]);

  // Get credit alerts
  const creditAlerts = integratedCredits ? getCreditAlerts(integratedCredits) : [];

  // Sort by credits in descending order and get top 6 for display
  const sortedTeamData = teamUsageData.sort((a, b) => b.credits - a.credits);
  const displayedUsers = sortedTeamData.slice(0, 6);
  const hasMoreUsers = teamUsageData.length > 6;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} font-poppins transition-colors duration-300`}>
      <Sidebar
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        isNaviModalOpen={isNaviModalOpen}
        setIsNaviModalOpen={setIsNaviModalOpen}
        isNaviDropdownOpen={isNaviDropdownOpen}
        setIsNaviDropdownOpen={setIsNaviDropdownOpen}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
        isNaviChatbotOpen={false}
        setIsNaviChatbotOpen={function (value: React.SetStateAction<boolean>): void {
          throw new Error('Function not implemented.');
        }}
      />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`flex-1 p-6 transition-all duration-300 ${isSidebarCollapsed ? 'ml-24' : 'ml-72'}`}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-600 mb-1">Dashboard</h1>
            <p className="text-lg text-gray-800 dark:text-gray-600 font-normal">Welcome! Here's a summary of your AI agents' performance and activities.</p>
          </div>
          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`${isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'} border rounded-xl flex items-center px-4 py-2 shadow-sm transition-colors duration-200`}
                aria-label="Open profile menu"
              >
                <Image src="/images/Troy.jpg" alt="Troy Teeples" width={32} height={32} className="rounded-full mr-2" />
                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-900'} font-medium mr-2`}>Troy</span>
                <ChevronDown size={18} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-2xl shadow-xl mt-2 absolute right-0 w-72 py-3 z-20`}
                >
                  <div className="flex items-center px-5 pb-3 border-b border-gray-200 dark:border-gray-700">
                    <Image src="/images/Troy.jpg" alt="Troy Teeples" width={44} height={44} className="rounded-full" />
                    <div className="ml-3">
                      <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-semibold`}>
                        Troy <span className="font-normal">Teeples</span>
                      </div>
                      <div className="flex items-center text-xs text-green-500 font-medium mt-0.5">
                        <span className="w-2 h-2 bg-green-500 rounded-full inline-block mr-1"></span>
                        Online
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Credit Alerts */}
        {creditAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            {creditAlerts.map((alert, index) => (
              <div key={index} className={`flex items-center gap-3 p-4 rounded-lg mb-3 ${
                alert.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' :
                alert.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300' :
                'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
              }`}>
                {alert.type === 'error' && <AlertTriangle size={20} />}
                {alert.type === 'warning' && <AlertTriangle size={20} />}
                {alert.type === 'info' && <Info size={20} />}
                <span className="text-sm font-medium">{alert.message}</span>
              </div>
            ))}
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-sm flex flex-col relative min-h-[140px] cursor-pointer`}
            onClick={() => setIsCreditDetailsModalOpen(true)}
          >
            <span className={`absolute top-5 right-5 w-8 h-8 ${isDarkMode ? 'bg-cyan-900' : 'bg-cyan-100'} rounded-full flex items-center justify-center`}>
              <CreditCard size={20} className={`${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
            </span>
            <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-medium mb-1`}>Total Credits Available</div>
            <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-3xl font-extrabold mb-1`}>
              {integratedCredits ? formatCredits(integratedCredits.totalCredits.available) : '---'}
            </div>
            <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>
              Plan: {integratedCredits ? formatCredits(integratedCredits.planCredits.monthly) : '---'} + 
              Additional: {integratedCredits ? formatCredits(integratedCredits.additionalCredits.total) : '---'}
            </div>
            <div className="mt-2 text-xs text-blue-500 font-medium">Click for details →</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-sm flex flex-col relative min-h-[140px]`}
          >
            <span className={`absolute top-5 right-5 w-8 h-8 ${isDarkMode ? 'bg-cyan-900' : 'bg-cyan-100'} rounded-full flex items-center justify-center`}>
              <CreditCard size={20} className={`${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
            </span>
            <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-medium mb-1`}>Credits Used This Period</div>
            <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-3xl font-extrabold mb-1`}>
              {integratedCredits ? formatCredits(integratedCredits.totalCredits.used) : '---'}
            </div>
            <div className="text-sm text-green-500 font-medium">
              {integratedCredits ? `${integratedCredits.totalCredits.usagePercentage.toFixed(1)}% of available` : '---'}
            </div>
            {integratedCredits && integratedCredits.billing.overage.credits > 0 && (
              <div className="text-sm text-red-400 font-medium mt-1">
                Overage: {formatCredits(integratedCredits.billing.overage.credits)} ({formatCurrency(integratedCredits.billing.overage.cost)})
              </div>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-sm flex flex-col relative min-h-[140px]`}
          >
            <span className={`absolute top-5 right-5 w-8 h-8 ${isDarkMode ? 'bg-cyan-900' : 'bg-cyan-100'} rounded-full flex items-center justify-center`}>
              <BarChart2 size={20} className={`${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
            </span>
            <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-medium mb-1`}>Estimated Period Cost</div>
            <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-3xl font-extrabold mb-1`}>
              {integratedCredits ? formatCurrency(integratedCredits.billing.estimatedCost) : '---'}
            </div>
            <div className="text-sm text-green-500 font-medium">
              Base: {integratedCredits ? formatCurrency(subscription.currentPlan?.price || 0) : '---'} 
              {integratedCredits && integratedCredits.billing.overage.cost > 0 && (
                <span className="text-red-400"> + {formatCurrency(integratedCredits.billing.overage.cost)} overage</span>
              )}
            </div>
          </motion.div>
        </div>

        {/* Agents Status */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm mb-8`}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-xl font-semibold`}>Agents Status & Quick Summary</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agentStatuses.map((agent, index) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border rounded-2xl p-5 flex flex-col relative min-h-[180px]`}
                >
                  <div className="flex items-center">
                    <Image src={agent.image} alt={agent.name} width={48} height={48} className="rounded-full mr-3" />
                    <div>
                      <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-bold text-lg`}>{agent.name}</div>
                      <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm font-light`}>{agent.description}</div>
                    </div>
                    <span className={`absolute right-5 top-5 ${isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'} text-xs font-semibold px-3 py-1 rounded-full`}>{agent.status}</span>
                  </div>
                  <div className={`mt-4 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Recent Activity: {agent.recentActivity} tasks</div>
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 font-medium">
                    <span>Performance</span>
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{agent.performance}%</span>
                  </div>
                  <div className={`w-full h-2 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full mt-1`}>
                    <div className="h-2 bg-sky-400 rounded-full" style={{ width: `${agent.performance}%` }}></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Visualizations */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm`}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-xl font-semibold`}>Performance Visualizations</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-semibold`}>Agent Usage Over Time</h3>
                  <select className={`${isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'bg-white border-gray-300 text-gray-700'} text-sm border rounded px-3 py-1`}>
                    <option>Filter by: Days</option>
                  </select>
                </div>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-4`}>Daily processing units used by each agent.</p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#d1d5db' : '#4b5563' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#d1d5db' : '#4b5563' }} />
                      <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#374151' : '#fff', border: 'none', borderRadius: '0.375rem', color: isDarkMode ? '#d1d5db' : '#4b5563' }} />
                      <Legend wrapperStyle={{ color: isDarkMode ? '#d1d5db' : '#4b5563' }} />
                      <Line type="monotone" dataKey="Navi" stroke="#3B82F6" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="Pixie" stroke="#EC4899" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="Paige" stroke="#F59E0B" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="Audra" stroke="#10B981" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="Flicka" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-semibold`}>Team Usage</h3>
                  <select className={`${isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'bg-white border-gray-300 text-gray-700'} text-sm border rounded px-3 py-1 font-medium`}>
                    <option>Filter by: Usage</option>
                  </select>
                </div>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-4`}>Distribution of credits used among top users.</p>
                <div className="space-y-4">
                  <div className={`grid grid-cols-3 gap-4 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} pb-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <span>User</span>
                    <span>Usage</span>
                    <span>Used credits</span>
                  </div>
                  {displayedUsers.map((user, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                      className={`grid grid-cols-3 gap-4 text-sm items-center py-2 rounded-lg transition-colors duration-200
                        ${isDarkMode
                          ? index % 2 === 0
                            ? 'bg-gray-800'
                            : 'bg-gray-700'
                          : index % 2 === 0
                            ? 'bg-white'
                            : 'bg-gray-50'}
                      `}
                    >
                      <div className="flex items-center space-x-2">
                        <div className={`${isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-300 text-gray-700'} w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium`}>
                          {user.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</span>
                      </div>
                      <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{user.usage}</span>
                      <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium`}>{user.credits.toLocaleString()}</span>
                    </motion.div>
                  ))}
                  {hasMoreUsers && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      onClick={() => setIsTeamUsageModalOpen(true)}
                      className={`w-full py-3 px-4 rounded-lg border-2 border-dashed transition-all duration-200 text-sm font-medium
                        ${isDarkMode 
                          ? 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300 hover:bg-gray-800' 
                          : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50'}
                      `}
                    >
                      <Users size={16} className="inline mr-2" />
                      View All Team Members ({teamUsageData.length - 6} more users)
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Activity & Insights */}
        <div className={`col-span-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm`}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div>
              <h2 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-xl font-semibold`}>Agent Activity & Insights</h2>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm font-light`}>Latest operations across all agents.</p>
            </div>
            <select className={`${isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'bg-white border-gray-300 text-gray-700'} text-sm border rounded px-3 py-1 font-medium`}>
              <option>Filter by: Days</option>
            </select>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {agentActivities.map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                  className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} flex items-center justify-between p-4 rounded-lg transition-all`}
                >
                  <div className="flex items-center space-x-4">
                    <Image src={activity.agentImage} alt={activity.agentName} width={40} height={40} className="rounded-full" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-semibold`}>{activity.agentName}:</span>
                        <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{activity.title}</span>
                      </div>
                      <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>{activity.time}</div>
                    </div>
                  </div>
                  <div className={`${isDarkMode ? 'bg-green-900' : 'bg-green-100'} w-6 h-6 rounded-full flex items-center justify-center`}>
                    <svg className={`w-4 h-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Team Usage Modal */}
      <TeamUsageModal 
        isOpen={isTeamUsageModalOpen}
        onClose={() => setIsTeamUsageModalOpen(false)}
        teamData={sortedTeamData}
        isDarkMode={isDarkMode}
      />

      {/* Credit Details Modal */}
      {integratedCredits && (
        <CreditDetailsModal
          isOpen={isCreditDetailsModalOpen}
          onClose={() => setIsCreditDetailsModalOpen(false)}
          integratedCredits={integratedCredits}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}