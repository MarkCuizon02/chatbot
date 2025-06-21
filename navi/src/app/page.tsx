'use client';

import React, { useState, useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Menu, Bell, Users, Link as LinkIcon, CreditCard, Trophy, ChevronDown, ChevronRight, BarChart2, ChevronLeft, Sun, Moon, LogOut, BookOpen, Settings, HelpCircle } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Sidebar from './components/Sidebar';

interface AgentActivity {
  title: string;
  time: string;
  color: string;
}

const agentActivity: AgentActivity[] = [
  {
    title: "Generated 10 new images for project 'Alpha'",
    time: "01:00 AM - Jun 07, 2025",
    color: "bg-green-500"
  },
  {
    title: "Handled 50 user queries with 98% satisfaction",
    time: "01:00 AM - Jun 07, 2025",
    color: "bg-yellow-500"
  },
  {
    title: "Knowledge base updated with new documents",
    time: "01:00 AM - Jun 07, 2025",
    color: "bg-blue-500"
  }
];

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

export default function Dashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNaviDropdownOpen, setIsNaviDropdownOpen] = useState(false);
  const [isNaviModalOpen, setIsNaviModalOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const router = useRouter();

  const chartData = [
    { name: 'Jun 05', Navi: 60, Pixie: 40, Paige: 50, Audra: 20, Flicka: 15 },
    { name: 'Jun 06', Navi: 80, Pixie: 45, Paige: 55, Audra: 25, Flicka: 18 },
    { name: 'Jun 07', Navi: 90, Pixie: 60, Paige: 60, Audra: 35, Flicka: 20 },
    { name: 'Jun 08', Navi: 110, Pixie: 80, Paige: 65, Audra: 30, Flicka: 25 },
    { name: 'Jun 09', Navi: 100, Pixie: 70, Paige: 58, Audra: 22, Flicka: 28 },
  ];

  const teamUsageData = [
    { name: 'Skylar Westervelt', usage: 321, credits: 545 },
    { name: 'Jordyn Bergson', usage: 645, credits: 76 },
    { name: 'Gustavo Dias', usage: 123, credits: 785 },
    { name: 'Jaylon Torff', usage: 653, credits: 2235 },
    { name: 'Maria Workman', usage: 251, credits: 3784 },
    { name: 'Ahmad Geidt', usage: 987, credits: 241 },
  ];

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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-sm flex flex-col relative min-h-[140px]`}
          >
            <span className={`absolute top-5 right-5 w-8 h-8 ${isDarkMode ? 'bg-cyan-900' : 'bg-cyan-100'} rounded-full flex items-center justify-center`}>
              <CreditCard size={20} className={`${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
            </span>
            <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-medium mb-1`}>Total Credits</div>
            <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-3xl font-extrabold mb-1`}>15,700</div>
            <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>- 1,200 this month</div>
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
            <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-medium mb-1`}>Credit Used</div>
            <div className="text-white text-3xl font-extrabold mb-1">1,500</div>
            <div className="text-sm text-green-500 font-medium">+5% from last week</div>
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
            <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-medium mb-1`}>Total Active Sessions</div>
            <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-3xl font-extrabold mb-1`}>1,250</div>
            <div className="text-sm text-green-500 font-medium">+5% from last week</div>
          </motion.div>
        </div>

        {/* Agents Status */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm mb-8`}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-xl font-semibold`}>Agents Status & Quick Summary</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border rounded-2xl p-5 flex flex-col relative min-h-[180px]`}
              >
                <div className="flex items-center">
                  <Image src="/images/Navi.png" alt="Navi" width={48} height={48} className="rounded-full mr-3" />
                  <div>
                    <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-bold text-lg`}>Navi</div>
                    <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm font-light`}>Your smart, friendly assistant</div>
                  </div>
                  <span className={`absolute right-5 top-5 ${isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'} text-xs font-semibold px-3 py-1 rounded-full`}>ACTIVE</span>
                </div>
                <div className={`mt-4 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Recent Activity: 120 tasks</div>
                <div className="mt-2 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 font-medium">
                  <span>Performance</span>
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>70%</span>
                </div>
                <div className={`w-full h-2 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full mt-1`}>
                  <div className="h-2 bg-sky-400 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
                className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border rounded-2xl p-5 flex flex-col relative min-h-[180px]`}
              >
                <div className="flex items-center">
                  <Image src="/images/Pixie.png" alt="Pixie" width={48} height={48} className="rounded-full mr-3" />
                  <div>
                    <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-bold text-lg`}>Pixie</div>
                    <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm font-light`}>Conversational AI</div>
                  </div>
                  <span className={`absolute right-5 top-5 ${isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'} text-xs font-semibold px-3 py-1 rounded-full`}>ACTIVE</span>
                </div>
                <div className={`mt-4 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Recent Activity: 350 tasks</div>
                <div className="mt-2 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 font-medium">
                  <span>Performance</span>
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>20%</span>
                </div>
                <div className={`w-full h-2 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full mt-1`}>
                  <div className="h-2 bg-sky-400 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border rounded-2xl p-5 flex flex-col relative min-h-[180px]`}
              >
                <div className="flex items-center">
                  <Image src="/images/Paige.png" alt="Paige" width={48} height={48} className="rounded-full mr-3" />
                  <div>
                    <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-bold text-lg`}>Paige</div>
                    <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm font-light`}>Image Generation</div>
                  </div>
                  <span className={`absolute right-5 top-5 ${isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'} text-xs font-semibold px-3 py-1 rounded-full`}>ACTIVE</span>
                </div>
                <div className={`mt-4 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Recent Activity: 500 tasks</div>
                <div className="mt-2 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 font-medium">
                  <span>Performance</span>
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>40%</span>
                </div>
                <div className={`w-full h-2 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full mt-1`}>
                  <div className="h-2 bg-sky-400 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border rounded-2xl p-5 flex flex-col relative min-h-[180px]`}
              >
                <div className="flex items-center">
                  <Image src="/images/Audra.png" alt="Audra" width={48} height={48} className="rounded-full mr-3" />
                  <div>
                    <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-bold text-lg`}>Audra</div>
                    <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm font-light`}>Video Generation</div>
                  </div>
                  <span className={`absolute right-5 top-5 ${isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'} text-xs font-semibold px-3 py-1 rounded-full`}>ACTIVE</span>
                </div>
                <div className={`mt-4 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Recent Activity: 500 tasks</div>
                <div className="mt-2 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 font-medium">
                  <span>Performance</span>
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>10%</span>
                </div>
                <div className={`w-full h-2 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full mt-1`}>
                  <div className="h-2 bg-sky-400 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border rounded-2xl p-5 flex flex-col relative min-h-[180px]`}
              >
                <div className="flex items-center">
                  <Image src="/images/flicka.png" alt="Flicka" width={48} height={48} className="rounded-full mr-3" />
                  <div>
                    <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-bold text-lg`}>Flicka</div>
                    <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm font-light`}>Audio Generation</div>
                  </div>
                  <span className={`absolute right-5 top-5 ${isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'} text-xs font-semibold px-3 py-1 rounded-full`}>INACTIVE</span>
                </div>
                <div className={`mt-4 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Recent Activity: 500 tasks</div>
                <div className="mt-2 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 font-medium">
                  <span>Performance</span>
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>5%</span>
                </div>
                <div className={`w-full h-2 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full mt-1`}>
                  <div className="h-2 bg-sky-400 rounded-full" style={{ width: '5%' }}></div>
                </div>
              </motion.div>
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
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-4`}>Distribution of credits used among users.</p>
                <div className="space-y-4">
                  <div className={`grid grid-cols-3 gap-4 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} pb-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <span>User</span>
                    <span>Usage</span>
                    <span>Used credits</span>
                  </div>
                  {teamUsageData.map((user, index) => (
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
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</span>
                      </div>
                      <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{user.usage}</span>
                      <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium`}>{user.credits}</span>
                    </motion.div>
                  ))}
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
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} flex items-center justify-between p-4 rounded-lg transition-all`}
              >
                <div className="flex items-center space-x-4">
                  <Image src="/images/Pixie.png" alt="Pixie" width={40} height={40} className="rounded-full" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-semibold`}>Pixie:</span>
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Generated 10 new images for project "Alpha"</span>
                    </div>
                    <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>12:09 AM - Jun 10, 2025</div>
                  </div>
                </div>
                <div className={`${isDarkMode ? 'bg-green-900' : 'bg-green-100'} w-6 h-6 rounded-full flex items-center justify-center`}>
                  <svg className={`w-4 h-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} flex items-center justify-between p-4 rounded-lg transition-all`}
              >
                <div className="flex items-center space-x-4">
                  <Image src="/images/Chattie.png" alt="Chattie" width={40} height={40} className="rounded-full" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-semibold`}>Chattie:</span>
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Handled 50 user queries with 98% satisfaction.</span>
                    </div>
                    <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>12:09 AM - Jun 10, 2025</div>
                  </div>
                </div>
                <div className={`${isDarkMode ? 'bg-yellow-900' : 'bg-yellow-100'} w-6 h-6 rounded-full flex items-center justify-center`}>
                  <svg className={`w-4 h-4 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} flex items-center justify-between p-4 rounded-lg transition-all`}
              >
                <div className="flex items-center space-x-4">
                  <Image src="/images/Navi.png" alt="Navi" width={40} height={40} className="rounded-full" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-semibold`}>Navi:</span>
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Knowledge base updated with new documents.</span>
                    </div>
                    <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>12:09 AM - Jun 10, 2025</div>
                  </div>
                </div>
                <div className={`${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'} w-6 h-6 rounded-full flex items-center justify-center`}>
                  <svg className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} flex items-center justify-between p-4 rounded-lg transition-all`}
              >
                <div className="flex items-center space-x-4">
                  <Image src="/images/flicka.png" alt="Flicka" width={40} height={40} className="rounded-full" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-semibold`}>Flicka:</span>
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Video rendering "Beta" failed. Retrying.</span>
                    </div>
                    <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>12:09 AM - Jun 10, 2025</div>
                  </div>
                </div>
                <div className={`${isDarkMode ? 'bg-green-900' : 'bg-green-100'} w-6 h-6 rounded-full flex items-center justify-center`}>
                  <svg className={`w-4 h-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} flex items-center justify-between p-4 rounded-lg transition-all`}
              >
                <div className="flex items-center space-x-4">
                  <Image src="/images/Audra.png" alt="Audra" width={40} height={40} className="rounded-full" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-semibold`}>Audra:</span>
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Generated voiceover for tutorial video.</span>
                    </div>
                    <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>12:09 AM - Jun 10, 2025</div>
                  </div>
                </div>
                <div className={`${isDarkMode ? 'bg-green-900' : 'bg-green-100'} w-6 h-6 rounded-full flex items-center justify-center`}>
                  <svg className={`w-4 h-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}