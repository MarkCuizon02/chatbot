'use client';

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Users, Activity, TrendingUp, Calendar, MessageSquare, CheckCircle, AlertTriangle, Info, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import Sidebar from '../components/EmployeeSidebar';

const agentUsageData = [
  { date: 'May 14', Navi: 80, Audra: 25, Pixie: 15 },
  { date: 'May 15', Navi: 85, Audra: 30, Pixie: 20 },
  { date: 'May 16', Navi: 90, Audra: 35, Pixie: 25 },
  { date: 'May 17', Navi: 95, Audra: 40, Pixie: 30 },
  { date: 'May 18', Navi: 100, Audra: 35, Pixie: 28 },
  { date: 'May 19', Navi: 105, Audra: 45, Pixie: 32 },
  { date: 'May 20', Navi: 110, Audra: 50, Pixie: 35 },
  { date: 'May 21', Navi: 115, Audra: 48, Pixie: 38 },
  { date: 'May 22', Navi: 108, Audra: 52, Pixie: 40 }
];

// Predefined waveform heights to prevent hydration issues
const waveformHeights = [
  13.9, 8.4, 18.7, 12.4, 6.3, 12.3, 7.8, 11.4, 12.7, 9.6,
  16.7, 15.9, 6.1, 9.1, 15.7, 4.6, 4.4, 18.0, 12.6, 9.8,
  9.0, 8.7, 19.3, 6.5, 15.9, 18.3, 10.0, 14.7, 17.5, 4.6,
  13.9, 13.6, 10.9, 18.6, 4.6
];

const recentActivity = [
  {
    id: 1,
    agent: 'Pixie',
    activity: 'An image of a haunting oil painting. A lone astronaut floats in the vast empti...',
    time: '2hr ago',
    type: 'image',
    avatar: '/images/Pixie.png',
    images: [
      '/images/astronaut1.jpg',
      '/images/astronaut2.jpg', 
      '/images/astronaut3.jpg',
      '/images/astronaut4.jpg'
    ]
  },
  {
    id: 2,
    agent: 'Flicka',
    activity: 'The wind whispered through the ancient trees as dusk settled over the...',
    time: '2hr ago',
    type: 'audio',
    avatar: '/images/flicka.png',
    duration: '2:00'
  }
];

const agentActivities = [
  {
    id: 1,
    agent: 'Pixie',
    activity: 'Generated 10 new images for project "Alpha"',
    time: '10 AM • May 23, 2025',
    status: 'success',
    avatar: '/images/Pixie.png'
  },
  {
    id: 2,
    agent: 'Chattie',
    activity: 'Handled 50 user queries with 98% satisfaction.',
    time: '11 AM • May 23, 2025',
    status: 'warning',
    avatar: '/images/Chattie.png'
  },
  {
    id: 3,
    agent: 'Navi',
    activity: 'Knowledge base updated with new documents.',
    time: '10 AM • May 23, 2025',
    status: 'info',
    avatar: '/images/Navi.png'
  },
  {
    id: 4,
    agent: 'Flicka',
    activity: 'Video rendering "text" failed. Retrying.',
    time: '11 AM • May 23, 2025',
    status: 'success',
    avatar: '/images/flicka.png'
  },
  {
    id: 5,
    agent: 'Audra',
    activity: 'Generated voiceover for tutorial video.',
    time: '11 AM • May 23, 2025',
    status: 'success',
    avatar: '/images/Audra.png'
  }
];

const agents = [
  {
    name: 'Navi',
    role: 'Your friendly assistant',
    status: 'ACTIVE',
    recentActivity: '120 tasks',
    performance: 70,
    avatar: '/images/Navi.png',
    statusColor: 'bg-green-500'
  },
  {
    name: 'Flicka',
    role: 'Video assistant',
    status: 'INACTIVE',
    recentActivity: '500 tasks',
    performance: 85,
    avatar: '/images/flicka.png',
    statusColor: 'bg-gray-500'
  },
  {
    name: 'Pixie',
    role: 'Generative AI',
    status: 'ACTIVE',
    recentActivity: '360 tasks',
    performance: 92,
    avatar: '/images/Pixie.png',
    statusColor: 'bg-green-500'
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'success':
      return <CheckCircle size={16} className="text-green-500" />;
    case 'warning':
      return <AlertTriangle size={16} className="text-yellow-500" />;
    case 'info':
      return <Info size={16} className="text-blue-500" />;
    default:
      return <CheckCircle size={16} className="text-green-500" />;
  }
};

export default function DashboardPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNaviDropdownOpen, setIsNaviDropdownOpen] = useState(false);
  const [isNaviModalOpen, setIsNaviModalOpen] = useState(false);
  const [isNaviChatbotOpen, setIsNaviChatbotOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
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
        isNaviChatbotOpen={isNaviChatbotOpen}
        setIsNaviChatbotOpen={setIsNaviChatbotOpen}
      />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex-1 p-6"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className={`text-4xl font-extrabold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Dashboard</h1>
          <p className={`text-lg transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Welcome! Here is a summary of your AI agents performance and activities.</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className={`rounded-xl p-6 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Company Credits</h3>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                <Users size={16} className={`transition-colors duration-300 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
            </div>
            <div className={`text-3xl font-bold mb-1 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>15,700</div>
            <div className="text-sm text-green-500">+1,200 this month</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className={`rounded-xl p-6 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Credit Used</h3>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-purple-900' : 'bg-purple-100'}`}>
                <Activity size={16} className={`transition-colors duration-300 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
            </div>
            <div className={`text-3xl font-bold mb-1 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>1,500</div>
            <div className="text-sm text-green-500">+5% from last week</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className={`rounded-xl p-6 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Total Active Sessions</h3>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-green-900' : 'bg-green-100'}`}>
                <TrendingUp size={16} className={`transition-colors duration-300 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
              </div>
            </div>
            <div className={`text-3xl font-bold mb-1 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>1,250</div>
            <div className="text-sm text-green-500">+15% from last week</div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-20 mb-8">
          {/* Recent Activity - Full Width Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className={`xl:col-span-3 rounded-xl shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
            <div className={`p-6 border-b transition-colors duration-300 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-xl font-semibold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentActivity.map((activity) => (
                  <div 
                    key={activity.id} 
                    className={`border rounded-lg p-4 transition-colors duration-300 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                  >
                    {/* Agent Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Image 
                          src={activity.avatar} 
                          alt={activity.agent} 
                          width={24} 
                          height={24} 
                          className="rounded-full" 
                        />
                        <span className={`font-medium text-sm transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {activity.agent}
                        </span>
                      </div>
                      <span className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {activity.time}
                      </span>
                    </div>

                    {/* Content */}
                    <div>
                      <div className="mb-2">
                        <span className={`text-xs font-medium uppercase tracking-wide transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          PROMPT
                        </span>
                      </div>
                      <p className={`text-sm mb-4 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {activity.activity}
                      </p>

                      {/* Image Grid for Pixie */}
                      {activity.type === 'image' && activity.images && (
                        <div className="grid grid-cols-4 gap-2">
                          {activity.images.map((image, index) => (
                            <div key={index} className={`aspect-square rounded-lg overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                              <div className="w-full h-full bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-600 flex items-center justify-center relative">
                                {/* Astronaut-like figure */}
                                <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                                  <div className="w-4 h-4 bg-white/80 rounded-full"></div>
                                </div>
                                {/* Space stars effect */}
                                <div className="absolute top-1 right-1 w-1 h-1 bg-white/60 rounded-full"></div>
                                <div className="absolute bottom-2 left-2 w-0.5 h-0.5 bg-white/40 rounded-full"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Audio Waveform for Flicka */}
                      {activity.type === 'audio' && (
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-900'}`}>
                            <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent ml-0.5"></div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-1 mb-1">
                              {[...Array(35)].map((_, i) => (
                                <div 
                                  key={i} 
                                  className={`w-0.5 rounded-full transition-colors duration-300 ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'}`}
                                  style={{ 
                                    height: `${waveformHeights[i % waveformHeights.length]}px`,
                                    opacity: i < 15 ? 0.4 : 1
                                  }}
                                ></div>
                              ))}
                            </div>
                            <div className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {activity.duration}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Agents Status - Separate Row */}
        <div className="grid grid-cols-1 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className={`rounded-xl shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
            <div className={`p-6 border-b transition-colors duration-300 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-xl font-semibold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Agents Status & Quick Summary</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {agents.map((agent) => (
                  <div key={agent.name} className={`rounded-lg p-4 transition-colors duration-300 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Image src={agent.avatar} alt={agent.name} width={40} height={40} className="rounded-full" />
                        <div>
                          <h4 className={`font-medium transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{agent.name}</h4>
                          <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{agent.role}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full transition-colors duration-300 ${
                        agent.status === 'ACTIVE' 
                          ? isDarkMode 
                            ? 'bg-green-900 text-green-200' 
                            : 'bg-green-100 text-green-800'
                          : isDarkMode 
                            ? 'bg-gray-600 text-gray-200' 
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {agent.status}
                      </span>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Recent Activity: {agent.recentActivity}
                        </span>
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Performance</span>
                          <span className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{agent.performance}%</span>
                        </div>
                        <div className={`w-full rounded-full h-2 transition-colors duration-300 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${agent.performance}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Performance Visualizations - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className={`rounded-xl shadow-sm transition-colors duration-300 mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className={`p-6 border-b transition-colors duration-300 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className={`text-xl font-semibold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Performance Visualizations</h3>
                <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Agent Usage Over Time</p>
                <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Daily processing units used by each agent.</p>
              </div>
              <button className={`text-sm hover:text-blue-500 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Filter by Days
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={agentUsageData}>
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: isDarkMode ? '#d1d5db' : '#4b5563', fontSize: 12 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: isDarkMode ? '#d1d5db' : '#4b5563', fontSize: 12 }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDarkMode ? '#374151' : '#fff', 
                      border: 'none', 
                      borderRadius: '0.5rem', 
                      color: isDarkMode ? '#d1d5db' : '#4b5563' 
                    }} 
                  />
                  <Line type="monotone" dataKey="Navi" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }} />
                  <Line type="monotone" dataKey="Audra" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }} />
                  <Line type="monotone" dataKey="Pixie" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Agent Activity & Insights - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          className={`rounded-xl shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className={`p-6 border-b transition-colors duration-300 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className={`text-xl font-semibold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Agent Activity & Insights</h3>
                <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Latest operations across all agents.</p>
              </div>
              <button className={`text-sm hover:text-blue-500 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Filter by Days
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {agentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <Image src={activity.avatar} alt={activity.agent} width={32} height={32} className="rounded-full flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`font-medium transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{activity.agent}</p>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(activity.status)}
                      </div>
                    </div>
                    <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{activity.activity}</p>
                    <p className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}