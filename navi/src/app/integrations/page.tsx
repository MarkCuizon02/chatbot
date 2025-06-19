'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import IntegrationCard from './IntegrationCard';
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import Sidebar from '../components/Sidebar';

interface Integration {
  name: string;
  description: string;
  icon: string;
  status: 'connected' | 'not-connected';
  connectedAccount?: string;
  category: string;
}

export default function IntegrationsPage() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNaviModalOpen, setIsNaviModalOpen] = useState(false);
  const [isNaviDropdownOpen, setIsNaviDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const integrationData: Integration[] = [
    {
      name: 'LinkedIn',
      description: 'Create and share posts with your linkedin network.',
      icon: '/images/linkedin.png',
      status: 'connected',
      connectedAccount: 'troy@hurdman.net',
      category: 'Communication',
    },
    {
      name: 'Facebook & Instagram',
      description: 'Manage Facebook and Instagram pages, accounts, and posts.',
      icon: '/images/facebook-instagram.png',
      status: 'not-connected',
      category: 'Communication',
    },
    {
      name: 'Gmail',
      description: 'Let helpers send emails and read your inbox.',
      icon: '/images/gmail.png',
      status: 'connected',
      connectedAccount: 'troy@hurdman.net',
      category: 'Communication',
    },
    {
      name: 'Google Calendar',
      description: 'Allow helpers to see and schedule events and meetings.',
      icon: '/images/google-calendar.png',
      status: 'not-connected',
      category: 'Calendar',
    },
    {
      name: 'Google Drive',
      description: 'Create and read docs, sheets, and other files.',
      icon: '/images/google-drive.png',
      status: 'connected',
      connectedAccount: 'troy@hurdman.net',
      category: 'Task',
    },
    {
      name: 'Notions',
      description: 'Read and update your Notion data.',
      icon: '/images/notion.png',
      status: 'not-connected',
      category: 'Task',
    },
  ];

  const filteredIntegrations = integrationData.filter((integration) => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || integration.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const tabs = ['All', 'Calendar', 'Communication', 'AI & Automation', 'Task'];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} font-poppins transition-colors duration-300 flex`}>
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
        setIsNaviChatbotOpen={() => {}}
      />
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-24' : 'ml-72'} p-6 sm:p-8 overflow-x-hidden flex justify-center`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold">Integrations</h1>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-base sm:text-lg mt-2`}>
                Seamlessly sync your meeting notes, action items,
                and insights with your favorite tools.
              </p>
            </div>
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search integration..."
                className={`w-full py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500
                  ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'}
                `}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <HiOutlineMagnifyingGlass size={20} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
          </div>

          <div className="mb-8">
            <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`py-2 px-4 text-sm font-medium transition-colors duration-200
                    ${activeTab === tab
                      ? (isDarkMode ? 'text-teal-400 border-b-2 border-teal-400' : 'text-teal-600 border-b-2 border-teal-600')
                      : (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900')
                    }
                  `}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIntegrations.map((integration) => (
              <IntegrationCard key={integration.name} {...integration} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 